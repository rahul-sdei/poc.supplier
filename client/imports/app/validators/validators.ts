import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
  return (group: FormGroup): {[key: string]: any} => {
    let password = group.controls[passwordKey];
    let confirmPassword = group.controls[confirmPasswordKey];

    if (password.value !== confirmPassword.value) {
      return {
        mismatchedPasswords: true
      };
    }
  }
}

export const validatePassword = function(c: FormControl) {
  if (isEmptyInputValue(c.value)) {
    return null;  // don't validate empty values to allow optional controls
  }

  let REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)\-\_\=\+\{\}\[\]\;\:\'\"\,\.\<\>\/\\\|\?])(?=.{8,})/;

  return REGEXP.test(c.value) ? null : {
    validatePassword: {
      valid: false
    }
  };
}

function isEmptyInputValue(value: any) {
  return value == null || typeof value === 'string' && value.length === 0;
}
