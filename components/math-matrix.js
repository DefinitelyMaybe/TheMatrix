Vue.component("math-matrix", {
  props: {
    initEntries: Array,
    initPosition: Array
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      x: 0,
      y: 0,
      dragOffsetX: 0,
      dragOffsetY: 0,
      styleObj: {
        position: 'absolute',
        left: `0px`,
        top: `0px`,
      },
      selected: false,
    }
  },
  created: function () {
    if (this.initEntries) {
      this.entries = this.initEntries.slice()
    }
    if (this.initPosition) {
      this.styleObj.left = `${this.initPosition[0]}px`
      this.styleObj.top   = `${this.initPosition[1]}px`
    }
  },
  methods: {
    newEntry: function (row, col, value) {
      try {
        let newRow = this.entries[row]
        newRow[col] = value
        this.entries.splice(row, 1, newRow)
      } catch (error) {
        console.log(error);
      }
    },
    getInputForEntry: function (event) {
      //console.log(event);
      let currentNumber = event.target.innerText
      let newNumber = prompt("Change the number?", currentNumber)
      if (newNumber && currentNumber != newNumber) {
        let row = parseInt(event.target.attributes["row"].value)
        let col = parseInt(event.target.attributes["col"].value)
        
        this.newEntry(row, col, newNumber)
      }
    },
    onDragStart: function (event) {
      console.log("matrix.js");
      console.log(event);
    }
  },
  computed: {
    classObj: function () {
      return {
        matrix: true,
        selected: this.selected
      }
    }
  },
  template: `<table draggable="true" v-on:ondragstart="onDragStart"
  v-bind:style="styleObj"
  v-bind:class=classObj>
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row" 
    v-bind:row="i"
    v-bind:col="j"
    v-on:click.stop="getInputForEntry">{{ entries[i][j] }}</td>
  </tr>
</table>`,
})