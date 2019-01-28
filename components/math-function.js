Vue.component("math-function", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // Is what's used for rendering and evaluation
      expression: [],
      // when the expression is evaluated, the operators will be pointers to the functions to be used.
      operators: {},
      // a simple list of all operands
      operands: {},
      dragOffsetX: 0,
      dragOffsetY: 0,
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.expression = this.initData.expression
      this.operands = this.initData.operands
      this.operators = this.initData.operators
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
  computed: {
    evaluate: function () {
      // we're assuming that the expression stack is built up in reverse polish notation
      // because each operator may have more than one operand we'll make a list of operands
      let result
      let stack = []
      for (let i = 0; i < this.expression.length; i++) {
        // we need to get all of the references within the expression
        let x = this.expression[i]
        // and then figure out if its an operator or an operand
        if (this.operator[x]) {
          // i.e. the above statement is not undefined
          result = this.operator[x](stack)
          stack = [result]
        } else {
          // we know x must be an operand so we put it on the stack
          stack.push(this.operands[x])
        }
      }
      return stack.pop()
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:drop="onDrop"
v-on:dragstart="onDragStart"
v-bind:class="{ function: true, selected: selected}"
v-on:click.self="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'function')">
  <component v-for="(value, index) in expression"
  v-bind:id="value.id"
  v-bind:key="value.id"
  v-bind:is="value.type"
  v-bind:initData="value.data"
  v-bind:selected="selected">
  </component>
</div>`,
})