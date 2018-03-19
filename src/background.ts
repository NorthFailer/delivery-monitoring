// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.tabs.executeScript(null, {file: "content_script.js"});
// });

import { EventDataTransition } from "./content_script";
import { EventMessages } from "./enum/event-messages.enum";

export interface MonitoringTab {
    id: string;
    data: any;
}

export namespace TabService {
    const monitoredTabs: Map<number, any> = new Map<number, any>();

    export function add(id: number, data: any) {
        monitoredTabs.set(id, data);
        onMonitorTabsChange();
    }

    export function remove(data: any) {
        monitoredTabs.delete(data.vendor_code);
        onMonitorTabsChange();
    }

    function onMonitorTabsChange() {
        // chrome.browserAction.setBadgeText({text: `${monitoredTabs.size}`});
        chrome.runtime.sendMessage(EventMessages.tabMonitorChange);
    }
}

class Background {
    constructor() {
        chrome.browserAction.setBadgeBackgroundColor({color: '#a3d200'});
        this.subscribeOnRuntimeMessages();
    }

    private subscribeOnRuntimeMessages() {
        chrome.runtime.onMessage.addListener((response: EventDataTransition, sender) => {
            switch (response.msg) {
                case EventMessages.addTabMonitor:
                    console.log(sender);
                    chrome.browserAction.setIcon({
                        path: 'ico-128.png',
                        tabId: sender.tab.id
                    });
                    TabService.add(sender.tab.id, response.data);
                    break;
                case EventMessages.checkIsPolling:

                    break;
            }
        });
    }
}

new Background();