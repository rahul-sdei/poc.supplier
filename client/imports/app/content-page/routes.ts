import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';


import { ViewPageComponent } from "./view";

export const routes = [
    {path: "page/view/:slug", component: ViewPageComponent}
];
