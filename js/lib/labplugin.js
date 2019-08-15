var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'text_selector',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'text_selector',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

