import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step3.html";

@Component({
  selector: '',
  template
})
export class CreateComponentStep3 extends MeteorComponent implements OnInit {
    step3Form: FormGroup;
    error: string;
    hasBreakfast = false;
    hasLunch = false;
    hasDinner = false;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      this.step3Form = this.formBuilder.group({
        title: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        hotelType: ['', Validators.compose([Validators.required])],
        hotelName: ['', Validators.compose([Validators.required])]
      });
      let step3Details = this.sessionStorage.retrieve("step3Details");
      if (step3Details) {
        this.step3Form.controls['title'].setValue(step3Details.title);
        this.step3Form.controls['description'].setValue(step3Details.description);
        this.step3Form.controls['hotelType'].setValue(step3Details.hotelType);
        this.step3Form.controls['hotelName'].setValue(step3Details.hotelName);
      }
      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "supplier-dashboard summary tours booking";
    }

    ngOnDestroy() {
    }

    step3() {
      if (! this.step3Form.valid) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      let details = {
        title : this.step3Form.value.title,
        description : this.step3Form.value.description,
        hotelType : this.step3Form.value.hotelType,
        hotelName : this.step3Form.value.hotelName,
        hasBreakfast : this.hasBreakfast,
        hasLunch : this.hasLunch,
        hasDinner : this.hasDinner,
      };
      this.sessionStorage.store("step3Details", details);
      let step3Details = this.sessionStorage.retrieve("step3Details");
      if (step3Details) {
        this.ngZone.run(() => {
          this.router.navigate(['/tours/create/step4']);
        });
      } else {
        showAlert("Error while saving data. Please try after restarting your browser.", "danger");
      }
    }
}
