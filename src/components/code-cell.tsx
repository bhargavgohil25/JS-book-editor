import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview'
import Resizable from './resizable'
import { Cell } from '../state'
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector'  // to pull the state from the store we use 'useTypedSelector'

// Another task is the bundling in-Browser process;
//whenever we see the import statements in the given code we have to to get access to those packages;
// 1) Now the there is option to to create a server API to and we ask them to always request a package whenever there is a import statet=ment;
// 2) But another option is to do in-Browser bundling;
//  and this is done by going to the specific package's index.js file(the package we want to import) and downloading that package;
// 3) Now, to download some npm package directly from the browser we will face some cors error and to get rid of those error we will use some third party called 'unpkg.com/{package name}'

interface CodeCellProps {
    cell : Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
    // const [input,setInput] = useState('');
    // const [code,setCode] = useState('');
    // const [err,setErr] = useState('');
    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => state.bundles[cell.id])
    // console.log(bundle);
    useEffect(() => {
        const timer = setTimeout( async () => {
            createBundle(cell.id, cell.content);
        },750);        
        
        return () => {
            clearTimeout(timer);
        }
    },[cell.content, cell.id, createBundle]);


    // the problem here is  that currently we want the service function gets triggered when we click subkit
    // therefore we will use 'useRef' to get function from outside 
    // and now we can access the service function by using 'ref.current'
    // const onClick = async () => {
    //     const output = await bundle(input);
    //     setCode(output); // here we used to change the state of code when it is bundled
    //     // bundled code is in the code state
    // };

 
    return (
        <Resizable direction="vertical">
            <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
                <Resizable direction="horizontal">
                    <CodeEditor 
                        initialValue={cell.content}
                        onChange = {(value) => updateCell(cell.id, value)}
                    />
                </Resizable>
                {/* <pre>{code}</pre>  */}
                {bundle && <Preview code={bundle.code} err={bundle.err}/>}
            </div>
        </Resizable>
    );
}

export default CodeCell;