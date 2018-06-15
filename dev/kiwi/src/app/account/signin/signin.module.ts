import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninRoutingModule } from './signin-routing.module';
import { SigninComponent } from './signin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    SigninRoutingModule,
  ],
  declarations: [
    SigninComponent,
  ]
})
export class SigninModule { }
