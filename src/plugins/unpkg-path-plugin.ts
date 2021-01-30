import axios from 'axios'
import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage'

const fileCache = localForage.createInstance({
  name : 'filecache',
});

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
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if(args.path === 'index.js'){
          return { path: args.path, namespace: 'a' };
        }
        if(args.path.includes('./') || args.path.includes('../')){
          return {
            namespace:'a',
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
          };
        }

        return{
          namespace: 'a',
          path : `https://unpkg.com/${args.path}`
        };
         
        // else if(args.path === 'tiny-test-pkg'){
        //   return { path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js', namespace: 'a' }; 
        // }
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => { // the thing that namespace does here is that, it is like a identifier and only onLoad function will run whose namespace matches  
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('react-select')
              console.log(message);
            `,
          };
        }
        // check to see if we have already fetched this file and if it is in the cache
        // and id it is in the cache 
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        if(cachedResult){
          return cachedResult;
        }

        // if it is in the cache, return it immediately
        const { data, request } = await axios.get(args.path);

        // console.log(data);
        // console.log(request); 
        const result : esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir : new URL('./', request.responseURL).pathname 
        }
        // store the response in cache
        await fileCache.setItem(args.path,result);
        return result;
      });
    },
  };
};
