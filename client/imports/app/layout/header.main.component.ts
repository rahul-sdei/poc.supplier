import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MeteorComponent } from 'angular2-meteor';
import { Page } from "../../../../both/models/page.model";
import template from './header.component.html';

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
      const optionsfaq:any = {
          limit: 0,
          curPage: 1,
          nameOrder: 1,
          searchString: '',
      }
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
