Vue.component("math-matrix", {
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      position: ['0px', '0px'],
      dragOffsetX: 0,
      dragOffsetY: 0
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.entries.splice(0, this.entries.length, this.initData.entries)
      this.position.splice(0, 2, this.initData.position)
    }
  },
  methods: {
    newEntry: function (row, col, value) {
      try {
        let newRow = this.entries[row]
        newRow[col] = value
        this.entries.splice(row, 1, newRow)
        // Only works if root has this function
        this.$root.updateData(this.$attrs.id, 'entries', this.entries)
      } catch (error) {
        console.log('New entry error:');
        console.log(error);
      }
    },
    getInputForEntry: function (event) {
      //console.log(event);
      // select the matrix before getting input from user
      if (this.selected) {
        this.onClick(event)
        let currentNumber = event.target.innerText
        let newNumber = prompt("Change the number?", currentNumber)
        if (newNumber && currentNumber != newNumber) {
          let row = parseInt(event.target.attributes["row"].value)
          let col = parseInt(event.target.attributes["col"].value)
          
          this.newEntry(row, col, newNumber)
        } 
      } else {
        this.onClick(event)
      }
    },
    toObject: function () {
      return {
        "entries": this.entries,
        "position": this.position
      }
    },
    onDragEnd: function (event) {
      //console.log("onDragEnd function says...");
      //console.log(event);
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      // its possible to get here and for this object to be deleted first.
      this.position.splice(0, 2, [`${x}px`, `${y}px`])
    },
    onDragStart: function (event) {
      //console.log("onDragStart function says...");
      //console.log(event);
      this.onClick()
      this.dragOffsetX = event.offsetX
      this.dragOffsetY = event.offsetY
    },
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      this.$root.onContextMenu(event, 'matrix')
    }
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-bind:class="{ matrix: true, selected: selected}"
v-bind:style="{ position: 'absolute', left: position[0], top: position[1]}"
v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick($event)">{{entries}}
</div>`,
})

/*
<tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row" 
    v-bind:row="i"
    v-bind:col="j"
    v-on:click="getInputForEntry">{{ entries[i][j] }}</td>
  </tr>
*/