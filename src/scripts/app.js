/* eslint-env es6, browser */
/* global rison, Vue */

const vm = new Vue({ // eslint-disable-line no-unused-vars
  el: '#app',
  data: {
    rison_string: '',
    json_string: '',
    kibana: true,
    format: 'Rison',
    rison_error: '',
    json_error: ''
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
      }
    }
  }
});
