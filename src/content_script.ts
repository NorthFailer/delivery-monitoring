import { EventMessages } from "./enum/event-messages.enum";
import { TabService } from "./background";

export interface EventDataTransition {
    msg: EventMessages;
    data?: any;
}

class ContentScript {
    private static injectorList = {
        vendor: "js/vendor.js",
        injectors: "js/injectors.js",
    };

    private static documentEvents = [
        EventMessages.dataLayer,
        EventMessages.minOrderData,
    ];

    private allScriptsAreInjected: boolean = false;
    private dataLayer: any;
    private pollTimeout;

    constructor() {
        this.injectScriptList();
        this.subscribeToRuntimeEvents();
        this.proxyDocumentEvents();
    }

    get randomMsDelay(): number {
        return Math.floor(((Math.random() * 10) + 10) * 1000);
    }

    private eventsFactory(request: EventDataTransition, sender?, resolve?) {
        console.log('eventsFactory', request, sender);
        switch (request.msg) {
            case EventMessages.minOrder:
                console.log('ContentScript dispatchEvent', request.msg);
                document.dispatchEvent(new CustomEvent(request.msg));
                break;
            case EventMessages.minOrderData:
                this.handleMinOrderData(request.data);
                break;
            case EventMessages.dataLayer:
                this.dataLayer = request.data;
                break;
        }
    }

    private injectScript(scriptPath: string): Promise<any> {
        return new Promise<boolean>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = chrome.extension.getURL(scriptPath);
            (document.head||document.documentElement).appendChild(script);

            script.onload = () => {
                script.parentNode.removeChild(script);
                resolve();
            };

            script.onerror = () => {
                reject();
            };
        });
    }

    private injectScriptList() {
        this.injectScript(ContentScript.injectorList.vendor)
            .then(() => this.injectScript(ContentScript.injectorList.injectors))
            .then(() => {
                this.allScriptsAreInjected = true;
                console.log('all injections successfully done');
            });
    }

    private subscribeToRuntimeEvents() {
        chrome.runtime.onMessage.addListener(this.eventsFactory);
    }

    private handleMinOrderData(data: any) {
        const isDeleted = parseInt(data.isDeleted, 10);

        if (isDeleted) {
            this.pollTimeout = setTimeout(() => {
                document.dispatchEvent(new CustomEvent(EventMessages.minOrder));
            }, this.randomMsDelay);

            chrome.runtime.sendMessage(({
                msg: EventMessages.addTabMonitor,
                data: this.dataLayer
            }));
        } else {
            new Notification('Ресторан досутпен!', {
                requireInteraction: true,
                body: `Ресторан ${this.dataLayer.vendor_title} готов принять Ваш заказ!`
            } as NotificationOptions);

            // TabService.remove(data);

            chrome.runtime.sendMessage({
                msg: EventMessages.resetSrvPoll
            });
        }
    }

    private proxyDocumentEvents() {
        ContentScript.documentEvents.forEach((msg: EventMessages) => {
           document.addEventListener(msg, (event: any) => {
               this.eventsFactory({
                   msg: msg,
                   data: event.detail,
               });
           });
        });
    }
}

new ContentScript();