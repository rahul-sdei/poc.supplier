import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import {SignupComponent} from "./auth/singup.component";
import {RecoverComponent} from "./auth/recover.component";
import {LoginComponent} from "./auth/login.component.web";
import { ResendEmailComponent } from "./auth/resend-email.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LandingComponent} from "./layout/landing.component";
import {accountRoutes} from "./account/account.routes";
import {routes as pageRoutes} from "./content-page/routes";
import {routes as tourRoutes} from "./tours/routes";
import {routes as faqRoutes} from "./faqs/routes";
import { ResetPassword } from "./auth/resetpassword";
import { VerifyEmail } from "./auth/verifyemail.component";
import { routes as bookingRoutes } from "./bookings/routes";
import { routes as reportsRoutes } from "./reports/routes";
import { routes as uploadRoutes } from "./upload-cert/routes";


let mainRoutes = [
    { path: '', component: LoginComponent/*, canActivate: ['canActivateForLogoff']*/ },
    { path: 'dashboard', component: DashboardComponent, canActivate: ['canActivateForLoggedIn'] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'recover', component: RecoverComponent },
    { path: 'reset-password/:token',component: ResetPassword },
    { path: 'verify-email/:token',component: VerifyEmail },
    { path: 'resend-email', component: ResendEmailComponent },
];

export const routes: Route[] = [
    ...mainRoutes,
    ...accountRoutes,
    ...pageRoutes,
    ...faqRoutes,
    ...tourRoutes,
    ...bookingRoutes,
    ...reportsRoutes,
    ...uploadRoutes
];

export const ROUTES_PROVIDERS = [
    {
        provide: 'canActivateForLoggedIn',
        useValue: () => !! Meteor.userId()
    },
    {
        provide: 'canActivateForLogoff',
        useValue: () => ! Meteor.userId()
    },
];
