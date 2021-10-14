const express = require('express');
var cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const request = require('request');
const tmi = require('tmi.js');
var getEmotes = require("./GetEmoticons");
const { networkInterfaces } = require('os');
var ip = "";

const nets = networkInterfaces();
const results = Object.create(null);
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) {
              results[name] = [];
          }
          ip = net.address;
      }
  }
}

const token = '55zcq51bqkm3gxhy3sb0ssw3pzam87';
const clientId = 'y45n7h5e4dl1j6ka92nywvhal2ymnt';
var imgs = null;

async function init(){
  imgs = await getEmotes.main()
}

init()

const opts = {
    identity: {
    username: 'Cabrasky_Bot',
    password: token
},
    channels: [
        'allkeyshop_tv'
    ]
};

const options = {
  url: 'https://id.twitch.tv/oauth2/token',
  json:true,
  body: {
  client_id: 'y45n7h5e4dl1j6ka92nywvhal2ymnt',
  client_secret: 'njxugi5yhkjlj3adq8e0ry1hgdi4pq',
  grant_type: 'client_credentials'
  }
};

const client = new tmi.client(opts);

client.connect();

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

var views = 0;

app.use('/', express.static("./webpage"));
app.use('/emoticons', express.static("./emoticons"));
app.use('/resources', express.static("./resources"));

io.on('connection', (socket) => {
  socket.broadcast.re
  socket.broadcast.emit("views",  views)
  console.log('a user connected');
  views++;
  socket.on('connected', name => {
    io.emit("views", views);
    socket.broadcast.emit(views)
    console.log(views);
    ifImage("hola BegWan".split(" "), "test")
    ifImage("hola  sad ss ss  dssBegWan".split(" "), "test")
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(80, () => {
  console.log('listening on ' + ip +  ':80');
});

function getID(accessToken){
  const IDOptions = {
      url: 'https://api.twitch.tv/helix/users?login=Cabrasky',
      method: 'GET',
      headers:{
          'Client-ID': clientId,
          'Authorization': 'Bearer ' + accessToken
      }
  }
  if(!accessToken){
      console.log("No Token");
  }else{
    console.log(IDOptions);

    const IDRequest = request.get(IDOptions,(err,res,body) => {
        if(err){
        return console.log(err);
    }
    
    console.log(`Status: ${res.statusCode}`);
    AllData = JSON.parse(body);
    userId = AllData.data[0].id;
    console.log(userId);
    });

  };
}

function ifImage(array, user) {
  var message = [];
  for (var i = 0; i < array.length; i++) {
    if (imgs.includes(array[i])){
      var id = imgs.indexOf(array[i])
      var url = "/emoticons/" + id + ".png";
      message.push(url);
    }
    else{
      message.push(array[i]);
    }
    message.push(" ");
    console.log(message);
  }

  io.emit('message', user, message);
}



request.post(options, (err,res,body)=>{
  if(err){
      return console.log(err);
  }
  console.log(`Status: ${res.statusCode}`);
  var token = body.access_token;
  console.log(token);

  getID(token);
  
});

function onMessageHandler (target, context, msg, self) {
    if (self) { return; }

    console.log(target);
    console.log(context['display-name']);
    console.log(msg);
    console.log(self);
    if(imgs){
    ifImage(msg.split(" "), context['display-name']);
    }

    
}

function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}