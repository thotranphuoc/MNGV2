import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

// for af auth
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// import { iSetting } from '../interfaces/setting.interface';

@Injectable()
export class AngularFireService {
    // SETTINGS: iSetting = {
    //     setHouse: true,
    //     setApartment: true,
    //     setLand: true,
    //     setOther: true,
    //     language: 'English',
    //     numOfItems: 50
    // }
    loadCtrl: any;
    items: FirebaseListObservable<any[]>;
    item: FirebaseObjectObservable<any>;
    user: Observable<firebase.User>
    constructor(
        private db: AngularFireDatabase,
        private afAuth: AngularFireAuth) {

        this.user = this.afAuth.authState;
    }

    getAuth() {
        return this.afAuth;
    }

    signInWithGoogleAcc() {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    signOut() {
        return this.afAuth.auth.signOut();
    }

    signInWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    createUserWithEmailAndPassword(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    sendPasswordResetEmail(email: string) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }



    getObject(URL: string) {
        return this.item = this.db.object(URL);
    }

    removeObject(URL: string) {
        return this.db.object(URL).remove();
    }

    // destructive updates: delete and create again @same url
    setObjectData(URL: string, data: any) {
        return this.db.object(URL).set(data)
    }



    // non-destructive update
    // const itemObservable = db.object('/item');
    // itemObservable.update({ age: newAge });
    updateObjectData(URL: string, data: any) {
        return this.db.object(URL).set(data)
        // return this.db.object(URL).update(data);
    }

    getObjectSnapshot(URL: string) {
        return this.db.object(URL, { preserveSnapshot: true })
        // .subscribe( snapshot=>{
        //     return { key: snapshot.key, value: snapshot.val()}
        // })
    }

    getList(URL: string) {
        return this.db.list(URL)
    }

    addItem2List(URLofList: string, value: any) {
        return this.db.list(URLofList).push(value);
    }

    updateItemInList(URLofList: string, key: string, value: any) {
        return this.db.list(URLofList).update(key, value);
    }

    deleteItemFromList(URLofList: string, key: string) {
        return this.db.list(URLofList).remove(key);
    }

    getListSnapshots(URL: string) {
        return this.db.list(URL, { preserveSnapshot: true })
        // .subscribe(snapshots=>{
        //     snapshots.forEach(snapshot=>{
        //         console.log(snapshot.key);
        //         console.log(snapshot.val());
        //     })
        // })

    }

    //this.afService.getListWithCondition('soldItems/', 'VISIBLE', true)
    getListWithCondition(URL: string, filterBy: string, filterValue: any, topNum: number) {
        return this.db.list(URL, {
            query: {
                orderByChild: filterBy,
                equalTo: filterValue,
                limitToFirst: topNum
            }

        })
    }




}

/*
1. install then add provider into app.module.ts
$ npm install firebase angularfire2 --save
 */