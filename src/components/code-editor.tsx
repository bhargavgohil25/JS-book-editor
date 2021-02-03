import { useRef } from 'react'
import './code-editor.css'
import './131 syntax.css'
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel'
import { editor } from 'monaco-editor';
import codeshift from 'jscodeshift'
import Highlighter from 'monaco-jsx-highlighter'


interface CodeEditorProps {
  initialValue : string;
  onChange(value: string) : void;
}

const CodeEditor : React.FC<CodeEditorProps> = ({ initialValue,onChange }) => {
  const editorRef = useRef<any>();   // to get the code value from the editor and format it through prettier and again set the code value to the editor 

  const onEditorDidMount : EditorDidMount = (getValue, monacoEditor) => { // this function is used to get the current value in the editor...
    // console.log(getValue())
    editorRef.current = monacoEditor;   // we can also make the reference to some value also and can use it anywhere in the app.... 
    monacoEditor.onDidChangeModelContent(() => { // we get the console.log() on every change made on the editor..
      onChange(getValue());
    });
    monacoEditor.getModel()?.updateOptions({ tabSize: 2})

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeshift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  }

  const onFormatClick = () => {
    //! get the current value from the editor
    // console.log(editorRef.current);
    const unformatted = editorRef.current.getModel().getValue();

    //! format the value 
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins : [parser],
      useTabs : false,
      semi : true,
      singleQuote : true
    }).replace(/\n$/,'');

    //! set the formated value again in the editor
    editorRef.current.setValue(formatted);
  }
  
  return (
  <div className="editor-wrapper">
    <button 
      className="button button-format is-primary is-small" 
      onClick={onFormatClick}
    >Format Code</button>
    <MonacoEditor  
      editorDidMount = {onEditorDidMount}
      value = {initialValue} 
      options={{
        wordWrap:"on",
        cursorBlinking: "expand",
        fontLigatures: true,
        minimap: { enabled: false },
        showUnused: false,
        folding:false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout:true,
      }}
      language="javascript" 
      theme="vs-dark" 
      height="500px" 
    />
  </div>
  );
};

export default CodeEditor;
