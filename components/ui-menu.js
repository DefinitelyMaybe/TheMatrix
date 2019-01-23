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
  template: `<ol v-on:contextmenu.prevent="0" v-bind:class="{menu: true}">
  <li v-for="(item, i) in menuitems" v-key="i" v-bind:class="{menu: true}">
    <button type="button" disabled="item.disable" v-bind:class="{menu: true}">{{item.text}}</button>
  </li>
</ol>`,
})