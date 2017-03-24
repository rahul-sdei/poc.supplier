import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Router } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import template from "./dashboard.html";

@Component({
  selector: "dashboard",
  template
})
@InjectUser('user')
export class DashboardComponent extends MeteorComponent implements OnInit, AfterViewChecked {
  constructor(private router: Router) {
    super();
  }

  ngAfterViewChecked() {
    var d = document.getElementById("main");
    d.className = "supplier-dashboard summary";
  }

  ngOnInit() {
    if (! Meteor.userId()) {
      this.router.navigate(['/login']);
    } else {
      this.userId = Meteor.userId();
    }
  }
}
