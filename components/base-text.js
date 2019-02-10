Vue.component("base-text", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      value: '',

      // styling and misc data
      styleObj: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px',
        'width': "300px",
        'height': "150px"
      },
      showContextMenu: false,
      contextMenuStyle : {
        'position': 'absolute',
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
      this.value = this.initData.value
      this.styleObj.width = this.initData.width
      this.styleObj.height = this.initData.height
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  methods: {
    toObject: function () {
      return {
        "value": this.value,
        "width": this.styleObj.width,
        "height": this.styleObj.height,
        "position": [this.styleObj.left, this.styleObj.top],
        "type": 'base-text',
        "id": this.$attrs.id
      }
    },
    deleteText: function () {
      console.log("Delete text function");
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
      this.contextMenuStyle.left = `${event.x}px`
      this.contextMenuStyle.top = `${event.y}px`
      this.showContextMenu = true
    },
    onResizeTextBox: function (event) {
      // check whether the text box size changed
      // and if it did update the root object and the local object
      let w = event.srcElement.style.width
      let h = event.srcElement.style.height
      if (w != this.width || h != this.height) {
        this.styleObj.width = w
        this.styleObj.height = h
      }
    }
  },
  template: `<div>
  <textarea draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:contextmenu.prevent="onRightClick"
  v-on:mouseup="onResizeTextBox"

  v-bind:class="{text:true, selected:selected}"
  v-bind:style="styleObj"
  v-model:value="value">
  </textarea>
  <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteText" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})