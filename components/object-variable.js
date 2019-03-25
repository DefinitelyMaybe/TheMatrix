Vue.component("object-variable", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      // some default settings
      name: 'x',
      value: 0,

      objHover: false
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.name = this.initData.name
      this.value = this.initData.value
    }
  },
  methods: {
    save: function () {
      return {
        "name": this.name,
        "value": this.value,
        "position": [this.objStyle.left, this.objStyle.top],
        "type": 'object-variable',
        "id": this.$attrs.id
      }
    },
    deleteObject: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    edit: function () {
      if (this.selected) {
        this.$root.editObject(this.$attrs.id)
      } else {
        this.onClick(event)
      }
    },

    onRightClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
      this.editing = false
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-on:dragenter="objHover = true"
v-on:dragleave="objHover = false"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick"

v-bind:style="objStyle"
v-bind:class="{variable:true, selected:selected, objHover:objHover}">
  <span><b>{{name}}</b></span>
  <span>=</span>
  <span>{{value}}</span>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContextMenu && selected"
  v-bind:style="contextMenuStyle">
    <li v-on:click="edit" v-bind:class="{menu: true}">Edit</li>
    <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})