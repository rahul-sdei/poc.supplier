import { Meteor } from "meteor/meteor";
import {Component, OnInit, OnDestroy, NgZone} from "@angular/core";
import {Observable, Subscription, Subject, BehaviorSubject} from "rxjs";
import {MeteorObservable} from "meteor-rxjs";
import {InjectUser} from "angular2-meteor-accounts-ui";
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Page } from "../../../../both/models/page.model";
import {showAlert} from "../shared/show-alert";

import template from "./view.html";

@Component({
  selector: '',
  template
})
export class ViewPageComponent extends MeteorComponent implements OnInit, OnDestroy {
    paramsSub: Subscription;
    item: Page;
    slug: string;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone
    ) {
        super();
    }

    ngOnInit() {
      this.paramsSub = this.route.params
        .map(params => params['slug'])
        .subscribe(id => {
            this.slug = id;

            if (! this.slug) {
              showAlert("Invalid slug supplied.");
              return;
            }

            this.call("pages.findOne", this.slug, (err, res)=> {
                if (err) {
                    showAlert("Error while fetching page data.", "danger");
                    return;
                }

                this.item = res;
            });
        });
    }

    get page() {
        return this.item;
    }
}
