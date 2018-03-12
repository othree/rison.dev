/* global: rison */

var vm = new Vue({
  el: '#app',
  data: {
    rison_string: "(columns:!(_source),index:'main-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))",
    json_string: '',
    kibana: true
  },
  methods: {
    rison_to_json: function () {
      let rison_string = this.rison_string;

      if (!rison_string) {
        return;
      }

      if (this.kibana) {
        let url = new URL(rison_string);
        let hash_url = new URL(url.hash.slice(1), `${url.protocol}//${url.host}`);
        rison_string = hash_url.searchParams.get('_a');
      }

      this.json_string = JSON.stringify(rison.decode(rison_string), null, 4);
    },
    json_to_rison: function () {
      let json_string = this.json_string;

      if (!json_string) {
        return;
      }

      this.rison_string = rison.encode(JSON.parse(this.json_string));
    }
  }
});
