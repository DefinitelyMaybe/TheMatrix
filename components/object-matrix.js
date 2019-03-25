Vue.component("object-matrix", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]]
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
        "type": 'object-matrix',
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
    }
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
  <component v-bind:is="'form-function'"
    v-bind:class="{CreateForm:true}"
    v-if="editing && selected"
    v-bind:initData="{name:name,latex:latex}"
    v-bind:style="contextMenuStyle"></component>
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