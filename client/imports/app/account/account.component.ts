import { Component, OnInit, NgZone, AfterViewInit, AfterViewChecked } from '@angular/core';
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
import { upload } from '../../../../both/methods/images.methods';
import template from './account.component.html';

declare var jQuery:any;

@Component({
  selector: '',
  template
})
@InjectUser("user")
export class UserDetailsComponent extends MeteorComponent implements OnInit, AfterViewInit, AfterViewChecked {
  profileForm: FormGroup;
  userId: string;
  oldEmailAddress: string;
  user: User;
  error: any;
  fileIsOver: boolean = false;
  isUploading: boolean;
  isUploaded: boolean;

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
        this.oldEmailAddress = user.emails[0].address;
      };
      this.fetchUser(callback);
    }
  }

  ngAfterViewInit() {
    Meteor.setTimeout(() => {
      jQuery(function($){
        var phones = [{ "mask": "(###) ###-####"}];
            $('#phnNumber').inputmask({
                mask: phones,
                greedy: false,
                definitions: { '#': { validator: "[0-9]", cardinality: 1}} });
      })
    }, 500);
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
    let emailAddress = {
      oldAddress: this.oldEmailAddress,
      newAddress: this.profileForm.value.email
    };

    this.error = null;
    this.call("users.update", userData, emailAddress, (err, res) => {
      this.ngZone.run(() => {
        if(err) {
          this.error = err;
        } else {
          this.oldEmailAddress = emailAddress.newAddress;
          showAlert("Your profile has been saved.", "success");
          this.router.navigate(['/account']);
        }
      });
    });
  }

  resetStateValue() {
    this.profileForm.controls['state'].setValue(null);
  }

  onFileSelect(event) {
      var files = event.srcElement.files;
      this.startUpload(files[0]);
  }


  private startUpload(file: File): void {
      // check for previous upload
      if (this.isUploading === true) {
          console.log("aleady uploading...");
          return;
      }

      // start uploading
      this.isUploaded = false;
      //console.log('file uploading...');
      this.isUploading = true;

      upload(file)
      .then((res) => {
          this.isUploading = false;
          this.isUploaded = true;
          let userData = {
              "profile.image":{
                id: res._id,
                url: res.url,
                name: res.name
              }
          };
          this.call("users.update", userData, (err, res) => {
              if (err) {
                  console.log("Error while updating user picture");
                  return;
              }
              $("#inputFile").val("");
              this.user.profile.image.url = res.url;
              showAlert("Profile picture updated successfully.", "success");
          });
      })
      .catch((error) => {
          this.isUploading = false;
          console.log('Error in file upload:', error);
          showAlert(error.reason, "danger");
      });
  }

}
