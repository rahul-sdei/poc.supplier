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

    "bookings.find": (options: Options, criteria: any, searchString: string) => {
        let where:any = [];
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        });

        if ( !_.isEmpty(criteria) ) {
          if ( criteria.completed==true ) {
            criteria.departureDate = {$lte: new Date()};
            delete criteria["completed"];
          } else if ( criteria.completed==false && criteria.confirmed==true ) {
            criteria.departureDate = {$gte: new Date()};
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
                    { "tour.title": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "contactDetails.lastName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "contactDetails.firstName": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }
        let cursor = Bookings.collection.find({$and: where}, options);

        return {count: cursor.count(), data: cursor.fetch()};
    },
    "bookings.findOne": (slug: string) => {
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });
      where.push({slug: slug});

      return Bookings.collection.findOne({$and: where});
    }
});
