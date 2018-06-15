import { SigninService } from '../signin/services/signin.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AntiSigninGuardService implements CanActivate {
  private status: boolean = true;

  constructor(private router: Router, private signinService: SigninService) {
  }

  canActivate() {
    this.status = localStorage.getItem("currentUser") ? false : true;

    this.signinService.currentUser.subscribe(
      data => {
        this.status = localStorage.getItem("currentUser") ? false : true;
      },
      error => {
        this.status = true;
      }
    )

    if (!this.status) {
      this.router.navigate(["/home"]);
    }
    return this.status;
  }
}
