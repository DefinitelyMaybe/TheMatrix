Vue.component("math-matrix", {
  props: {
    initEntries: Array
  },
  data: function () {
    return {
      entries: this.initEntries || [[1,0,0],[0,1,0],[0,0,1]],
      shouldUpdate: false
    }
  },
  methods: {
    newEntry: function () {
      try {
        this.entries[i][j] = value
        this.shouldUpdate = true
      } catch (error) {
        console.log(error);
      }
    },
    newMatrix: function () {
      this.entries = matrix
    }
  },
  computed: {
    generateTemplate: function () {
      return `<table>
      <tr v-for="(row, i) in entries">
        <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
      </tr>
    </table>`
    }
  },
  template: `<table>
  <tr v-for="(row, i) in entries">
    <td v-for="(item, j) in row"> {{ entries[i][j] }} </td>
  </tr>
</table>`,
})