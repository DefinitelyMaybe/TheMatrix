// when you wanted to make this manually... 1 hour later you realize you shouldn't.
const urls = [
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-array/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-axis/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-brush/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-chord/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-collection/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-color/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-contour/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-dispatch/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-drag/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-dsv/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-ease/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-fetch/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-force/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-format/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-geo/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-hierarchy/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-interpolate/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-path/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-polygon/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-quadtree/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-random/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-scale/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-scale-chromatic/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-selection/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-shape/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-time/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-time-format/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-timer/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-transition/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-voronoi/index.d.ts',
  'https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/d3-zoom/index.d.ts',
]

Deno.writeTextFileSync("./test.d.ts", "")

urls.forEach(url => {
  console.log("fetching new file");
  fetch(url)
  .then( (v) => {
    console.log("recieved file");
    if (v.ok) {
      v.text()
      .then((v)=> {
        Deno.writeTextFileSync("./test.d.ts", v, {append:true})
      })
    } else {
      console.log(`not sure what to do with: ${v.status} from ${url}`);
    }
  })
});