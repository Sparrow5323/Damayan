# Firebase Setup Guide

## Step 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **Add project** → name it (e.g. `barangay-damayang-lagi`)
3. Disable Google Analytics (optional), click **Create project**

## Step 2 — Enable Authentication

1. In the Firebase console, go to **Build → Authentication**
2. Click **Get started**
3. Under **Sign-in method**, enable **Email/Password**

## Step 3 — Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (you can add security rules later)
4. Choose a region closest to you (e.g. `asia-southeast1` for Philippines)

## Step 4 — Get your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Under **Your apps**, click the **</>** (Web) icon
3. Register your app with a nickname (e.g. `barangay-web`)
4. Copy the `firebaseConfig` object

## Step 5 — Add Config to the Project

Open `c:\xampp\htdocs\website\assets\js\firebase-config.js`
and replace the placeholder values with your actual config:

```js
const firebaseConfig = {
    apiKey:            "AIza...",
    authDomain:        "your-project.firebaseapp.com",
    projectId:         "your-project-id",
    storageBucket:     "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId:             "1:123456789:web:abc123"
};
```

## Step 6 — Create the First Admin User

1. Go to Firebase Console → Authentication → Users
2. Click **Add user**, enter an admin email and password
3. After the user logs in for the first time, go to
   **Firestore → users collection** and find their document
4. Set `role: "admin"` on that document

## Firestore Collections Used

| Collection     | Purpose                              |
|----------------|--------------------------------------|
| `users`        | User profiles (role, name, contact)  |
| `residents`    | Residency registration applications  |
| `requests`     | Clearance / ID / Business permit     |
| `blotter`      | Blotter incident reports             |
| `announcements`| Barangay announcements               |
| `events`       | Calendar events                      |

## Firestore Security Rules (recommended for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }

    match /users/{uid} {
      allow read:   if request.auth != null;
      allow write:  if isOwner(uid) || isAdmin();
    }

    match /requests/{id} {
      allow read:   if request.auth != null && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }

    match /residents/{id} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }

    match /blotter/{id} {
      allow read:   if request.auth != null && (resource.data.uid == request.auth.uid || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }

    match /announcements/{id} {
      allow read:  if request.auth != null;
      allow write: if isAdmin();
    }

    match /events/{id} {
      allow read:  if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```
