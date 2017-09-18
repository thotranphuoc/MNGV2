import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoSelectPage } from './photo-select';

@NgModule({
  declarations: [
    PhotoSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoSelectPage),
  ],
})
export class PhotoSelectPageModule {}
