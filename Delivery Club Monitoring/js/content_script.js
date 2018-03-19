webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventMessages;
(function (EventMessages) {
    EventMessages["minOrder"] = "dcm:ajax@get_min_order";
    EventMessages["pollingPromise"] = "dcm:PollingPromise";
    EventMessages["pollData"] = "dcm:PollData";
    EventMessages["dataLayer"] = "dcm:gtm_data_layer";
    EventMessages["minOrderData"] = "dcm:MinOrderData";
    EventMessages["resetSrvPoll"] = "dcm:ResetSrvPoll";
    EventMessages["addTabMonitor"] = "dcm:AddTabMonitor";
    EventMessages["tabMonitorChange"] = "dcm:TabMonitorChange";
    EventMessages["removeTabMonitor"] = "dcm:RemoveTabMonitor";
    EventMessages["checkIsPolling"] = "dmc:CheckIsPolling";
})(EventMessages = exports.EventMessages || (exports.EventMessages = {}));


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const event_messages_enum_1 = __webpack_require__(0);
class ContentScript {
    constructor() {
        this.allScriptsAreInjected = false;
        this.injectScriptList();
        this.subscribeToRuntimeEvents();
        this.proxyDocumentEvents();
    }
    get randomMsDelay() {
        return Math.floor(((Math.random() * 10) + 10) * 1000);
    }
    eventsFactory(request, sender, resolve) {
        console.log('eventsFactory', request, sender);
        switch (request.msg) {
            case event_messages_enum_1.EventMessages.minOrder:
                console.log('ContentScript dispatchEvent', request.msg);
                document.dispatchEvent(new CustomEvent(request.msg));
                break;
            case event_messages_enum_1.EventMessages.minOrderData:
                this.handleMinOrderData(request.data);
                break;
            case event_messages_enum_1.EventMessages.dataLayer:
                this.dataLayer = request.data;
                break;
        }
    }
    injectScript(scriptPath) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = chrome.extension.getURL(scriptPath);
            (document.head || document.documentElement).appendChild(script);
            script.onload = () => {
                script.parentNode.removeChild(script);
                resolve();
            };
            script.onerror = () => {
                reject();
            };
        });
    }
    injectScriptList() {
        this.injectScript(ContentScript.injectorList.vendor)
            .then(() => this.injectScript(ContentScript.injectorList.injectors))
            .then(() => {
            this.allScriptsAreInjected = true;
            console.log('all injections successfully done');
        });
    }
    subscribeToRuntimeEvents() {
        chrome.runtime.onMessage.addListener(this.eventsFactory);
    }
    handleMinOrderData(data) {
        const isDeleted = parseInt(data.isDeleted, 10);
        if (isDeleted) {
            this.pollTimeout = setTimeout(() => {
                document.dispatchEvent(new CustomEvent(event_messages_enum_1.EventMessages.minOrder));
            }, this.randomMsDelay);
            chrome.runtime.sendMessage(({
                msg: event_messages_enum_1.EventMessages.addTabMonitor,
                data: this.dataLayer
            }));
        }
        else {
            new Notification('Ресторан досутпен!', {
                requireInteraction: true,
                body: `Ресторан ${this.dataLayer.vendor_title} готов принять Ваш заказ!`
            });
            // TabService.remove(data);
            chrome.runtime.sendMessage({
                msg: event_messages_enum_1.EventMessages.resetSrvPoll
            });
        }
    }
    proxyDocumentEvents() {
        ContentScript.documentEvents.forEach((msg) => {
            document.addEventListener(msg, (event) => {
                this.eventsFactory({
                    msg: msg,
                    data: event.detail,
                });
            });
        });
    }
}
ContentScript.injectorList = {
    vendor: "js/vendor.js",
    injectors: "js/injectors.js",
};
ContentScript.documentEvents = [
    event_messages_enum_1.EventMessages.dataLayer,
    event_messages_enum_1.EventMessages.minOrderData,
];
new ContentScript();


/***/ })
],[4]);