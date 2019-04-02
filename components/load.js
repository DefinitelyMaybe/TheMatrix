Vue.component("scene-load", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      data: "",
      dataType: "Object",
      reset: false
    }
  },
  methods: {
    //form specific
    finishForm: function () {
      this.deleteForm()
      try {
        this.data = JSON.parse(this.data)
        if (this.data != "") {
          for (let i = 0; i < this.data.length; i++) {
            this.$root.createObj(this.data[i])
          }
        }
      } catch (error) {
        //console.error(error);
      }
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
    <label>Paste load data into the textbox:</label><br>
    <textarea v-model="data" v-bind:style="{width:'300px'}"></textarea><br>
    <button v-on:click="finishForm">Finish</button>
  </form>
</div>`,
})