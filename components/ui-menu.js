Vue.component("ui-menu", {
  props: {
    initItems: Array,
  },
  data: function () {
    return {
      menuitems: []
    }
  },
  created: function () {
    if (this.initItems) {
      this.menuitems = this.initItems.slice()
    }
  },
  template: `<ol v-on:contextmenu.prevent="0" v-bind:class="{menu: true}">
  <li v-for="(item, i) in menuitems"
  v-bind:key="i"
  v-bind:class="{menu: true}">{{item.text}}</li>
</ol>`,
})