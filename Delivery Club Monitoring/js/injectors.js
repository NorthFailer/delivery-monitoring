webpackJsonp([1],{

/***/ 0:
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

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const $ = __webpack_require__(1);
const event_messages_enum_1 = __webpack_require__(0);
class MainInjector {
    constructor() {
        console.log('MainInjector constructor');
        this.sendDataLayer();
        this.subscribeToDocumentEvents();
    }
    callMinOrder() {
        return $.ajax(this.fullUrl);
    }
    subscribeToDocumentEvents() {
        console.log('proxyDocumentEvents', event_messages_enum_1.EventMessages.minOrder);
        document.addEventListener(event_messages_enum_1.EventMessages.minOrder, () => {
            console.log('receive event', event_messages_enum_1.EventMessages.minOrder);
            this.handleStartMonitoring();
        });
    }
    handleStartMonitoring() {
        this.callMinOrder().then((data) => {
            document.dispatchEvent(new CustomEvent(event_messages_enum_1.EventMessages.minOrderData, { detail: data }));
        }, (error) => {
            // TODO handle method error
        });
    }
    get fullUrl() {
        return `${MainInjector.orderUrl}?srv_id=${window['gtm_data_layer'].vendor_code}&aff_title=${window.location.hash.replace(/[#/]/g, '')}`;
    }
    sendDataLayer() {
        document.dispatchEvent(new CustomEvent(event_messages_enum_1.EventMessages.dataLayer, { detail: window['gtm_data_layer'] }));
    }
}
MainInjector.orderUrl = 'https://www.delivery-club.ru/ajax/get_min_order/';
new MainInjector();


/***/ })

},[6]);