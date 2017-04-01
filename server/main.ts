import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import './startup/accounts-config';
import './imports/publications/users';
import './startup/email-config';

Meteor.startup(() => {

});
