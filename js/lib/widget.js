var widgets = require("@jupyter-widgets/base");
var _ = require("lodash");

var TSWidgetModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "TSWidgetModel",
    _view_name: "TSWidgetView",
    _model_module: "text_selector",
    _view_module: "text_selector",
    _model_module_version: "0.0.0",
    _view_module_version: "0.0.0",
    tags: [],
    txts: [],
    n: 3,
    res: {}
  })
});

var TSWidgetView = widgets.DOMWidgetView.extend({
  // value_changed: function() {
    // this.res = this.model.get("res");
  // },
  render() {
    this.txts = this.model.get("txts");
    this.tags = this.model.get("tags");
    this.n = this.model.get("n");
    this.res = this.model.get("res");

    this.colors = this.create_colors(this.tags.length);
    this.model.on("change:res", this.res_changed, this);
    this.tag = this.tags[0];
    this.color = this.colors[0];
    this.page = 0;
    this.pages = Math.ceil(this.txts.length / this.n);

    // if (this.res.length !== this.txts.length) {
    // this.res = [];
    // for(let i = 0; i<this.txts.length; i++) {
    // this.res[i] = {};
    // this.res[i] = [];
    // }
    // console.log(JSON.stringify(this.res));
    // this.model.set('res', this.res);
    // this.model.save();
    // }
    // console.log(this.res);
    // this.model.set('res', JSON.stringify(this.res));
    // this.model.set('res', this.res);
    // this.model.save_changes();
    // console.log(this.model.get('res'));

    this.box = document.createElement("div");
    // this.box.classList.add('container');
    this.box.id = "TS-box";
    this.box.style.border = "1px solid black";
    this.box.style.padding = "1%";

    this.pagination = document.createElement("div");

    this.prev = document.createElement("button");
    this.prev.innerText = "Prev";
    // this.prev.classList.add('btn');
    // this.prev.classList.add('btn-light');
    this.prev.onclick = () => {
      this.page = Math.max(0, this.page - 1);
      this.cur_page.innerText = `${this.page + 1}/${this.pages}`;

      while (this.text.hasChildNodes()) {
        this.text.removeChild(this.text.lastChild);
      }
      this.text.appendChild(this.create_txts());
    };
    this.pagination.appendChild(this.prev);

    this.cur_page = document.createElement("span");
    this.cur_page.innerText = `${this.page + 1}/${this.pages}`;
    this.cur_page.id = "TS-cur-page";
    this.pagination.appendChild(this.cur_page);

    this.next = document.createElement("button");
    this.next.innerText = "Next";
    // this.next.classList.add('btn');
    // this.next.classList.add('btn-light');
    this.next.classList.add("col");
    this.next.onclick = () => {
      this.page = Math.min(this.pages - 1, this.page + 1);
      this.cur_page.innerText = `${this.page + 1}/${this.pages}`;

      while (this.text.hasChildNodes()) {
        this.text.removeChild(this.text.lastChild);
      }
      this.text.appendChild(this.create_txts());
    };
    this.pagination.appendChild(this.next);
    this.box.appendChild(this.pagination);

    this.text = document.createElement("div");
    this.text.appendChild(this.create_txts());

    this.box.appendChild(this.text);
    this.el.appendChild(this.box);
    // for (let i = 0; i < this.n; i++) {
      // let el = document.getElementById(`TSW-text-${i}`);
      // if (el !== null) {
        // el.style.display = "none";
      // }
    // }
  },
  create_txt(id) {
    let txt = this.txts[id];
    let dom_txt = document.createElement("div");
    dom_txt.style.border = "1px solid gray";
    dom_txt.style.margin = "1% 0";
    this.res = this.model.get("res");
    for (let i = 0; i < txt.length; i++) {
      let tmp = document.createElement("span");
      tmp.innerText = txt.charAt(i);
      tmp.id = `TSW-txt-${id}-letter-${i}`;
      if (id in this.res) {
        Object.keys(this.res[id]).forEach(range => {
          let splits = range.split(':');
          let left = splits[0];
          let right = splits[1];
          if ((i >= left) && (i <= right)) {
            let color = this.colors[this.tags.indexOf(this.res[id][range])]
            tmp.style.background = color;
          }
          // for (let j = left; j <= right; j++) {
            // console.log(id, '\t', j);
            // let tmp_el = document.getElementById(`TSW-txt-${id}-letter-${j}`);
            // sentence += tmp_el.innerText;
            // tmp_el.style.background = 'red';
          // }
        });
      }
      dom_txt.appendChild(tmp);
    }
    return dom_txt;
  },
  create_txts() {
    let dom_el = document.createElement("div");
    for (
      let i = this.page * this.n;
      i <= Math.min(this.n * (this.page + 1) - 1, this.txts.length - 1);
      i++
    ) {
      console.log(i);
      text = document.createElement("div");
      text.id = `TSW-text-${i}`;
      let txt = this.create_txt(i);
      text.appendChild(txt);

      let control = document.createElement("div");
      let add = document.createElement("button");
      add.innerText = "Add";
      // add.classList.add('btn');
      // add.classList.add('btn-light');
      add.onclick = () => {
        let selection = window.getSelection();
        let start = parseInt(selection.anchorNode.parentNode.id.replace(/TSW-txt-\d+-letter-/i, ""), 10);
        let end = parseInt(selection.focusNode.parentNode.id.replace(/TSW-txt-\d+-letter-/i, ""), 10);
        let left, right;
        if (start < end) {
          left = start;
          right = end;
        } else {
          left = end;
          right = start;
        }
        // let sentence = "";
        for (let j = left; j <= right; j++) {
          let tmp_el = document.getElementById(`TSW-txt-${i}-letter-${j}`);
          // sentence += tmp_el.innerText;
          tmp_el.style.background = this.color;
        }
        if (!(i in this.res)) {
          this.res[i] = {};
        }
        this.res[i][left + ":" + right] = this.tag;
        this.model.set("res", this.res);
        this.model.save();
        console.log(
          JSON.stringify(this.res),
          "\t",
          JSON.stringify(this.model.get("res"))
        );
      };
      control.appendChild(add);

      select_tag = document.createElement("select");
      select_tag.id = "selector";
      this.tags.forEach((el, idx) => {
        let tag_dom_el;
        tag_dom_el = document.createElement("option");
        tag_dom_el.innerText = el;
        tag_dom_el.onclick = () => {
          this.tag = el;
          this.color = this.colors[idx];
        };
        select_tag.appendChild(tag_dom_el);
      });
      control.appendChild(select_tag);

      let rem = document.createElement("button");
      // rem.classList.add('btn');
      // rem.classList.add('btn-light');
      rem.innerText = "Reset";
      rem.onclick = () => {};
      control.appendChild(rem);
      text.appendChild(control);
      // if (i >= this.n) text.style.display = "none";
      dom_el.appendChild(text);
    }
    return dom_el;
  },
  create_colors(len) {
    let color = 0;
    let colors = [];
    let max_color = Math.pow(16, 6);

    let beg_color = Math.floor(Math.random() * max_color);
    for (let i = 0; i < len; i++) {
      // color = Math.floor((beg_color + i*Math.floor(max_color / len)) / max_color);
      color = (beg_color + i * Math.floor(max_color / len)) % max_color;
      color = color.toString(16);
      colors[i] = `#${color}`;
    }

    return colors;
  }
});

module.exports = {
  TSWidgetModel,
  TSWidgetView
};
