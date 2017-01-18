
import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import {MeteorComponent} from 'angular2-meteor';


import template from './changepassword.component.html';

@Component({
  selector: '',
  template
})
export class PasswordComponent extends MeteorComponent implements OnInit {
  passwordForm: FormGroup;
  error: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
    super();
  }


ngOnInit() {
  this.passwordForm = this.formBuilder.group({
    oldpassword: ['',Validators.required],
    newPassword: ['', Validators.required],
  });

   this.error = '';
}

ChangePassword() {
  if (this.passwordForm.valid) {

    Accounts.changePassword({oldpassword:this.passwordForm.value.newPassword,newPassword:this.passwordForm.value.newPassword}
    ), (err) => {
      if (err) {
        this.error = err;
      } else {
        this.router.navigate(['/dashboard']);
      }
    };
  }
}
}
