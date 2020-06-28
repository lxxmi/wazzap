function copyToClipboard() {
          let str = document.querySelector(".share-link").innerText;
          const el = document.createElement('textarea');
          el.value = str;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          let text = "Link copied to clipboard";
          showToast(text);
        }
        
function displayShareDialog(){
  let link =  window.location.href;
  var shareDialog = document.querySelector(".share-dialog");
  var shareLink = document.querySelector(".share-link");
  shareLink.innerHTML = link;
  shareDialog.className = "share-dialog";
}

function closeShareDialog(){
  var shareDialog = document.querySelector(".share-dialog");
  shareDialog.className = "share-dialog makeHidden";
}

function showToast(text) {
  var x = document.getElementById("toast");
  x.innerHTML = text;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

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
        var copyBtn = $("copy-btn");
        var shareLink = $(".share-link");
        var link = shareLink.value;
        console.log("link:"+link);
        
        function copyToClipboard() {
          console.log("clicked");
          var shareLink = document.querySelector(".share-link");
          shareLink.select();
          shareLink.setSelectionRange(0, 99999)
          document.execCommand("copy");
        }
        
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
