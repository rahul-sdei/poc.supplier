import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Bookings } from "../../both/collections/bookings.collection";
import { Booking } from "../../both/models/booking.model";
import { isLoggedIn, userIsInRole } from "../imports/services/auth";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "bookings.find": (options: Options, criteria: any, searchString: string, count: boolean = false) => {
        userIsInRole(["supplier"]);

        let userId = Meteor.userId();
        let where:any = [];

        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        }, {
          "tour.supplierId": userId
        });

        if ( !_.isEmpty(criteria) ) {
          if ( criteria.confirmed == false ) { // new items
            criteria.startDate = {$gt: new Date()};
            delete criteria["completed"];
          } else if ( criteria.completed==true ) { // completed
            criteria.startDate = {$lte: new Date()};
            delete criteria["completed"];
            delete criteria["confirmed"];
          } else if ( criteria.completed==false && criteria.confirmed==true ) { // pending
            criteria.startDate = {$gt: new Date()};
            delete criteria["completed"];
          }
          //console.log(criteria);
          where.push(criteria);
        }
        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({
                "$or": [
                    { "_id": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "tour.name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "user.firstName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "user.lastName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "travellers.firstName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "travellers.lastName": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }
        let cursor = Bookings.collection.find({$and: where}, options);

        if (count === true) {
          return cursor.count();
        }

        return {count: cursor.count(), data: cursor.fetch()};
    },
    "bookings.findOne": (criteria: any) => {
      userIsInRole(["supplier"]);

      let userId = Meteor.userId();
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      }, {
        "tour.supplierId": userId
      });

      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      where.push(criteria);

      return Bookings.collection.findOne({$and: where});
    },
    "bookings.count": () => {
      userIsInRole(["supplier"]);

      let bookingsCount: any = {};
      bookingsCount.new = Meteor.call("bookings.find", {}, {"confirmed": false, "cancelled": false}, "", true);
      bookingsCount.pending = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": false}, "", true);
      bookingsCount.completed = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": true}, "", true);

      return bookingsCount;
    },
    "bookings.approve": (bookingId) => {
      userIsInRole(["supplier"]);

      let user = Meteor.user();
      Bookings.collection.update({_id: bookingId, "tour.supplierId": user._id}, {$set: {confirmed: true, confirmedAt: new Date()} });
    },
    "bookings.disapprove": (bookingId) => {
      userIsInRole(["supplier"]);

      let user = Meteor.user();
      Bookings.collection.update({_id: bookingId, "tour.supplierId": user._id}, {$set: {cancelled: true, cancelledAt: new Date()} });
    },
    "bookings.statistics": () => {
      userIsInRole(["supplier"]);

      let userId = Meteor.userId(),
          today = new Date(),
          oneDay = ( 1000 * 60 * 60 * 24 ),
          week6 = new Date( today.valueOf() - ( 5 * 7 * oneDay ) ),
          week5 = new Date( today.valueOf() - ( 4 * 7 * oneDay ) ),
          week4 = new Date( today.valueOf() - ( 2 * 7 * oneDay ) ),
          week3 = new Date( today.valueOf() - ( 2 * 7 * oneDay ) ),
          week2 = new Date( today.valueOf() - ( 1 * 7 * oneDay ) ),
          week1 = new Date( today.valueOf() - ( 0 * 7 * oneDay ) );

      let $cond = {
          "$cond": [
              { "$lt": [ "$bookingDate", week6 ] },
              "week6",
              { "$cond": [
                  { "$lt": [ "$bookingDate", week5 ] },
                  "week5",
                  { "$cond": [
                      { "$lt": [ "$bookingDate", week4 ] },
                      "week4",
                      { "$cond": [
                          { "$lt": [ "$bookingDate", week3 ] },
                          "week3",
                          { "$cond": [
                              { "$lt": [ "$bookingDate", week2 ] },
                              "week2",
                              "week1"
                          ]}
                      ]}
                  ]}
              ]}
          ]
      };

      let data = Bookings.collection.aggregate([
          { "$match": {
              "tour.supplierId": userId,
              "bookingDate": { "$gte": week6 }
          }},
          { "$group": {
              "_id": $cond,
              "count": { "$sum": 1 },
              "totalValue": { "$sum": "$totalPrice" }
          }}
      ]);

      return {bookings: data};
    }

});
