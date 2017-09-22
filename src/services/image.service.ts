import { Injectable } from '@angular/core';

@Injectable()
export class ImageService {
    IMG_WIDTH_MAX: number = 750;
    IMG_HEIGHT_MAX: number = 750;
    constructor() { }

    // VERIFIED: browse photo/ capture photo, then convert to imageData to be ready to display
    convertFile2ImageData(file: File) {
        let reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result);
            }
            reader.readAsDataURL(file);
        })
    }

    convertFile2ImageElement(file: File) {
        return new Promise((resolve, reject) => {
            this.convertFile2ImageData(file)
                .then((dataUrl: string) => {
                    let img = document.createElement('img');
                    img.src = dataUrl
                    console.log(img)
                    resolve(img);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    // VERIFIED: resize image of img element, target size: MAX_WIDTH & MAX_HEIGHT
    resizeImageFromImageElement(img: HTMLImageElement, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
        var width, height;
        console.log(img);
        img.onload = () => {
            console.log('img loaded');
            // get the current image's width and height
            width = img.width;
            height = img.height;

            // Set the WxH to fit the Max values (but maintain proportions)
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            // create a canvas object
            var canvas = document.createElement("canvas");

            // set the canvas with new calculated dimensions
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // get this encoded as a jpeg
            // IMPORTANT: 'jpeg' NOT 'jpg'
            var imageDataURL = canvas.toDataURL('image/jpeg');

            // callback with the results
            callback(imageDataURL, img.src.length, imageDataURL.length)

        }
    }
    // VERIFIED: from imageElement, resize to target demension
    resizeFromImageElementReturnPromise(img: HTMLImageElement, MAX_WIDTH: number, MAX_HEIGHT: number): Promise<any> {
        return new Promise((resolve, reject) => {
            var width, height;
            console.log(img);
            img.onload = () => {
                console.log('img loaded');
                // get the current image's width and height
                width = img.width;
                height = img.height;

                // Set the WxH to fit the Max values (but maintain proportions)
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                // create a canvas object
                var canvas = document.createElement("canvas");

                // set the canvas with new calculated dimensions
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // get this encoded as a jpeg
                // IMPORTANT: 'jpeg' NOT 'jpg'
                var imageDataURL = canvas.toDataURL('image/jpeg');

                // callback with the results
                resolve({ imageUrl: imageDataURL, sizeBefore: img.src.length, sizeAfter: imageDataURL.length })

            }
        })
    }

    // VERIFIED: select files then return array of imageDataUrl
    //<input type="file" (change)="resizeSelectedImages($event)" multiple id="inputFilea">
    // remember to wait 1s to update array otherwise array = null
    resizeImagesFromChoosenFilesReturnPromiseWithArrayOfImageDataUrls(event) {
        return new Promise((resolve, reject) => {
            // let imagesDataURLs: string[] = [];
            let resizedDataURLs: string[] = [];
            let seletectedFiles: any[] = event.target.files;
            console.log(seletectedFiles);
            console.log('number of files: ', seletectedFiles.length);
            for (let index = 0; index < seletectedFiles.length; index++) {
                if (index < seletectedFiles.length) {
                    let selectedFile = seletectedFiles[index];
                    console.log(selectedFile);
                    // // convert file into imageDataURL. if keep same quality
                    // this.convertFile2ImageData(selectedFile)
                    //     .then((imgDataURL: string) => {
                    //         imagesDataURLs.push(imgDataURL)
                    //     }, err => console.log(err))

                    // convert files to HTMLImageElement in order resize
                    this.convertFile2ImageElement(selectedFile)
                        .then((el: HTMLImageElement) => {
                            console.log(el);
                            this.resizeFromImageElementReturnPromise(el, this.IMG_WIDTH_MAX, this.IMG_HEIGHT_MAX)
                                .then((res) => {
                                    console.log(res);
                                    resizedDataURLs.push(res.imageUrl)
                                })
                        })
                }
            }
            resolve(resizedDataURLs);
            // if(resizedDataURLs.length>0){
            //     resolve(resizedDataURLs);
            // }else{
            //     reject({err: 'null returned'})
            // }
        })
    }



}

