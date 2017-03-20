import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import {MeteorComponent} from 'angular2-meteor';
import template from './signup.component.html';

@Component({
  selector: 'signup',
  template
})
export class SignupComponent extends MeteorComponent implements OnInit {
  signupForm: FormGroup;
  error: string;
  fbId: string;
  fbProfile: any;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    var emailRegex = "[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})";
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required],
      firstName: ['', ([Validators.required,Validators.pattern("[a-zA-Z][a-zA-Z ]*")])],
      lastName: ['', Validators.required]
    })

  }

  signup() {
    if (this.signupForm.valid) {
      let userData = {
        email: this.signupForm.value.email,
        passwd: this.signupForm.value.password,
        fbId: this.fbId,
        profile: {
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
        }
      };
      this.call("users.insert", userData, (err, res) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  fblogin(): void {
    Meteor.loginWithFacebook({requestPermissions: ['public_profile,email']}, (err) => {
      if (err) {
        console.log("Error while calling loginWithFacebook:", err);
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
