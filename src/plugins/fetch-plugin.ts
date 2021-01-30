import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage'
import axios from 'axios'

const fileCache = localForage.createInstance({
    name : 'filecache',
});

export const fetchPlugin = (inputCode : string) => {
    return{
        name: 'fetch-plugin',
        setup(build : esbuild.PluginBuild){
        build.onLoad({ filter: /.*/ }, async (args: any) => { // the thing that namespace does here is that, it is like a identifier and only onLoad function will run whose namespace matches  
            // console.log('onLoad', args);
    
            if (args.path === 'index.js') {
              return {
                loader: 'jsx',
                contents: inputCode,
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
        }
    }
}


