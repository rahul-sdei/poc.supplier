import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { ListPageComponent } from './list';
import { CreateComponent } from './step1';
export const routes = [
    {path: "tours/list", component: ListPageComponent },
    {path: "tours/create/step1", component: CreateComponent }
];
