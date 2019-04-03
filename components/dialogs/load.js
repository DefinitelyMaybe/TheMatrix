Vue.component("dialog-load", {
  data: function () {
    return {
      loadData: "",
    }
  },
  methods: {
    //form specific
    finishForm: function () {
      this.deleteForm()
      try {
        this.loadData = JSON.parse(this.loadData)
        if (this.loadData != "") {
          for (let i = 0; i < this.loadData.length; i++) {
            this.$root.createObj(this.loadData[i])
          }
        }
      } catch (error) {
        //console.error(error);
      }
    }
  },
  template: `<dialog>
  <form onsubmit="return false">
    <label>Paste load data into the textbox:</label><br>
    <textarea v-model="loadData" v-bind:style="{width:'300px'}"></textarea><br>
    <button v-on:click="finishForm">Finish</button>
  </form>
</dialog>`,
})