Vue.component("form-table", {
  data: function () {
    return {
      inputVarCount: 1,
      inputNames: ["x"],
      outputFuncCount: 1,
      outputNames: ["f"],

      rowCount: 5,
      varStep: [1],
      inputRanges: [[1], [2], [3], [4], [5]],
      outputValues: [["?"], ["?"], ["?"], ["?"], ["?"]],
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
        inputHeaders: this.inputNames,
        inputTable: this.inputRanges,
        outputHeaders: this.outputNames,
        outputTable: this.outputValues,
      })
    }
  },
  template: `<form onsubmit="return false">
  <label>How many input variables would you like:</label>
  <input type="number" v-model="inputVarCount"></input><br>
  <label>How many output functions would you like:</label>
  <input type="number" v-model="outputFuncCount"></input><br>
  
  <label>Name the variables:</label><br>
  <template v-for="index in inputNames">
    <input type="text" v-model="inputNames[index]" v-bind:key="index"></input><br>
  </template>
  <label>How many rows:</label>
  <input type="number" v-model="rowCount"></input><br>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})