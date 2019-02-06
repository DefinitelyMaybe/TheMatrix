Vue.component("base-text", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      value: '',
      width: "300px",
      height: "150px",
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.value = this.initData.value
      this.width = this.initData.width
      this.height = this.initData.height
    }
  },
  methods: {
    updateValue: function (event) {
      if (this.selected) {
        // find the element and 
        if (this.value != event.srcElement.value) {
          this.value = event.srcElement.value
          this.$root.updateData(this.$attrs.id, 'value', this.value)
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
    },
    onResizeTextBox: function (event) {
      // check whether the text box size changed
      // and if it did update the root object and the local object
      let w = event.srcElement.style.width
      let h = event.srcElement.style.height
      if (w != this.width || h != this.height) {
        this.width = w
        this.height = h
        this.$root.updateData(this.$attrs.id, 'width', w)
        this.$root.updateData(this.$attrs.id, 'height', h)
      }
    }
  },
  template: `<textarea draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'matrix')"
v-on:mouseup="onResizeTextBox"
v-on:keyup="updateValue"
v-bind:class="{text:true, selected:selected}"
v-bind:style="{width:width, height:height}">{{value}}
</textarea>`,
})