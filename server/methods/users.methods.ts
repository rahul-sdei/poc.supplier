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
    }
})
