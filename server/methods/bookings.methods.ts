import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Bookings } from "../../both/collections/bookings.collection";
import { Booking } from "../../both/models/booking.model";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({

    "bookings.find": (options: Options, criteria: any, searchString: string, count: boolean = false) => {
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
      let bookingsCount: any = {};
      bookingsCount.new = Meteor.call("bookings.find", {}, {"confirmed": false, "cancelled": false}, "", true);
      bookingsCount.pending = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": false}, "", true);
      bookingsCount.completed = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": true}, "", true);

      return bookingsCount;
    },
    "bookings.approve": (bookingId) => {
      let user = Meteor.user();
      Bookings.collection.update({_id: bookingId, "tour.supplierId": user._id}, {$set: {confirmed: true, confirmedAt: new Date()} });
    },
    "bookings.disapprove": (bookingId) => {
      let user = Meteor.user();
      Bookings.collection.update({_id: bookingId, "tour.supplierId": user._id}, {$set: {cancelled: true, cancelledAt: new Date()} });
    },
    "bookings.sales": (lastday: Date, firstday: Date) => {
      console.log(firstday, lastday);
      console.log(new Date(firstday));
      let user = Meteor.user();
      let cursor = Bookings.collection.find({"tour.supplierId": user._id, confirmed: true, completed: false, bookingDate:{$gte: lastday, $lte: firstday}});
      return {count: cursor.count(), data: cursor.fetch()};
    }

});
