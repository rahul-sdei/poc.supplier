import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../both/collections/users.collection';

Meteor.methods({
    "users.insert": (userData: {email: string, passwd: string, profile?: any, supplier?: any}): string => {
        let userDetails = {
            email: userData.email,
            password: userData.passwd,
            profile: userData.profile,
            supplier: userData.supplier
        };
        let userId = Accounts.createUser(userDetails);
        if (userId)
        {
          Meteor.setTimeout(function () {
            Accounts.sendVerificationEmail(userId);
          }, 500);
        }
        return userId;
    },
    "users.update": (userData: {"profile" : any }): any => {
      if (! Meteor.userId()) {
        throw new Meteor.Error(403, "Not authorized!");
      }

      return Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: userData
      });
    },
    "users.findByPasswdToken": (token: string): any => {
      let userDetail = Meteor.users.findOne({"services.password.reset.token": token});
      if (userDetail && userDetail._id) {
        return userDetail._id;
      } else {
        return null;
      }
    },
    "users.verifyEmailToken": (token: string): any => {
      let userDetail = Meteor.users.findOne({"services.email.verificationTokens.token": token});
      if (!userDetail || !userDetail._id) {
        return null;
      }
      let userId = userDetail._id;

      // find email address
      let verificationTokens = userDetail.services.email.verificationTokens;
      let emailAddress = null;
      for (let i=0; i<verificationTokens.length; i++) {
        if (verificationTokens[i] ["token"] == token) {
          emailAddress = verificationTokens[i] ["address"];
        }
      }
      // set email verified
      let emails = userDetail.emails;
      for (let i=0; i<emails.length; i++) {
        if (emails[i] ["address"] == emailAddress) {
          emails[i] ["verified"] = true;
        }
      }
      // update emails array in user collection
      Meteor.users.update({_id: userId}, {$set: {emails: emails} });
      return userId;
    },
    "users.resetPasswd": (token: string, newPasswd: string) : void => {
        let userId = Meteor.call("users.findByPasswdToken", token);
        if (! userId || ! userId.length) {
          throw new Meteor.Error(403, "Not authorized");
        }
        return Accounts.setPassword(userId, newPasswd);
    },
    /* find logged-in user */
    "users.findOne": () => {
      let userId = Meteor.userId();
      if (! userId) {
        throw new Meteor.Error(403, "Not authorized!");
      }
      return Meteor.users.findOne({ _id: userId });
    },
    "users.resetProfile": () => {
      let users = Meteor.users.find().fetch();
      for (let i=0; i<users.length; i++) {
        let user = users[i];
        if (! user.profile.companyName) {
          user.profile.companyName = "";
        }
        if (! user.profile.agentCertificate) {
          user.profile.agentCertificate = {};
        }
        if (! user.profile.agentIdentity) {
          user.profile.agentIdentity = {};
        }
        if (! user.profile.ownerName) {
          user.profile.ownerName = "";
        }

        Meteor.users.update({_id: user._id}, {
          $set: {
            supplier: {
              companyName: user.profile.companyName,
              agentCertificate: user.profile.agentCertificate,
              agentIdentity: user.profile.agentIdentity,
              ownerName: user.profile.ownerName
            }
          }
        });
      }
    }
})
