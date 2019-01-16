// Got a library library from the internet.
// console.log(math);

let x = math.matrix([[1,0],[0,1]])
console.log(x);
console.log(x.toString());

const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: {
    message: 'hello world'
  }
})

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