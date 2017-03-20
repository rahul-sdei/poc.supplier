import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MeteorComponent } from 'angular2-meteor';
import template from './header.component.html';
import { Page } from "../../../../both/models/page.model";
@Component({
    selector: 'header-main',
    template
})
@InjectUser('user')
export class HeaderMainComponent extends MeteorComponent implements OnInit, AfterViewInit {
    pages: Page[];
    constructor(private router: Router) {
      super();
    }

    ngOnInit() {
      const options:any = {
          limit: 0,
          skip: 0,
          sort: { "title": 1 },
          fields: {title: 1, slug: 1}
      };
      let searchString = "";
      this.call("pages.find", options, {}, searchString, (err, res) => {
        if (err) {
          console.log("Error calling pages.find");
          return;
        }
        this.pages = res.data;
      });
    }

    logout() {
        Meteor.logout();
        this.router.navigate( ['/login'] );
    }

    ngAfterViewInit() {
    }
}
