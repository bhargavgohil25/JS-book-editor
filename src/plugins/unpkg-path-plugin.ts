import axios from 'axios'
import * as esbuild from 'esbuild-wasm';

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
            path: new URL(args.path, 'https:unpkg.com' + args.resolveDir + '/').href
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
              const message = require('axios')
              console.log(message);
            `,
          };
        }
        const { data, request } = await axios.get(args.path);
        // console.log(data);
        // console.log(request); 
        return{
          loader: 'jsx',
          contents: data,
          resolveDir : new URL('./', request.responseURL).pathname 
        }
      });
    },
  };
};
