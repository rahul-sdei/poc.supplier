import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import {MeteorComponent} from 'angular2-meteor';
import { matchingPasswords} from '../../app/validators/validators';


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

  oldpassword = new FormControl("", Validators.required);
  newpassword = new FormControl("", Validators.required);
  confirmpassword = new FormControl("", Validators.required);




    ngOnInit() {

      this.passwordForm = this.formBuilder.group({


      "oldpassword": this.oldpassword,
     "newpassword": this.newpassword,
     "confirmpassword": this.confirmpassword
   }, {validator: this.matchingPasswords('newpassword', 'confirmpassword')});

}
        changepassword() {
        if (this.passwordForm.valid) {
          let userData = {

            passwd: this.passwordForm.value.password,
          };
          this.call("users.insert", userData, (err, res) => {
            if (err) {
              this.zone.run(() => {
                this.error = err;
              });
            } else {
              console.log("new user-id:", res);
              this.router.navigate(['/account']);
            }
          });
        }
    }
}
