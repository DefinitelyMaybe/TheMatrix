// Global Scripts
// mathjs - http://mathjs.org/
// plotly - https://plot.ly/javascript/

// possibles
// mathjax - for making it look pretty
// http://docs.mathjax.org/en/latest/advanced/typeset.html

// global varibles
// Have a look at whats in the html file and then in the data folder.
// This variable will be moved later

// functions
function define(obj) {
  console.log(obj);
  // Here we're going to let the parser know about a new thing we've defined
  // i.e. have a scope object for the page
}

const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: {
    name: 'The Matrix',
    
    showContext: false,
    contextType: 'main',
    
    // The next ID to be used if there are no freeobjectIDs left
    nextID: 0,
    // if an object is ever removed. its id is added here
    freeObjectID: [],
    // The id of the currently selected object
    selectedObj: null,
    // An array of objects which describe the scene
    objects: DATA_objects,
    styleObj: {
      width: '100%',
      height: '100%'
    },
    contextMenuStyle: {
      position: 'absolute',
      left: '0px',
      top: '0px'
    },
  },
  created: function () {
    // for the moment we're going to manually bring our scene ids up to speed with the loaded scene
    this.nextID = 9
  },
  methods: {
    getNewObjectID: function () {
      let id = this.freeObjectID.pop()
      if (id == undefined) {
        id = this.nextID
        this.nextID += 1
      }
      return id.toString()
    },
    getCurrentObjData: function () {
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].id == this.selectedObj) {
          return this.objects[i]
        }
      }
    },
    getObjectByID: function (id) {
      for (let i = 0; i < this.objects.length; i++) {
        if (this.objects[i].id == id) {
          return [this.objects[i], i]
        }
      }
    },
    createObj: function (options) {
      //console.log("creating an object");
      //console.log(options);
      switch (options.type) {
        case 'math-matrix':
        {
          this.objects.push({
            id: this.getNewObjectID(),
            type: options.type,
            data: {
              position: options.position,
              entries: options.entries
            }
          })
          break;
        }
        case 'math-function':
        {
          this.objects.push({
            id: this.getNewObjectID(),
            type: options.type,
            data: {
              position: options.position,
              expressionTree: options.expressionTree || []
            }
          })
          break;
        }
        case 'math-variable':
        {
          this.objects.push({
            id: this.getNewObjectID(),
            type: options.type,
            data: {
              position: options.position,
              name: options.name || 'x',
              type: options.valueType || 'number',
              value: options.value || 0
            }
          })
          break;
        }
        default:
          console.warn("The default creation case hasn't created anything with:");
          console.log(options);
          break;
      }
    },
    userCreateObj: function (event) {
      let obj = prompt("What would you like to create? Type one of the following...\nmatrix\nfunction\nvariable", '')
      
      switch (obj) {
        case 'matrix':
        {
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
          this.createObj({
            type: 'math-matrix',
            position:[`${event.x}px`, `${event.y}px`],
            entries: defaultEntries
          })
          break;
        }
        case 'function':
        {
          this.createObj({
            type: 'math-function',
            position:[`${event.x}px`, `${event.y}px`],
            expressionTree: []
          })
          break;
        }
        case 'variable':
        {
          this.createObj({
            type: 'math-variable',
            position:[`${event.x}px`, `${event.y}px`],
            name: 'x',
            valueType: 'number',
            value: 0
          })
          break;
        }
        default:
        {
          // default is to say that what the user entered wasn't an object that can be created
          alert("Sorry, not sure what you were wanting to create.")
          break
        }
      }
      // we're assuming the function was called from a context menu
      this.showContext = false
    },
    deleteCurrentObj: function () {
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
          this.freeObjectID.push(x.id)
        }
      }
      this.objects = newObjs
      this.objects.slice()
      // and we must close the context menu once the operation finishes
      this.showContext = false
    },
    deleteObjByID: function (id) {
      let newObjs = []
      while (this.objects.length > 0) {
        let x = this.objects.pop()
        if (x.id != id) {
          newObjs.push(x)
        } else {
          // because we've found the obj that we want to del
          // we must add its index to free indices.
          // this is so we can guarantee that all object ids are unquie
          this.freeObjectID.push(x.id)
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
      this.selectedObj = id
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
      //console.log("Update function called.");
      let obj = this.getObjectByID(id)
      if (obj) {
        // the second item in the array is the index of the object
        this.objects[obj[1]].data[key] = value
        if (Array.isArray(this.objects[obj[1]].data[key])) {
          console.log('there was an array updated');
        }
      } else {
        console.log(`Did not find the following pair to update: (id:${id}, key:${key}) trying to update it with:`);
        console.log(value);
      }
    },
    dropData: function (id, updateObj) {
      //console.log("dropData called.");
      //console.log(id, updateObj);
      // creating the new one first so it has a different ID
      this.createObj(updateObj)

      this.deleteCurrentObj()
      this.selectedObj = null

      // first update the object that was just dropped on
      this.deleteObjByID(id)
    },
    toJSON: function () {
      return JSON.stringify(this.$data)
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
    },
    LoadObject: function () {
      let x = prompt("what would you like to load in?\ntype on of the following:\nscene\nobject")
      switch (x) {
        case 'scene':
          {
            let y = prompt("paste all of the JSON data here:")
            try {
              y = JSON.parse(y)
              loadMainData(y)
            } catch (error) {
              console.log("couldn't manage to parse the data, are you sure it was json formatted?");
              console.log(error);
            }
          }
          break;
        case 'object':
          {
            
          }
          break;
        default:
          
          break;
      }
    },
    saveObjects: function () {
      alert(`Copy the following into the Load function:\n${this.toJSON()}`)
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self="selectObj($event, null)"
v-on:contextmenu.self.prevent="onContextMenu($event, 'main')"
v-bind:style="styleObj">
  <component v-for="(obj, key) in objects"
  v-bind:key="obj.id"
  v-bind:id="obj.id"
  v-bind:initData="obj.data"
  v-bind:is="obj.type"
  v-bind:selected="obj.id === selectedObj"
  v-bind:style="{ position: 'absolute', left: obj.data.position[0], top: obj.data.position[1]}">
  </component>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'main'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="LoadObject" v-bind:class="{menu: true}">Load</li>
    <li v-on:click="saveObjects" v-bind:class="{menu: true}">Save</li>
    <li v-on:click="userCreateObj" v-bind:class="{menu: true}">Create</li>
  </ol>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'matrix'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteCurrentObj" v-bind:class="{menu: true}">Delete</li>
    <li v-bind:class="{menu: false}">-----</li>
    <li v-bind:class="{menu: true}">Add</li>
    <li v-bind:class="{menu: true}">Subtract</li>
    <li v-bind:class="{menu: true}">Multiply</li>
  </ol>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'variable'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteCurrentObj" v-bind:class="{menu: true}">Delete</li>
  </ol>
  <ol v-on:contextmenu.prevent="0"
  v-bind:class="{menu: true}"
  v-show="showContext && contextType == 'function'"
  v-bind:style="contextMenuStyle">
    <li v-on:click="deleteCurrentObj" v-bind:class="{menu: true}">Delete</li>
  </ol>
</div>`
})

window.onload = function () {
  //console.log(TheMatrix);
  /*let f = math.parse('2x^2+x')
  console.log(f)
  let g = math.compile('2x^2+x')
  console.log(g);
  let x = g.eval({x:2})
  console.log(x);

  console.log("-------------");
  console.log(JSON.stringify(f)); // can stringify an expression tree
  console.log(JSON.stringify(g)); // cannot stringify a function

  console.log("-------------");
  console.log(JSON.parse('{"mathjs":"OperatorNode","op":"+","fn":"add","args":[{"mathjs":"OperatorNode","op":"*","fn":"multiply","args":[{"mathjs":"ConstantNode","value":2},{"mathjs":"OperatorNode","op":"^","fn":"pow","args":[{"mathjs":"SymbolNode","name":"x"},{"mathjs":"ConstantNode","value":2}],"implicit":false}],"implicit":true},{"mathjs":"SymbolNode","name":"x"}],"implicit":false}', math.json.reviver));
  // bringing an expression tree back in is easy

  console.log("-------------");
  let h = f._compile(math) // expression trees must be compiled using the math library
  console.log(h({x:2})) // before they can be called with a scope obj

  console.log("-------------");
  // question can we define a variable == anotherVaraible
  let parser = math.parser()
  parser.set('x', 3)
  console.log(parser);
  console.log(parser.eval("x+2"));*/
}

// Got a library library from the internet.
// console.log(math);
// vs
// console.log(Math);
// i.e.
//let x = math.matrix([[1,0],[0,1]])
