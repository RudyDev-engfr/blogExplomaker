import { createContext, useEffect, useState } from 'react'
import { firestore, useAuth } from '../lib/firebase'

export const SessionContext = createContext()
const SessionContextProvider = ({ children }) => {
  const localUser = JSON.parse(localStorage.getItem('user'))
  const [user, setUser] = useState(localUser || {})
  const [searchValue, setSearchValue] = useState('')
  const [needFetch, setNeedFetch] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState('')
  const [currentHitsArray, setCurrentHitsArray] = useState()
  // currentHitsArray is the array of results from Algolia

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const { initializing, firebaseUser } = useAuth()

  useEffect(() => {
    if (firebaseUser) {
      const tempUser = { isLoggedIn: true, id: firebaseUser.uid }
      firestore
        .collection('users')
        .doc(firebaseUser.uid)
        .onSnapshot(doc => {
          const data = doc.data()
          if (typeof data !== 'undefined') {
            tempUser.gender = data.gender
            tempUser.firstname = data.firstname
            tempUser.lastname = data.lastname
            tempUser.birthdate = data.birthdate
            tempUser.email = data.email
            tempUser.avatar = data.avatar
            tempUser.type = data.type
            tempUser.rangeType = data.rangeType
            tempUser.likes = data.likes
            tempUser.newsletter = data.newsletter
            tempUser.spotsLiked = data.spotsLiked
            tempUser.spotsBookmarked = data.spotsBookmarked
            tempUser.articlesLiked = data.articlesLiked
            tempUser.articlesBookmarked = data.articlesBookmarked
            setUser({ ...tempUser })
          }
        })
    } else if (!initializing) {
      setUser({ isLoggedIn: false })
    }
  }, [firebaseUser, initializing])

  const spotsBookmarkedUpdate = slug => {
    let tempBookmarks = user?.spotsBookmarked || []
    const updateData = {}
    const tempLikes = user?.spotsLiked || []

    if (tempBookmarks.includes(slug)) {
      tempBookmarks = tempBookmarks.filter(bookmark => bookmark !== slug)
    } else {
      if (!tempLikes.includes(slug)) {
        tempLikes.push(slug)
        updateData.spotsLiked = [...tempLikes]
      }
      tempBookmarks.push(slug)
    }

    updateData.spotsBookmarked = [...tempBookmarks]

    firestore
      .collection('users')
      .doc(user.id)
      .set({ ...updateData }, { merge: true })
  }

  const spotsLikedUpdate = slug => {
    let tempLikes = user?.spotsLiked || []
    if (tempLikes.includes(slug)) {
      tempLikes = tempLikes.filter(like => like !== slug)
    } else {
      tempLikes.push(slug)
    }
    firestore
      .collection('users')
      .doc(user.id)
      .set({ spotsLiked: [...tempLikes] }, { merge: true })
  }

  const articlesBookmarkedUpdate = slug => {
    let tempBookmarks = user?.articlesBookmarked || []
    const updateData = {}
    const tempLikes = user?.spotsLiked || []

    if (tempBookmarks.includes(slug)) {
      tempBookmarks = tempBookmarks.filter(bookmark => bookmark !== slug)
    } else {
      if (!tempLikes.includes(slug)) {
        tempLikes.push(slug)
        // eslint-disable-next-line no-undef
        updateData.articlesLiked = structuredClone(tempLikes)
      }
      tempBookmarks.push(slug)
    }

    updateData.articlesBookmarked = [...tempBookmarks]

    firestore
      .collection('users')
      .doc(user.id)
      .set({ ...updateData }, { merge: true })
  }

  const articlesLikedUpdate = slug => {
    let tempLikes = user?.articlesLiked || []
    if (tempLikes.includes(slug)) {
      tempLikes = tempLikes.filter(like => like !== slug)
    } else {
      tempLikes.push(slug)
    }
    firestore
      .collection('users')
      .doc(user.id)
      .set({ articlesLiked: [...tempLikes] }, { merge: true })
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        searchValue,
        setSearchValue,
        spotsBookmarkedUpdate,
        articlesBookmarkedUpdate,
        spotsLikedUpdate,
        articlesLikedUpdate,
        isAuthModalOpen,
        setIsAuthModalOpen,
        needFetch,
        setNeedFetch,
        currentHitsArray,
        setCurrentHitsArray,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContextProvider
