import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinCuestPage } from './fin-cuest';

@NgModule({
  declarations: [
    FinCuestPage,
  ],
  imports: [
    IonicPageModule.forChild(FinCuestPage),
  ],
})
export class FinCuestPageModule {}
