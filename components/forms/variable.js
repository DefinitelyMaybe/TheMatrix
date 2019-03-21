Vue.component("form-variable", {
  props: {
    initData: Object
  },
  data: function () {
    return {
      name: "x",
      value: 1
    }
  },
  created: function () {
    if (this.initData) {
      this.name = this.initData.name
      this.value = this.initData.value
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