import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkPage } from './link';

@NgModule({
  declarations: [
    LinkPage,
  ],
  imports: [
    IonicPageModule.forChild(LinkPage),
  ],
})
export class LinkPageModule {}
