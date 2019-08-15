import ipywidgets as widgets
from traitlets import Unicode, List

@widgets.register
class Widget(widgets.DOMWidget):
    _view_name = Unicode('TSWidgetView').tag(sync=True)
    _model_name = Unicode('TSWidgetModel').tag(sync=True)
    _view_module = Unicode('text_selector').tag(sync=True)
    _model_module = Unicode('text_selector').tag(sync=True)
    _view_module_version = Unicode('^0.0.0').tag(sync=True)
    _model_module_version = Unicode('^0.0.0').tag(sync=True)
    tags = List().tag(sync=True)
    txts = List().tag(sync=True)
    def __init__(self, tags, txts):
        super(Widget, self).__init__()
        self.tags = tags
        self.txts = txts

