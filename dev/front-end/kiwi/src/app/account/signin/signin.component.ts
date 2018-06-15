import { SigninService } from './services/signin.service';
import { User } from '../models/user-model';
import { flyIn } from '../../animations/fly-in';
import { Md5 } from 'ts-md5/dist/md5';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [flyIn]
})
export class SigninComponent implements OnInit {
  public signinForm: FormGroup;
  private user: User = new User();
  public success: boolean = true;

  constructor(private fb: FormBuilder, private signinService: SigninService) {
    this.signinForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.markInputsAsTouched();
    if (this.signinForm.valid) {
      let secret = Md5.hashStr(this.signinForm.get("password").value);
      // console.log(secret);
      this.user.username = this.signinForm.get("username").value;
      this.user.password = secret;

      this.signinService.signin(this.user).subscribe(
        data => {
          if (!localStorage.getItem("currentUser")) {
            this.success = false;
          }
        },
        error => {
          console.log(error);
          this.success = false;
        }
      );
    }
    //console.log(this.signinForm.value);
  }

  private markInputsAsTouched(): void {
    this.signinForm.get("username").markAsTouched();
    this.signinForm.get("password").markAsTouched();
  }

}
