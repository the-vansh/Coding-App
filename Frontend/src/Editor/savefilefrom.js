import React, { useState } from 'react';
import './formcss.css'
const InfoForm = ({ onSubmit, onClose }) => {
  const [tag, setTag] = useState('');

  const handleChange = (e) => {
    setTag(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tag });
  };

  return (
    <div className="InfoForm">
      <h1>FILE TAG</h1>
      <form onSubmit={handleSubmit}>
        
        <label>
          <input type="text" name="tag" value={tag} onChange={handleChange} required placeholder='Enter Tag'/>
        </label>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default InfoForm;
