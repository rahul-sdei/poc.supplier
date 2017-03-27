import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { BookingPageComponent } from './list';

export const routes = [
    {path: "bookings/list", component: BookingPageComponent }
];
