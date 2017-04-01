import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import template from "./step6.html";

@Component({
  selector: '',
  template
})
export class CreateTourStep6Component extends MeteorComponent implements OnInit {
    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }
}
