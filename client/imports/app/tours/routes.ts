import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { ListPageComponent } from './list';
import { CreateComponent } from './create/step1';
import { CreateComponentStep3 } from './create/step3';
import { CreateComponentStep4 } from './create/step4';
import { CreateComponentStep5 } from './create/step5';
import { CreateComponentStep6 } from './create/step6';
export const routes = [
    {path: "tours/list", component: ListPageComponent },
    {path: "tours/create/step1", component: CreateComponent },
    {path: "tours/create/step3", component: CreateComponentStep3 },
    {path: "tours/create/step4", component: CreateComponentStep4 },
    {path: "tours/create/step5", component: CreateComponentStep5 },
    {path: "tours/create/step6", component: CreateComponentStep6 }
];
