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

      initValues: [0],
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
      this.inputTable = this.initData.inputTable

      this.initValues = this.initData.inputTable[0]
      this.rowCount = this.initData.inputTable.length
      try {
        for (let i = 0; i < this.inputHeaders.length; i++) {
          this.colStep.push(parseFloat(this.inputTable[1][i]) - parseFloat(this.inputTable[0][i]))
        }
      } catch (error) {
        console.error(error);
        this.colStep = []
        for (let i = 0; i < this.inputHeaders.length; i++) {
          this.colStep.push(1)
        }
      }
    }
  },
  methods: {
    recomputeTables: function () {
      // first
      let newTable = []
      let newTableHeader = []
      for (let col = 0; col < this.inputCount; col++) {
        // the following line may not be needed later on
        newTableHeader.push(this.inputHeaders[col])
        // get the starting value
        let x = parseFloat(this.initValues[col])
        // get the step value
        let step = this.colStep[col]
        for (let row = 0; row < this.rowCount; row++) {
          // make sure the tables is setup for inserts
          if (col == 0) {
            newTable.push([])
          }
          newTable[row][col] = math.format(x, {precision: 4})
          x += parseFloat(step)
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
    },
    addVariable: function () {
      this.inputHeaders.push('x')
      this.initValues.push(1)
      this.colStep.push(1)
      this.inputCount += 1
    },
    removeVariable: function () {
      if (this.inputHeaders.length >= 2) {
        this.inputHeaders.splice(-1, 1)
        this.initValues.splice(-1,1)
        this.colStep.splice(-1, 1)
        this.inputCount -= 1
      }
    },
    addFunction: function () {
      this.outputCount += 1
      this.outputHeaders.push('f')
    },
    removeFunction: function () {
      if (this.outputCount >= 2) {
        this.outputCount -= 1
        this.outputHeaders.splice(-1, 1)
      }
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
    <label>How many rows:</label>
    <input type="number" v-model="rowCount"></input><br>
    <button type="button" v-on:click="addVariable">Add</button><button type="button" v-on:click="removeVariable">Remove</button><br>
    <template v-for="(item, index) in inputHeaders">
      <label>Variable:</label>
      <input type="text" v-model="inputHeaders[index]"></input><br>
      <label>Start:</label>
      <input type="number" v-model="initValues[index]"></input><br>
      <label>Step:</label>
      <input type="number" v-model="colStep[index]"></input><br>
    </template>
  </template>
  <span><b>Outputs:</b></span><br>
  <button type="button" v-on:click="addFunction">Add</button><button type="button" v-on:click="removeFunction">Remove</button><br>
    
  <label>Name the variables:</label><br>
  <template v-for="(item, index) in outputHeaders">
    <input type="text" v-model="outputHeaders[index]"></input><br>
  </template>
  <button v-on:click="finishForm">Finish</button>
</form>`,
})