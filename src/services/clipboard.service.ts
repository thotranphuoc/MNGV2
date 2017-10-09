import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
@Injectable()
export class ClipboardService {
    docu: Document;
    constructor( @Inject(DOCUMENT) dom: Document) {
        this.docu = dom;
    }

    public copy(value: string): Promise<any> {
        var pro = new Promise((resolve, reject): void => {
            var textarea = null;
            // In order to execute the "Copy" command, we actually have to have
            // a "selection" in the currently rendered document. As such, we're
            // going to inject a Textarea element and .select() it in order to
            // force a selection.
            // --
            // NOTE: This Textarea is being rendered off-screen.
            try {
                textarea = this.docu.createElement("textarea");
                textarea.style.height = "0px";
                textarea.style.left = "-100px";
                textarea.style.opacity = "0";
                textarea.style.position = "fixed";
                textarea.style.top = "-100px";
                textarea.style.width = "0px";
                this.docu.body.appendChild(textarea);

                // Set and select the value (creating an active Selection range).
                textarea.value = value;
                textarea.select();

                // Ask the browser to copy the current selection to the clipboard.
                this.docu.execCommand("copy");

                resolve(value);
            } catch (error) {

            } finally {
                // Cleanup - remove the Textarea from the DOM if it was injected.
                if (textarea && textarea.parentNode) {
                    textarea.parentNode.removeChild(textarea);
                }
            }
        });

        return pro;
    }






}
