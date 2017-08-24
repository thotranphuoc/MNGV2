import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AppService } from '../../services/app.service';
import { CrudService } from '../../services/crud.service';
@IonicPage()
@Component({
  selector: 'page-track',
  templateUrl: 'track.html',
})
export class TrackPage {
  issue: {
    ISSUE_TITLE: string,
    ISSUE_DES: string,
    ISSUE_STATE: string,
    ISSUE_DATE: string
  };
  issuesData: any[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetCtrl: ActionSheetController,
    private appService: AppService,
    private crudService: CrudService
  ) {
    this.issue = {
      ISSUE_DATE: null,
      ISSUE_DES: null,
      ISSUE_TITLE: null,
      ISSUE_STATE: 'Open'
    }
  }

  isUpdate: boolean = false;
  IssueUpdateKey: string = null;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackPage');
    this.crudService.readIssues().then((res: any[]) => {
      console.log(res);
      this.issuesData = res;
    })
  }

  createIssue() {
    let date = this.appService.getCurrentDataAndTime();
    this.issue.ISSUE_DATE = date;
    console.log(this.issue);
    this.crudService.createIssue(this.issue).then((res) => {
      console.log(res);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  setIssueStatus(ISSUE) {
    console.log(ISSUE);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
            this.crudService.deleteIssue(ISSUE.key);
            let index = this.issuesData.indexOf(ISSUE);
            this.issuesData.splice(index, 1);
          }
        }, {
          text: 'Modify',
          handler: () => {
            console.log('Archive clicked');
            this.issue = ISSUE.data;
            this.isUpdate = true;
            this.IssueUpdateKey = ISSUE.key;
            this.issue.ISSUE_STATE = 'Open';
          }
        }, {
          text: 'Closed',
          handler: () => {
            console.log('Archive clicked');
            this.issue = ISSUE.data;
            this.issue.ISSUE_STATE = 'Closed';
            this.IssueUpdateKey = ISSUE.key;
            this.updateIssue();
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

  updateIssue(){
    this.crudService.updateIssue(this.IssueUpdateKey, this.issue).then((res)=>{
      console.log(res, 'update done');
      this.isUpdate = false;
      this.issue = {
        ISSUE_DATE: null,
        ISSUE_DES: null,
        ISSUE_TITLE: null,
        ISSUE_STATE: 'Open'
      }
    })
  }



}
