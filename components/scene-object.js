Vue.component("scene-object", {
  props: {
    id: String,
    type: String,
    data: Object,
    selected: Boolean
  },
  template: `<component v-bind:is="type"
  v-bind:id="id"
  v-bind:initData="data"
  v-bind:selected="selected"></component>`,
})