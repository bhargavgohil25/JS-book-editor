import * as esbuild from 'esbuild-wasm'
import { useState,useEffect,useRef } from "react";
import ReactDOM from 'react-dom'
import ts from 'typescript';



const App = () => {
    const ref = useRef<any>();
    const [input,setInput] = useState('');
    const [code,setCode] = useState('');
    
    // this service will take the code that is supposed to be transpiled and bundled
    // esbuild will do the both the task in very rapid way... and therefore it used in here 
    const startService = async () => {
        ref.current  = await esbuild.startService({
            worker :  true,
            wasmURL : '/esbuild.wasm'
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
        const result = await ref.current.transform(input,{
            loader : 'jsx',
            target : 'es2015'
        });
        // the transpiled code is saved in result
        setCode(result.code);
        // console.log(result);
    };

    return (
        <div>
            <textarea value = {input} onChange = {(e) => setInput(e.target.value)}></textarea>
            <div>
                <button onClick={onClick}>
                    Submit
                </button>
            </div>
            <pre>{code}</pre>
        </div>
    );
}

ReactDOM.render(
    <App />,
    document.querySelector('#root')
)