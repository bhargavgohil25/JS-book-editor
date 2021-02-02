import * as esbuild from 'esbuild-wasm'
import { useState,useEffect,useRef } from "react";
import ReactDOM from 'react-dom'
import ts from 'typescript';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

// Another task is the bundling in-Browser process;
//whenever we see the import statements in the given code we have to to get access to those packages;
// 1) Now the there is option to to create a server API to and we ask them to always request a package whenever there is a import statet=ment;
// 2) But another option is to do in-Browser bundling;
//  and this is done by going to the specific package's index.js file(the package we want to import) and downloading that package;
// 3) Now, to download some npm package directly from the browser we will face some cors error and to get rid of those error we will use some third party called 'unpkg.com/{package name}'

const App = () => {
    const ref = useRef<any>();
    const iframe = useRef<any>(); // rather than updating the state we will directly pass the bundled code to the iframe just after bundling is done...
    const [input,setInput] = useState('');
    const [code,setCode] = useState('');
    
    // this service will take the code that is supposed to be transpiled and bundled
    // esbuild will do the both the task in very rapid way... and therefore it used in here 
    const startService = async () => {
        ref.current  = await esbuild.startService({
            worker :  true,
            wasmURL : 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });
        // console.log(service);

    };

    useEffect(() => {
        startService();
    },[]);

    // the problem here is  that currently we want the service function gets triggered when we click subkit
    // therefore we will use 'useRef' to get function from outside 
    // and now we can access the service function by using 'ref.current'
    const onClick = async () => {
        if(!ref.current){
            return;
        }
        // console.log(ref.current);
        // Here, the raw JSX code is passed into transform and the output is will the transpiled code in version of target provided 
        const result = await ref.current.build({
            entryPoints : ['index.js'],
            bundle : true,
            write : false,
            plugins : [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                'process.env.NODE_ENV' : '"production"',
                global : 'window'
            }
        });
        // the transpiled code is saved in result
        // Here we are also bundling the code simultaneously via using 'unpkgPathPlugin'
        // console.log(result);

        // setCode(result.outputFiles[0].text); // here we used to change the state of code when it is bundled
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text,'*');
    };

    const html = `
        <html>
            <head></head>
            <body>
                <div id="root"></div>
                <script>
                    window.addEventListener('message',(event) => {
                        eval(event.data);
                    },false);
                </script>
            </body>
        </html>
    `;
 
    return (
        <div>
            <textarea value = {input} onChange = {(e) => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>
                    Submit 
                </button>
            </div>
            <pre>{code}</pre>
            <iframe ref={iframe} sandbox ="allow-scripts" srcDoc={html}></iframe> 
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)