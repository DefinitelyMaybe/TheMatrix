Vue.component("math-graph", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some defaults
      header: 'graph',
      axis: ['x', 'y'],
      data: {
        'x': [1, 2, 3, 4, 5],
        'y': [1, 2, 4, 8, 16]
      },
      options: {
        margin: { t: 0 }
      },
      
      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'width': "300px",
        'height': "300px"
      },
      showContextMenu: false,
      contextMenuStyle: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px'
      },
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      /*this.inputHeaders = this.initData.inputHeaders
      this.outputHeaders = this.initData.outputHeaders
      this.inputTable = this.initData.inputTable
      this.outputTable = this.initData.outputTable*/
      this.styleObj.width = this.initData.width
      this.styleObj.height = this.initData.height
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
      console.log(this);
    }
  },
  mounted: function () {
    this.graph = this.$refs.graph
    this.plot()
  },
  methods: {
    // Graph specific
    plot: function () {
      console.log("hello world");
      Plotly.plot( this.graph, [this.data], this.options);
    },
    deleteGraph: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },

    // Root specific
    toObject: function () {
      return {
        "position": [this.styleObj.left, this.styleObj.top],
        "type": 'math-graph',
        "id": this.$attrs.id
      }
    },

    // events
    onDragEnd: function (event) {
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.styleObj.left = `${x}px`
      this.styleObj.top = `${y}px`
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
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
      this.addedWidth = event.layerX
      this.showContextMenu = true
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  v-bind:class="{ graph: true, selected: selected}"
  v-bind:style="styleObj">
    <div ref="graph"></div>
    <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteGraph" v-bind:class="{menu: true}">Delete Table</li>
    </ol>
  </div>`,
})