import {
  ensureFileSync,
} from "https://deno.land/std/fs/mod.ts";

const BUILD = "build/";
const BUILDJAVASCRIPT = "build/js/";
const VIEWS = "views/";

// firstly, run a complete build of the entire folder
Deno.run({ cmd: ["deno", "run", "-A", "--unstable", "utils/build.ts"] });

// then only compile the files that get modified
const watcher = Deno.watchFs(["./src", "./views"]);
for await (const event of watcher) {
  // { kind: "create", paths: [ "/foo.txt" ] }
  // console.log(Deno.cwd());
  // look for modifying specific paths and only re-compile those paths
  // console.log(event.paths);
  if (event.kind === "modify") {
    if (event.paths.length === 1) {
      let path = event.paths[0];
      path = path.split("./")[1];
      if (path.endsWith(".ts")) {
        // ignore changes to utils
        if (path.includes("utils/")) {
          console.log(`> Did nothing with: ${path}`);
        } else {
          // For the moment we shall say that it was typescript that needs to be recompiled
          // @ts-ignore
          const js = await Deno.transpileOnly(
            { "compiled": Deno.readTextFileSync(path) },
            {
              lib: ["esnext"],
            },
          );

          if (js["compiled"].source) {
            // update the path
            path = path.replaceAll(/\\/g, "/");
            path = path.replace(/src\//g, "");
            path = path.replace(/\.ts/g, ".js");
            const filepath = `${BUILDJAVASCRIPT}${path}`;
            console.log(`writing: ${filepath}`);
            // make sure we can write to the path
            ensureFileSync(filepath);
            // parse the emitted script
            const data = js["compiled"].source.replace(/\.ts/g, ".js");
            Deno.writeTextFileSync(filepath, data);
          } else {
            console.error(js);
          }
        }
      } else if (path.endsWith(".html")) {
        // The html needs to be updated
        console.log("updating html");
        const html = Deno.readTextFileSync(`${VIEWS}main.html`);
        Deno.writeTextFileSync(`${BUILD}main.html`, html);
      } else if (path.endsWith(".css")) {
        // css should be updated
        console.log("updating css");
        const css = Deno.readTextFileSync(`${VIEWS}style.css`);
        Deno.writeTextFileSync(`${BUILD}style.css`, css);
      } else {
        console.log(`> Did nothing with: ${path}`);
      }
    } else {
      console.log(`> ${event.paths.length} paths within event`);
    }
  } else {
    console.log(`> unused ${event.kind} event`);
  }
}
