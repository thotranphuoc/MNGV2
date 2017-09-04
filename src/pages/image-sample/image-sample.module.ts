import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageSamplePage } from './image-sample';

@NgModule({
  declarations: [
    ImageSamplePage,
  ],
  imports: [
    IonicPageModule.forChild(ImageSamplePage),
  ],
})
export class ImageSamplePageModule {}
