
var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var TSWidgetModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'TSWidgetModel',
        _view_name : 'TSWidgetView',
        _model_module : 'text_selector',
        _view_module : 'text_selector',
        _model_module_version : '0.0.0',
        _view_module_version : '0.0.0',
        tags: [],
        txts: []
    })
});

var TSWidgetView = widgets.DOMWidgetView.extend({
    create_p() {

    },
    render() {
        this.el.textContent = this.model.get('txts') + "\n" + this.model.get('tags');
    },
});


module.exports = {
    TSWidgetModel,
    TSWidgetView
};
