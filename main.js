const TheMatrix = new Vue({
  el: '#TheMatrix',
  data: DATA_scene_0,
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
    deleteObj: function (event) {
      console.log("delete function");
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
  <ui-menu v-for="(value, key) in contextMenus"
  v-bind:key="key"
  v-show="showContext && contextType == key"
  v-bind:style="contextMenuStyle"
  v-bind:initItems="value">
  </ui-menu>
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

/*
* { margin: 0; padding: 0; }
body {
	overflow: hidden;
}
/* generic styles for button & circular menu
.ctrl {
	position: absolute;
	top: 70%; left: 50%;
	font: 1.5em/1.13 Verdana, sans-serif;
	transition: .5s;
}
/* generic link styles ]
a.ctrl, .ctrl a {
	display: block;
	opacity: .56;
	background: #c9c9c9;
	color: #7a8092;
	text-align: center;
	text-decoration: none;
	text-shadow: 0 -1px dimgrey;
}
a.ctrl:hover, .ctrl a:hover, a.ctrl:focus, .ctrl a:focus { opacity: 1; }
a.ctrl:focus, .ctrl a:focus { outline: none; }
.button {
	z-index: 2;
	margin: -.625em;
	width: 1.25em; height: 1.25em;
	border-radius: 50%;
	box-shadow: 0 0 3px 1px white;
}
/* circular menu 
.tip {
	z-index: 1;
	/**outline: dotted 1px white;
	margin: -5em;
	width: 10em; height: 10em;
	transform: scale(.001);
	list-style: none;
	opacity: 0;
}
/* the ends of the menu
.tip:before, .tip:after {
	position: absolute;
	top: 34.3%;
	width: .5em; height: 14%;
	opacity: .56;
	background: #c9c9c9;
	content: '';
}
.tip:before {
	left: 5.4%;
	border-radius: .25em 0 0 .25em;
	box-shadow: -1px 0 1px dimgrey, inset 1px 0 1px white, inset -1px 0 1px grey, 
				inset 0 1px 1px white, inset 0 -1px 1px white;
	transform: rotate(-75deg);
}
.tip:after {
	right: 5.4%;
	border-radius: 0 .25em .25em 0;
	box-shadow: 1px 0 1px dimgrey, inset -1px 0 1px white, inset 1px 0 1px grey,
				inset 0 1px 1px white, inset 0 -1px 1px white;
	transform: rotate(75deg);
}
/* make the menu appear on click 
.button:focus + .tip {
	transform: scale(1);
	opacity: 1;
}
/* slices of the circular menu 
.slice {
	overflow: hidden;
	position: absolute;
	/**outline: dotted 1px yellow;
	width: 50%; height: 50%;
	transform-origin: 100% 100%;
}
/* 
 * rotate each slice at the right angle = (A/2)° + (k - (n+1)/2)*A°
 * where A is the angle of 1 slice (30° in this case)
 * k is the number of the slice (in {1,2,3,4,5} here)
 * and n is the number of slices (5 in this case)
 * formula works for odd number of slices (n odd)
 * for even number of slices (n even) the rotation angle is (k - n/2)*A°
 * 
 * after rotating, skew on Y by 90°-A°; here A° = the angle for 1 slice = 30° 
 *
.slice:first-child { transform: rotate(-45deg) skewY(60deg); }
.slice:nth-child(2) { transform: rotate(-15deg) skewY(60deg); }
.slice:nth-child(3) { transform: rotate(15deg) skewY(60deg); }
.slice:nth-child(4) { transform: rotate(45deg) skewY(60deg); }
.slice:last-child { transform: rotate(75deg) skewY(60deg); }
/* covers for the inner part of the links so there's no hover trigger between
   star button & menu links; give them a red background to see them *
.slice:after {
	position: absolute;
	top: 32%; left: 32%;
	width: 136%; height: 136%;
	border-radius: 50%;
	/* "unskew" = skew by minus the same angle by which parent was skewed *
	transform: skewY(-60deg);
	content: '';
}
/* menu links *
.slice a {
	width: 200%; height: 200%;
	border-radius: 50%;
	box-shadow: 0 0 3px dimgrey, inset 0 0 4px white;
	/* "unskew" & rotate by -A°/2 *
	transform: skewY(-60deg) rotate(-15deg);
	background: /* lateral separators *
			linear-gradient(75deg, 
		transparent 50%, grey 50%, transparent 54%) no-repeat 36.5% 0,
			linear-gradient(-75deg, 
		transparent 50%, grey 50%, transparent 54%) no-repeat 63.5% 0,
		/* make sure inner part is transparent *
		radial-gradient(rgba(127,127,127,0) 49%, 
					rgba(255,255,255,.7) 51%, #c9c9c9 52%);
	background-size: 15% 15%, 15% 15%, cover;
	line-height: 1.4;
}
/* arrow for middle link *
.slice:nth-child(3) a:after {
	position: absolute;
	top: 13%; left: 50%;
	margin: -.25em;
	width: .5em; height: .5em;
	box-shadow: 2px 2px 2px white;
	transform: rotate(45deg);
	background: linear-gradient(-45deg, #c9c9c9 50%, transparent 50%);
	content: '';
}
<a class='button ctrl' href='#' tabindex='1'>★</a>
<ul class='tip ctrl'>
	<li class='slice'><a href='#'>✦</a></li>
	<li class='slice'><a href='#'>✿</a></li>
	<li class='slice'><a href='#'>✵</a></li>
	<li class='slice'><a href='#'>✪</a></li>
	<li class='slice'><a href='#'>☀</a></li>
</ul>
*/