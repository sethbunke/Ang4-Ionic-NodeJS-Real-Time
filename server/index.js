let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    console.log('nickname:' + nickname);
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    console.log('add message:' + message);
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });

  socket.on('message', function(message){
      console.log('received messsage on socket: ' + message);    
  });

});
 
var port = process.env.PORT || 3001;

app.post('/message', function (req, res) {
    console.log('in post message');

    io.emit('message', {text: 'test', from: 'api', created: new Date()});  
    res.send('POST request to the homepage')
})

app.post('/status', function (req, res) {
    console.log('in post status');
    let status = 'status: ' + new Date();
    io.emit('status', {text: status, from: 'api', created: new Date()});  
    res.send('POST request to the homepage')
})
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});