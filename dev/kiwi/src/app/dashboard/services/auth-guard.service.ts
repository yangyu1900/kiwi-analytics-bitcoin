import { SigninService } from '../../account/signin/services/signin.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {
  private status: boolean = false;

  constructor(private router: Router, private signinService: SigninService) {
  }

  canActivate() {
    this.status = localStorage.getItem("currentUser") ? true : false;

    this.signinService.currentUser.subscribe(
      data => {
        this.status = localStorage.getItem("currentUser") ? true : false;
      },
      error => {
        this.status = false;
      }
    )

    if (!this.status) {
      this.router.navigate(["account/signin"]);
    }
    return this.status;
  }

}
