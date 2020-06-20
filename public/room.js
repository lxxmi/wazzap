      $(function () {
        var noOfUsers = 0;
        var username = window.prompt("Please enter your name", "");
        if(username == null || username ==""){
          window.location.href = "/";
        }
        var currentTime = new Date();
        var hour = currentTime.getHours();
        var min  = currentTime.getMinutes();
        var sec  = currentTime.getSeconds();

        var text = $(".newtext");
        var sendButton = $(".send-btn");
        var messageArea = $(".chat-message-area");
        var typing = $(".typing");
        var userCount = $(".activeUserCount");
        var backbtn = $(".back-btn");
        
      if(username){
        var socket =io();
        socket.emit("setUsername",{username,roomName});

        socket.on("userJoined", (data)=>{
            messageArea.append('<div class="center-label-div"><span class="chat-center-labels">'+data.username+' has joined the group</span></div>');
            messageArea.scrollTop(9999);
        });
        socket.on("userLeft", (data)=>{
            messageArea.append('<div class="center-label-div"><span class="chat-center-labels">'+data.username+' has left</span></div>');
            messageArea.scrollTop(9999);
        });
        
        socket.on("userCount", (noOfUsers)=>{
          userCount.text(noOfUsers);
        });
        
        //isTyping event
        text.on('input',function(){
          if(this.value.length >0){
            socket.emit("typing", { user: username, message: "is typing…", roomName:roomName});
          }
          else{
            socket.emit("stoptyping", {roomName: roomName});
          }
        });
        
        function keepFading(){
          typing.fadeToggle(1500, ()=> {
            keepFading();
          });
        }
      
        socket.on("typing", (data) => {
          typing.text(data.user + " " + data.message);
          keepFading();
        });
        
        socket.on("stoptyping", () => {
          typing.text("");
        });
        
        //Send Message ------
        sendButton.on('click',sendMessage);
        text.keydown(function(e){
          if (e.keyCode === 13) {sendMessage();}
        });

        backbtn.on('click',()=>{
          
        });
        
        function sendMessage(){
          if(text.val()){
            var curTime =hour+":"+min;
            messageArea.append('<div class="text-bubble right-text"><div class="text-content">'+text.val()+'</div><div class="text-time">'+curTime+'</div></div>');
            socket.emit("stoptyping", {roomName:roomName});
            messageArea.scrollTop(9999);
//          messageArea.scrollTop =  messageArea.scrollHeight;
            socket.emit("new message", {content:text.val(),username:username, timestamp:curTime, roomName:roomName});
          }
          text.val("");
          text.focus();
        }

        socket.on("new message", (msg)=>{
            console.log(`message recieved at Client: ${msg}`);
            messageArea.append('<div class="text-bubble left-text"><div class="text-content">'+msg.content+'</div><div class="text-time">'+msg.timestamp+'</div></div>');
            messageArea.scrollTop(9999);
//          messageArea.scrollTop =  messageArea.scrollHeight;
          });
      }
    });
