// Got a library library from the internet.
// console.log(math);

//let x = math.matrix([[1,0],[0,1]])

mainData = {
  name: 'hello world',
  selectedObj: null,
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
      id : "test4",
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
            id:"testing",
            position: [event.x, event.y],
            entries: [[5,5,5],[4,4,4],[3,2,1]]
          })
          break;
        default:
          console.log("default case when creating obj.")
          break;
      }
    },
    selectObj: function (event) {
      console.log("select obj function called");
      console.log(event);
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
        console.log(`Did not find the following tuple to update: (id:${id}, key${key}`);
      }
    },
    printMainData: function () {
      console.log(JSON.stringify(this.$data, this.printMainDataReplacer, 2))
    },
    printMainDataReplacer: function (key, value) {
      //console.log(key, value);
      if (key === 'entries') {
        if (value) {
          let x = ''
          for (let i = 0; i < value.length; i++) {
            x = x.concat(`[${value[i].toString()}]`);
            if (i < value.length-1) {
              x = x.concat(',')
            }
          }
          return `[${x}]`
        } else {
          console.log('there was no entries array');
        }
      } else if (key === 'position') {
        return `[${value.toString()}]`
      }
      return value
    }
  },
  template: `<div ondragover="event.preventDefault()"
  v-on:click.self="createObj($event, 'matrix')"
  v-bind:style=styleObj>
    <math-matrix v-for="(matrix, index) in matrices"
    v-bind:key="index"
    v-bind:id="matrix.id"
    v-bind:initEntries="matrix.entries"
    v-bind:initPosition="matrix.position"
    v-on:click="selectObj">
    </math-matrix>
</div>`
})

//console.log(TheMatrix);
//console.log(TheMatrix.$refs);

window.onload = function () {
  //console.log("hello again, again");
}
