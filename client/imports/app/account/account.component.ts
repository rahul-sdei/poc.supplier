import { Component, OnInit, NgZone, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { Observable, Subscription, Subject } from "rxjs";
import { User } from "../../../../both/models/user.model";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { CustomValidators as CValidators } from "ng2-validation";
import { validatePhoneNum, validateFirstName } from "../../validators/common";
import template from './account.component.html';

declare var jQuery:any;

@Component({
  selector: '',
  template
})
@InjectUser("user")
export class UserDetailsComponent extends MeteorComponent implements OnInit, AfterViewChecked {
  profileForm: FormGroup;
  userId: string;
  user: User;
  error: any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    if (!! Meteor.userId()) {
      this.profileForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), CValidators.email])],
        companyName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
        contact: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(15), validatePhoneNum])],
        address1: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), ])],
        address2: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(50)])],
        suburb: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
        state: ['', Validators.compose([Validators.required])],
        postCode: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(12)])],
        country: ['', Validators.compose([Validators.required])]
      })
      let callback = (user) => {
        this.profileForm.controls['companyName'].setValue(user.profile.supplier.companyName);
        this.profileForm.controls['email'].setValue(user.emails[0].address);
        this.profileForm.controls['contact'].setValue(user.profile.contact);
        if (typeof user.profile.address == "undefined") {
          user.profile.address = {};
        }
        this.profileForm.controls['state'].setValue(user.profile.address.state);
        this.profileForm.controls['suburb'].setValue(user.profile.address.suburb);
        this.profileForm.controls['country'].setValue(user.profile.address.country);
        this.profileForm.controls['address2'].setValue(user.profile.address.address2);
        this.profileForm.controls['address1'].setValue(user.profile.address.address1);
        this.profileForm.controls['postCode'].setValue(user.profile.address.postCode);
      };
      this.fetchUser(callback);
    }
  }

  ngAfterViewChecked() {
    var d = document.getElementById("main");
    d.className = "";
  }

  private fetchUser(callback) {
    //console.log("call users.findOne()")
    this.call("users.findOne", (err, res) => {
      if (err) {
        return;
      }
      //console.log("users.findOne():", res);
      callback(res);
    });
  }

  //update supplier's profile
  update() {
    /*if (! this.profileForm.valid) {
      showAlert("Invalid FormData supplied.", "danger");
      return;
    }*/

    let userData = {
      "profile.supplier.companyName": this.profileForm.value.companyName,
      "profile.contact": this.profileForm.value.contact,
      "profile.address": {
        address1: this.profileForm.value.address1,
        address2: this.profileForm.value.address2,
        suburb: this.profileForm.value.suburb,
        state:  this.profileForm.value.state,
        postCode: this.profileForm.value.postCode,
        country:  this.profileForm.value.country
      }
    };
    this.call("users.update", userData, (err, res) => {
      this.ngZone.run(() => {
        if(err) {
          this.error = err;
        } else {
          showAlert("Your profile has been saved.", "success");
          this.router.navigate(['/account']);
        }
      });
    });
  }

  resetStateValue() {
    this.profileForm.controls['state'].setValue(null);
  }

}
