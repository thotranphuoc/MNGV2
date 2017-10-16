import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClonePage } from './clone';

@NgModule({
  declarations: [
    ClonePage,
  ],
  imports: [
    IonicPageModule.forChild(ClonePage),
  ],
})
export class ClonePageModule {}
