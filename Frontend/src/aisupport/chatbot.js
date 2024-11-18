import React, { useState } from 'react';
import './chatbot.css'; 
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const getAnswer = async () => {
    setLoading(true); 
    
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: question 
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      const textContent = data['candidates'][0]['content']['parts'][0]['text'];
      console.log(textContent);
      const highlightedContent = highlightCodeBlocks(textContent);

      setAnswer(highlightedContent);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error(error);
      setAnswer("NOT ABLE TO GET THE ANSWER");
      console.log("NOT ABLE TO GET THE ANSWER");
      setLoading(false);
    }
    setQuestion('');
  };

  //Function to highlight code blocks
  const highlightCodeBlocks = (content) => {
    const codeRegex = /```([\s\S]*?)```|\*\*([\s\S]+?)\*\*|(^|\n)(\d+\.\s+)/g;

  // Replace code blocks with styled <pre> tag, bold text with <strong>,
  // and add line breaks before numbered list items.
  return content.replace(codeRegex, (match, codeBlock, boldText, lineBreak, listItem) => {
    if (codeBlock) {
      return `<pre>${codeBlock}</pre>`;
    } else if (boldText) {
      return `<strong>${boldText}</strong>`;
    } else if (lineBreak && listItem) {
      return `${lineBreak}<br>${listItem}`;
    }
    return match; // fallback in case no match found
});
}

  return (
    <div className='chatbotcontainer'>
      <h1>AI SUPPORT IN VANSH SAINI ONLINE CODE COMPILER</h1>
      {loading ? (
        <pre>Loading...</pre>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: answer }} />
      )}
      <textarea
        value={question} 
        onChange={handleInputChange} 
        placeholder="Enter your question..."
      ></textarea>
      <button onClick={getAnswer} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Answer'}
      </button>
    </div>
  );
}