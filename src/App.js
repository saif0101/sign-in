import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut,createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);



function App() {
  const [user, setUSer] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password:''
  })

  const provider = new GoogleAuthProvider();

  const handleSingIn = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL ,password} = result.user;
        const singnIned = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          password: password
          
        }
        setUSer(singnIned);
        console.log(result);

      })
      .cath(error => {
        console.log(error);
        console.log(error.message);
      })

  }
  const handleSingOut = () => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      const singnOut = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error :'',
        success: false
      }
      setUSer(singnOut);
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });

  }
  const handleChange = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isValidPass = e.target.value.length > 6;
       const passValid =  /\d{1}/.test(e.target.value);
      isFieldValid = isValidPass && passValid;
    }
    if (isFieldValid){
      const newUSerInfo = {...user};
      newUSerInfo[e.target.name]= e.target.value;
      console.log(newUSerInfo);
      setUSer(newUSerInfo);
    }
  }
  const handleSubmit=(e)=>{
    if ( user.email && user.password){ 
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, user.email, user.password)
   .then(res => {
     // Signed in 
    //  const user = userCredential.user;
     const newUSerInfo ={...user};
     newUSerInfo.error ='';
     newUSerInfo.success = true;
     setUSer(newUSerInfo);
     // ...
   })
   .catch((error) => {
   
     const newUSerInfo = {...user};
     newUSerInfo.error = error.message;
     newUSerInfo.success = false ;
     setUSer(newUSerInfo);
  
     // ..
   });
  
  }
  e.preventDefault();
  }


    return (
      <div className="App">


        {user.isSignedIn ? <button onClick={handleSingOut}> Sing out </button> : <button onClick={handleSingIn}> Sing In</button>

        }
        {
          user.isSignedIn &&
          <div>
            <h1> Welcome {user.name} </h1>
            <h4> Your email : {user.email}</h4>
            <img src={user.photo} alt="photoURL" />
          </div>
        }

        <h4> Sign in Here</h4>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" onBlur={handleChange} placeholder='type your email' required />
          <br />
          <input type="password" name="password"  onBlur={handleChange} placeholder='type your password' required />
          <br />
          <input type="submit"  value=" submit" />
        </form>
        {user.error && <p style={{color: 'red'}} > The email is in Used</p>}
        {user.success && <p style={{color: 'green'}} > User Created Succesfully</p>}
    </div>
  );
}
export default App;
