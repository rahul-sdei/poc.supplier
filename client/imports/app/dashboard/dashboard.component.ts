import { Component, OnInit } from "@angular/core";
import { Meteor } from "meteor/meteor";
import { InjectUser } from "angular2-meteor-accounts-ui";

import template from "./dashboard.html";

@Component({
    selector: "dashboard",
    template
})
@InjectUser('user')
export class DashboardComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
