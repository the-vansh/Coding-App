const express = require('express');
const connectDB = require('./dbconnection');
const Loginroute = require('./Loginroute');
const signuproute =require('./signuproute');
const http = require('http');
const cors = require('cors');


const {router:stopExecutioncpp, handleUpgradecpp } = require('./websocketcpp');
const {router:stopExecutionc, handleUpgradeC } = require('./websocketc');
const {router:stopExecutionjava,handleUpgradeJava} = require('./websocketjava');
const {router:stopExecutionpython,handleUpgradePy}=require('./websocketpython');

const {router:executecpp} = require('./cplusplus');
const {router:executec} = require('./c');
const {router:executejava}=require('./java');
const {router:executepython} = require('./python')

const savecode = require('./Savecodefile');
const deletefile = require('./deletefile');
const fetchallfile = require('./fetchallfile');

const app = express();

app.use(express.text());
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Connect to MongoDB
connectDB();

app.post('/login', Loginroute);
app.post('/signup', signuproute);

//for save the file
app.post('/savecode',savecode);
// for delete the file
app.delete('/deletefile',deletefile);

//for fetch all file
app.get('/fetchallfile',fetchallfile);



app.post('/executecpp',executecpp);
app.post('/executec',executec);
app.post('/executejava',executejava);
app.post('/executepython',executepython);

app.post('/stopExecutioncpp/:id',stopExecutioncpp);
app.post('/stopExecutionc/:id',stopExecutionc);
app.post('/stopExecutionjava/:id',stopExecutionjava);
app.post('/stopExecutionpython/:id',stopExecutionpython);
// Create HTTP server
const server = http.createServer(app);

// Use WebSocket 
server.on('upgrade', (req, socket, head) => {
  const pathname = req.url.split('?')[0];

  if (pathname === '/cpp') {
      handleUpgradecpp(req, socket, head);
  } else if (pathname === '/c') {
      handleUpgradeC(req, socket, head);
  }else if (pathname === '/java'){
      handleUpgradeJava(req, socket, head);
  }else if (pathname === '/python'){
    handleUpgradePy(req, socket, head);
  }else {
      socket.destroy();
  }
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});