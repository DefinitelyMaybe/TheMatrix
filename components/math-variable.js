Vue.component("math-variable", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      name: 'x',
      type: 'number',
      value: 0,
      styleObj: {
        'display': 'flex',
        'flex-direction': 'row'
      },
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.name = this.initData.name
      this.type = this.initData.type
      this.value = this.initData.value
    }
  },
  methods: {
    changeName: function () {
      if (this.selected) {
        let x = prompt(`What would you like to rename ${this.name} to?`, this.name)
        if (x) {
          this.name = x
        } 
      } else {
        this.onClick()
      }
    },
    changeValue: function () {
      if (this.selected) {
        let x = prompt(`What would you like to change the value to?`, this.value)
        if (x) {
          this.value = x 
        } 
      } else {
        this.onClick()
      }
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
      this.$root.onContextMenu(event, 'variable')
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-bind:style="styleObj"
v-bind:class="{variable:true, selected:selected}"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'matrix')">
  <p v-on:click="changeName">{{name}}</p>
  <p>=</p>
  <p v-on:click="changeValue">{{value}}</p>
</div>`,
})