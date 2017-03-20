import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../both/collections/users.collection';

Meteor.methods({
    "users.insert": (userData: {email: string, passwd: string, profile?: any, fbId?: string}): string => {
        let userDetails = {
            email: userData.email,
            password: userData.passwd,
            profile: userData.profile,
            fbId: userData.fbId
        };
        let userId = Accounts.createUser(userDetails);
        return userId;
    },
    "users.findByToken": (token: string): any => {
      let userDetail = Meteor.users.findOne({"services.password.reset.token": token});
      if (userDetail && userDetail._id) {
        return userDetail._id;
      } else {
        return null;
      }
    },
    "users.resetPasswd": (token: string, newPasswd: string) => {
        let userId = Meteor.call("users.findByToken", token);
        if (! userId.length) {
          return false;
        } else {
          return Accounts.setPassword(userId, newPasswd);
        }
    },
})
