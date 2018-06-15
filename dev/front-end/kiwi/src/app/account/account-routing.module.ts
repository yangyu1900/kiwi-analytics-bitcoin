import { AntiSigninGuardService } from './services/anti-signin-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: "",
      children: [
        { path: "signin", loadChildren: "./signin/signin.module#SigninModule", canActivate: [AntiSigninGuardService]},
        { path: "register", loadChildren: "./register/register.module#RegisterModule", canActivate: [AntiSigninGuardService]}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AntiSigninGuardService]
})

export class AccountRoutingModule { }
