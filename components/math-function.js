Vue.component("math-function", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      expressionTree: [],
      dragOffsetX: 0,
      dragOffsetY: 0,
      styleObj: {
        position: 'absolute',
        left: '0px',
        top: '0px'
      }
    }
  },
  created: function () {
    if (this.initData) {
      // assuming there is both a position and entires
      this.expressionTree = this.initData.expressionTree
      this.expressionTree.slice()
      this.styleObj.left = `${this.initData.position[0]}px`
      this.styleObj.top   = `${this.initData.position[1]}px`
    }
  },
  methods: {
    newOperator: function (operator) {
      console.log("New Operator function called");
    },
    newOperand: function (operand) {
      console.log("New Operand function called.");
    },
    onDrop: function (event) {
      console.log("OnDrop function called.");
      // Data is going to be moved from the mains objects and nested within the function object
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.styleObj.left = `${x}px`
      this.styleObj.top   = `${y}px`
      this.$root.updateData(this.$attrs.id, 'position', [x, y])
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
v-on:click.self="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'function')">
  <component v-for="(value, index) in expressionTree"
  v-bind:id="value.id"
  v-bind:key="value.id"
  v-bind:is="value.type"
  v-bind:initData="value.data"
  v-bind:selected="selected">
  </component>
</div>`,
})