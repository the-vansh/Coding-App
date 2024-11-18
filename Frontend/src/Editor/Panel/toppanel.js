import React from 'react'
import './toppan.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSave, faStop,faFile } from '@fortawesome/free-solid-svg-icons';

export default function toppanel({onRunClick,setlanguage,onSaveClick,onStopClick,onNewFileClick}) {

  const handlelanguagelselection=(e)=>{
    setlanguage(e.target.value);
  }
  return (
    <div className='toppanal'>
      <div className='newfile'>
       <button onClick={onNewFileClick} className="new-file-btn"><FontAwesomeIcon icon={faFile} /> NEW FILE </button>
      </div>
      <div className='mainbtn' >
        <button onClick={onRunClick}  className='run'><FontAwesomeIcon icon={faPlay} /> RUN</button>
        <button onClick={onStopClick} className='stop'><FontAwesomeIcon icon={faStop} /> STOP</button>
        <button  onClick={onSaveClick} className='save'><FontAwesomeIcon icon={faSave} /> SAVE</button>
      </div>
      <div className='selectlang'>
        <label htmlFor="language">Language: </label>
        <select id="language" onChange={handlelanguagelselection}>
          <option value="">Select Language</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c">C</option>
        </select>
      </div>
    </div>
  )
}
