Vue.component("form-table", {
  props: {
    initData: Object,
  },
  data: function () {
    return {
      importData: false,
      importedData: "",

      inputCount: 1,
      inputHeaders: ["x"],
      outputCount: 1,
      outputHeaders: ["f"],

      rowCount: 5,
      colStep: [1],
      inputTable: [],
      outputTable: [],
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.outputCount = this.initData.outputHeaders.length
      this.outputHeaders = this.initData.outputHeaders
      this.inputCount = this.initData.inputHeaders.length
      this.inputHeaders = this.initData.inputHeaders

      this.rowCount = this.initData.inputTable.length
    }
  },
  methods: {
    recomputeTables: function () {
      // first
      let newTable = []
      let newTableHeader = []
      for (let col = 0; col < this.inputCount; col++) {
        // the following line may not be needed later on
        newTableHeader.push('x')
        // get the starting value
        let x = 1
        // get the step value
        let step = 1
        for (let row = 0; row < this.rowCount; row++) {
          // make sure the tables is setup for inserts
          if (col == 0) {
            newTable.push([])
          }
          newTable[row][col] = x
          x += step
        }
      }
      this.inputTable = newTable
      this.inputHeaders = newTableHeader
    },
    finishForm: function () {
      this.recomputeTables()
      this.$parent.finishForm({
        inputHeaders: this.inputHeaders,
        inputTable: this.inputTable,
        outputHeaders: this.outputHeaders,
        outputTable: this.outputTable,
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
    <input type="number" v-model="inputCount"></input><br>
    <label>How many rows:</label>
    <input type="number" v-model="rowCount"></input><br>
  </template>
  <span><b>Outputs:</b></span><br>
  <label>How many output functions would you like:</label>
    <input type="number" v-model="outputCount"></input><br>
    
    <label>Name the variables:</label><br>
    <template v-for="(item, index) in outputHeaders">
      <input type="text" v-model="outputHeaders[index]" v-bind:key="index"></input><br>
    </template>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})