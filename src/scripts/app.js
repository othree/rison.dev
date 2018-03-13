/* global: rison */

var vm = new Vue({
  el: '#app',
  data: {
    rison_string: "(columns:!(_source),index:'main-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))",
    json_string: '',
    kibana: true,
    format: 'Rison',
    rison_error: '',
    json_error: ''
  },
  methods: {
    rison_to_json: function () {
      this.rison_error = '';
      let rison_string = this.rison_string;

      if (!rison_string) {
        return;
      }

      if (this.kibana) {
        try {
          let url = new URL(rison_string);
          let hash_url = new URL(url.hash.slice(1), `${url.protocol}//${url.host}`);
          rison_string = hash_url.searchParams.get('_a');
        } catch (error) {}
      }

      let json_string = '';

      // Rison
      if (!json_string) {
        try {
          json_string = JSON.stringify(rison.decode(rison_string), null, 4);
          this.format = 'Rison';
          this.rison_error = '';
        } catch (error) {
          this.rison_error = `Error: ${error.message}`;
        }
      }

      // O-Rison
      if (!json_string) {
        try {
          json_string = JSON.stringify(rison.decode_object(rison_string), null, 4);
          this.format = 'O-Rison';
          this.rison_error = '';
        } catch (error) {}
      }

      // A-Rison
      if (!json_string) {
        try {
          json_string = JSON.stringify(rison.decode_array(rison_string), null, 4);
          this.format = 'A-Rison';
          this.rison_error = '';
        } catch (error) {}
      }

      if (json_string) {
        this.json_string = json_string;
      }
    },
    json_to_rison: function () {
      let json_string = this.json_string;

      if (!json_string) {
        return;
      }

      let rison_string = ''

      try {
        rison_string = rison.encode(JSON.parse(this.json_string));
      } catch (error) {
        this.json_error = `Error: ${error.message}`;
      }

      if (rison_string) {
        this.rison_string = rison_string;
      }
    }
  }
});
