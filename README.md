# HomieHub

**HomieHub** is a mobile app designed to improve the lives of college students living with roommates. It offers a streamlined solution to common challenges faced by roommates, making shared living spaces more harmonious and enjoyable.

## Key Features

- **Task Management:** Keep track of shared responsibilities, such as grocery shopping and chores, with ease. Assign tasks, set reminders, and ensure everyone is on the same page.

- **Shared Shopping List:** Maintain a shared shopping list of items needed for the household. Collaboratively add and update items for more efficient shopping.

## Getting Started

Follow these steps to get a development environment up and running:

1. Clone this repository:

   ```
   git clone https://github.com/aarontorres0/HomieHub.git
   ```

2. Navigate to the project directory:
   ```
   cd HomieHub
   ```
3. Install dependencies:

   ```
   npm install
   ```

4. Run the app:

   ```
   npm start
   ```

## Setting Up Firebase

To enable Firebase in this project, follow these steps:

1. **Create a Firebase Project:**

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click on "Add Project" and follow the setup instructions.

2. **Add Firebase Configuration:**

   - In your project's root directory, locate the `firebaseConfig.js` file.
   - Update the Firebase configuration in this file with your project's credentials.

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```
