Vue.component("form-create", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      formData: {},

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
  v-on:mouseup="onResizeTextBox"

  v-bind:class="{text:true, selected:selected}"
  v-bind:style="styleObj"
  v-model:value="value">
  <form>
    <label for="hello">Hello</label>
    <input type="text" id="hello">world</input>
  </form>
</div>`,
})