// Got a library library from the internet.
// console.log(math);

//let x = math.matrix([[1,0],[0,1]])

mainData = {
  name: 'hello world',
  selectedObj: null,
  showContext: false,
  contextType: 'main',
  contextMenuStyle: {
    position: 'absolute',
    left: '0px',
    top: '0px'
  },
  contextMenus: DATA_contextmenus,
  // An array of objects which describe all the matrices
  matrixIDs: [], // if a matrix is ever removed. add its number here
  matrices: DATA_matrices,
  styleObj: {
    width: '100%',
    height: '100%'
  }
}

const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: mainData,
  methods: {
    createObj: function (event, obj) {
      console.log(`trying to create a ${obj}`);
      // First check if 
      switch (obj) {
        case 'matrix':
          mainData.matrices.push({
            id:`matrix-${this.matrices.length}`,
            position: [event.x, event.y],
            entries: [[5,5,5],[4,4,4],[3,2,1]]
          })
          break;
        default:
          console.log("default case when creating obj.")
          break;
      }
    },
    selectObj: function (event, id) {
      // if we just selected an obj, make sure we close the context menu
      this.showContext = false
      //console.log("select obj function called");
      //console.log(this);
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
      for (let i = 0; i < this.matrices.length; i++) {
        if (this.matrices[i].id === id) {
          found = true
          // then for the key
          // then update the value
          this.matrices[i][key] = value
        }
      }
      if (!found) {
        console.log(`Did not find the following pair to update: (id:${id}, key${key}`);
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
      // or just load the objects/matrices?
      // For now, just load the matrices
      // Expects a JSON string
      let x = JSON.parse(data)
      if (x.matrices) {
        console.log("the input matrices:", x.matrices);
        console.log("the current matrices:", this.matrices);
        this.matrices = []
        for (let i = 0; i < x.matrices.length; i++) {
          this.matrices.push(x.matrices[i]);
        }
        console.log("the current matrices:", this.matrices);
      } else {
        console.log("there were no matrices");
      }
      return "Something may have happened"
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self="selectObj($event, 'none')"
v-on:contextmenu.self.prevent="onContextMenu($event, 'main')"
v-bind:style="styleObj">
  <math-matrix v-for="(matrix, index) in matrices"
  v-bind:key="index"
  v-bind:id="matrix.id"
  v-bind:initEntries="matrix.entries"
  v-bind:initPosition="matrix.position"
  v-bind:selected="matrix.id === selectedObj">
  </math-matrix>
  <ui-menu v-show="showContext" v-bind:style="contextMenuStyle">
    
  </ui-menu>
</div>`
})
/*
<ul id="operationsMenu" v-show="contextType === 'main'">
  <li>-load-</li>
  <li>json</li>
  <li>-create-</li>
  <li>matrix</li>
</ul>
<ul id="operationsMenu" v-show="contextType === 'matrix'">
  <li>-options-</li>
  <li>delete</li>
  <li>-operators-</li>
  <li>plus</li>
  <li>minus</li>
  <li>multiply</li>
</ul>
created() {
  for (let i = 0; i < this.matrices.length; i++) {
    this.$createElement(mathMatrix, this.matrices[i])
  }
},
*/
//console.log(TheMatrix);
//console.log(TheMatrix.$refs);
console.log(window);
window.onload = function () {
  //console.log(TheMatrix);

}
