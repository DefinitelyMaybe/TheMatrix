Vue.component("math-matrix", {
  mixins: [mixin_moveable],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],

      // styling and misc data
      showContextMenu: false,
      contextMenuStyle: {
        'position': 'absolute',
        'width': '175px',
        'left': '0px',
        'top': '0px'
      }
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.entries.splice(0, this.entries.length, this.initData.entries)
      this.styleObj.left = this.initData.position[0]
      this.styleObj.top = this.initData.position[1]
    }
  },
  methods: {
    save: function () {
      return {
        "entries": this.entries,
        "position": [this.styleObj.left, this.styleObj.top],
        "type": 'math-matrix',
        "id": this.$attrs.id
      }
    },
    deleteObject: function () {
      this.$root.deleteObjByID(this.$attrs.id)
    },
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

    // events
    onClick: function () {
      this.$root.selectObj(this.$attrs.id)
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.$root.selectObj(this.$attrs.id)
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    },
  },
  template: `<div draggable="true"
v-on:dragend="onDragEnd"
v-on:dragstart="onDragStart"
v-bind:class="{ matrix: true, selected: selected}"
v-bind:style="styleObj"

v-on:click.prevent="onClick"
v-on:contextmenu.prevent="onRightClick">
  <p>{{entries}}</p>
  <ol v-on:contextmenu.prevent="0"
    v-bind:class="{menu: true}"
    v-show="showContextMenu && selected"
    v-bind:style="contextMenuStyle">
    <li v-on:click="deleteObject" v-bind:class="{menu: true}">Edit</li>
    <li v-on:click="deleteObject" v-bind:class="{menu: true}">Delete</li>
  </ol>
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