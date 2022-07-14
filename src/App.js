import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth,updateProfile, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);



function App() {

  const [newUser, setnewUser] = useState(false);
  const [user, setUSer] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })

  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();


  const handleSingIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL, password } = result.user;
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
        error: '',
        success: false
      }
      setUSer(singnOut);
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });

  }

  const handleFbSingIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then(result => {

        // The signed-in user info.
        const user = result.user;
        console.log(user);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;


        // ...
      })


      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });

  }



      const handleChange = (e) => {
        let isFieldValid = true;
        if (e.target.name === "email") {
          isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
        }
        if (e.target.name === "password") {
          const isValidPass = e.target.value.length > 6;
          const passValid = /\d{1}/.test(e.target.value);
          isFieldValid = isValidPass && passValid;
        }
        if (isFieldValid) {
          const newUSerInfo = { ...user };
          newUSerInfo[e.target.name] = e.target.value;
          console.log(newUSerInfo);
          setUSer(newUSerInfo);
        }
      }
      const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {
          const auth = getAuth(app);
          createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(res => {
              // Signed in 
              //  const user = userCredential.user;
              const newUSerInfo = { ...user };
              newUSerInfo.error = '';
              newUSerInfo.success = true;
              setUSer(newUSerInfo);
              updateUserName(user.name);

            })
            .catch((error) => {

              const newUSerInfo = { ...user };
              newUSerInfo.error = error.message;
              newUSerInfo.success = false;
              setUSer(newUSerInfo);

              // ..
            });

        }

        if (!newUser && user.email && user.password) {
          const auth = getAuth();
          signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              const newUSerInfo = { ...user };
              newUSerInfo.error = '';
              newUSerInfo.success = true;
              setUSer(newUSerInfo);
              console.log(user)
              // ...
            })
            .catch((error) => {
              const newUSerInfo = { ...user };
              newUSerInfo.error = error.message;
              newUSerInfo.success = false;
              setUSer(newUSerInfo);
            });

        }
        e.preventDefault();
      }
      const updateUserName = name => {
        const auth = getAuth();
        updateProfile(auth.currentUser, {
          displayName: name
        }).then(() => {
          // Profile updated!
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });

      }


      return (
        <div className="App">


          {user.isSignedIn ? <button onClick={handleSingOut}> Sing out </button> : <button onClick={handleSingIn}> Sing In</button>}
          <br />
          <button onClick={handleFbSingIn}> Sing In with Facebook </button>

          {
            user.isSignedIn &&
            <div>
              <h1> Welcome {user.name} </h1>
              <h4> Your email : {user.email}</h4>
              <img src={user.photo} alt="photoURL" />

            </div>
          }

          <h4> Sign in Here</h4>
          <input type="checkbox" onChange={() => setnewUser(!newUser)} name=" newUser" />
          <label htmlFor="newUSer">New USer Sign Up</label>
          <form onSubmit={() => handleSubmit}>
            {
              newUser && <input type="text" name="name" placeholder='type your name' onBlur={handleChange} />
            }
            <br />
            <input type="email" name="email" onBlur={handleChange} placeholder='type your email' required />
            <br />
            <input type="password" name="password" onBlur={handleChange} placeholder='type your password' required />
            <br />
            <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
          </form>
          {user.error && <p style={{ color: 'red' }} > The email is in Used</p>}
          {user.success && <p style={{ color: 'green' }} > User {newUser ? 'Created' : 'Login'} Succesfully</p>}
        </div>
      );
    }
export default App;
