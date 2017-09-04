import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotosSelectPage } from './photos-select';

@NgModule({
  declarations: [
    PhotosSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotosSelectPage),
  ],
})
export class PhotosSelectPageModule {}
