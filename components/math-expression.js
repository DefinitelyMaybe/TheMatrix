Vue.component("math-expression", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // the default function name
      // used as a referrence for other functions
      name: "expression?",
      variables: [],
      expression: "...",

      // For moving around on the scene
      dragOffsetX: 0,
      dragOffsetY: 0,

      styleObj: {
        'display': 'flex',
        'flex-direction': 'row'
      }
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.result = this.initData.result
      this.variables = this.initData.variables
      this.name = this.initData.name
      this.expression = this.initData.expression
    }
  },
  methods: {
    onDrop: function (event) {
      console.log("OnDrop function called.");
      // Data is going to be moved from the mains objects and nested within the function object
      // The object being dropped must have been selected so we'll start there.
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.$root.updateData(this.$attrs.id, 'position', [`${x}px`, `${y}px`])
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
      this.onClick(event)
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
    },
    onClick: function (event) {
      this.$root.selectObj(event, this.$attrs.id)
    },
    onRightClick: function (event) {
      this.$root.selectObj(event, this.$attrs.id)
      this.$root.onContextMenu(event, 'function')
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:drop="onDrop"
v-on:dragstart="onDragStart"
v-bind:style="styleObj"
v-bind:class="{ function: true, selected: selected}"

v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'function')">
  <p>{{name}}</p>
  <p v-if="variables.length != 0">(...)</p>
  <p>=</p>
  <p>{{expression}}</p>
</div>`,
})