Vue.component("object-edit", {
    mixins: [mixin_moveable],
    props: {
      initData: Object,
      selected: Boolean
    },
    data: function () {
      return {
        confirmation: false
      }
    },
    methods: {
      //form specific
      finishForm: function (args) {
        console.log("WIP");
      },
      deleteForm: function () {
        this.$root.deleteObjByID(this.$attrs.id)
      },
      editform: function () {
        let form = this.getObjectByID(this.selectedObj)
        console.log("trying to find form.type to select the right form")
        console.log(form)
        return "object-function"
      },
    },
    template: `<div draggable="true"
    v-on:dragend="onDragEnd"
    v-on:dragstart="onDragStart"
  
    v-bind:class="{CreateForm:true,selected:selected}"
    v-bind:style="objStyle">
    <component v-bind:is="editform"
        v-bind:class="{CreateForm:true}"
        v-if="editing && selected"
        v-bind:initData="{name:name,latex:latex}"
        v-bind:style="{position:'absolute', left:contextMenuStyle.left, top:contextMenuStyle.top}"></component>
  </div>`,
  })