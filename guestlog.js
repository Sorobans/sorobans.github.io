'use strict';
/*
// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use

import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import * as firebaseui from 'firebaseui';
*/
// Document elements

//ough

const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');


let rsvpListener = null;
let guestbookListener = null;

let db, auth = null;


const firebaseConfig = {
  apiKey: 'AIzaSyDn0xUiIqQcQ1jMYUbA0LbRJXyKQUR9rR8',

  authDomain: 'warpzonesite-1bfca.firebaseapp.com',

  projectId: 'warpzonesite-1bfca',

  storageBucket: 'warpzonesite-1bfca.appspot.com',

  messagingSenderId: '270271376664',

  appId: '1:270271376664:web:d917fa3cd532bef586026d'
};

firebase.initializeApp(firebaseConfig);
const appCheck = firebase.appCheck();
// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
appCheck.activate(
  '6Lcsc08jAAAAAMpfB9o4wQOt4ewcgSpLqMDsHYzE',

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  true);
//we need this above bit to make sure that the below bit isn't a bad safety decision. i think! we'll find out eventually. 
db = firebase.firestore();
db.collection("guestlog").orderBy("timestamp","desc");

// FirebaseUI config
/* const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    },
  },
}; */
form.addEventListener('submit', async (e) => {
  // Prevent the default form redirect
  e.preventDefault();
  // Write a new message to the database collection "guestbook"
  db.collection("guestlog").add({
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    website: document.getElementById('website').value,
    message: document.getElementById('message').value,
    timestamp: Date.now(),
    honeypot: document.getElementById('bonus').value,
  });
   
  // clear message input field
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('website').value = '';
  document.getElementById('message').value = '';
  document.getElementById('bonus').value = '';
  //let user know it has been submitted and to not do that again
  document.getElementById('guesty').innerText =
    'Sucessfully logged your message!';
  // Return false to avoid redirect
  return false;
});

// const ui = new firebaseui.auth.AuthUI(auth);
//const q = firebase.query(firestore.collection(db, 'guestlog'), firestore.orderBy('timestamp', 'desc'));
db.collection("guestlog").orderBy("timestamp","desc").get().then((querySnapshot) => {
//  guestbook.innerHTML = '';

  querySnapshot.forEach((doc) => {
    
    if (doc.data().honeypot == '') {
      const newEntry = document.createElement('div');
      newEntry.id = 'entrybox';
      
      //we now make elements for each of the fields and add them into the thing above.
      //oh god am i understanding web dev?
      const infobar = document.createElement('p');
      infobar.id = 'infobar';
      infobar.textContent =
        'NAME: ' +
        doc.data().name +
        ' WEBSITE: ' +
        doc.data().website +
        ' EMAIL: ' +
        doc.data().email + '  ';
        const datetime=document.createElement('span');
        datetime.id='datetime';
        const myDate = new Date(doc.data().timestamp);
        datetime.textContent = (myDate.toLocaleString());
        infobar.append(datetime);
      const messageholder = document.createElement('div');
      messageholder.id = 'messagebox';
      const messagecontent = document.createElement('p');
      messagecontent.id = 'messagecontent';
      messagecontent.textContent = doc.data().message;
      
      messageholder.appendChild(messagecontent);
      
      newEntry.appendChild(infobar);
      
      newEntry.appendChild(messageholder);
      

      if (doc.data().response != null){
        const responseholder=document.createElement('div');
        responseholder.id='responseholder';
        responseholder.class = 'window';
        responseholder.innerHTML=('<p id="infobar" style="width:100%; margin-left:-2px;">RESPONSE</p>');
        const responsecontent=document.createElement('p');
        responsecontent.id='responsecontent';
        responsecontent.textContent = doc.data().response;
        responseholder.appendChild(responsecontent);
        guestbook.appendChild(responseholder);
      }
      guestbook.appendChild(newEntry);
    
    }

  });
});

