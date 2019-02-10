// Global Scripts
// mathjs - http://mathjs.org/
// plotly - https://plot.ly/javascript/

// possibles
// mathjax - for making it look pretty
// http://docs.mathjax.org/en/latest/advanced/typeset.html
// http://mathquill.com/ - for typing maths into the browser (requires JQuery)

// global varibles
// Have a look at whats in the html file and then in the data folder.
// This variable will be moved later

// functions
function sayHi(name) {
  console.log(`Hey ${name}`);
}

const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: {
    name: 'The Matrix',
    
    nextID: 0, // The next ID to be used if there are no freeobjectIDs left
    freeObjectID: [], // if an object is ever removed. its id is added here
    selectedObj: '', // The id of the currently selected object
    initObjects: [], // An array of objects which describe initialized objects

    // Style and misc data
    showContextMenu: false,
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
    let x = 0
    for (let i = 0; i < DATA_objects.length; i++) {
      this.createObj(DATA_objects[i])
      x += 1
    }
    this.nextID = x + 1
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
    getObjectByID: function (id) {
      for (let i = 0; i < this.initObjects.length; i++) {
        if (this.initObjects[i].id == id) {
          return [this.initObjects[i], i]
        }
      }
    },
    getVueObjectbyID: function (id) {
      for (let i = 0; i < this.$children.length; i++) {
        if (this.$children[i].$attrs.id == id) {
          return this.$children[i]
        }
      }
    },
    getAllObjectsOfType: function (type) {
      let x = []
      for (let i = 0; i < this.initObjects.length; i++) {
        if (this.initObjects[i].type == type) {
          x.push(this.initObjects[i])
        }
      }
      return x
    },
    getFunctionString: function (symbol) {
      //console.log(symbol);
      // the idea here is to match the symbol to a function and return the function string
      let x = this.getAllObjectsOfType('math-function')
      for (let i = 0; i < x.length; i++) {
        if (x[i].data.name == symbol) {
          return x[i].data.expression
        }
      }
    },
    evaluteTableWithID: function (id) {
      // we assume that a table is already selected in order to get to this piece of code
      let vueObj = this.getVueObjectbyID(id)
      if (vueObj) {
        //console.log(vueObj);
        vueObj.evaluateAllRows()
      }
      this.showContextMenu = false
    },
    createObj: function (options) {
      //console.log("creating an object");
      //console.log(options);
      switch (options.type) {
        case 'math-matrix':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            entries: options.entries
          })
          break;
        }
        case 'math-function':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            result: options.result,
            variables: options.variables,
            name: options.name,
            expression: options.expression
          })
          break;
        }
        case 'math-variable':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            name: options.name || 'x',
            valueType: options.valueType || 'number',
            value: options.value || 0
          })
          break;
        }
        case 'base-text':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            width: options.width,
            height: options.height,
            value: options.value || ''
          })
          break;
        }
        case 'math-table':
        {
          this.initObjects.push({
            id: options.id || this.getNewObjectID(),
            type: options.type,
            position: options.position,
            inputHeaders: options.inputHeaders || ['x'],
            inputTable: options.inputTable || [[1],[2],[3],[4],[5]],
            outputHeaders: options.outputHeaders || ['?'],
            outputTable: options.outputTable || [['?'], ['?'], ['?'], ['?'], ['?']]
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
      let obj = prompt("What would you like to create? Type one of the following...\nmatrix\nfunction\nvariable\ntext\ntable", '')
      
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
            data: {
              position:[`${event.x}px`, `${event.y}px`],
              entries: defaultEntries
            }
          })
          break;
        }
        case 'function':
        {
          this.createObj({
            type: 'math-function',
            data: {
              position:[`${event.x}px`, `${event.y}px`]
            }
          })
          break;
        }
        case 'variable':
        {
          this.createObj({
            type: 'math-variable',
            data: {
              position:[`${event.x}px`, `${event.y}px`]
            }
          })
          break;
        }
        case 'text':
        {
          this.createObj({
            type: 'base-text',
            data: {
              position:[`${event.x}px`, `${event.y}px`]
            }
          })
          break;
        }
        case 'table':
        {
          this.createObj({
            type: 'math-table',
            data: {
              position:[`${event.x}px`, `${event.y}px`]
            }
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
      this.showContextMenu = false
    },
    deleteCurrentObj: function () {
      // We can assume that selectedObj has the obj id we want to delete
      // Also the while loop was just the first way I thought of doing it.
      // Using a for loop is also an option.
      //console.log("delete function");
      let newObjs = []
      while (this.initObjects.length > 0) {
        let x = this.initObjects.pop()
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
      this.initObjects = newObjs
      // and we must close the context menu once the operation finishes
      this.showContextMenu = false
    },
    deleteObjByID: function (id) {
      let x = this.getObjectByID(id)
      //this.initObjects.splice()
      console.log(x);

      // TODO: redo this code block --------
      let newObjs = []
      while (this.initObjects.length > 0) {
        x = this.initObjects.pop()
        if (x.id != id) {
          newObjs.push(x)
        } else {
          // because we've found the obj that we want to del
          // we must add its index to free indices.
          // this is so we can guarantee that all object ids are unquie
          this.freeObjectID.push(x.id)
        }
      }
      this.initObjects = newObjs
      // ----------------------------

      // and we must close the context menu once the operation finishes
      this.showContextMenu = false
    },
    deleteAllObjects: function () {
      // if all initObjects are being deleted we can reset the unique ids
      this.initObjects.splice(0, this.initObjects.length, [])
      this.nextID = 0
      this.freeObjectID = []
    },
    selectObj: function (id) {
      // if we just selected an obj, make sure we close the context menu
      this.showContextMenu = false
      //console.log("select obj function called");
      //console.log(id);
      this.selectedObj = id
    },
    onClick: function () {
      this.selectObj('')
      this.showContextMenu = false
    },
    onRightClick: function (event) {
      this.selectObj('')
      //console.log(event);
      this.contextMenuStyle.left = `${event.layerX}px`
      this.contextMenuStyle.top = `${event.layerY}px`
      this.showContextMenu = true
    },
    updateData: function (id, key, value) {
      //console.log("Update function called.");
      let obj = this.getObjectByID(id)
      if (obj) {
        // the second item in the array is the index of the object
        this.initObjects[obj[1]].data[key] = value
        /*if (Array.isArray(this.initObjects[obj[1]].data[key])) {
          console.log('there was an array updated');
        }*/
        // Lots of initObjects called the updateData method
        // so we need to be specific about what flow on effects might happen
        //console.log(obj);
        if (obj[0].type == "math-function") {
          this.updateTablesWithSymbol(obj[0].data.name)
        }
      } else {
        console.warn(`Did not find the following pair to update: (id:${id}, key:${key}) trying to update it with:`);
        console.warn(value);
      }
    },
    updateTablesWithSymbol: function (symbol) {
      //console.log(`updating tables with: ${symbol}`);
      let tables = this.getAllObjectsOfType("math-table")
      for (let i = 0; i < tables.length; i++) {
        // first does the table have the symbol
        if (tables[i].data.outputHeaders.includes(symbol)) {
          //console.log("Yes we found our symbol");
          // the need the vue object
          let vueObj = this.getVueObjectbyID(tables[i].id)
          if (vueObj) {
            // if we did find it then we can call evaluate
            vueObj.evaluateAllRows()
          }
        }
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
      let output = []
      for (let i = 0; i < this.$children.length; i++) {
        let x = this.$children[i].toObject()
        output.push(x)
      }
      return JSON.stringify(output)
    },
    onLoad: function () {
      this.showContextMenu = false
      let x = prompt("what would you like to load in? Type on of the following:\nscene\nobject")
      let y = prompt("paste all of the JSON data here:")
      switch (x) {
        case 'scene':
          {
            try {
              let z = JSON.parse(y)
              this.deleteAllObjects()
              for (let i = 0; i < z.length; i++) {
                this.createObj(z[i]);
              }
            } catch (error) {
              console.log("couldn't manage to parse the data because:");
              console.log(error);
            }
          }
          break;
        case 'object':
          {
            console.log('WIP');
          }
          break;
        default:
          console.log("Sorry, wasn't sure what you wanted to load in.");
          break;
      }
    },
    saveObjects: function () {
      console.log(`Copy the following into the Load function:\n${this.toJSON()}`)
      this.showContextMenu = false
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self.prevent="selectObj('')"
v-on:contextmenu.self.prevent="onRightClick"
v-bind:style="styleObj">
  <component v-for="(obj, key) in initObjects"
  v-bind:key="obj.id"
  v-bind:id="obj.id"
  v-bind:initData="obj"
  v-bind:is="obj.type"
  v-bind:selected="obj.id === selectedObj">
  </component>
  <ol v-on:contextmenu.prevent="onRightClick"
  v-show="showContextMenu && selectedObj == ''"
  v-bind:style="contextMenuStyle"
  v-bind:class="{menu: true}">
    <li v-on:click="onLoad" v-bind:class="{menu: true}">Load</li>
    <li v-on:click="saveObjects" v-bind:class="{menu: true}">Save</li>
    <li v-on:click="userCreateObj" v-bind:class="{menu: true}">Create</li>
  </ol>
</div>`
})
