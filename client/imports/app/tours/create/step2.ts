import { Component, OnInit, NgZone, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { ChangeDetectorRef } from "@angular/core";
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { CustomValidators as CValidators } from "ng2-validation";
import template from "./step2.html";

interface DateRange {
  startDate: Date;
  endDate: Date;
  price?: [{
    numOfPersons: number;
    adult: number;
    child: number;
  }],
  totalSeats: number;
  availableSeats: number;
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
        private sessionStorage: SessionStorageService,
        private changeDetectorRef: ChangeDetectorRef
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
        startDate: ['', Validators.compose([])],
        endDate: ['', Validators.compose([])],
        seats: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(30)])],
        price: this.formBuilder.array([
        ])
      });

      for (let i=0; i<5; i++) {
        let control = <FormArray>this.step2Form.controls['price'];
        let priceGroup = this.formBuilder.group({
          numOfPersons: [(i+1), Validators.compose([Validators.required, CValidators.min(1), CValidators.max(100)])],
          adult: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(5000)])],
          child: ['', Validators.compose([Validators.required, CValidators.min(1), CValidators.max(5000)])]
        });
        control.push(priceGroup);
      }
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

    removeDateRange( index ) {
      if (!confirm("Are you sure, do you want to continue?")) {
        return false;
      }

      let dateRange = this.dateRange;
      dateRange.splice(index, 1);
      this.changeDetectorRef.detectChanges();
      this.dateRange = dateRange;
    }

    step2() {
      if (! this.step2Form.valid || ! $("#datetimepicker1").val() || ! $("#datetimepicker2").val()) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      var startDate = $("#datetimepicker1").datepicker("getDate");
      var endDate = $("#datetimepicker2").datepicker("getDate");

      let object = {
        startDate,
        endDate,
        totalSeats: <number>this.step2Form.value.seats,
        availableSeats: <number>this.step2Form.value.seats,
        hasDeparture: this.step2Form.value.hasDeparture,
        price: this.step2Form.value.price
      };
      // console.log(object);

      let dateRange = this.dateRange;
      let newObject = true;
      for(let i=0; i<dateRange.length; i++)
      {
        if(dateRange[i].startDate == object.startDate) {
          dateRange[i] = object;
          newObject = false;
          break;
        }
      }

      if (newObject == true)
      {
        this.dateRange.push(object);
      }
      else {
        this.dateRange = dateRange;
      }

      //this.step2Form.reset();
      $('#datetimepicker1').val('').datepicker('update');
      $('#datetimepicker2').val('').datepicker('update');

      this.step2Form.setValue({
        price: [
        {numOfPersons: 1, adult: '', child: ''},
        {numOfPersons: 2, adult: '', child: ''},
        {numOfPersons: 3, adult: '', child: ''},
        {numOfPersons: 4, adult: '', child: ''},
        {numOfPersons: 5, adult: '', child: ''}
      ],
      startDate: '',
      endDate: '',
      seats: ''
    });
    }

    next() {
      if (this.dateRange.length <= 0) {
        showAlert("Fill Tour Schedule first.", "danger");
        return;
      }

      let details = {
        dateRange: this.dateRange
      }
      this.sessionStorage.store("step2Details", details);
      let step2Details = this.sessionStorage.retrieve("step2Details");
      if (step2Details) {
        this.ngZone.run(() => {
          this.router.navigate(['/tours/create/step3']);
        });
      } else {
        showAlert("Error while saving data. Please try after restarting your browser.", "danger");
      }
    }
}
