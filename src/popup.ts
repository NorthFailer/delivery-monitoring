import * as $ from 'jquery';
import { EventMessages } from "./enum/event-messages.enum";
import { EventDataTransition } from "./content_script";

class Popup {
    private $monitoringBtn;

    constructor() {
        this.initCache();
    }

    private initCache() {
        this.$monitoringBtn = $('#monitoring');
    }
}

new Popup();



$(function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            msg: EventMessages.checkIsPolling,
            data: {tabId: tabs[0].id}
        });
    });

    $('#monitoring').click(() => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                msg:EventMessages.minOrder,
                data: {tabId: tabs[0].id}
            });
        });
    });

    chrome.runtime.onMessage.addListener((request: EventDataTransition) => {
        if (request.msg === EventMessages.addTabMonitor) {
            $('#monitoring').toggle();
            console.log(request.data);
            $('.vendor-name').text(request.data.vendor_title);
            $('.vendor-block').toggleClass('hidden');
        } else if (request.msg === EventMessages.removeTabMonitor) {

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
