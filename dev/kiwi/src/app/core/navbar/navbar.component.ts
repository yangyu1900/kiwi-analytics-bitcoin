import { Router, NavigationEnd } from '@angular/router';
import { SigninService } from '../../account/signin/services/signin.service';
import { User } from '../../account/models/user-model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public currentUser: User;

  constructor(private signinService: SigninService, private router: Router) { }

  ngOnInit() {
    //console.log(localStorage.getItem("currentUser"));
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.signinService.currentUser.subscribe(
      data => {
        this.currentUser = data;
      },
      error => console.error(error)
    );

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => {
        $("#navbarHeader").removeClass("show");
        $("#collapseBtn").addClass("collapsed").attr({ "aria-expanded": false });
      });
  }

  public doSignout(): void {
    this.signinService.signout();
  }

}
