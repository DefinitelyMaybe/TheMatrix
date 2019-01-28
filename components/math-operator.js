Vue.component("math-operator", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      operator: '?',
      operands: []
    }
  },
  created: function () {
    //console.log("created function called");
    //console.log(this.initData);
    if (this.initData) {
      this.operator = this.initData.operator
      this.operands = this.initData.operands
    }
  },
  template: `<div v-bind:selected="selected">
  <template v-if="operator == 'add'">
    <component v-bind:is="operands[0].type"
    v-bind:id="operands[0].id"
    v-bind:initData="operands[0].data"></component>
    <p>+</p>
    <component v-bind:is="operands[1].type"
    v-bind:id="operands[1].id"
    v-bind:initData="operands[1].data"></component>
  </template>
  <template v-if="operator == '?'">
    <div>?</div>
  </template>
</div>`,
})