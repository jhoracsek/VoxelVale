    


    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
    import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithCustomToken, signOut, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
    import { getFirestore, doc, setDoc, getDoc, collection } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyA36b4yGnT6k620PHwRupLgoykeGML2_j4",
        authDomain: "voxelvale-fec75.firebaseapp.com",
        projectId: "voxelvale-fec75",
        storageBucket: "voxelvale-fec75.firebasestorage.app",
        messagingSenderId: "290314560027",
        appId: "1:290314560027:web:9478b33ec2aa6ffcb00ebe",
        measurementId: "G-DVMHH5L9SL"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    const database = getFirestore(app);
    const provider = new GoogleAuthProvider();

    let displayName = null;

    window.signUp = async function (){
        const email = document.getElementById('emailSu').value;
        const pass = document.getElementById('passwordSu').value;

        createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) =>{
            //Do sign up stuff
            const user = userCredential.user;

            sendEmailVerification(user)
                .then(() =>{
                    alert("Verification email sent! Please check your inbox.")
                })
                .catch((error) =>{
                    console.error("Error sending vertication email:", error.message);
                })

        })
        .catch((error)=>{
            const code = error.code;

            switch (code) {
                case "auth/email-already-in-use":
                    alert("An account already exists with this email.");
                    break;
                case "auth/weak-password":
                    alert("Password should be at least 6 characters.");
                    break;
                case "auth/invalid-email":
                    alert("Please enter a valid email address.");
                    break;
                default:
                    alert("Signup error: " + error.message);
            }
        });
    }


    window.logIn = async function() {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, pass)
        .then((user) => {
            //Do sign in stuff.
        })
        .catch((error) => {
            const code = error.code;
            alert("Invalid credentials.")

        } );
    }

    window.logOut = async function () {
        loggedIn = false;
        emailAccount = "null";
        accountUID = "null";
        signOut(auth).then(() => {});
    }

    window.googleSignInBtn = async function(){
         try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
           // console.log("Signed in user:", user);
          } catch (error) {
            console.error("Error during Google sign-in:", error.message);
            alert("Google sign-in failed: " + error.message);
          }
    }

    /*
        Functions for popup windows.

        Todo: Add signout.
    */
    window.loginViaPopup = async function(){
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (!email || !pass) return alert("Please enter an email and password.");

        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            const user = result.user;
            const idToken = await user.getIdToken();
            sendLoginViaPost(user, idToken, false);
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    window.signupViaPopup = async function () {
      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;

      if (!email || !pass) return alert("Please enter an email and password.");

      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        const user = result.user;
        const idToken = await user.getIdToken();
        sendLoginViaPost(user, idToken, false);
      } catch (err) {
        alert("Signup failed: " + err.message);
      }
    };


    
    window.verifyGoogleCredentials = async function () {
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
      } catch (err) {
        console.error("Cannot verify credentials", err.message);
      }
    };

    window.verifyNormalCredentials = async function () {
      try {
        const customToken = await mintCustomToken(idToken);
        if(!customToken) return;
        const result = await signInWithCustomToken(auth, customToken);

      } catch (err) {
        console.error("Cannot verify credentials", err.message);
      }
    };

    window.loginWithGoogleViaPopup = async function () {
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const idToken = credential.idToken;
        sendLoginViaPost(result.user, idToken, true);
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    };

    

    /*
        End popup functions.
    */

    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayName = user.email;
            //document.getElementById("username").innerHTML = displayName;
            document.getElementById("loggedout").style.visibility = "hidden";
            document.getElementById("loggedin").style.visibility = "visible";
            document.getElementById("useremail").innerHTML = displayName;
            loggedIn = true;
            emailAccount = displayName;
            sessionToken = user.token;
            accountUID = user.uid;
            // You can now load or save data for this user!
        } else {
            document.getElementById("loggedout").style.visibility = "visible";
            document.getElementById("loggedin").style.visibility = "hidden";
            loggedIn = false;
            emailAccount = "null";
            sessionToken = "null";
            accountUID = "null";
            //document.getElementById("username").innerHTML = "Not signed in.";
           // document.getElementById("authchange").innerHTML = '<ul style="padding-right:0px; padding-left:0px;"> <li  style="padding-right:10px; padding-right:10px;margin: 0px;"> <input type="email" id="email" placeholder="Email"></input></li> <li  style="padding-right:10px; padding-right:10px;margin: 0px; margin-right: 10px;"> <input type="password" id="password" placeholder="Password"></input></li><li  style="padding:5px;padding-right:10px;margin: 0px;"> Login</li><li  style="padding:5px;padding-right:10px;margin: 0px;"> Sign up</li></ul>'
        }
    });

   

    window.saveWorld = async function(worldData) {
        //console.log('Saving...')
        //const user = auth.currentUser;
        //if (!user) {
        if(!loggedIn){
            alert("You must be logged in to save!");
            return;
        }
        isSaving = true;
        saveProgress = 0;

        const xPosRef = doc(collection(database, "users", accountUID, "worlds"), "xPositions");
        const yPosRef = doc(collection(database, "users", accountUID, "worlds"), "yPositions");
        const zPosRef = doc(collection(database, "users", accountUID, "worlds"), "zPositions");

        const objNumRef = doc(collection(database, "users", accountUID, "worlds"), "objectNumbers");

        const ref = doc(collection(database, "users", accountUID, "worlds"), "aux");

        const townFolkInfo = doc(collection(database, "users", accountUID, "worlds"), "townFolkInfo");

        let info = getWorldObj();



        try {

            await setDoc(xPosRef, {
                xPos: info[0]
            });
            saveProgress = 40;
            await setDoc(yPosRef, {
                yPos: info[1]
            });
            saveProgress = 60;
            await setDoc(zPosRef, {
                zPos: info[2]
            });
            saveProgress = 80;
            await setDoc(objNumRef, {
                objectNumbers: info[3]
            });
            saveProgress = 99;
            await setDoc(ref, {
                blockInstanceInfo: info[4],
                invObjNums: info[5],
                position: info[6],
                health: info[7],
                toolbar: info[8],
                gold: info[9],
                silver: info[10],
                version: GAME_VERSION
                //lastModified: new Date().toISOString()
            });
            await setDoc(townFolkInfo, {
                numFolk: info[11],
                folkNumberOrder: info[12],
                folkPositions: info[13]
            });
            //console.log("World saved!");
            pQueue.empty();
            keyboardDisabled=false;
            disableInventoryCursor = false;
        } catch (err) {
            alert("There was an error saving your world!");
            console.error("Save error:", err.message);
        }
        saveProgress = -1;
        isSaving = false;
    }

    window.loadWorld = async function(){
        const user = auth.currentUser;
        if(!user){
            alert("You must be logged in to load your world!");
            return;
        }

        isLoading = true;
        loadProgress = 0;

        const xPosRef = doc(collection(database, "users", user.uid, "worlds"), "xPositions");
        const yPosRef = doc(collection(database, "users", user.uid, "worlds"), "yPositions");
        const zPosRef = doc(collection(database, "users", user.uid, "worlds"), "zPositions");

        const objNumRef = doc(collection(database, "users", user.uid, "worlds"), "objectNumbers");

        const ref = doc(collection(database, "users", user.uid, "worlds"), "aux");

        const townFolkInfo = doc(collection(database, "users", user.uid, "worlds"), "townFolkInfo");

        let loadedWorldX = null;
        let loadedWorldY = null;
        let loadedWorldZ = null;
        let loadedWorldNum = null;
        let loadedWorld = null;
        let loadedWorldTFI = null;

        try {
            const snapshotX = await getDoc(xPosRef);
            const snapshotY = await getDoc(yPosRef);
            const snapshotZ = await getDoc(zPosRef);
            const snapshotObjNum = await getDoc(objNumRef);
            const snapshot = await getDoc(ref);
            const snapshotTFI = await getDoc(townFolkInfo);
            loadProgress = 5;
           

            if (snapshot.exists()) {
                loadedWorldX = snapshotX.data();
                loadedWorldY = snapshotY.data();
                loadedWorldZ = snapshotZ.data();
                loadedWorldNum = snapshotObjNum.data();
                loadedWorld = snapshot.data();
                loadedWorldTFI = snapshotTFI.data();
            } else {
                alert("You haven't saved a world yet!");
            }
           
        } catch (err) {
            console.error("Load error:", err.message);
        }
       
        if(loadedWorld!=null){
            loadWorldIntoGame(loadedWorldX, loadedWorldY, loadedWorldZ, loadedWorldNum, loadedWorld, loadedWorldTFI);
            //console.log('Done!');
        }
        
        pQueue.empty();
        isLoading = false;
        loadProgress = -1;
    }