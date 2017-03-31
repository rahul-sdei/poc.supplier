import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step1.html";

@Component({
  selector: '',
  template
})
export class CreateComponent extends MeteorComponent implements OnInit {
    step1Form: FormGroup;
    error: string;
    hasGuide = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      this.step1Form = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        departure: ['', Validators.compose([Validators.required])],
        destination: ['', Validators.compose([Validators.required])],
        noOfDays: ['', Validators.compose([Validators.required])],
        noOfNights: ['', Validators.compose([Validators.required])],
        tourType: ['', Validators.compose([Validators.required])],
        tourPace: ['', Validators.compose([Validators.required])]
      });
      let step1Details = this.sessionStorage.retrieve("step1Details");
      if (step1Details) {
        this.step1Form.controls['name'].setValue(step1Details.name);
        this.step1Form.controls['description'].setValue(step1Details.description);
        this.step1Form.controls['departure'].setValue(step1Details.departure);
        this.step1Form.controls['destination'].setValue(step1Details.destination);
        this.step1Form.controls['noOfDays'].setValue(step1Details.noOfDays);
        this.step1Form.controls['noOfNights'].setValue(step1Details.noOfNights);
        this.step1Form.controls['tourType'].setValue(step1Details.tourType);
        this.step1Form.controls['tourPace'].setValue(step1Details.tourPace);
        // this.hasGuide = step1Details.hasGuide;
      } else {
        showAlert("Unable to fetch data", "danger");
      }
      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }

    step1() {
      if (! this.step1Form.valid) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      let details = {
        name : this.step1Form.value.name,
        description : this.step1Form.value.description,
        departure : this.step1Form.value.departure,
        destination : this.step1Form.value.destination,
        noOfDays : this.step1Form.value.noOfDays,
        noOfNights : this.step1Form.value.noOfNights,
        tourType : this.step1Form.value.tourType,
        tourPace : this.step1Form.value.tourPace,
        hasGuide : this.hasGuide
      };
      this.sessionStorage.store("step1Details", details);
      let step1Details = this.sessionStorage.retrieve("step1Details");
      if (step1Details) {
        this.ngZone.run(() => {
          this.router.navigate(['/tours/create/step3']);
        });
      } else {
        showAlert("Error while saving data. Please try after restarting your browser.", "danger");
      }
    }
}
