import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step4.html";

@Component({
  selector: '',
  template
})
export class CreateComponentStep4 extends MeteorComponent implements OnInit {
    step4Form: FormGroup;
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
      this.step4Form = this.formBuilder.group({
        title: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        hotelType: ['', Validators.compose([Validators.required])],
        hotelName: ['', Validators.compose([Validators.required])],
        hasBreakfast: ['', Validators.compose([Validators.required])],
        hasLunch: ['', Validators.compose([Validators.required])],
        hasDinner: ['', Validators.compose([Validators.required])],
      });

      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "supplier-dashboard summary tours booking";
    }

    ngOnDestroy() {
    }

    step3() {
      if (! this.step4Form.valid) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }
      // this.sessionStorage.store("step3Details", details);
      // let step1Details = this.sessionStorage.retrieve("step3Details");
      // if (step1Details) {
      //   this.ngZone.run(() => {
      //     this.router.navigate(['/tours/create/step5']);
      //       console.log(step1Details);
      //   });
      // } else {
      //   showAlert("Please refresh your session and try again.", "danger");
      // }
    }
}
