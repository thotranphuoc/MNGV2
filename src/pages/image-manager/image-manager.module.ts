import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageManagerPage } from './image-manager';

@NgModule({
  declarations: [
    ImageManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageManagerPage),
  ],
})
export class ImageManagerPageModule {}
