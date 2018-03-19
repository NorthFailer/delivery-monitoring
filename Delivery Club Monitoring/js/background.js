webpackJsonp([3],{

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

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(null, {file: "content_script.js"});
// });
Object.defineProperty(exports, "__esModule", { value: true });
const event_messages_enum_1 = __webpack_require__(0);
var TabService;
(function (TabService) {
    const monitoredTabs = new Map();
    function add(id, data) {
        monitoredTabs.set(id, data);
        onMonitorTabsChange();
    }
    TabService.add = add;
    function remove(data) {
        monitoredTabs.delete(data.vendor_code);
        onMonitorTabsChange();
    }
    TabService.remove = remove;
    function onMonitorTabsChange() {
        // chrome.browserAction.setBadgeText({text: `${monitoredTabs.size}`});
        chrome.runtime.sendMessage(event_messages_enum_1.EventMessages.tabMonitorChange);
    }
})(TabService = exports.TabService || (exports.TabService = {}));
class Background {
    constructor() {
        chrome.browserAction.setBadgeBackgroundColor({ color: '#a3d200' });
        this.subscribeOnRuntimeMessages();
    }
    subscribeOnRuntimeMessages() {
        chrome.runtime.onMessage.addListener((response, sender) => {
            switch (response.msg) {
                case event_messages_enum_1.EventMessages.addTabMonitor:
                    console.log(sender);
                    chrome.browserAction.setIcon({
                        path: 'ico-128.png',
                        tabId: sender.tab.id
                    });
                    TabService.add(sender.tab.id, response.data);
                    break;
                case event_messages_enum_1.EventMessages.checkIsPolling:
                    break;
            }
        });
    }
}
new Background();


/***/ })

},[5]);