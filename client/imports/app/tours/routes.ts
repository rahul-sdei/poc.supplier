import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { ListPageComponent } from './list';
import { CreateComponent } from './create/step1';
import { CreateComponentStep3 } from './create/step3';
import { CreateComponentStep4 } from './create/step4';
export const routes = [
    {path: "tours/list", component: ListPageComponent },
    {path: "tours/create/step1", component: CreateComponent },
    {path: "tours/create/step3", component: CreateComponentStep3 },
    {path: "tours/create/step4", component: CreateComponentStep4 }
];
