Vue.component("scene-reset", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      confirmation: false
    }
  },
  methods: {
    //form specific
    finishForm: function (args) {
      if (this.confirmation) {
        this.$root.deleteAllObjects()
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
    <label for="object">Are you sure you want to reset the scene?</label>
    <input type="checkbox" v-model="confirmation"></input><br>
    <button v-on:click="finishForm">Finish</button>
  </form>
</div>`,
})