import { Component, OnInit, NgZone, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { CustomValidators as CValidators } from "ng2-validation";
import template from "./step2.html";

interface DateRange {
  date: string;
  seats: number;
  price: {
    adult: number;
    child: number;
  },
  hasDeparture: any;
}

declare var jQuery:any;

@Component({
  selector: '',
  template
})

export class CreateTourStep2Component extends MeteorComponent implements OnInit {
  step2Form: FormGroup;
  dateRange: DateRange[] = [];
  error: string;
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }
    ngOnInit() {
      let step2Details = this.sessionStorage.retrieve("step2Details");
      if (! step2Details) {
        step2Details = {};
      }
      else {
        this.dateRange = step2Details.dateRange;
      }
      this.step2Form = this.formBuilder.group({
        date: ['', Validators.compose([])],
        seats: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(30)])],
        adult: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(5000)])],
        child: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(5000)])]
      });
      this.error = '';
    }

    ngAfterViewInit() {
      Meteor.setTimeout(() => {
        jQuery(function($){
          $('#datetimepicker1')
            .datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true
            })
            .on('changeDate', function(e) {

            });
        });
      }, 500);
      Meteor.setTimeout(() => {
        jQuery(function($){
          $('#datetimepicker2')
            .datepicker({
                format: 'mm/dd/yyyy',
                autoclose: true
            })
            .on('changeDate', function(e) {

            });
        });
      }, 500);
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }

    step2() {
      if (! this.step2Form.valid || ! $("#datetimepicker1").val()) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      var startDate = $("#datetimepicker1").datepicker("getDate");
      var endDate = $("#datetimepicker2").datepicker("getDate");
      console.log(startDate, endDate, adult, child);
    }
      // let object = {
      //   date: date,
      //   seats: this.step2Form.value.seats,
      //   price: {
      //     child: this.step2Form.value.child,
      //     adult: this.step2Form.value.adult
      //   },
      //   hasDeparture: this.step2Form.value.hasDeparture
      // };

    //   let dateRange = this.dateRange;
    //   let newObject = true;
    //   for(let i=0; i<dateRange.length; i++)
    //   {
    //     if(dateRange[i].date == object.date) {
    //       dateRange[i] = object;
    //       newObject = false;
    //       break;
    //     }
    //   }
    //
    //   if (newObject == true)
    //   {
    //     this.dateRange.push(object);
    //   }
    //   else {
    //     this.dateRange = dateRange;
    //   }
    //
    //   this.step2Form.reset();
    // }

    // next() {
    //   if (this.dateRange.length <= 0) {
    //     showAlert("Fill Tour Schedule first.", "danger");
    //     return;
    //   }
    //
    //   let details = {
    //     dateRange: this.dateRange
    //   }
    //   this.sessionStorage.store("step2Details", details);
    //   let step2Details = this.sessionStorage.retrieve("step2Details");
    //   if (step2Details) {
    //     this.ngZone.run(() => {
    //       this.router.navigate(['/tours/create/step3']);
    //     });
    //   } else {
    //     showAlert("Error while saving data. Please try after restarting your browser.", "danger");
    //   }
    // }
}
