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
  // An array of objects which describe all the matrices
  matrixIDs: [], // if a matrix is ever removed. add its number here
  matrices: [
    {
      id: "matrix-0",
      position: [100, 100],
      entries: [[1,2,3],[4,5,6],[7,8,9]]
    },
    {
      id : "matrix-1",
      position: [50, 50],
      entries: [[1,1,1],[1,1,1],[1,1,1]]
    },
    {
      id : "matrix-2",
      entries: [[3,4],[2,1]]
    },
    {
      id : "matrix-3",
      position: [400, 400],
    }
  ],
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
    getMainData: function () {
      let x = JSON.stringify(this.$data)
      //console.log(x)
      return x
    },
    loadMainData: function (data) {
      // question replace all of main data
      // or just load the objects/matrices?
      // For now, just load the matrices
      // Expects a JSON string
      let x = JSON.parse(data)
      if (x.matrices) {
        console.log(x.matrices);
        this.matrices = []
        for (let i = 0; i < x.matrices.length; i++) {
          this.matrices.push(x.matrices[i]);
        }
      } else {
        console.log("there were no matrices");
      }
    }
  },
  template: `<div ondragover="event.preventDefault()"
v-on:click.self="createObj($event, 'matrix')"
v-on:contextmenu.self.prevent="onContextMenu($event, 'main')"
v-bind:style="styleObj">
  <math-matrix v-for="(matrix, index) in matrices"
  v-bind:key="index"
  v-bind:id="matrix.id"
  v-bind:initEntries="matrix.entries"
  v-bind:initPosition="matrix.position"
  v-bind:selected="matrix.id === selectedObj">
  </math-matrix>
  <div v-show="showContext" v-bind:style="contextMenuStyle">
    <ul id="operationsMenu" v-show="contextType === 'main'">
      <p>main - hello</p>
      <p>test</p>
      <p>hello</p>
    </ul>
    <ul id="operationsMenu" v-show="contextType === 'matrix'">
      <p>matrix - world</p>
      <p>test</p>
      <p>hello</p>
    </ul>
  </div>
</div>`
})
/*

  created() {
    for (let i = 0; i < this.matrices.length; i++) {
      this.$createElement(mathMatrix, this.matrices[i])
    }
  },
*/
//console.log(TheMatrix);
//console.log(TheMatrix.$refs);

window.onload = function () {
  //console.log(TheMatrix);

}
