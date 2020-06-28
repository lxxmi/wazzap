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
  var shareDialog = document.querySelector(".share-dialog");
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