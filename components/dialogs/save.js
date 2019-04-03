Vue.component("dialog-save", {
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
    finishForm: function () {
      console.log("Not Yet Implemented");
    }
  },
  template: `<dialog>
  <form onsubmit="return false">
    <i>Everything was saved into the textbox.</i><br>
    <textarea v-model="data" v-bind:style="{width:'300px'}"></textarea><br>
    <i>copy, paste the textbox's contents into load.</i><br>
    <button v-on:click="finishForm">Close</button>
  </form>
</dialog>`,
})