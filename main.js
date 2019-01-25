const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: {
    name: 'The Matrix',
    selectedObj: null,
    showContext: false,
    contextType: 'main',
    contextMenuStyle: {
      position: 'absolute',
      left: '0px',
      top: '0px'
    },
    // An array of objects which describe the scene
    freeObjectIndices: [], // if a matrix is ever removed. add its number here
    objects: DATA_objects,
    styleObj: {
      width: '100%',
      height: '100%'
    }
  },
  methods: {
    createObj: function (event) {
      let obj = prompt("What would you like to create?\nmatrix\n...", '')
      switch (obj) {
        case 'matrix':
          let index = this.objects.length
          if (this.freeObjectIndices.length > 0) {
            index = this.objects.length
          }
          let rows = prompt("how many rows?", "1")
          let cols = prompt("how many columns?", "1")

          try {
            rows = parseInt(rows)
            cols = parseInt(cols)
          } catch (error) {
            alert("sorry, not sure how many rows and columns you wanted. default values are going to be used.")
            rows = 1
            cols = 1
          }

          let defaultEntries = []
          for (let i = 0; i < rows; i++) {
            let row = []
            for (let j = 0; j < cols; j++) {
              row.push(0)
            }
            defaultEntries.push(row)
          }

          this.objects.push({
            id: index.toString(),
            type: 'math-matrix',
            data: {
              position: [event.x, event.y],
              entries: defaultEntries
            }
            
          })
          break;
        default:
          // default is to say that what the user entered wasn't an object that can be created
          alert("Sorry, not sure what you were wanting to create.")
          break;
      }
      // we're assuming the function was called from a context menu
      this.showContext = false
    },
    deleteObj: function (event) {
      // We can assume that selectedObj has the obj id we want to delete
      // Also the while loop was just the first way I thought of doing it.
      // Using a for loop is also an option.
      //console.log("delete function");
      let newObjs = []
      while (this.objects.length > 0) {
        let x = this.objects.pop()
        if (x.id != this.selectedObj) {
          newObjs.push(x)
        } else {
          // because we've found the obj that we want to del
          // we must add its index to free indices.
          // this is so we can guarantee that all object ids are unquie
          //console.log(x.id);
          this.freeObjectIndices.push(x.id)
        }
      }
      this.objects = newObjs
      this.objects.slice()
      // and we must close the context menu once the operation finishes
      this.showContext = false
    },
    selectObj: function (event, id) {
      // if we just selected an obj, make sure we close the context menu
      this.showContext = false
      //console.log("select obj function called");
      //console.log(id);
      let oldObj = this.selectedObj
      this.selectedObj = id
      for (let i = 0; i < this.$children.length; i++) {
        const child = this.$children[i];
        if (child.$attrs.id === oldObj) {
          //child.selected = false
        }
        if (child.$attrs.id === id) {
          //child.selected = true
          this.selectedObj = id
        } 
      }
    },
    onContextMenu: function (event, type) {
      //console.log("onContextMenu change");
      this.showContext = true
      this.contextType = type
      this.contextMenuStyle.left = `${event.x}px`
      this.contextMenuStyle.top = `${event.y}px`
      if (this.contextType === 'main') {
        // we right clicked someonewhere else so we need to make sure a selected object is de-selected
        this.selectObj(event, '')
        // because at the moment, selecting an obj hides the context, we need to turn it back on
        this.showContext = true
      }
    },
    updateData: function (id, key, value) {
      let found = false
      // first look for id
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].id === id) {
          found = true
          // then for the key
          // then update the value
          this.objects[i][key] = value
        }
      }
      if (!found) {
        console.log(`Did not find the following pair to update: (id:${id}, key:${key}) trying to update it with:`);
        console.log(value);
      }
    },
    toJSON: function () {
      return JSON.stringify(this.$data)
    },
    getUserInputForMainData: function () {
      let x = prompt("paste all of the JSON data here:")
      try {
        x = JSON.parse(x)
      } catch (error) {
        console.log("couldn't manage to parse the data, are you sure it was json formatted?");
        console.log(error);
      }
      if (x) {
        console.log(x);
        //this.$data = x
      }
    },
    loadMainData: function (data) {
      // question replace all of main data
      // or just load the objects/objects?
      // For now, just load the objects
      // Expects a JSON string
      let x = JSON.parse(data)
      if (x.objects) {
        console.log("the input objects:", x.objects);
        console.log("the current objects:", this.objects);
        this.objects = []
        for (let i = 0; i < x.objects.length; i++) {
          this.objects.push(x.objects[i]);
        }
        console.log("the current objects:", this.objects);
      } else {
        console.log("there were no objects");
      }
      return "Something may have happened"
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self="selectObj($event, 'none')"
v-on:contextmenu.self.prevent="onContextMenu($event, 'main')"
v-bind:style="styleObj">
<scene-object v-for="(obj, key) in objects"
  v-bind:key="obj.id"
  v-bind:id="obj.id"
  v-bind:data="obj.data"
  v-bind:type="obj.type"
  v-bind:selected="obj.id === selectedObj">
  </scene-object>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'main'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteObj" v-bind:class="{menu: true}">Load</li>
    <li v-on:click="createObj" v-bind:class="{menu: true}">Create</li>
  </ol>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'matrix'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteObj" v-bind:class="{menu: true}">Delete</li>
    <li v-bind:class="{menu: false}">-----</li>
    <li v-on:click="deleteObj" v-bind:class="{menu: true}">Add</li>
    <li v-on:click="deleteObj" v-bind:class="{menu: true}">Subtract</li>
    <li v-on:click="deleteObj" v-bind:class="{menu: true}">Multiply</li>
  </ol>
</div>`
})

window.onload = function () {
  //console.log(TheMatrix);
}

// Got a library library from the internet.
// console.log(math);
// vs
// console.log(Math);
// i.e.
//let x = math.matrix([[1,0],[0,1]])
