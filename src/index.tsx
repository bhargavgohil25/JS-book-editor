import * as esbuild from 'esbuild-wasm'
import { useState,useEffect } from "react";
import ReactDOM from 'react-dom'



const App = () => {
    const [input,setInput] = useState('');
    const [code,setCode] = useState('');
    
    // this service will take the code that is supposed to be transpiled and bundled
    // esbuild will do the both the task in very rapid way... and therefore it used in here 
    const startService = async () => {
        const service = await esbuild.startService({
            worker :  true,
            wasmURL : '/esbuild.wasm'
        });
        console.log(service);
    };
    
    useEffect(() => {
        startService();
    },[]);

    const onClick = () => {
        console.log(input);
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