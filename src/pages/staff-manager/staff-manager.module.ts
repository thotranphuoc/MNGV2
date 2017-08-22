import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaffManagerPage } from './staff-manager';

@NgModule({
  declarations: [
    StaffManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(StaffManagerPage),
  ],
  exports: [
    StaffManagerPage
  ]
})
export class StaffManagerPageModule {}
