Vue.component("math-matrix", {
  props: {
    initEntries: Array,
    initPosition: Array
  },
  data: function () {
    return {
      entries: [[1,0,0],[0,1,0],[0,0,1]],
      position: [0,0],
      styleObj: {
        position: 'absolute',
        // we can either orientate things from the bottom left, or the top right.
        // that or centre everything?
        left: `0px`,
        bottom: `0px`,
      }
      //shouldUpdate: false
    }
  },
  created: function () {
    if (this.initEntries) {
      this.entries = this.initEntries 
    }
    if (this.initPosition) {
      this.position = this.initPosition
      this.styleObj.left = `${this.initPosition[0]}px`
      this.styleObj.bottom   = `${this.initPosition[1]}px`
    }
  },
  methods: {
    newEntry: function () {
      try {
        this.entries[i][j] = value
        //this.shouldUpdate = true
      } catch (error) {
        console.log(error);
      }
    }
  },
  computed: {
    generateTemplate: function () {
      return `<table v-bind:style="styleObj">
      <tr v-for="(row, i) in entries">
        <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
      </tr>
    </table>`
    }
  },
  template: `<table v-bind:style="styleObj">
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
  </tr>
</table>`,
})