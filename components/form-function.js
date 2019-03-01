Vue.component("form-function", {
  data: function () {
    return {
      name: "f",
      initWithFunction: false,
      writeOutFunction: false,
      latexInitFunction: false
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
  <label>What would you like to name your function?</label>
  <input type="text" v-model="name"></input>
  <label>Would you like to name your function?</label>
  <input type="checkbox" v-model="initWithFunction"></input>
  <template v-if="initWithFunction">
    <label>Would you like to write it yourself or paste in some latex?</label>
    <label>Write it out.</label><input type="checkbox" v-model="writeOutFunction"></input>
    <label>Paste in latex.</label><input type="checkbox" v-model="latexInitFunction"></input>
  </template>
</form>`,
})