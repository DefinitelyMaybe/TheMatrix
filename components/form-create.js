Vue.component("form-create", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      formData: {
        type: "Function"
      },

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
      this.formData = this.initData.formData
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

    // needed by main.js
    toObject: function () {
      return {
        "data": this.formData,
        "width": this.styleObj.width,
        "height": this.styleObj.height,
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
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  
  v-bind:class="{CreateForm:true,selected:selected}"
  v-bind:style="styleObj">
  <form onsubmit="return false">
    <label for="object">What would you like to create?</label>
    <select type="text" v-model="formData.type">
      <option v:bind:selected="'Function'==formData.type">Function</option>
      <option v:bind:selected="'Variable'==formData.type">Variable</option>
      <option v:bind:selected="'Graph'==formData.type">Graph</option>
      <option v:bind:selected="'Table'==formData.type">Table</option>
      <option v:bind:selected="'Text'==formData.type">Text</option>
    </select>
    <keep-alive>
      <component v-bind:is="subform(formData.type)"></component>
    </keep-alive>
  </form>
</div>`,
})