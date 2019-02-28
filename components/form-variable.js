Vue.component("form-variable", {
  data: function () {
    return {
      name: "f",
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
  },
  template: `<form onsubmit="return false">
  <label for="name">What would you like to name your function?</label>
  <input type="text" v-model="name"></input>
</form>`,
})