import { Routes } from '@angular/router';


import { UserDetailsComponent }    from './account.component';


// Route Configuration
export const accountRoutes: Routes = [
  { path: 'account/:id', component: UserDetailsComponent },

];
