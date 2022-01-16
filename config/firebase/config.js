import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  // Paste configuration object from project settings page
  // in Firebase console of your app
}

firebase.initializeApp(firebaseConfig)

const firestore = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

const timestamp = firebase.firestore.Timestamp

export {
  firestore,
  auth,
  storage,
  timestamp
}
