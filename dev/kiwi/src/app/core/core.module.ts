import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error("core module already exists");
    }
  }
}
