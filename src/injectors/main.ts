document.dispatchEvent(new CustomEvent('RW759_connectExtension', {
    detail: window['gtm_data_layer'] // Some variable from Gmail.
}));