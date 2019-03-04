Vue.component("form-create", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      type: "Function",
      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px'
      },
      showContextMenu: false,
      contextMenuStyle : {
        'position': 'absolute',
        'width': '175px',
        'left': '0px',
        'top': '0px',
      },
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  methods: {
    //form specific
    subform: function (name) {
      switch (name) {
        case 'Function':
          return 'form-function'
        case 'Variable':
          return 'form-variable'
        case 'Graph':
          return 'form-graph'
        case 'Table':
          return 'form-table'
        case 'Text':
          return 'form-text'
        default:
          return 'form-function'
      }
    },
    finishForm: function (args) {
      //console.log(args);
      switch (this.type) {
        case 'Variable':
          this.$root.createObj({
            type: "math-variable",
            position: [this.styleObj.left, this.styleObj.top],
            value: args.value
          })
          break
        case 'Graph':
          this.$root.createObj({
            type: "math-graph",
            position: [this.styleObj.left, this.styleObj.top],
            xaxis: args.xaxis,
            yaxis: args.yaxis,
            xrange: args.xrange,
            yrange: args.yrange,
          })
          break
        case 'Table':
          this.$root.createObj({
            type: "math-table",
            position: [this.styleObj.left, this.styleObj.top],
            inputHeaders: this.inputHeaders,
            inputTable: this.inputTable,
            outputHeaders: this.outputHeaders,
            outputTable: this.outputTable
          })
          break
        case 'Text':
          this.$root.createObj({
            type: "base-text",
            position: [this.styleObj.left, this.styleObj.top],
          })
          break
        default:
          // default case is Function
          this.$root.createObj({
            type: 'math-function',
            position: [this.styleObj.left, this.styleObj.top],
            name: args.name,
            latex: args.latex
          })
          break
      }
      this.deleteForm()
    },

    // needed by main.js
    toObject: function () {
      return {
        "position": [this.styleObj.left, this.styleObj.top],
        "type": 'form-create',
        "id": this.$attrs.id
      }
    },
    deleteForm: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },

    // events
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
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.self="onClick"
  v-on:contextmenu.prevent="onRightClick"

  v-bind:class="{CreateForm:true,selected:selected}"
  v-bind:style="styleObj">
  <form onsubmit="return false">
    <label for="object">What would you like to create?</label>
    <select type="text" v-model="type">
      <option v:bind:selected="'Function'==type">Function</option>
      <option v:bind:selected="'Variable'==type">Variable</option>
      <option v:bind:selected="'Graph'==type">Graph</option>
      <option v:bind:selected="'Table'==type">Table</option>
      <option v:bind:selected="'Text'==type">Text</option>
    </select>
    <keep-alive>
      <component v-bind:is="subform(type)"></component>
    </keep-alive>
  </form>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContextMenu && selected"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteForm" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})