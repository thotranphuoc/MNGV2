import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

// import { AngularFireService } from '../../services/af.service';
import { DbService } from '../../services/db.service';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
import { iShop } from '../../interfaces/shop.interface';
import { iProfile } from '../../interfaces/profile.interface';
@IonicPage()
@Component({
  selector: 'page-staff-manager',
  templateUrl: 'staff-manager.html',
})
export class StaffManagerPage {
  data: any;
  SHOP: iShop;
  USER_ID: string;
  PROFILE: iProfile;
  Admins: any[];
  PROFILES: any[] = [];
  newStaff: { EMAIL: string, PW1: string, PW2: string, ROLE: string, NAME: string } = {
    EMAIL: null,
    PW1: null,
    PW2: null,
    ROLE: 'staff',
    NAME: 'STAFF_NAME'
  };
  existingStaff: { EMAIL: string, ROLE: string } = {
    EMAIL: null,
    ROLE: 'staff'
  };
  action: string = 'add-new';
  isNEWSelected: boolean = true;
  isExistingSelected: boolean = false;
  isManager: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    // private afService: AngularFireService,
    private dbService: DbService,
    private appService: AppService,
    private crudService: CrudService
  ) {

    this.data = this.navParams.data;
    console.log(this.data);
    this.USER_ID = this.data.USER_ID;
    this.SHOP = this.data.SHOP;
    this.PROFILE = this.data.PROFILE;
    if(typeof(this.SHOP) === 'undefined'){
      this.navCtrl.setRoot('HomePage');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffManagerPage');
  }

  ionViewWillEnter() {
    this.getData(this.SHOP);
  }

  getData(SHOP) {
    if (this.SHOP) {
      this.Admins = [];
      this.dbService.getListReturnPromise_ArrayOfData('AdminsOfShop/' + this.SHOP.SHOP_ID).then((res: any[]) => {
        console.log(res);
        this.Admins = res;
        this.isMangerOfShop(this.USER_ID, this.SHOP.SHOP_ID);
        this.PROFILES = [];
        this.Admins.forEach(admin => {
          this.dbService.getOneItemReturnPromise('UserProfiles/' + admin.UID).then((profile: iProfile) => {
            this.PROFILES.push({profile: profile, role: admin.ROLE});
          })
        })
        console.log(this.PROFILES);
      })
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  createNewStaff() {
    this.crudService.createAdminWithNewAccount(this.newStaff.EMAIL, this.newStaff.PW1, this.newStaff.NAME, this.SHOP.SHOP_ID, 'staff')
      .then((res) => {
        console.log('success', res)
        this.appService.alertMsg('Success:', this.newStaff.EMAIL + ' was created successfully');
        this.navCtrl.pop();
      })
      .catch((err) => {
        console.log(err);
        this.appService.alertMsg('Error:', err.message);
      })
  }

  createNewStaffWithExisting() {
    console.log(this.existingStaff.EMAIL, this.existingStaff.ROLE, this.SHOP.SHOP_ID);
    this.crudService.createAdminWithExistingAccount(this.existingStaff.EMAIL, this.existingStaff.ROLE, this.SHOP.SHOP_ID).then((res) => {
      console.log('create staff with for ', this.existingStaff.EMAIL, ' successfully');
      this.appService.alertMsg('Success:', 'create staff with for ' + this.existingStaff.EMAIL + ' successfully');
      this.navCtrl.pop();
    }).catch((err) => {
      console.log(err);
      this.appService.alertMsg('Error:', err.message);
    })

  }

  toggle() {
    this.isNEWSelected = !this.isNEWSelected;
    if (this.isNEWSelected) {
      this.action = 'add-new';
    } else {
      this.action = 'add-existing'
    }
  }

  deleteStaff(PROFILE, index) {
    let confirm = this.alertCtrl.create({
      title: 'Alert!',
      message: 'Are you sure you want to delete user?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteStaffComfirm(PROFILE, index);
          }
        }
      ]
    });
    confirm.present();
  }

  deleteStaffComfirm(PROFILE, index) {
    console.log('delete staff', PROFILE, index, this.Admins[index]);
    this.crudService.removeAdminOfUserFromShop(this.SHOP.SHOP_ID, this.Admins[index], this.Admins[index].UID)
      .then((res) => {
        console.log(res);
        this.appService.alertMsg('Success:', PROFILE.EMAIL + ' removed');
        this.navCtrl.pop();
      })
      .catch((err) => {
        console.log(err);
        this.appService.alertMsg('Error:', err.message);
      })
  }

  isMangerOfShop(USER_ID, SHOP_ID) {
    this.isManager = false;
    this.Admins.forEach(admin => {
      if (admin.UID === USER_ID) {
        if (admin.ROLE === 'manager') {
          this.isManager = true;
        }
      }
    });
    console.log('isManager: ', this.isManager);
  }



}
