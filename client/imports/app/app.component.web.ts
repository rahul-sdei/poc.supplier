import { Meteor } from 'meteor/meteor';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'
import template from './app.component.web.html';
import {InjectUser} from "angular2-meteor-accounts-ui";
import {LocalStorageService, SessionStorageService} from 'ng2-webstorage';

declare var jQuery:any;

@Component({
    selector: 'app',
    template
})
@InjectUser('user')
export class AppComponent implements OnInit, AfterViewInit {
    constructor(private router: Router, private localStorage: LocalStorageService, private sessionStorage: SessionStorageService) {
      this.observeWindowHeight();
    }

    ngOnInit() {
      this.checkRememberMe();
    }

    private observeWindowHeight() {
      this.router.events.subscribe((val) => {
        //console.log("route changed:", val);
        // see also
        (function setWindowHeight(){
        	var windowHeight = $(window).height();
        	$('.table-wrapper').height(windowHeight);
        	var tableHeight = $('.table-wrapper').height();
        })();
      });
    }

    private checkRememberMe() {
      let rememberMeNot = this.localStorage.retrieve("rememberMeNot");
      console.log("rememberMeNot:", rememberMeNot);
      if (rememberMeNot == true) {
        console.log("remember me not");
        let userId = this.sessionStorage.retrieve("Meteor.userId");
        console.log(userId);
        if (! userId) {
          // remove tokens
          console.log("remove login tokens");
          this.localStorage.clear("rememberMeNot");
          Meteor.logout();
          let router = this.router;
          Meteor.setTimeout(function(){
            router.navigate( ['/login'] );
          }, 500);
        }
      }
    }

    ngAfterViewInit() {
        jQuery(function($){
        })
    }
}
