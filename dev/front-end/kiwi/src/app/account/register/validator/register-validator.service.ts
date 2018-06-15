import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class RegisterValidatorService {

  constructor() { }

  emailValidator(field:FormControl):any {
    var emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var valid = emailReg.test(field.value);
    return valid ? null : {email: true};
  }

  passwordFormatValidator(field:FormControl):any {
    var passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}/;
    var valid = passwordReg.test(field.value);
    return valid ? null : {validFormat: true};
  }

  passwordEqualValidator(group:FormGroup):any {
    var password = group.get("password");
    var confirmPassword = group.get("confirmPassword");
    var valid = password.value === confirmPassword.value;
    return valid ? null : {equal : true};
  }
}
