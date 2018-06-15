import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'account', loadChildren: './account/account.module#AccountModule' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
    ]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
