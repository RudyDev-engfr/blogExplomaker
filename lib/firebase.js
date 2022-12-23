import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import { useEffect, useState } from 'react'

const firebaseConfig = {
  apiKey: 'AIzaSyAgeZlnX0NxeuHRjVylQMGLZOla4zWE9p8',
  authDomain: 'explomaker-3010b.firebaseapp.com',
  databaseURL: 'https://explomaker-3010b.firebaseio.com',
  projectId: 'explomaker-3010b',
  storageBucket: 'explomaker-3010b.appspot.com',
  messagingSenderId: '607806486683',
  appId: '1:607806486683:web:9faddae9a305f878f0ae3e',
  measurementId: 'G-154BFD5KW3',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  if (
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    // eslint-disable-next-line dot-notation
    !window['_init']
  ) {
    // eslint-disable-next-line no-console
    console.warn('Using local Realtime Database')
    firebase.database().useEmulator('localhost', 9000)
    // eslint-disable-next-line no-console
    console.warn('Using local Firestore')
    firebase.firestore().settings({
      host: 'localhost:8080',
      ssl: false,
    })
    // eslint-disable-next-line no-console
    console.warn('Using local Auth')
    firebase.auth().useEmulator('http://localhost:9099/', { disableWarnings: true })
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line dot-notation
      window['_init'] = true
    }
  }
}

/* firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL) */
// eslint-disable-next-line import/prefer-default-export
export const auth = firebase.auth()

// eslint-disable-next-line import/prefer-default-export
export const firestore = firebase.firestore()
// eslint-disable-next-line import/prefer-default-export
export const database = firebase.database()

export const signInWithEmailAndPassword = async (email, password) => {
  const response = await auth.signInWithEmailAndPassword(email, password)
  return response
}

export const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      fullLabel: 'Continuer avec Facebook',
      iconUrl:
        'https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2Ffacebook.svg?alt=media&token=bb97f642-7312-47d6-aca8-7d38ffa5742f',
    },
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      fullLabel: 'Continuer avec Google',
      iconUrl:
        'https://firebasestorage.googleapis.com/v0/b/explomaker-3010b.appspot.com/o/blog%2Fgoogle.svg?alt=media&token=bed8070b-456e-4028-80a8-905932ec60e6',
    },
  ],
}

// export const loadArticleSiteMap = async (articles = false, spots = false) => {
//   const myPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(
//         database
//           .ref()
//           .child('site_map/post')
//           .get()
//           .then(results => results.val())
//       )
//     }, 1000)
//   })

//   myPromise.then(result => {
//     console.log('result', result)
//     return result
//   })
// }

export const mailCollection = firestore.collection('mails')

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const firebaseUser = auth.currentUser
    return { initializing: !firebaseUser, firebaseUser }
  })

  function onChange(firebaseUser) {
    setState({ initializing: false, firebaseUser })
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    return () => unsubscribe()
  }, [])

  return state
}
