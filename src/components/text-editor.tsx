import { useState,useEffect,useRef } from "react";
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css'
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions'

interface TextEditorProps{
    cell : Cell
}

const TextEditor : React.FC<TextEditorProps> = ({ cell }) => {
    const [editing, setEditing] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    // const [value,setValue] = useState('# MarkDown');
    const { updateCell } = useActions();

    useEffect(() => {
        const listener = (event : MouseEvent) => {
            // console.log(event.target);
            if(ref.current && event.target && ref.current.contains(event.target as Node)){ // This is to check whether the click even is inside the Editor or not
                return;
            }
            setEditing(false);
        };
        document.addEventListener('click',listener, { capture: true });
        return () => {
            document.removeEventListener('click',listener, { capture: true })
        }
    },[]);

    if(editing){
        return(
            <div className="text-editor" ref={ref}>
                <MDEditor value={cell.content} onChange={(v) => updateCell(cell.id, v || '')}/>
            </div>
        );
    }

    return(
        <div className="text-editor card" onClick ={() => setEditing(true)} >
            <div className="card-content">
                <MDEditor.Markdown source={cell.content || "Click To Edit"}/>
            </div>
        </div>
    );
}

export default TextEditor;

