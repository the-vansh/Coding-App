import React, { useEffect, useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import './show.css';

const Showfile = () => {
  
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10); // Format: yyyy-mm-dd
  };

  const deletefile=async(id)=>{
    try{
       const response = await fetch(`http://localhost:8000/deletefile`, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json',
         'auth-token': localStorage.getItem('token')
       },
       body: JSON.stringify({id})
       });
 
      const json = await response.json();
      console.log(json); 
      setUserData((prevData) => prevData.filter(file => file._id !== id));
    }catch(e){
      console.log(e);
    }
 }

  useEffect(() => {
    // Define the function to fetch data
    const fetchData = async () => {
      try {
       // const id = '6633868a750aa84ec82c1f58';
         const token = localStorage.getItem('token');
            console.log('Token retrieved:', token); // Log the retrieved token
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
          }
        const response = await fetch(`http://localhost:8000/fetchallfile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':token
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const json = await response.json();
        setUserData(json);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  },[]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 style={{textAlign:'center',color:'green'}}>Saved Files</h1>
      {userData && userData.length > 0 ? (
        userData.map((file, index) => (
          <div className="file-container" key={index}>
            <div className="file-header">
              <div className='file-tag'>
                <p>Tag:{file.tag}</p> 
              </div>
              <br />
              <div className="file-actions">
                <button className="delete-button" onClick={() => deletefile(file._id)}>Delete</button>
                <CopyToClipboard text={file.file}>
                  <button className="copy-button">Copy to clipboard</button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="file-content">
              <pre>{file.file}</pre>
            </div>
            <br />
            <p style={{color:'white'}} ><strong >Date:</strong> {formatDate(file.date)}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Showfile;
