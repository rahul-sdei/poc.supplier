import { Component, OnInit } from "@angular/core";
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";
import { Router } from '@angular/router'
import template from "./dashboard.html";

@Component({
    selector: "dashboard",
    template
})
@InjectUser('user')
export class DashboardComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit() {
      if (!Meteor.userId()) {
        console.log("in dashboard");
        this.router.navigate(['/login']);
      }
    }
}
