
import React from 'react'
import {BrowserRouter as Router,Routes, Route} from "react-router-dom";
import Login from './Authentication/login'
import Signup from './Authentication/Signup'
import Navigates from './Navbar/navigate';
import Editorpage from './Editor/Editorpage';
import Showfile from './myfile/showfile';
import ProtectedRoute from './protect';
import Chatbot from './aisupport/chatbot';
export default function App() {
  return (
    <>
     <Router>
     <Navigates/>
          <Routes>
            <Route exact path="/signup" element={<Signup/>}/>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/myfile" element={<ProtectedRoute><Showfile/></ProtectedRoute>}/>
            <Route exact path="/editor" element={<ProtectedRoute><Editorpage/></ProtectedRoute>}/>
            <Route exact path='/aisupport' element={<ProtectedRoute><Chatbot/></ProtectedRoute>}/>
          </Routes>
     </Router>
    
    </>
  )
}
