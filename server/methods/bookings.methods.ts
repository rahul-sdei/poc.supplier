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
          "tour.supplierId": userId,
          "paymentInfo.status": "approved"
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
        "tour.supplierId": userId,
        "paymentInfo.status": "approved"
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
      bookingsCount.pending = Meteor.call("bookings.find", {}, {"confirmed": false, "cancelled": false}, "", true);
      bookingsCount.confirmed = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": false}, "", true);
      bookingsCount.completed = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": true}, "", true);
      bookingsCount.cancelled = Meteor.call("bookings.find", {}, {"cancelled": true}, "", true);

      return bookingsCount;
    },
    "bookings.approve": (bookingId) => {
      userIsInRole(["supplier"]);

      let user = Meteor.user();
      Bookings.collection.update({_id: bookingId, "tour.supplierId": user._id, "cancelled": false}, {$set: {confirmed: true, confirmedAt: new Date()} });
    },
    "bookings.cancel": (bookingId: string, userData: any) => {
      let dataToUpdate: any = {
        confirmed: false,
        cancelled: true,
        cancelledAt: new Date(),
        cancellationReason: userData.reason,
        cancellationComments: userData.comments,
        cancelledBy: "supplier"
      };

      return Bookings.collection.update({_id: bookingId, cancelled: false}, { $set: dataToUpdate });
    },
    "bookings.statistics": () => {
      userIsInRole(["supplier"]);

      let userId = Meteor.userId(),
          today = new Date(),
          oneDay = ( 1000 * 60 * 60 * 24 ),
          week6 = new Date( today.valueOf() - ( 5 * 7 * oneDay ) ),
          week5 = new Date( today.valueOf() - ( 4 * 7 * oneDay ) ),
          week4 = new Date( today.valueOf() - ( 3 * 7 * oneDay ) ),
          week3 = new Date( today.valueOf() - ( 2 * 7 * oneDay ) ),
          week2 = new Date( today.valueOf() - ( 1 * 7 * oneDay ) ),
          week1 = new Date( today.valueOf() - ( 0 * 7 * oneDay ) );

      let $cond = {
          "$cond": [
              { "$lte": [ "$bookingDate", week6 ] },
              "week6",
              { "$cond": [
                  { "$lte": [ "$bookingDate", week5 ] },
                  "week5",
                  { "$cond": [
                      { "$lte": [ "$bookingDate", week4 ] },
                      "week4",
                      { "$cond": [
                          { "$lte": [ "$bookingDate", week3 ] },
                          "week3",
                          { "$cond": [
                              { "$lte": [ "$bookingDate", week2 ] },
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
              "confirmed": true,
              "bookingDate": { "$gte": week6 }
          }},
          { "$group": {
              "_id": $cond,
              "count": { "$sum": 1 },
              "totalValue": { "$sum": "$totalPrice" }
          }}
      ]);

      let bookings = data;
      let bookingsCount = [];
      let bookingsValue = [];
      let groupNames = ["week1", "week2", "week3", "week4", "week5", "week6"];
      interface BookingStats {count: number; totalValue: number}
      for (let i=0; i<groupNames.length; i++) {
        let item: BookingStats = <BookingStats>_.find(bookings, {_id: groupNames[i]});
        if (_.isEmpty(item)) {
          bookingsCount.push(0);
          bookingsValue.push(0);
        } else {
          bookingsCount.push(item.count);
          bookingsValue.push(item.totalValue);
        }
      }

      return {bookingsCount, bookingsValue};
    },
    "bookings.statistics.new":(criteria: any = {}) => {
      userIsInRole(["supplier"]);
      // console.log(criteria);

      let userId = Meteor.userId(),
        today = new Date(),
        oneDay = ( 1000 * 60 * 60 * 24 ),
        _id: any = {"year":"$year","month":"$month","day":"$day"};

      let data = Bookings.collection.aggregate([
        {
        "$match":
          {
            "tour.supplierId": userId,
            "confirmed": true
          }},
        {
        "$project":
          {
            "tour.supplierId":1,
            "totalPrice":1,
            "month": {"$month":"$bookingDate"},
            "year": {"$year": "$bookingDate"},
            "day": {"$dayOfMonth": "$bookingDate"},
            "bookingDate": 1
          }},
        {
        "$match": criteria
          },
        {
        "$group":
          {
            _id,
            "totalPrice":{"$sum":"$totalPrice"},
            "count":{"$sum":1}
          }},
          {
          "$sort":
           {
             "_id.year": 1, "_id.month": 1, "_id.day": 1
           }}
      ])
      return data;
    }

});
