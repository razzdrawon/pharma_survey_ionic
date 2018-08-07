import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { RevisionPage } from './revision';

@NgModule({
  declarations: [
    RevisionPage,
  ],
  imports: [
    IonicPageModule.forChild(RevisionPage),
  ],
})
export class RevisionPageModule {}
