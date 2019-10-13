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
    colors = List([]).tag(sync=True)
    callback = Any()
    n = Int(3).tag(sync=True)
    res = Dict({}).tag(sync=True)

    def __init__(self, tags=[], txts=[], colors=set(), callback=None, n=None):
        super(Widget, self).__init__()
        self.tags = tags
        self.txts = txts
        colors = set(colors)
        if len(colors) == 0:
            self.colors = [
                '#ff0000',
                '#ff8000',
                '#ffff00',
                '#00ff00',
                '#00ff80',
                '#00ffff',
                '#0080ff',
                '#0000ff',
                '#ff00ff'
            ]
        else:
            self.colors = list(colors)
        assert len(tags) <= len(self.colors), 'you should have at least one unique color for each tag'
        self.observe(callback, names=['res'])
        self.n = n