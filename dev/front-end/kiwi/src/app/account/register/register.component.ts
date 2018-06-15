import { User } from '../models/user-model';
import { RegisterService } from './service/register.service';
import { RegisterValidatorService } from './validator/register-validator.service';
import { flyIn } from '../../animations/fly-in';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [flyIn],
  providers: [RegisterValidatorService, RegisterService]
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  private user: User = new User();

  constructor(private fb: FormBuilder, private rv: RegisterValidatorService, private rs: RegisterService, private router: Router) {
    this.registerForm = fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      username: ["", [Validators.required]],
      email: ["", [Validators.required, this.rv.emailValidator]],
      passwordGroup: fb.group({
        password: ["", this.rv.passwordFormatValidator],
        confirmPassword: [""]
      }, { validator: this.rv.passwordEqualValidator })
    });
  }

  ngOnInit() {
  }

  public onSubmit(): void {
    // console.log("submitted");
    this.markInputsAsTouched();
    if (this.registerForm.valid) {
      this.user.firstName = this.registerForm.get("firstName").value;
      this.user.lastName = this.registerForm.get("lastName").value;
      this.user.username = this.registerForm.get("username").value;
      this.user.email = this.registerForm.get("email").value;
      let secret = Md5.hashStr(this.registerForm.get("passwordGroup").get("password").value);
      this.user.password = secret;
      // console.log(this.user);
      this.rs.register(this.user, (result) => {
        if (result.result) {
          this.router.navigate(["/account/signin"]);
        }
      });
    }
  }

  private markInputsAsTouched(): void {
    this.registerForm.get("firstName").markAsTouched();
    this.registerForm.get("lastName").markAsTouched();
    this.registerForm.get("username").markAsTouched();
    this.registerForm.get("email").markAsTouched();
    this.registerForm.get("passwordGroup").get('password').markAsTouched();
    this.registerForm.get("passwordGroup").get('confirmPassword').markAsTouched();
  }

}
