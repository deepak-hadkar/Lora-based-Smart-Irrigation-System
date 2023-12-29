
// Select the sign-in form and create-account form elements
const signinForm = document.getElementById('signin-form');
const createAccountForm = document.getElementById('create-account-form');

// Select the "Create an account" and "Sign In" links
const createAccountLink = document.getElementById('create-account');
const returnToSigninLink = document.getElementById('return-to-signin');

// Select the sign-in and create-account container elements
const signinContainer = document.querySelector('.signin-container');
const createAccountContainer = document.querySelector('.create-account-container');

// Add event listener for the "Create an account" link
createAccountLink.addEventListener('click', function(event) {
	event.preventDefault();

	// Hide the sign-in container and show the create-account container
	signinContainer.style.display = 'none';
	createAccountContainer.style.display = 'block';
});

// Add event listener for the "Sign In" link
returnToSigninLink.addEventListener('click', function(event) {
	event.preventDefault();

	// Hide the create-account container and show the sign-in container
	createAccountContainer.style.display = 'none';
	signinContainer.style.display = 'block';
});

// Add event listener for the sign-in form
/* signinForm.addEventListener('submit')

const signinButton = document.getElementById("signin-button")
signinButton.addEventListener("click", () =>{



	if()
}) */

// Initialize Firebase
var firebaseConfig = {
	// Your Firebase configuration goes here
  };
  firebase.initializeApp(firebaseConfig);
  
  // Get the email and password fields from the login form
  const emailField = document.getElementById("email-field");
  const passwordField = document.getElementById("password-field");
  
  // Get the login button from the login form
  const loginButton = document.getElementById("login-button");
  
  // Add an event listener to the login button
  loginButton.addEventListener("click", () => {
	const email = emailField.value;
	const password = passwordField.value;
  
	// Call Firebase Authentication API to sign in the user
	firebase.auth().signInWithEmailAndPassword(email, password)
	  .then((userCredential) => {
		// The user is signed in
		const user = userCredential.user;
		console.log("User signed in: ", user);
		// Redirect the user to the account page
		window.location.href = "/account"; // Replace "/account" with the actual URL of your account page
	  })
	  .catch((error) => {
		// Handle errors here
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error("Error signing in: ", errorMessage);
	  });
  });