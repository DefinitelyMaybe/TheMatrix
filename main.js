// Got a library library from the internet.
// console.log(math);

//let x = math.matrix([[1,0],[0,1]])

mainData = {
  message: 'hello world',
  // An array of objects which describe all the matrices
  matrices: [
    {
      id: "test1",
      position: [100, 100],
      entries: [[1,2,3],[4,5,6],[7,8,9]]
    },
    {
      id : "test2",
      position: [50, 50],
      entries: [[1,1,1],[1,1,1],[1,1,1]]
    },
    {
      id : "test3",
      entries: [[3,4],[2,1]]
    },
    {
      id : "test3",
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
  data: function () {
    return mainData
  },
  methods: {
    createMatrix: function (event) {
      //console.log(event);
      mainData.matrices.push({
        id:"testing",
        position: [event.x, event.y],
        entries: [[5,5,5],[4,4,4],[3,2,1]]
      })
    },
    onDrop: function (event) {
      console.log("main.js");
      console.log(event);
    }
  },
  template: `<div ondragover="event.preventDefault()" dragend="onDrop"
  v-on:click="createMatrix"
  v-bind:style=styleObj>
    <math-matrix v-for="(matrix, index) in matrices"
    v-bind:key="index"
    v-bind:id="matrix.id"
    v-bind:initEntries="matrix.entries"
    v-bind:initPosition="matrix.position">
    </math-matrix>
</div>`
})

//console.log(TheMatrix);
//console.log(TheMatrix.$refs);

window.onload = function () {
  //console.log("hello again, again");
}
