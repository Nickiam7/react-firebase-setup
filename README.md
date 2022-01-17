# react-firebase-setup

A simple, light-weight setup for React and Firestore that can be easily dropped into any React or React Native app. Comes with a Firebase config, authContext and multiple hooks for a complete authentication flow, CRUD functionality and file storage.

## config/
Initializes and exports the necessary services from Firebase
  - app
  - firestore
  - auth
  - storage

## context/
Initializes an auth context and exports `AuthContextProvider` with state containing `user` and `authReady`. Also creates an `authReducer` containing three actions (`LOGIN`, `LOGOUT`, `AUTH_READY`).

## hooks/
Collection of hooks to easily implement auth flow and CRUD actions, including file storage.
- useAuthContext
- useCollection
- useDocument
- useFirestore (Contains file storage functionality)
- useLogin
- useLogout
- useResetPassword
- useSignup
- useUpdatePassword
