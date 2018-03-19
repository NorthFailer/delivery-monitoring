import * as $ from 'jquery';
import { EventMessages } from "../enum/event-messages.enum";

class MainInjector {
    static orderUrl: string = 'https://www.delivery-club.ru/ajax/get_min_order/';

    constructor() {
        console.log('MainInjector constructor');
        this.sendDataLayer();
        this.subscribeToDocumentEvents();
    }

    private callMinOrder(): Promise<any> {
        return $.ajax(this.fullUrl);
    }

    private subscribeToDocumentEvents() {
        console.log('proxyDocumentEvents', EventMessages.minOrder);
        document.addEventListener(EventMessages.minOrder, () => {
            console.log('receive event',EventMessages.minOrder);
            this.handleStartMonitoring();
        });
    }

    private handleStartMonitoring() {
        this.callMinOrder().then((data) => {
            document.dispatchEvent(new CustomEvent(EventMessages.minOrderData, {detail: data}));
        }, (error) => {
            // TODO handle method error
        });
    }

    private get fullUrl(): string {
        return `${MainInjector.orderUrl}?srv_id=${window['gtm_data_layer'].vendor_code}&aff_title=${window.location.hash.replace(/[#/]/g, '')}`;
    }

    private sendDataLayer() {
        document.dispatchEvent(new CustomEvent(EventMessages.dataLayer, {detail: window['gtm_data_layer']}));
    }
}

new MainInjector();

