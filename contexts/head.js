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

const HeadContextProvider = ({ children }) => {
  const [headData, setHeadData] = useState({})
  const router = useRouter()

  const updateHeadData = newData => {
    setHeadData(prevHeadData => {
      console.log('Old Head Data: ', prevHeadData)
      console.log('New Head Data: ', newData)
      return newData
    })
  }

  useEffect(() => {
    let doc
    let dataset
    const fetchTags = async () => {
      try {
        const database = firebase.database()
        if (!router.pathname.includes('inspiration') && !router.pathname.includes('spot')) {
          doc = await database.ref().child('content/pages').get()
          dataset = doc.val()
          console.log('je ne devrais pas rentrer là avec mon pathname', dataset)
        } else if (router.pathname.includes('/spot')) {
          const slug = router.asPath.split('/').pop() // gets the last part of the path, i.e., the slug
          doc = await database.ref().child(`content/spots/${slug}`).get()
          dataset = doc.val()
          console.log('je devrais rentrer là avec mon pathname', dataset)
        }
        //  else if (
        //   router.pathname.indexOf('/inspiration') !==
        //   router.pathname.split('').length - 12
        // ) {
        //   doc = await database.ref().child('/page_structure/inspiration').get()
        // }
        if (dataset) {
          console.log('dataset du head', dataset.tags)
          updateHeadData(dataset.tags)
          console.log('==== CHARGEMENT DES DONNEES HEAD REUSSIES ====')
        }
      } catch (error) {
        console.error(error)
        console.error('Le document est introuvable ou ne peut pas être utilisé')
      }
    }

    fetchTags()

    // fetch tags data on route changes
    router.events.on('routeChangeComplete', fetchTags)

    // cleanup function to remove listener on unmount
    return () => {
      router.events.off('routeChangeComplete', fetchTags)
    }
  }, [router])

  useEffect(() => {
    console.log('je suis les data depuis le context', headData)
  }, [headData])

  return (
    <HeadContext.Provider value={{ headData, updateHeadData }}>{children}</HeadContext.Provider>
  )
}

export default HeadContextProvider
