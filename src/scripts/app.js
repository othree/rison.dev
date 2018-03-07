/* global: rison */

var vm = new Vue({
  el: '#app',
  data: {
    rison_string: '',
    json_string: '',
  },
  methods: {
    rison_to_json: function () {
      this.json_string = JSON.stringify(rison.decode(this.rison_string), null, 4);
    },
    json_to_rison: function () {
      this.rison_string = rison.encode(JSON.parse(this.json_string));
    }
  }
});
