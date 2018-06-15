import { User } from '../../models/user-model';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class SigninService {
  private subject: Subject<User> = new Subject<User>();

  constructor(private http: Http, private router: Router) {
  }

  public get currentUser(): Observable<User> {
    return this.subject.asObservable();
  }

  public signin(user: User): Observable<any> {
    let postHeaders: Headers = new Headers();
    postHeaders.set("Content-Type", "application/json");

    let targetUrl: string = "/kiwi/account/signin";

    return this.http.post(
      targetUrl,
      JSON.stringify(user),
      { headers: postHeaders }
    ).map((res) => {
      let result = res.json();
      if (result && result.username) {
        // console.log("user object>" + JSON.stringify(result));
        localStorage.setItem("currentUser", JSON.stringify(result));
        this.subject.next(Object.assign({}, result));
        this.router.navigate(["/dashboard"]);
      }
      return res;
    });
  }

  public signout(): void {
    localStorage.removeItem("currentUser");
    this.subject.next(Object.assign({}));
    this.router.navigate(["/home"])
  }

}
