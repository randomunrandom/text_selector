import ipywidgets as widgets
from traitlets import HasTraits, Unicode, List, Int, Any, observe


@widgets.register
class Widget(widgets.DOMWidget, HasTraits):
    id = 0
    _view_name = Unicode('TSWidgetView').tag(sync=True)
    _model_name = Unicode('TSWidgetModel').tag(sync=True)
    _view_module = Unicode('text_selector').tag(sync=True)
    _model_module = Unicode('text_selector').tag(sync=True)
    _view_module_version = Unicode('^2.0.0').tag(sync=True)
    _model_module_version = Unicode('^2.0.0').tag(sync=True)
    widget_id = Int(-1).tag(sync=True)
    tags = List().tag(sync=True)
    txt = Unicode('').tag(sync=True)
    colors = List([]).tag(sync=True)
    callback = Any()
    res = List([]).tag(sync=True)

    def __init__(self, tags=[], txt='', colors=set(), callback=None):
        super(Widget, self).__init__()
        self.widget_id = Widget.id
        Widget.id += 1
        self.tags = tags
        assert len(txt) > 0, "txt shouldn't be an empty string"
        self.txt = txt
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