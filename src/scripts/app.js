/* eslint-env es6, browser */
/* global rison, Vue */

import { Tween, update } from 'es6-tween';

function clone (o) {
  return Object.assign({}, o);
}

const YELLOW = {
  r: 255,
  g: 255,
  b: 64
};

const WHITE = {
  r: 255,
  g: 255,
  b: 255
};

const vm = new Vue({ // eslint-disable-line no-unused-vars
  el: '#app',
  data: {
    rison_string: '',
    json_string: '',
    kibana: true,
    format: 'Rison',
    rison_error: '',
    json_error: '',
    rison_bg: clone(WHITE),
    json_bg: clone(WHITE),
    rison_tbg: clone(WHITE),
    json_tbg: clone(WHITE),
    rison_bg_tween: null,
    json_bg_tween: null
  },
  watch: {
    rison_bg: function () {
      if (this.rison_bg_tween) {
        this.rison_bg_tween.stop();
      }

      this.rison_bg_tween = new Tween(this.rison_tbg)
        .to(this.rison_bg, 750)
        .start();
    },
    json_bg: function () {
      if (this.json_bg_tween) {
        this.json_bg_tween.stop();
      }

      this.json_bg_tween = new Tween(this.json_tbg)
        .to(this.json_bg, 750)
        .start();
    }
  },
  computed: {
    rison_tbg_css: function () {
      return `rgb(${this.rison_tbg.r}, ${this.rison_tbg.g}, ${this.rison_tbg.b})`;
    },
    json_tbg_css: function () {
      return `rgb(${this.json_tbg.r}, ${this.json_tbg.g}, ${this.json_tbg.b})`;
    }
  },
  methods: {
    fill_sample: function () {
      this.rison_string = "(columns:!(_source),index:'main-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))";
    },
    rison_to_json: function () {
      this.rison_error = '';
      let risonString = this.rison_string;

      if (!risonString) {
        return;
      }

      if (this.kibana) {
        try {
          let url = new URL(risonString);
          let hashUrl = new URL(url.hash.slice(1), `${url.protocol}//${url.host}`);
          risonString = hashUrl.searchParams.get('_a');
        } catch (error) {}
      }

      let jsonString = '';

      // Rison
      if (!jsonString) {
        try {
          jsonString = JSON.stringify(rison.decode(risonString), null, 4);
          this.format = 'Rison';
          this.rison_error = '';
          this.json_error = '';
        } catch (error) {
          this.rison_error = `Error: ${error.message}`;
        }
      }

      // O-Rison
      if (!jsonString) {
        try {
          jsonString = JSON.stringify(rison.decode_object(risonString), null, 4);
          this.format = 'O-Rison';
          this.rison_error = '';
          this.json_error = '';
        } catch (error) {}
      }

      // A-Rison
      if (!jsonString) {
        try {
          jsonString = JSON.stringify(rison.decode_array(risonString), null, 4);
          this.format = 'A-Rison';
          this.rison_error = '';
          this.json_error = '';
        } catch (error) {}
      }

      if (jsonString) {
        this.json_string = jsonString;
        this.json_tbg = clone(YELLOW);
        this.json_bg = clone(WHITE);
      }
    },
    json_to_rison: function () {
      let jsonString = this.json_string;

      if (!jsonString) {
        return;
      }

      let risonString = '';

      try {
        risonString = rison.encode(JSON.parse(this.json_string));
        this.json_error = '';
        this.rison_error = '';
      } catch (error) {
        this.json_error = `Error: ${error.message}`;
      }

      if (risonString) {
        this.rison_string = risonString;
        this.rison_tbg = clone(YELLOW);
        this.rison_bg = clone(WHITE);
      }
    }
  }
});

// Setup the animation loop.
function animate (time) {
  requestAnimationFrame(animate);
  update(time);
}
requestAnimationFrame(animate);
