Vue.component("math-matrix", {
  props: {
    initEntries: Array,
    initPosition: Array,
    selected: Boolean
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      dragOffsetX: 0,
      dragOffsetY: 0,
      styleObj: {
        position: 'absolute',
        left: `0px`,
        top: `0px`,
      }
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
      // select the matrix before getting input from user
      this.$emit('selectObj')
      let currentNumber = event.target.innerText
      let newNumber = prompt("Change the number?", currentNumber)
      if (newNumber && currentNumber != newNumber) {
        let row = parseInt(event.target.attributes["row"].value)
        let col = parseInt(event.target.attributes["col"].value)
        
        this.newEntry(row, col, newNumber)
      }
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      this.styleObj.left = `${event.x - this.dragOffsetX}px`
      this.styleObj.top   = `${event.y - this.dragOffsetY}px`
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
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
  template: `<table draggable="true" 
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-bind:style="styleObj"
  v-bind:class=classObj>
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row" 
    v-bind:row="i"
    v-bind:col="j"
    v-on:click="getInputForEntry">{{ entries[i][j] }}</td>
  </tr>
</table>`,
})