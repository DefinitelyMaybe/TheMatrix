const Vue = require('vue')
const mixin_moveable = require('../mixins/moveable')
const mixin_contextmenu = require('../mixins/contextmenu')

Vue.component("object-table", {
  mixins: [mixin_moveable, mixin_contextmenu],
  props: {
    initData: Object,
    selected: Boolean
  },
  data: function () {
    return {
      headers: ['x'],
      table: [[1], [2], [3], [4], [5]],
      cursorPos: [1,0]
    }
  },
  created: function () {
    if (this.initData) {
      //console.log(this.initData);
      this.headers = this.initData.headers
      this.table = this.initData.table
    }
  },
  methods: {
    save: function () {
      return {
        "headers": this.headers,
        "table": this.table,
        "position": [this.objStyle.left, this.objStyle.top],
        "type": 'object-table',
        "id": this.$attrs.id
      }
    },
    setCursorPosition: function (row, col) {
      this.cursorPos.splice(0, 2, [row, col])
    }
  },
  render: function (createElement) {
    //code
    return createElement('table', {
      attrs: {
        draggable:"true"
      },
      on: {
        dragend: this.onDragEnd,
        dragstart: this.onDragStart,
      },
      style: this.$data.objStyle
    }, [
      createElement('tr', this.headers.map(function (header, i) {
        createElement('th',{
          key: i,
          on: {
            //click: this.setCursorPosition(0, i)
          }
        }, header)
      }))
      /*this.table.map(function (tableRow, row) {
        return createElement('tr', tableRow.map(function (data, col) {
          return createElement('td', {
            
          })
        }))
      })*/
    ])
  }
  /*template: `<table draggable="true"
  v-on:dragend="onDragEnd"
  v-on:dragstart="onDragStart"
  v-bind:style="objStyle">
  <tr>
    <th v-for="(value, index) in headers" v-bind:key="index" v-on:click="setCursorPosition(0, index)">{{value}}</th>
  </tr>
  <tr v-for="(value, row) in table" v-bind:key="row">
    <td v-for="(item, col) in value" v-bind:key="col" v-on:click="setCursorPosition(row + 1, col)">{{item}}</td>
  </tr>
</table>`,*/
})