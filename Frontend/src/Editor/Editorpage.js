import React, { useState } from 'react';
import Toppanel from './Panel/toppanel'; 
import Texteditor from './Texteditor';
import Terminal from './Terminals';
import InfoForm from './savefilefrom';
import './formcss.css';
import './editor.css';
export default function Editorpage() {
    const [code, setCode] = useState('Write your code here....');
    const [output, setOutput] = useState('');
    const [selected_lang,setlanguage] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [processid,setprocessid] = useState(null);
    const [ws, setWs] = useState(null);
    const [fornewfile,setfornewfile] = useState(false);


    const [savingfile,setsavingfile]=useState(false);
    

    const handlenewfileclick = ()=>{
        var result = window.confirm("Do You Want to Save the");
        if (result) {
            handleSaveClick();
            setfornewfile(true);
        } 
    }

    const handleSaveClick = () => {
       console.log('click hogya hai par form open ni hora');
       if (!code.trim() || code==='Write your code here....') {
            alert('Code cannot be empty');
            return;
       }
       setIsFormOpen(true);
       console.log('form ka open set true ho gya h');
    }; 

    const handleFormSubmit = async (formData) => {
        setIsFormOpen(false);
        const combinedData = {
            tag: formData.tag,
            file: code,
            date: new Date().toISOString(),
           
        };
        console.log("here in combine data");
        setsavingfile(true);
        try {
            const response = await fetch('http://localhost:8000/savecode', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'auth-token':localStorage.getItem('token')
              },
              body: JSON.stringify(combinedData),
            });
            const result = await response.json();
            console.log('Success:', result);
            alert("FILE SAVED SUCCESSFULLY");
            if(fornewfile){
                setCode('');
            }
          } catch (error) {
            console.error('Error:', error);
          }finally{
            setsavingfile(false);
          }
    }

    const handleFormClose = () => {
        setIsFormOpen(false);

    };

    const handleCodeSubmit = async()=>{
        setOutput('');
       
        if(selected_lang===''){
            alert("Please Select the language");
            return;
        }

        if(code.length===0 || code==='Write your code here....'){
            alert("Please enter the code First");
            return;
        }
        try{
            setOutput('Executing code.......')
            const response = await fetch('http://localhost:8000/execute'+selected_lang, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: code,
        });

        if (!response.ok) {
            throw new Error('Execution failed');
        }

        const data = await response.json();
        setprocessid(data.id);
       // console.log(data.id);    
        //console.log(selected_lang);
        const socket = new WebSocket(`ws://localhost:8000/${selected_lang}?id=${data.id}`);
        

     
        socket.onopen = () => {
            console.log('WebSocket connection established');
        };
        
    
        socket.onmessage = (event) => {
        
                console.log('Received message from server:', event.data);
                setOutput(prevOutput => (prevOutput!=='Executing code.......')? prevOutput + '\n' + event.data : event.data);
        };
    
        socket.onclose = () => {
            console.log('WebSocket connection closed');
            handleExecutionFinish();
        };
    
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
        setWs(socket);
    } catch (error) {
        console.error('Error executing code:', error);
        throw error;
    }


 }
    
 const handleExecutionFinish = () => {
    setOutput(prevOutput => prevOutput + '\nExecution Finish');
};
 const sendRuntimeInput = (value) => {
    console.log(value);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(value); 
        // Append the input value to the output with a newline for better readability
        setOutput(prevOutput => prevOutput + '\n' + value);
        console.log("Input sent successfully");
    } else {
        console.error('WebSocket connection is not open.');
    }
};

const handleStopExecution = async () => {
    try {
        if(processid==null){
           alert("No current running process");
           return;
        }
        const response = await fetch(`http://localhost:8000/stopExecution${selected_lang}/${processid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log('Stop Execution:', result);

        // Close WebSocket connection if open
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }

        // Optionally, reset other states or perform cleanup
        setOutput('');
    } catch (error) {
        console.error('Error stopping execution:', error);
    }
};
   
    return(
       <>
       {savingfile && <p style={{textAlign:"center"}}>Saving File Please Wait....</p>}
        <Toppanel onRunClick={handleCodeSubmit} setlanguage={setlanguage} onSaveClick={handleSaveClick} onStopClick={handleStopExecution} onNewFileClick={handlenewfileclick}/>
        <div className='sideedit'>
           <div className='editor-container'>
           <Texteditor  code={code} setCode={setCode} selected_lang={selected_lang} seleted_theme={'vs-dark'} linesz={20}/>
           {isFormOpen && <InfoForm onSubmit={handleFormSubmit} onClose={handleFormClose} />}
           </div>
           <Terminal output={output} sendinput={sendRuntimeInput}/>
        </div>
        
        </>
        
    );
}
