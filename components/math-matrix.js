Vue.component("math-matrix", {
  props: {
    initEntries: Array,
    initPosition: Array,
    needsUpdate: Boolean
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      position: [0,0],
      styleObj: {
        position: 'absolute',
        left: `0px`,
        top: `0px`,
      }
    }
  },
  created: function () {
    if (this.initEntries) {
      this.entries = this.initEntries 
    }
    if (this.initPosition) {
      this.position = this.initPosition
      this.styleObj.left = `${this.initPosition[0]}px`
      this.styleObj.top   = `${this.initPosition[1]}px`
    }
  },
  methods: {
    newEntry: function (row, col, value) {
      try {
        this.entries[row][col] = value
      } catch (error) {
        console.log(error);
      }
    },
    getInputForEntry: function (event) {
      //console.log(event);
      let currentNumber = event.target.innerText
      let newNumber = prompt("Change the number?", currentNumber)
      if (currentNumber != newNumber) {
        let row = parseInt(event.target.attributes["row"].value)
        let col = parseInt(event.target.attributes["col"].value)
        console.log("Row and Col clicked");
        console.log([row, col]);
        this.newEntry(row, col, parseFloat(newNumber))
        this.needsUpdate = true
      }
    }
  },
  template: `<table v-bind:style="styleObj"
  v-if>
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row" 
    v-bind:row="i"
    v-bind:col="j"
    v-on:click.stop="getInputForEntry">{{ entries[i][j] }}</td>
  </tr>
</table>`,
})