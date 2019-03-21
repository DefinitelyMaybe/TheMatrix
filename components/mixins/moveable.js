const mixin_moveable = {
  data: function () {
    return {
      objStyle: {
        'position': 'absolute',
        'left': '0px',
        'top': '0px'
      }
    }
  },
  created: function () {
    if (this.initData) {
      this.objStyle.left = this.initData.position[0]
      this.objStyle.top = this.initData.position[1]
    }
  },
  methods: {
    onDragEnd: function (event) {
      let x = event.x - this.dragOffsetX
      let y = event.y - this.dragOffsetY
      this.objStyle.left = `${x}px`
      this.objStyle.top = `${y}px`
    },
    onDragStart: function (event) {
      this.dragOffsetX = event.layerX
      this.dragOffsetY = event.layerY
    },
  },
}