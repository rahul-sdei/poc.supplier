import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {MeteorComponent} from 'angular2-meteor';
import template from './login.component.web.html';
import {showAlert} from "../shared/show-alert";

@Component({
  selector: 'login',
  template
})
export class LoginComponent extends MeteorComponent implements OnInit {
    loginForm: FormGroup;
    error: string;

    constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
      super();
    }

    ngOnInit() {
        var emailRegex = "[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})";
        this.loginForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.pattern(emailRegex), Validators.required])],
          password: ['', Validators.required]
        });

        this.error = '';
    }

    login() {
          if (this.loginForm.valid) {
              Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
                  if (err) {
                      this.zone.run(() => {
                        this.error = err;
                      });
                  } else {
                      showAlert("You have been logged in successfully.", "success");
                      this.router.navigate(['/dashboard']);
                  }
              });
          }
      }

    fblogin(): void {
     Meteor.loginWithFacebook({requestPermissions: ['public_profile,email']}, (err) => {
       if (err) {
         console.log("Error while calling loginWithFacebook:", err);
       } else {
         showAlert("You have been logged in successfully.", "success");
         this.router.navigate(['/dashboard']);
       }
     });
   }
}
