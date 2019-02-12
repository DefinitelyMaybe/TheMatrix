Vue.component("math-function", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // the default function name
      // used as a referrence for other functions
      name: "f",
      expression: "x + 1",
      
      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'display': 'flex',
        'flex-direction': 'row'
      },
      showContextMenu: false,
      contextMenuStyle : {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
      },
      // For moving around on the scene
      dragOffsetX: 0,
      dragOffsetY: 0,
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.name = this.initData.name
      this.expression = this.initData.expression
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  methods: {
    changeName: function () {
      if (this.selected) {
        let newName = prompt("what would you like to change the name to?", this.name)
        if (newName && this.name != newName) {
          this.name = newName
          this.$root.updateTablesWithSymbol(this.name)
        } 
      } else {
        this.onClick(event)
      }
    },
    changeExpression: function () {
      if (this.selected) {
        let newExpression = prompt("what would you like to change the name to?", this.expression)
        if (newExpression && this.expression != newExpression) {
          this.expression = newExpression
          this.$root.updateTablesWithSymbol(this.name)
        } 
      } else {
        this.onClick(event)
      }
    },
    toObject: function () {
      return {
        "name": this.name,
        "expression": this.expression,
        "position": [this.styleObj.left, this.styleObj.top],
        "type": 'math-function',
        "id": this.$attrs.id
      }
    },
    deleteFunction: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    onDragEnd: function (event) {
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.styleObj.left = `${x}px`
      this.styleObj.top = `${y}px`
    },
    onDragStart: function (event) {
      this.onClick()
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
    },
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    },
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-bind:style="styleObj"
v-bind:class="{ function: true, selected: selected}"

v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick">
  <p v-on:click.prevent="changeName">{{name}}</p>
  <p>:</p>
  <p v-on:click.prevent="changeExpression">{{expression}}</p>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContextMenu && selected"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteFunction" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})