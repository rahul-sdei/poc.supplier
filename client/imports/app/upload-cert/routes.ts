import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { UploadCertStep1Component } from './step1.component';
import { UploadCertStep2Component } from './step2.component';

export const routes = [
    {path: "signup/step1", component: UploadCertStep1Component },
    {path: "signup/step2", component: UploadCertStep2Component }
];
