import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService],
    children: [
      { path: "", loadChildren: "./overview/overview.module#OverviewModule" },
      { path: "overview", loadChildren: "./overview/overview.module#OverviewModule" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})

export class DashboardRoutingModule { }
