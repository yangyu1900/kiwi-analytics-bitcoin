import { User } from '../../models/user-model';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RegisterService {

  constructor(private http: Http) { }

  public register(user: User, callback: any): void {
    let postHeaders: Headers = new Headers();
    postHeaders.set("Content-Type", "application/json");

    let targetUrl: string = "/kiwi/account/register";

    this.http.post(
      targetUrl,
      JSON.stringify(user),
      { headers: postHeaders })
      .subscribe(
      (res) => {
        let result = res.json();
        // console.log(result);
        callback(result);
      }
      );
  }
}
