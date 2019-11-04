import ipywidgets as widgets
from traitlets import HasTraits, Unicode, List, Int, Any, observe


@widgets.register
class Widget(widgets.DOMWidget, HasTraits):
    id = 1

    _view_name = Unicode('TSWidgetView').tag(sync=True)
    _model_name = Unicode('TSWidgetModel').tag(sync=True)
    _view_module = Unicode('text_selector').tag(sync=True)
    _model_module = Unicode('text_selector').tag(sync=True)
    _view_module_version = Unicode('^2.0.2').tag(sync=True)
    _model_module_version = Unicode('^2.0.2').tag(sync=True)
    widget_id = Int(-1).tag(sync=True)

    tags = List([]).tag(sync=True)
    txt = Unicode('').tag(sync=True)
    colors = List([]).tag(sync=True)
    callback = Any()
    res = List([]).tag(sync=True)

    def __init__(self, tags=[], txt='', colors=None, callback=None):
        super(Widget, self).__init__()

        self.widget_id = Widget.id
        Widget.id += 1

        if len(txt) == 0: raise ValueError("txt shouldn't be an empty string")
        self.txt = txt
        if (colors is None) or (colors == []):
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
            if len(colors) != len(set(colors)): raise ValueError("colors shouldn't contain duplicates")
            self.colors = colors

        if len(tags) > len(self.colors): raise ValueError('colors should contain at least one unique color for each tag')
        self.tags = tags

        self.observe(callback, names=['res'])