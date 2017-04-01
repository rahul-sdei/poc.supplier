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
export class CreateTourStep4Component extends MeteorComponent implements OnInit {
    step4Form: FormGroup;
    error: string;
    url: string;

    private fileString: any[];
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

    onFileSelect(event) {
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.onload = (event) => {
          this.url = event.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }
}
