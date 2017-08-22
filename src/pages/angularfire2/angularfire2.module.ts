import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Angularfire2Page } from './angularfire2';

@NgModule({
  declarations: [
    Angularfire2Page,
  ],
  imports: [
    IonicPageModule.forChild(Angularfire2Page),
  ],
  exports: [
    Angularfire2Page
  ]
})
export class Angularfire2PageModule {}
