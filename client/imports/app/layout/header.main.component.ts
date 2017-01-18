import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import template from './header.component.html';
import {InjectUser} from "angular2-meteor-accounts-ui";

@Component({
    selector: 'demo-dropdown-basic',
    template
})
@InjectUser('user')
export class HeaderMainComponent implements AfterViewInit {
    constructor(private router: Router) {}

    logout() {
        Meteor.logout();
        this.router.navigate( ['/login'] );
    }
    ngAfterViewInit() {
    }
}
