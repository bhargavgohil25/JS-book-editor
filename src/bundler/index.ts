// we are making this reusable component for all the logic for 
// es-build related stuff.....

// taking input of rawcode or code from the editor and bundle and transpile the code 
// in here... 

// we actually have done this in index.ts file but as a matter of refactor we dooing this here 
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

//! We can use this as an API for bundling the JS code in further projects...

// this service will take the code that is supposed to be transpiled and bundled
// esbuild will do the both the task in very rapid way... and therefore it used in here 

let service : esbuild.Service; // we use this service variable to initialize the the startService only once
// so therefore if service is not initialized we will initilize the service....

const bundle = async (rawcode: string) => {
    if(!service){
        service = await esbuild.startService({
            worker :  true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
    }

    // the transpiled code is saved in result
    // Here we are also bundling the code simultaneously via using 'unpkgPathPlugin'

    const result = await service.build({
        entryPoints : ['index.js'],
        bundle : true,
        write : false,
        plugins : [
            unpkgPathPlugin(),
            fetchPlugin(rawcode)
        ],
        define: {
            'process.env.NODE_ENV' : '"production"',
            global : 'window'
        }
    });

    return result.outputFiles[0].text;
}


export default bundle;