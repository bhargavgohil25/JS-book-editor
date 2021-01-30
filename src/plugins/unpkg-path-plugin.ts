import * as esbuild from 'esbuild-wasm';


// testing

// ( async () => {
//   await fileCache.setItem('color', 'red');

//   const color = await fileCache.getItem('color');

//   console.log(color);
// })()

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin', // just to identify the name of the plugin 
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of index.js 
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: 'index.js', namespace: 'a' }
      });
      // Handle relative paths in a module 
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace:'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
        };
      });
      // Handle main file of a module.
      build.onResolve({ filter: /.*/ }, async (args: any) => {

        return{
          namespace: 'a',
          path : `https://unpkg.com/${args.path}`
        };
         
        // else if(args.path === 'tiny-test-pkg'){
        //   return { path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js', namespace: 'a' }; 
        // }
      });
    },
  };
};
