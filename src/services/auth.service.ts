import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireService } from './af.service';

@Injectable()


export class AuthService {
    isSigned: boolean = false;
    uid: string;
    email: string;
    constructor(private afService: AngularFireService) { }
    signIn(email: string, pass: string): firebase.Promise<any> {
        return firebase.auth().signInWithEmailAndPassword(email, pass)
    }

    signUp(email: string, pass: string): firebase.Promise<any> {
        return firebase.auth().createUserWithEmailAndPassword(email, pass)
    }

    signOut(): firebase.Promise<any> {
        return firebase.auth().signOut();
    }

    resetAccount(email: string): firebase.Promise<any> {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    checkIfUserIsAdmin(userEmail: string) {
        return new Promise((resolve, reject) => {
            var isAdmin = false;
            this.afService.getList('Admins/')
                .subscribe((listUsers: any[]) => {
                    console.log(listUsers);
                    listUsers.forEach(user => {
                        console.log(user, userEmail);
                        if (user.email === userEmail) {
                            isAdmin = true;
                        }
                    });
                    if(isAdmin){
                        resolve(true)
                    }else{
                        resolve(false);
                    }
                })
        })
    }

    // getUserID(EMAIL: string){
    //     console.log('test get UID');
    //     firebase.auth().fetchProvidersForEmail(EMAIL).then((res)=>{
    //         console.log(res);
    //     })
    // }

    



}