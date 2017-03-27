import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { ListPageComponent } from './list';

export const routes = [
    {path: "tours/list", component: ListPageComponent }
];
