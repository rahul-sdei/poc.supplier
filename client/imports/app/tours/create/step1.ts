import { Component, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { CustomValidators as CValidators } from "ng2-validation";
import template from "./step1.html";

@Component({
  selector: '',
  template
})
export class CreateTourStep1Component extends MeteorComponent implements OnInit {
    step1Form: FormGroup;
    error: string;
    address : Object;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      let step1Details = this.sessionStorage.retrieve("step1Details");
      if (! step1Details) {
        step1Details = {};
      }
      this.step1Form = this.formBuilder.group({
        name: [step1Details.name, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255)])],
        description: [step1Details.description, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(755)])],
        departure: [step1Details.departure, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(255)])],
        destination: [step1Details.destination, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(255)])],
        noOfDays: [step1Details.noOfDays, Validators.compose([Validators.required, CValidators.min(1), CValidators.max(30)])],
        noOfNights: [step1Details.noOfNights, Validators.compose([CValidators.min(1), CValidators.max(30)])],
        tourType: [step1Details.tourType, Validators.compose([Validators.required])],
        tourPace: [step1Details.tourPace, Validators.compose([Validators.required])],
        hasGuide: [step1Details.hasGuide]
      });
      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngAfterViewInit() {
      Meteor.setTimeout(() => {
        jQuery(function($){
        });
      }, 500);
    }

    ngOnDestroy() {
    }

    locationsUrl(search) {
      console.log(search);
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&key=AIzaSyByFK_dYdfuhuZVY8ipkwn9pZYmYD0IidA`;
    }

    getAddress(place:Object, control) {
       //this.address = place['formatted_address'];
       this.address = place['name'];
       var location = place['geometry']['location'];
       var lat =  location.lat();
       var lng = location.lng();
       //console.log("Address Object", place);

       this.step1Form.controls[control].setValue(this.address);
    }

    step1() {
      if (! this.step1Form.valid) {
        showAlert("Fill Tour Details first.", "danger");
        return;
      }

      let details = {
        name : this.step1Form.value.name,
        slug: this.slugify(this.step1Form.value.name),
        description : this.step1Form.value.description,
        departure : this.step1Form.value.departure,
        destination : this.step1Form.value.destination,
        noOfDays : this.step1Form.value.noOfDays,
        noOfNights : this.step1Form.value.noOfNights,
        tourType : this.step1Form.value.tourType,
        tourPace : this.step1Form.value.tourPace,
        hasGuide : this.step1Form.value.hasGuide
      };
      this.sessionStorage.store("step1Details", details);
      let step1Details = this.sessionStorage.retrieve("step1Details");
      if (step1Details) {
        this.ngZone.run(() => {
          this.router.navigate(['/tours/create/step2']);
        });
      } else {
        showAlert("Error while saving data. Please try after restarting your browser.", "danger");
      }
    }

    slugify(text)
    {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    }
}
