import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { BookingsPageComponent } from './list';
import { BookingsViewComponent } from './view';
export const routes = [
    {path: "bookings/list", component: BookingsPageComponent },
    {path: "bookings/view/:id", component: BookingsViewComponent }
];
