Vue.component("math-function", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      expressionTree: {},
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
      this.entries = this.initData.expressionTree
      this.styleObj.left = `${this.initData.position[0]}px`
      this.styleObj.top   = `${this.initData.position[1]}px`
    }
  },
  methods: {
    newOperator: function (operator) {
      console.log("WIP");
    },
    newOperand: function (operand) {
      console.log("WIP");
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
v-on:dragstart="onDragStart"
v-bind:style="styleObj"
v-bind:class="{ function: true, selected: selected}"
v-on:click.self="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'function')">hello world
</div>`,
})