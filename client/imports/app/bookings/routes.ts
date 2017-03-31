import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { BookingsPageComponent } from './list';

export const routes = [
    {path: "bookings/list", component: BookingsPageComponent }
];
