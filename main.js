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
      id : "test3"
    }
  ]
}

function createMatrix(event) {
  //console.log(event);
  mainData.matrices.push({
    id:"testing",
    position: [event.x, event.y],
    entries: [[5,5,5],[4,4,4],[3,2,1]]
  })
}

const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: function () {
    return mainData
  },
  methods: {
    createMatrix: function () {
      // 
    }
  },
  template: `<div>
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
  console.log("hello again, again");
  //mainData.matrices.push({id:"test4",entries:[[3,3],[2,1]]})
}
document.onclick = createMatrix
/*
window.customElements.define('math-matrix', class extends HTMLElement {
  constructor() {
    super();
    // Attach the shadowDom
    this.shadow = this.attachShadow({mode: 'open'});

    // Create the html that we're going to attach to the shadowDom
    this.table = document.createElement('table')
    this.entries = [[1]]
    for (let i = 0; i < this.entries.length; i++) {
      let row = document.createElement('tr')
      for (let j = 0; j < this.entries[i].length; j++) {
        let x = document.createElement('td')
        x.innerHTML = this.entries[i][j];
        row.appendChild(x)
      }
      this.table.appendChild(row)
    }

    this.style = document.createElement('style')
    this.style.textContent = `table {
      background: white;
    }`

    // Attach the elements to the shadowDom
    this.shadow.appendChild(this.style)
    this.shadow.appendChild(this.table)
  }
});

//const shadowDom = document.body.attachShadow({mode:'open'})

//x = document.createElement('math-matrix')

//shadowDom.appendChild(x)


console.log(math.add(x, x).toString());

//document.body.appendChild(document.createElement('math-matrix'))
*/