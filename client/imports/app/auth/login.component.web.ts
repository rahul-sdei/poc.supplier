import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import {MeteorComponent} from 'angular2-meteor';
import template from './login.component.web.html';
import {showAlert} from "../shared/show-alert";
import {validateEmail, validatePhoneNum, validateFirstName} from "../../validators/common";

@Component({
  selector: 'login',
  template
})
export class LoginComponent extends MeteorComponent implements OnInit {
    loginForm: FormGroup;
    error: string;
    isAvailable = false;
    userId: string;
    constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
      super();
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), validateEmail])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])]
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
                        Accounts.config({
                          loginExpirationInDays: 30
                        });
                        showAlert("You have been logged in successfully.", "success");
                        this.router.navigate(['/dashboard']);
                    }
                });
            }
          }
}
