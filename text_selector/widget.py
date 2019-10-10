import ipywidgets as widgets
from traitlets import HasTraits, Unicode, List, Int, Any, Dict, observe, Undefined

@widgets.register
class Widget(widgets.DOMWidget, HasTraits):
    _view_name = Unicode('TSWidgetView').tag(sync=True)
    _model_name = Unicode('TSWidgetModel').tag(sync=True)
    _view_module = Unicode('text_selector').tag(sync=True)
    _model_module = Unicode('text_selector').tag(sync=True)
    _view_module_version = Unicode('^0.0.0').tag(sync=True)
    _model_module_version = Unicode('^0.0.0').tag(sync=True)
    tags = List().tag(sync=True)
    txts = List().tag(sync=True)
    callback = Any()
    n = Int(3).tag(sync=True)
    res = Dict({}).tag(sync=True)

    def __init__(self, tags=tags, txts=txts, callback=callback, n=n):
        super(Widget, self).__init__()
        self.tags = tags
        self.txts = txts
        self.n = n
        self.observe(callback, names=['res'])
