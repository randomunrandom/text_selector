var widgets = require("@jupyter-widgets/base");
var _ = require("lodash");

var TSWidgetModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "TSWidgetModel",
    _view_name: "TSWidgetView",
    _model_module: "text_selector",
    _view_module: "text_selector",
    _model_module_version: "2.3.1",
    _view_module_version: "2.3.1",
    widget_id: -1,
    tags: [],
    txt: '',
    colors: [],
    emojify: false,
    dis: true,
    res: []
  })
});

var TSWidgetView = widgets.DOMWidgetView.extend({
  render() {
    this.widget_id = this.model.get('widget_id');
    this.tags = this.model.get("tags");
    this.txt = this.model.get("txt");
    this.colors = this.model.get("colors");
    this.emojify = this.model.get("emojify");
    this.res = this.model.get("res");
    this.dis = this.model.get("dis");

    this.selected_tag_id = 0;
    this.old_res = [];
    

    this.box = document.createElement("div");
    this.box.id = `TSW-widget-${this.widget_id}`;
    // this.box.style.border = "1px solid black";
    // this.box.style.padding = "1%";

    this.box.appendChild(this.create_controls());
    this.box.appendChild(this.create_txt());
    this.el.appendChild(this.box);
  },
  create_txt() {
    let dom_txt = document.createElement("div");
    dom_txt.id = `TSW-widget-${this.widget_id}-txt`;
    dom_txt.style["border-bottom"] = "1px solid gray";
    dom_txt.style.margin = "1em auto";
    for (let i = 0; i < this.txt.length; i++) {
      let tmp = document.createElement("span");
      tmp.innerText = this.txt.charAt(i);
      tmp.id = `TSW-widget-${this.widget_id}-letter-${i}`;
      dom_txt.appendChild(tmp);
    }
    for(r of this.res){
      for(let i = r['start']; i<= r['end']; i++) {
        let letter = dom_txt.querySelector(`#TSW-widget-${this.widget_id}-letter-${i}`);
        letter.style.background = this.colors[this.tags.indexOf(r['tag'])];
      }
    }
    return dom_txt;
  },
  create_controls() {
    let dom_controls = document.createElement("div");
    dom_controls.id = `TSW-widget-${this.widget_id}-controls`;
    dom_controls.style.display = "inline";

    let select = document.createElement("span");
    select.classList.add("p-Widget");
    select.classList.add("jupyter-widgets");
    // select.classList.add("widget-inline-hbox");
    select.classList.add("widget-dropdown");

    let select_dd = document.createElement("select");
    select_dd.id = `TSW-widget-${this.widget_id}-select`;
    select_dd.onchange = () => {
      selected = document.getElementById(`TSW-widget-${this.widget_id}-select`)[document.getElementById(`TSW-widget-${this.widget_id}-select`).selectedIndex].value;
      this.selected_tag_id = selected;
    };
    this.tags.forEach((item, idx) => {
      let tag_dom_el;
      tag_dom_el = document.createElement("option");
      tag_dom_el.innerText = item;
      tag_dom_el.value = idx;
      tag_dom_el.onclick = () => {
        this.selected_tag_id = idx;
      }
      select_dd.appendChild(tag_dom_el);
    });
    select.appendChild(select_dd);
    dom_controls.appendChild(select);

    let add = document.createElement("button");
    add.id = `TSW-widget-${this.widget_id}-add`;
    if (this.emojify) {
      add.innerText += "Add ➕";
    } else {
      add.innerText = "Add";
    }
    add.classList.add('p-Widget');
    add.classList.add('btn');
    add.classList.add('jupyter-widgets');
    add.classList.add('jupyter-button');
    add.classList.add('widget-button');
    add.onclick = () => {
      // console.log(this.selected_tag_id);
      let selection = window.getSelection();
      let selected_id;
      try {
        selected_id = selection.anchorNode.parentNode.id.replace('TSW-widget-', '').replace('-letter-\d+', '');
        selected_id = parseInt(selected_id, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (selected_id !== this.widget_id) return 
      let start, end, left, right;
      try {
        start = selection.anchorNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        start = parseInt(start, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      try {
        end = selection.focusNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        end = parseInt(end, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (start < end) {
        left = start;
        right = end;
      } else {
        left = end;
        right = start;
      }
      let l_txt = document.getElementById(`TSW-widget-${this.widget_id}-letter-${left}`).innerText;
      if (l_txt === ' ') left += 1;
      let r_txt = document.getElementById(`TSW-widget-${this.widget_id}-letter-${right}`).innerText;
      if (r_txt === ' ') right -= 1;

      for (let i = left; i <= right; i++) {
        let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
        tmp_el.style.background = this.colors[this.selected_tag_id];
      }
      this.res.push({
        start: left,
        end: right,
        tag: this.tags[this.selected_tag_id]
      });
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(add);

    let done_inp = document.createElement("input");
    done_inp.type = "checkbox";
    done_inp.name = "Done";
    done_inp.value = "Done";
    done_inp.onclick = () => {
      this.dis = !this.dis;
      this.model.set("dis", this.dis);
      this.model.save();
      this.model.save_changes();
      if (this.dis) {
        add.removeAttribute("disabled");
        rem.removeAttribute("disabled");
        res.removeAttribute("disabled");
        sel = document.getElementById(`TSW-widget-${this.widget_id}-select`);
        sel.removeAttribute("disabled");
        this.res = this.old_res;
        for (r of this.res) {
          for(let i = r['start']; i<= r['end']; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = this.colors[this.tags.indexOf(r.tag)];
          }
        }
      } else {
        add.disabled = "disabled";
        rem.disabled = "disabled";
        res.disabled = "disabled";
        sel = document.getElementById(`TSW-widget-${this.widget_id}-select`);
        sel.disabled = "disabled";
        this.old_res = this.res;
        for (r of this.res) {
          for(let i = r['start']; i<= r['end']; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = '';
          }
        }
        this.res = [ "None" ];
      }
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    let done = document.createElement("span");
    done.id = "TSW-done";
    done.appendChild(done_inp);
    done.appendChild(document.createTextNode("Done"));
    dom_controls.appendChild(done);

    let res = document.createElement("button");
    res.id = 'TSW-res'
    res.classList.add('p-Widget');
    res.classList.add('btn');
    res.classList.add('jupyter-widgets');
    res.classList.add('jupyter-button');
    res.classList.add('widget-button');
    res.style.float = "right";
    if (this.emojify) {
      res.innerText = "Reset 🗑️";
    } else {
      res.innerText = "Reset";
    }
    res.onclick = () => {
      for (r of this.res) {
        for(let i = r['start']; i<= r['end']; i++) {
          let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
          tmp_el.style.background = '';
        }
      }
      this.res = [];
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(res);

    let rem = document.createElement("button");
    rem.id = `TSW-widget-${this.widget_id}-rem`;
    if (this.emojify) {
      rem.innerText = "Remove ➖";
    } else {
      rem.innerText = "Remove";
    }
    rem.style.float = "right";
    rem.classList.add('p-Widget');
    rem.classList.add('btn');
    rem.classList.add('jupyter-widgets');
    rem.classList.add('jupyter-button');
    rem.classList.add('widget-button');
    rem.onclick = () => {
      let selection = window.getSelection();
      let selected_id;
      try {
        selected_id = selection.anchorNode.parentNode.id.replace('TSW-widget-', '').replace('-letter-\d+', '');
        selected_id = parseInt(selected_id, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (selected_id !== this.widget_id) return 
      let start, end, left, right;
      try {
        start = selection.anchorNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        start = parseInt(start, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      try {
        end = selection.focusNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        end = parseInt(end, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (start < end) {
        left = start;
        right = end;
      } else {
        left = end;
        right = start;
      }
      this.res.forEach((r, idx) => {
        if ((r.start >= left) && (r.end <= right)) {
          for (let i = r.start; i <= r.end; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = '';
          }
          this.res.splice(idx, 1);
        }
      });
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(rem);

    return dom_controls;
  },
});

module.exports = {
  TSWidgetModel,
  TSWidgetView
};
