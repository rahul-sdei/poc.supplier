import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step5.html";

@Component({
  selector: '',
  template
})
export class CreateTourStep5Component extends MeteorComponent implements OnInit {
    step5Form: FormGroup;
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
      this.step5Form = this.formBuilder.group({
        inclusions: ['', Validators.compose([Validators.required])],
        exclusions: ['', Validators.compose([Validators.required])]
      });

      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }

    step5() {
      if (! this.step5Form.valid) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      let details = {
        inclusions : this.step5Form.value.inclusions,
        exclusions : this.step5Form.value.exclusions
      };
      this.ngZone.run(() => {
        this.router.navigate(['/tours/create/step6']);
      })
    }
}
