import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoTakePage } from './photo-take';

@NgModule({
  declarations: [
    PhotoTakePage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoTakePage),
  ],
})
export class PhotoTakePageModule {}
