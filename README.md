Overview:
This project provides a comprehensive backend API for managing user authentication and user data management. It consists of various endpoints that handle user registration, login, password management, profile updates, and session management.

Functionalities:
User Registration
Endpoint: POST /register
Description: Allows new users to register by providing necessary details like username, email, and password. Uses registerUser middleware for validation and user creation.

User Login
Endpoint: POST /login
Description: Authenticates users with their credentials (email and password) and returns a token for secure access. Uses logIn middleware to handle the login process.

User Logout
Endpoint: GET /logout
Description: Logs the user out by invalidating the session or token. Uses logOut middleware for the logout process.

Get User Details
Endpoint: GET /getuser
Description: Retrieves the authenticated user's details securely using the protect middleware to verify user authorization.

Check Logged-in Status
Endpoint: GET /loggedin
Description: Checks if the user is currently logged in. Uses loginStatus middleware to verify the login state.

Update User Information
Endpoint: PATCH /updateuser
Description: Allows authenticated users to update their profile information securely. Uses protect middleware for authorization and updateUser middleware for handling the update process.

Change Password
Endpoint: PATCH /changepassword
Description: Enables users to change their password securely. It utilizes the protect middleware for verification and changePassword middleware for updating the password.

Forgot Password
Endpoint: POST /forgotpassword
Description: Handles forgotten password requests by generating a password reset link/token. Uses forgotPassword middleware for processing.

Reset Password
Endpoint: PUT /resetPassword/:resetToken
Description: Resets the password using a valid reset token. Uses resetPassword middleware for handling the reset process securely.


Technologies Used:
Node.js
Express.js
MongoDB
JWT (JSON Web Tokens) for authentication
Middleware for route protection and data validation
Error handling and validation for secure operations
