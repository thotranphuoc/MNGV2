import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { ImageService } from '../../services/image.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { iItem } from '../../interfaces/item.interface';
@IonicPage()
@Component({
  selector: 'page-update-item',
  templateUrl: 'update-item.html',
})
export class UpdateItemPage {
  SHOP_ITEM: iItem = null;
  base64Images: any[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private imageService: ImageService,
    private dbService: DbService,
    private crudService: CrudService,
    private appService: AppService
  ) {
    this.SHOP_ITEM = this.navParams.get('SHOP_ITEM');
    if (typeof (this.SHOP_ITEM) == 'undefined') {
      this.SHOP_ITEM = null
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateItemPage');
  }

  clickImage(image, i) {
    console.log(image, i)
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Update photo',
          handler: () => {
            console.log('Update photo clicked');
            this.takePhoto(image);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto(image){
    this.selectPhotosByBrowser(image);
  }

  selectPhotosByBrowser(image){
    document.getElementById('inputFile').click();
  }

  takePictureAndResizeByBrowser(event) {
    this.imageService.resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event)
      .then((imgDataUrls: string[]) => {
        setTimeout(() => {
          console.log(imgDataUrls);
          this.base64Images = imgDataUrls;
          let NAME = new Date().getTime().toString();
          
          this.dbService.uploadBase64Images2FBReturnPromiseWithArrayOfURL('ItemImages/' + this.SHOP_ITEM.ITEM_ID, this.base64Images, NAME)
          .then((urls)=>{
            // upload ITEM_IMAGES then delete the old ITEM_IMAGE
            this.dbService.updateAnObjectAtNode('Items/' + this.SHOP_ITEM.ITEM_ID + '/ITEM_IMAGES', urls);
            // delete old image firebase storage
            this.dbService.deleteFileFromFireStorageWithHttpsURL(this.SHOP_ITEM.ITEM_IMAGES[0]).then((res)=>{
              // update
              this.SHOP_ITEM.ITEM_IMAGES = urls;
            })
            .catch((err)=>{
              console.log(err)
            })
            
          })
        }, 1000);
      })
  }

  update(){
    console.log(this.SHOP_ITEM);
    this.crudService.updateItem(this.SHOP_ITEM);
  }

}
