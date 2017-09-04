import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotosTakePage } from './photos-take';

@NgModule({
  declarations: [
    PhotosTakePage,
  ],
  imports: [
    IonicPageModule.forChild(PhotosTakePage),
  ],
})
export class PhotosTakePageModule {}
