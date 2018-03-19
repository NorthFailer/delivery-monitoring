webpackJsonp([0],[
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const $ = __webpack_require__(1);
const event_messages_enum_1 = __webpack_require__(0);
class Popup {
    constructor() {
        this.initCache();
    }
    initCache() {
        this.$monitoringBtn = $('#monitoring');
    }
}
new Popup();
$(function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            msg: event_messages_enum_1.EventMessages.checkIsPolling,
            data: { tabId: tabs[0].id }
        });
    });
    $('#monitoring').click(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                msg: event_messages_enum_1.EventMessages.minOrder,
                data: { tabId: tabs[0].id }
            });
        });
    });
    chrome.runtime.onMessage.addListener((request) => {
        if (request.msg === event_messages_enum_1.EventMessages.addTabMonitor) {
            $('#monitoring').toggle();
            console.log(request.data);
            $('.vendor-name').text(request.data.vendor_title);
            $('.vendor-block').toggleClass('hidden');
        }
        else if (request.msg === event_messages_enum_1.EventMessages.removeTabMonitor) {
        }
    });
    // const queryInfo = {
    //   active: true,
    //   currentWindow: true
    // };
    //
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   $('#url').text(tabs[0].url);
    //   $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
    // });
    //
    // chrome.browserAction.setBadgeText({text: '' + count});
    // $('#countUp').click(()=>{
    //   chrome.browserAction.setBadgeText({text: '' + count++});
    // });
    //
    // $('#changeBackground').click(()=>{
    //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       color: '#555555'
    //     },
    //     function(msg) {
    //       console.log("result message:", msg);
    //     });
    //   });
    // });
});


/***/ })
],[2]);