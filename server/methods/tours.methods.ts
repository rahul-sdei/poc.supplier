import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Tours } from "../../both/collections/tours.collection";
import { Tour } from "../../both/models/tour.model";
import { User } from "../../both/models/user.model";
import { Email } from 'meteor/email';
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "tours.find": (options: Options, criteria: any, searchString: string = "") => {
        let where:any = [];
        let userId = Meteor.userId();
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        },
        {"owner.id": userId});

        if (!_.isEmpty(criteria)) {
          where.push(criteria);
        }

        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({
                "$or": [
                    { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }

        let cursor = Tours.collection.find({$and: where}, options);
        return {count: cursor.count(), data: cursor.fetch()};
    },
    "tours.findOne": (criteria: any) => {
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });
      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      where.push(criteria);

      return Tours.collection.findOne({$and: where});
    },
    "tours.count": ( criteria: any, searchString: string ) => {
      let where:any = [];
      let userId = Meteor.userId();
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      },
      {"owner.id": userId});

      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      criteria.approved = true;
      where.push(criteria);

      // match search string
      if (typeof searchString === 'string' && searchString.length) {
          // allow search on firstName, lastName
          where.push({
              "$or": [
                  { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
              ]
          });
      }

      let approvedCount =  Tours.collection.find({$and: where}).count();

      // find pending count
      criteria.approved = false;
      let pendingCount =  Tours.collection.find({$and: where}).count();
      let count = { };
      count["approvedCount"] = approvedCount;
      count["pendingCount"] = pendingCount;
      return count;
    },
    "tours.insert": (data: Tour) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error(403, "Not authorized!");
      }

      let user = <User>Meteor.user();

      let owner = {
        id: user._id,
        companyName: user.profile.supplier.companyName,
        agentIdentity: {
          verified: false
        },
        agentCertificate: {
          verified: false
        }
      };

      if (user.profile.supplier.agentIdentity && user.profile.supplier.agentIdentity.verified === true) {
        owner.agentIdentity.verified = true;
      }

      if (user.profile.supplier.agentCertificate && user.profile.supplier.agentCertificate.verified === true) {
        owner.agentCertificate.verified = true;
      }

      data.owner = owner;
      data.active = true;
      data.approved = false;
      data.deleted = false;
      data.createdAt = new Date();
      let requestApprovalDate = new Date();
      requestApprovalDate.setHours(requestApprovalDate.getHours() + 6);
      data.requestApprovalAt = requestApprovalDate;
      let tourId = Tours.collection.insert(data);
      return tourId;
    },
    "tours.delete": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (typeof tour == "undefined" || !tour._id) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {deleted: true } });
    },
    "tours.update": (data: Tour, id: string) => {
      data.modifiedAt = new Date();
      return Tours.collection.update({_id: id}, {$set: data});
    },
    "tours.requestApproval": () => {
      const options: Options = {
          limit: 0,
          skip: 0
      };

      let where:any = [{active: true, approved: false, requestApprovalAt: {$lte: new Date()} }];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });
      where.push({requestApprovalSentAt: {$exists: false} } );

      let tours = Tours.collection.find({$and: where}, options).fetch();
      let message = `Hi Admin, <br />
      We have found ${tours.length} new tours that requires approval.<br />
      <ul>`;

      console.log(`Found ${tours.length} records to request approval.`);
      let tourIds: string[] = [];
      for (let i=0; i<tours.length; i++) {
        let tour = tours[i];
        tourIds.push(tour._id);
        // console.log(`${i}: send request approval for tour: ${tour.name}`);
        let tourURL = Meteor.settings.public.customerAppUrl + '/tours/' + tour.slug;
        message += `<li><a href="${tourURL}">${tour.name}</a></li>`;
      }
      message += `</ul>`;

      let from = "atorvia12@gmail.com";
      let to = "atorvia.sdei@yopmail.com";
      let subject = "Tours approval required";
      let text = message;
      Meteor.setTimeout(() => {
        Email.send({ to, from, subject, text});
      }, 0);


      Tours.collection.update({_id: {$in: tourIds}}, {$set: {requestApprovalSentAt: new Date()} }, {multi: true});
    }
});
