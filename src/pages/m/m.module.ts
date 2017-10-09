import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MPage } from './m';

@NgModule({
  declarations: [
    MPage,
  ],
  imports: [
    IonicPageModule.forChild(MPage),
  ],
})
export class MPageModule {}
