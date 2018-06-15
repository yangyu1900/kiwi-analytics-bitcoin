import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
