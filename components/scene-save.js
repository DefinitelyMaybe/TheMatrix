Vue.component("scene-save", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      data: ""
    }
  },
  created: function () {
    this.data = this.$root.toJSON()
  },
  methods: {
    //form specific
    finishForm: function (args) {
      this.deleteForm()
    },
    deleteForm: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    }
  },
  template: `<div draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"

  v-bind:class="{CreateForm:true,selected:selected}"
  v-bind:style="objStyle">
  <form onsubmit="return false">
    <i>Everything was saved into the textbox.</i><br>
    <textarea v-model="data" v-bind:style="{width:'300px'}"></textarea><br>
    <i>copy, paste the textbox's contents into load.</i><br>
    <button v-on:click="finishForm">Close</button>
  </form>
</div>`,
})