Vue.component("form-variable", {
  data: function () {
    return {
      name: "x",
      value: 1
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.formData = this.initData.formData
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  methods: {
    //form specific
    finishForm: function () {
      this.$parent.finishForm({
        name: this.name,
        value: this.value
      })
    }
  },
  template: `<form onsubmit="return false">
  <label>Name:</label>
  <input type="text" v-model="name"></input><br>
  <label>value:</label>
  <input type="number" v-model="value"></input><br>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})