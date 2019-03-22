Vue.component("form-table", {
  props: {
    initData: Object,
  },
  data: function () {
    return {
      importData: false,
      importedData: "",
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
      console.log(this.initData);
      this.outputFuncCount = this.initData.outputHeaders.length
      this.outputHeaders = this.initData.outputHeaders
    }
  },
  methods: {
    recomputeTables: function () {
      
    },
    finishForm: function () {
      this.recomputeTables()
      this.$parent.finishForm({
        inputHeaders: this.inputNames,
        inputTable: this.inputRanges,
        outputHeaders: this.outputNames,
        outputTable: this.outputValues,
      })
    }
  },
  template: `<form onsubmit="return false">
  <span><b>Inputs:</b></span><br>
  <label>import csv</label>
  <input type="checkbox" v-model="importData"></input><br>
  <template v-if="importData">
    <i>paste csv into textbox</i><br>
    <textarea v-model="importedData"></textarea><br>
  </template>
  <template v-if="!importData">
    <label>How many input variables would you like:</label>
    <input type="number" v-model="inputVarCount"></input><br>
    <label>How many rows:</label>
    <input type="number" v-model="rowCount"></input><br>
  </template>
  <span><b>Outputs:</b></span><br>
  <label>How many output functions would you like:</label>
    <input type="number" v-model="outputFuncCount"></input><br>
    
    <label>Name the variables:</label><br>
    <template v-for="(item, index) in outputNames">
      <input type="text" v-model="outputNames[index]" v-bind:key="index"></input><br>
    </template>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})