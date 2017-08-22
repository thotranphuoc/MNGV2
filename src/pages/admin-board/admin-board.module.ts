import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminBoardPage } from './admin-board';

@NgModule({
  declarations: [
    AdminBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminBoardPage),
  ],
  exports: [
    AdminBoardPage
  ]
})
export class AdminBoardPageModule {}
