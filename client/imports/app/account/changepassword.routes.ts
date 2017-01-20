import { Routes } from '@angular/router';


import { PasswordComponent }    from './changepassword.component';


// Route Configuration
export const passwordRoutes: Routes = [
  { path: 'changepassword/:id', component: PasswordComponent },

];
