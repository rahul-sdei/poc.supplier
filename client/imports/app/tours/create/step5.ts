import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { showAlert } from "../../shared/show-alert";
import { SessionStorageService } from 'ng2-webstorage';
import { upload } from '../../../../../both/methods/documents.methods';
import template from "./step5.html";

interface Document {
  id: string;
  url: string;
  name: string;
}

@Component({
  selector: '',
  template
})
export class CreateTourStep5Component extends MeteorComponent implements OnInit {
    step5Form: FormGroup;
    error: string;
    isUploading: boolean;
    isUploaded: boolean;
    cancellationPolicy: Document;
    refundPolicy: Document;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        private sessionStorage: SessionStorageService
    ) {
        super();
    }

    ngOnInit() {
      let step5Details = this.sessionStorage.retrieve("step5Details");
      if (! step5Details) {
        step5Details = {};
      } else {
        this.refundPolicy = <Document>step5Details.refundPolicy;
        this.cancellationPolicy = <Document>step5Details.cancellationPolicy;
      }

      this.step5Form = this.formBuilder.group({
        inclusions: [step5Details.inclusions, Validators.compose([Validators.required])],
        exclusions: [step5Details.exclusions, Validators.compose([Validators.required])]
      });

      this.error = '';
    }

    ngAfterViewChecked() {
      var d = document.getElementById("main");
      d.className = "";
    }

    ngOnDestroy() {
    }

    onFileSelect(event, field) {
      var files = event.srcElement.files;
      console.log(files);
      this.startUpload(files[0], field);
    }

    private startUpload(file: File, field): void {
        // check for previous upload
        if (this.isUploading === true) {
            console.log("aleady uploading...");
            return;
        }

        // start uploading
        this.isUploaded = false;
        this.isUploading = true;

        upload(file)
        .then((res) => {
            this.isUploading = false;
            this.isUploaded = true;
            let document: Document = {
              id: res._id,
              url: res.url,
              name: res.name
            };
            if (field == 'cancellationPolicy') {
              this.cancellationPolicy = document;
            } else if (field == 'refundPolicy') {
              this.refundPolicy = document;
            }
            console.log("document upload done.")
            console.log("file id:", res._id);
        })
        .catch((error) => {
            this.isUploading = false;
            console.log('Error in file upload:', error);
            showAlert(error.reason, "danger");
        });
    }

    step5() {
      if (! this.step5Form.valid) {
        showAlert("Invalid FormData supplied.", "danger");
        return;
      }

      let details = {
        inclusions : this.step5Form.value.inclusions,
        exclusions : this.step5Form.value.exclusions,
        cancellationPolicy: this.cancellationPolicy,
        refundPolicy: this.refundPolicy
      };

      this.sessionStorage.store("step5Details", details);
      let step5Details = this.sessionStorage.retrieve("step5Details");
      if (step5Details) {
        this.ngZone.run(() => {
          this.router.navigate(['/tours/create/step6']);
        });
      } else {
        showAlert("Error while saving data. Please try after restarting your browser.", "danger");
      }
    }
}
