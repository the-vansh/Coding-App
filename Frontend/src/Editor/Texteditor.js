import './editor.css';
import React from 'react'
import {Editor} from "@monaco-editor/react";
export default function Texteditor({selected_lang,seleted_theme,linesz,code,setCode}) {

  const handleCodeChange = (value) => {
    setCode(value);
  };
  return (
    <div className='editor'>
     <Editor
      value={code} 
      onChange={handleCodeChange} 
      height="100%"
      width="100%"
      language={selected_lang}
      theme={seleted_theme}
      options={{
        fontSize:linesz,
        automaticLayout: true,
        lineDecorationsWidth: 1,
        wordWrap: "on" 
      }}
    />
    </div>
  )
}
