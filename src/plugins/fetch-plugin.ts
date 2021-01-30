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
        build.onLoad({ filter: /(^index\.js$)/ }, () => {
            return {
                loader: 'jsx',
                contents: inputCode,
            };
        });

        build.onLoad({ filter: /.*/ }, async(args: any) => {
            // check to see if we have already fetched this file and if it is in the cache
            // and id it is in the cache 
            const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
            if(cachedResult){
                return cachedResult;
            }
            // if; it is in the cache, return it immediately
        })

        build.onLoad({ filter: /.css$/ }, async(args : any) => {
            // console.log('onLoad', args);
            const { data, request } = await axios.get(args.path);
            
            //console.log(args.path);
            
            //const fileType = args.path.match(/.css$/) ? 'css' : 'jsx'; // we don't want to check file type now because we already taking only .css file
            const escaped = data
                            .replace(/\n/g, '')
                            .replace(/"/g, '\\"')
                            .replace(/'/g,"\\'");
            const contents = `
                    const style = document.createElement('style');
                    style.innerText = '${escaped}';
                    document.head.appendChild(style);
                `
            
            // console.log(data);
            // console.log(request); 
            const result : esbuild.OnLoadResult = {
              loader: 'jsx',
              contents: contents,
              resolveDir : new URL('./', request.responseURL).pathname 
            }
            // store the response in cache
            await fileCache.setItem(args.path,result);
            return result;
        });


        build.onLoad({ filter: /.*/ }, async (args: any) => { // the thing that namespace does here is that, it is like a identifier and only onLoad function will run whose namespace matches  
            // console.log('onLoad', args);
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


