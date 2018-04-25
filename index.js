
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCbIwhZMu0mA0JsZKl9FIWFyflky7euWtE",
  authDomain: "playground-9b087.firebaseapp.com",
  databaseURL: "https://playground-9b087.firebaseio.com",
  projectId: "playground-9b087",
  storageBucket: "",
  messagingSenderId: "499868578110"
};
firebase.initializeApp(config);

let email = document.getElementById('txtEmail');
let userName = document.getElementById('txtUserName');
let avatar = document.getElementById('txtAvatar');
let password = document.getElementById('txtPassword');
let login = document.getElementById('btnLogin');
let signUp = document.getElementById('btnSignUp');
let logOut = document.getElementById('btnLogOut');
let chat = document.getElementById('chatSend');
let chatInput = document.getElementById('chat-input');
let chatWindow = document.getElementById('chatty');
let msg = document.getElementById('msg');
let jumbo = document.getElementById('greet');
let currentUser = "not logged in";
let error = document.getElementById('error');
let database = firebase.database();

login.addEventListener('click', e =>{
  let auth = firebase.auth();
  let promise = auth.signInWithEmailAndPassword(email.value, password.value);
  promise.catch(e => {
    console.log(e.message);
    error.classList.remove("hide");
    error.innerHTML = e.message
  });
  clearFields();
  error.classList.add("hide");
});


signUp.addEventListener('click', e =>{
  if (email.value != "" && userName.value != "" && avatar.value != "" && password.value != "") {
    let auth = firebase.auth();
    let promise = auth.createUserWithEmailAndPassword(email.value, password.value);
    
    promise.catch(e => {
      console.log(e.message);
      error.classList.remove("hide");
      error.innerHTML = e.message;
    })
      // document.getElementById('error').innerHTML = e.message;
    
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
        console.log(userName.value);
        console.log(avatar.value);
        firebaseUser.updateProfile({

                  displayName: userName.value,
                  photoURL: avatar.value

                }).then(function() {

                  currentUser = firebaseUser.displayName;
                  var photoURL = firebaseUser.photoURL;
                  
                  console.log(currentUser, photoURL);
                  clearFields();
                  
                }, function(error) {
                  console.log(error);
                }); 
      }
    });
  }
  else {
    error.classList.remove("hide");
    error.innerHTML = "Please complete each field";
  }
});

logOut.addEventListener('click', e =>{
  firebase.auth().signOut();
  console.log("signed out");
});

firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser) {
    currentUser = firebaseUser.displayName;
    logOut.classList.remove("hide");
    login.classList.add("hide");
    
    var newMsg = firebase.database().ref('msgs/');    
    var ignoreItems = true;
    
    newMsg.once('value', function(snapshot) {
      ignoreItems = false;
    });  

    newMsg.limitToLast(1).on("child_added", function(snapshot) {
      if (!ignoreItems) {
        console.log(snapshot.val());
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(snapshot.val().message));
        var momo = `<img class="avatar" src="${firebaseUser.photoURL}"><h6>${currentUser}</h6> <p>: ${div.innerHTML}</p><hr>`;
        var msgElement = document.createElement("div");
        msgElement.innerHTML = momo;
        chatWindow.appendChild(msgElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
    
    chatInput.classList.remove("hide");
    jumbo.classList.add("hide");
     
    
  } else {
    console.log("not logged in");
    logOut.classList.add("hide");
    login.classList.remove("hide");
    chatInput.classList.add("hide");
    jumbo.classList.remove("hide");
    currentUser = "not logged in";
  }
});

chat.addEventListener("click", function() {
  if (msg.value != "") {
    var userId = firebase.auth().currentUser.uid
    var name = currentUser;
    var msgText = msg.value;

    msg.value = "";

    console.log(userId);

    firebase.database().ref('msgs').push({
      userId: userId,
      username: name,
      message: msgText
    });
  }
});

const enterKey = document.getElementById("msg");
enterKey.addEventListener("keyup", function(event) {
  if (event.key === "Enter" && msg.value != "") {
    var userId = firebase.auth().currentUser.uid
    var name = currentUser;
    var msgText = msg.value;
    msg.value = "";
    console.log(userId);
    firebase.database().ref('msgs').push({
      userId: userId,
      username: name,
      message: msgText
    });
  }
})

let clearFields = function(){
    email.value = "";
    userName.value = "";
    avatar.value = "";
    password.value = "";
    error.innerHTML ="";
}  