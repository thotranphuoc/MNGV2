import { Injectable } from '@angular/core';
// import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

// for af auth
// import { Observable } from 'rxjs/Observable';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

// import { iShop } from '../interfaces/shop.interface';

@Injectable()
export class DbService {
    constructor(
        // private db: AngularFireDatabase,
        // private afAuth: AngularFireAuth
    ) {
    }

    checkIfUserIsAdminOfApp(USER_ID: string) {
        return new Promise((resolve, reject) => {
            this.getOneItemReturnPromise('AdminsOfApp/' + USER_ID).then((res) => {
                console.log(res);
                if (res != null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    checkIfUserIsAdmin(USER_ID: string) {
        return new Promise((resolve, reject) => {
            this.getOneItemReturnPromise('Admins/' + USER_ID).then((res) => {
                console.log(res);
                if (res != null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    // VERIFIED: create new key and insert object
    insertOneNewItemReturnPromise(item, URL) {
        let db = firebase.database().ref(URL);
        return db.push(item);
    }

    //VERIFIED: upload array of images, return array of url
    uploadBase64Images2FBReturnPromiseWithArrayOfURL(path: string, imageDatas: string[], dbFileName: string) {
        let promises = [];
        imageDatas.forEach((imageData, index) => {
            promises[index] = new Promise((resolve, reject) => {
                let name = dbFileName + '_' + index.toString();
                this.uploadBase64Image2FBReturnPromiseWithURL(path, imageData, name)
                    .then(url => {
                        resolve(url)
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    })
            })
        });
        return Promise.all(promises);
    }

    //VERIFIED: upload one image, return url
    uploadBase64Image2FBReturnPromiseWithURL(path: string, imageData: string, name: string) {
        return new Promise((resolve, reject) => {
            let storageRef = firebase.storage().ref(path + '/' + name);
            storageRef.putString(imageData, 'data_url', { contentType: 'image/png' })
                .then((res) => {
                    console.log(res);
                    resolve(res.downloadURL);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    deleteFileFromFireStorageWithURL(url: string) {
        let storageRef = firebase.storage().ref(url);
        return storageRef.delete()
    }

    // VERIFIED: Delete file from storage with httpsURL
    // such as: storage.refFromURL('https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');
    deleteFileFromFireStorageWithHttpsURL(httpsURL: string) {
        let storage = firebase.storage().refFromURL(httpsURL);
        return storage.delete();
    }

    // VERIFIED
    getListReturnPromise_ArrayOfData(dbURL) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dbURL);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let item = _childSnap.val();
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    // VERIFIED
    getListReturnPromise_ArrayOfKey(dBName) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dBName);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let item = _childSnap.key;
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    // VERIFIED
    getListReturnPromise_ArrayOfObjectWithKey_Data(dBName) {
        return new Promise((resolve, reject) => {
            let items = [];
            let db = firebase.database().ref(dBName);
            db.once('value', (_snapShot) => {
                _snapShot.forEach(_childSnap => {
                    let key = _childSnap.key;
                    let data = _childSnap.val();
                    let item = {
                        key: key,
                        data: data
                    }
                    // console.log(key, data)
                    // console.log(item)
                    items.push(item);
                    return false;
                })
                resolve(items);
            })
            // .then(() => {
            //     resolve(items)
            // })
            // .catch((err) => {
            //     reject(err);
            // })
        })
    }

    // VERIFIED: get an item object from url
    getOneItemReturnPromise(dbURL) {
        return new Promise((resolve, reject) => {
            let db = firebase.database().ref(dbURL);
            db.once('value')
                .then((data) => {
                    // console.log(data.val());
                    resolve(data.val())
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                })
        })
    }

    //VERIFIED: insert 1 element into current array
    insertElementIntoArray(dbURL, value: any) {
        return new Promise((resolve, reject) => {
            this.getListReturnPromise_ArrayOfData(dbURL).then((array: any[]) => {
                let items = array;
                items.push(value);
                firebase.database().ref(dbURL).set(items)
                    .then((res) => {
                        console.log('insert success');
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('Error:', err)
                        reject(err);
                    })
            })
        })
    }

    removeElementFromArray(dbURL, el: any) {
        return new Promise((resolve, reject) => {
            this.getListReturnPromise_ArrayOfData(dbURL).then((array: any[]) => {
                console.log(el, array);
                let index = array.indexOf(el);
                if (index < 0) {
                    // el not exist
                    reject({ message: 'Element not exist' });
                } else {
                    array.splice(index, 1);
                    firebase.database().ref(dbURL).set(array).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            })
        })
    }

    //VERIFIED: insert 1 array ofelement into current array
    insertArrayOfElementIntoArray(dbURL, values: any[]) {
        return new Promise((resolve, reject) => {
            this.getListReturnPromise_ArrayOfData(dbURL).then((array: any[]) => {
                let items = array;
                items = items.concat(values);
                console.log(items);
                firebase.database().ref(dbURL).set(items)
                    .then((res) => {
                        console.log('insert success');
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('Error:', err)
                        reject(err);
                    })
            })
        })
    }

    // VERIFIED: insert an object at specific node such as ActiveOrdersOfUser/USER_ID/ORDER_ID {}
    insertAnObjectAtNode(dbURL, value) {
        let db = firebase.database().ref(dbURL);
        return db.set(value);
    }

    // VERIFIED: update an object at specific node such as ActiveOrdersOfUser/USER_ID/ORDER_ID {}
    updateAnObjectAtNode(dbURL, value) {
        let db = firebase.database().ref(dbURL);
        return db.set(value);
    }

    // VERIFIED: remove an object (including all its children) from this node
    removeAnObjectAtNode(dbURL) {
        let db = firebase.database().ref(dbURL);
        return db.remove();
    }

    getAnObjectAtNode(dbURL) {
        let db = firebase.database().ref(dbURL);
        db.once('value').then((res) => {
            console.log(res.val());
            console.log(res.key);
        })
    }

    copyObjectFromURL2URL(url1, url2, node_key) {
        return new Promise((resolve, reject) => {
            let db1 = firebase.database().ref(url1 + '/' + node_key);
            db1.once('value').then((res) => {
                console.log(res.val());
                console.log(res.key);
                let db2 = firebase.database().ref(url2 + '/' + node_key);
                db2.set(res.val()).then((res) => {
                    console.log(res);
                    console.log('copy success')
                    resolve();
                }, err => {
                    console.log(err);
                    reject(err);
                })
            }, err => {
                console.log(err);
                reject(err);
            });
        })
    }

    moveObjectFromURL2URL(url1, url2, node_key) {
        this.copyObjectFromURL2URL(url1, url2, node_key)
            .then(() => {
                // remove url1/node_key
                this.removeAnObjectAtNode(url1 + '/' + node_key).then(() => {
                    console.log('move success')
                })
            })
    }
}
