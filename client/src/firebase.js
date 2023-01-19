import {initializeApp} from "firebase/app";
import {getAuth,GoogleAuthProvider,setPersistence,  browserSessionPersistence} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyAGR9qhofgWPt0KY1JOHmfqJFGLRMoErig",
    authDomain: "whatsapp-clone-f3f2d.firebaseapp.com",
    projectId: "whatsapp-clone-f3f2d",
    storageBucket: "whatsapp-clone-f3f2d.appspot.com",
    messagingSenderId: "442801826152",
    appId: "1:442801826152:web:6a6e7f98c22e67f3c10edd",
    measurementId: "G-BF6QE8EE7E"
  };



  const app=initializeApp(firebaseConfig);
  const auth =getAuth();
  const provider = new GoogleAuthProvider();
  // (async () => {
  //   await setPersistence(auth, browserSessionPersistence);
  // })();

  
  export{app,auth,provider}


 

    