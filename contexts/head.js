import { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import { useRouter } from 'next/router'

// Initialisez votre application Firebase ici
const firebaseConfig = {
  // Ajoutez ici la configuration de votre application Firebase
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const HeadContext = createContext()

export const HeadProvider = ({ children }) => {
  const [headData, setHeadData] = useState({})
  const router = useRouter()

  const updateHeadData = newData => {
    setHeadData(newData)
  }

  useEffect(() => {
    let doc
    const fetchTags = async () => {
      try {
        const database = firebase.database()
        if (!router.pathname.includes('inspiration') && !router.pathname.includes('spot')) {
          doc = await database.ref().child('content/pages/aide').get()
        }
        if (doc.exists()) {
          const dataset = doc.val()
          updateHeadData(dataset.tags)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchTags()
  }, [])

  return (
    <HeadContext.Provider value={{ headData, updateHeadData }}>{children}</HeadContext.Provider>
  )
}
