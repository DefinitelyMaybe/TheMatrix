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
      dummyArray: [],
      styleObj: {
        'display': 'flex',
        'flex-direction': 'row'
      },
      objHover: false,
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
          this.$root.updateData(this.$attrs.id, 'name', x)
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
          this.$root.updateData(this.$attrs.id, 'value', x)
        } 
      } else {
        this.onClick()
      }
    },
    onDrop: function (event) {
      //console.log("OnDrop function called.");
      //console.log(event);
      // get the data about the currently selected item
      let x = this.$root.getCurrentObjData()
      if (x) {
        //console.log(x);
        if (x.type == 'math-matrix') {
          // create a new object with the new values at this exact same location
          
          // sigh, not liking do it this way.
          let y = this.$root.getObjectByID(this.$attrs.id)

          // Data is going to be moved from the mains objects and nested within this object
          this.$root.dropData(this.$attrs.id, {
            type: "math-variable",
            position: y[0].data.position,
            name: this.name,
            valueType: x.type,
            value: x.data.entries
          })
        } else if (x.type == 'math-vector') {

        } else {
          alert("Sorry, variables can only be numbers, vectors or matrices")
        }
      }
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.$root.updateData(this.$attrs.id, 'position', [`${x}px`, `${y}px`])
      // updating the class appropriately
      this.objHover = false
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
v-on:drop="onDrop"
v-on:dragenter="objHover = true"
v-on:dragleave="objHover = false"

v-bind:style="styleObj"
v-bind:class="{variable:true, selected:selected, objHover:objHover}"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'matrix')">
  <p v-on:click="changeName">{{name}}</p>
  <p>=</p>
  <p v-if="this.type == 'number'"
  v-on:click="changeValue">{{value}}</p>
  <component
  v-if="this.type == 'math-matrix'"
  v-bind:is="'math-matrix'"
  v-bind:selected="selected"
  v-bind:initData="{'entries':value}">
  </component>
</div>`,
})