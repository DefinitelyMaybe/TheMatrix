Vue.component("ui-menu", {
  props: {
    initItems: Array
  },
  data: function () {
    return {
      menuitems: [],
    }
  },
  created: function () {
    if (this.initItems) {
      this.menuitems = this.initItems.slice()
    }
  },
  methods: {},
  template: `<ol v-on:contextmenu.prevent="0">
  <li v-for="(item, i) in menuitems">
    <button type="button" disabled="item.disable">{{item.text}}</button>
  </li>
</ol>`,
})