Vue.component("dialog-reset", {
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
    }
  },
  template: `<dialog>
  <form onsubmit="return false">
    <label for="object">Are you sure you want to reset the scene?</label>
    <input type="checkbox" v-model="confirmation"></input><br>
    <button v-on:click="finishForm">Finish</button>
  </form>
</dialog>`,
})