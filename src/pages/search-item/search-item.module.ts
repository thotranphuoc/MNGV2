import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchItemPage } from './search-item';

@NgModule({
  declarations: [
    SearchItemPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchItemPage),
  ],
})
export class SearchItemPageModule {}
