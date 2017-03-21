import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Accounts.onCreateUser(function(options, user) {
    // Use provided userData in options, or create an empty object
    // user profile
    if (typeof options.profile !== "undefined") {
        user.profile = options.profile || {};
    }
    // user status
    if (typeof options.status !== "undefined") {
        user.status = options.status || {};
    }

    // set profile incase of fb login
    if (typeof user.services.facebook !== "undefined") {
        let fbData = user.services.facebook;
        user.profile = {
          fbId: fbData.id,
          fullName: fbData.name,
          firstName: fbData.first_name,
          lastName: fbData.last_name,
          age: fbData.age_range.min,
          gender: fbData.gender
        }
    }

    // set user role
    user.roles = ['supplier'];

    // Returns the user object
    return user;
});

// remove login attempt limit
// Accounts.removeDefaultRateLimit();

// validate user role before login
Accounts.validateLoginAttempt(function (options) {
   if (options.user && options.allowed) {
       var isAdmin = Roles.userIsInRole(options.user, ['supplier'])
       if (!isAdmin) {
           throw new Meteor.Error(403, "Not authorized!");
       }
   }
   return true;
});

//validate the change password
Accounts.changePassword = function (oldpassword, newPassword) {
  if (!Meteor.user()) {
    throw new Meteor.Error("Must be logged in to change password.");
  }

  check(newPassword, String);
  if (!newPassword) {
    throw new Meteor.Error(400, "Password may not be empty");
  }
}
