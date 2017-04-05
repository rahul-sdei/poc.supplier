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
      if (Meteor.userId())
      {
          this.checkRememberMe();
      }
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
      if (rememberMeNot == true) {
        let userId = this.sessionStorage.retrieve("Meteor.userId");
        if (! userId) {
          // remove tokens
          this.localStorage.clear("rememberMeNot");
          Meteor.logout();
          let router = this.router;
          Meteor.setTimeout(function(){
            router.navigate( ['/login'] );
          }, 500);
        }
        if (Meteor.userId()) {
            this.router.navigate(['/dashboard']);
        }
      } else if (Meteor.userId()) {
        this.router.navigate(['/dashboard']);
      }
    }

    ngAfterViewInit() {
        jQuery(function($){
             var link = '<link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">';
             link += '<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/css/datepicker3.min.css">';
             link += '<script src="https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyByFK_dYdfuhuZVY8ipkwn9pZYmYD0IidA"></script>';
             $('head').prepend(link);
        })
    }
}
