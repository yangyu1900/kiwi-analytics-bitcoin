import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CoreModule } from './core/core.module';
import { ThemeSpinner } from './theme/services/theme-spinner.service';
import 'style-loader!./theme/initial.scss';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SigninService } from './account/signin/services/signin.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CoreModule,
    HomeModule,
    HttpModule,
    RouterModule,
  ],
  providers: [
    SigninService,
    ThemeSpinner,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
