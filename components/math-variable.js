Vue.component("math-variable", {
  props: {
    initData: Object,
    selected: Boolean,
    showContectMenu: Boolean
  },
  data: function () {
    return {
      // some default settings
      name: 'x',
      type: 'number',
      value: 0,

      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
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
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
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
    toObject: function () {
      return {
        "name": this.name,
        "type": this.type,
        "value": this.value,
        "position": [this.styleObj.left, this.styleObj.top]
      }
    },
    onDragEnd: function (event) {
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.styleObj.left = `${x}px`
      this.styleObj.top = `${y}px`
      // updating the class appropriately
      this.objHover = false
    },
    onDragStart: function (event) {
      this.onClick()
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
    },
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      this.$root.onContextMenu(event, 'variable')
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-on:dragenter="objHover = true"
v-on:dragleave="objHover = false"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'matrix')"

v-bind:style="styleObj"
v-bind:class="{variable:true, selected:selected, objHover:objHover}">
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
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContextMenu &&  == 'variable'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteCurrentObj" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})