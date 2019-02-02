Vue.component("base-text", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      value: '',
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      console.log(this.initData);
    }
  },
  methods: {
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
  template: `<textarea draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"

v-bind:class="{text:true, selected:selected}"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event, 'matrix')">
</textarea>`,
})