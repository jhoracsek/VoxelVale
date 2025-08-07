




/*
	Just print the information associated with this!
*/
window.addEventListener("message", (event) => {
	//event.data
	/*
		data: 
			displayName: "Jay Poopoo"
			email: "jay@voxelvale.net"
			token: "eyJhbGc..."
			uid: "KcE..."
	*/

	// So now on the client-side, I have this information.
  loggedIn = true;
  emailAccount = event.data.email;
  sessionToken = event.data.token;
  accountUID = event.data.uid;
  idToken = event.data.idToken;
  if(event.data.viaGoogle)
    verifyGoogleCredentials();
  else
    verifyNormalCredentials();
});


async function mintCustomToken(idToken) {
  try {
    const response = await fetch("https://voxelvale.net/mint-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to mint token");
    }

    return data.customToken;
  } catch (err) {
    console.error("Minting error:", err.message);
    return null;
  }
}



function sendLoginViaPost(user, idToken, viaGoogle) {
      user.getIdToken().then((token) => {
        const message = {
          uid: user.uid,
          token: token,
          email: user.email,
          displayName: user.displayName,
          idToken: idToken,
          viaGoogle: viaGoogle
        };

        if (window.opener) {
          window.opener.postMessage(message, "*");

          // Try to close immediately
          window.close();

          // If window doesn't close, show fallback
          setTimeout(() => {
            if (!window.closed) {
              document.getElementById("close-msg").style.display = "block";
            }
          }, 1000);
        }
      });
}


async function mintCustomToken(idToken) {
  try {
    const response = await fetch("https://voxelvale.net/mint-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idToken })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to mint token");
    }

    return data.customToken;
  } catch (err) {
    console.error("Minting error:", err.message);
    return null;
  }
}

