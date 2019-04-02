Vue.component("object-text", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      value: '',
      textStyle: {
        'width': "300px",
        'height': "150px"
      }
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.value = this.initData.value
      this.textStyle.width = this.initData.width
      this.textStyle.height = this.initData.height
    }
  },
  methods: {
    save: function () {
      return {
        "value": this.value,
        "width": this.textStyle.width,
        "height": this.textStyle.height,
        "position": [this.objStyle.left, this.objStyle.top],
        "type": 'object-text',
        "id": this.$attrs.id
      }
    },
    deleteObject: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
    onResizeTextBox: function (event) {
      // check whether the text box size changed
      // and if it did update the root object and the local object
      let w = event.srcElement.style.width
      let h = event.srcElement.style.height
      if (w != this.textStyle.width || h != this.textStyle.height) {
        this.textStyle.width = w
        this.textStyle.height = h
      }
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-on:click.prevent="onClick"
  v-on:mouseup="onResizeTextBox"
  v-on:contextmenu.prevent="onRightClick"
  v-bind:style="objStyle">
  <textarea v-bind:class="{text:true, selected:selected}"
  v-model:value="value" v-bind:style="textStyle">
  </textarea>
  <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
      <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`,
})