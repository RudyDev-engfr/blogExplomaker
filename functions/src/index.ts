import * as functions from 'firebase-functions'
const admin = require('firebase-admin')

admin.initializeApp()

interface searchResults {
  articles: any[]
  spots: any[]
}

interface favoritesRequest {
  spotsBookmarked: string[]
  articlesBookmarked: string[]
}

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.getFavorites = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', `${process.env.LOCATIONURL}`)
  response.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.set('Access-Control-Allow-Headers', ["*"])


  if (request.method === 'OPTIONS') {
    response.end()
  } else {
    const currentRequest: favoritesRequest = request.body
    const rootLink = (await admin.database().ref().child('dictionary/library_source').get()).val()

    const tempDocs = await admin.database().ref().child('content').get()
    if (tempDocs.exists()) {
      const tempContent = tempDocs.val()

      const articlesKeys = Object.keys(tempContent.post)
      const tempArticles = articlesKeys.map(currentKey => tempContent.post[currentKey])
      const articles = tempArticles
        .filter((article: any) => currentRequest.articlesBookmarked.includes(article.slug))
        .map(article => {
          const tempArticle = { ...article }
          tempArticle.picture.src.original = `${rootLink}${article.picture.src.original}`
          return tempArticle
        })

      const spotsKeys = Object.keys(tempContent.spots)
      const tempSpots = spotsKeys.map(currentKey => tempContent.spots[currentKey])
      const spots = tempSpots
        .filter((spot: any) => currentRequest.spotsBookmarked.includes(spot.slug))
        .map(spot => {
          const tempSpot = { ...spot }
          tempSpot.picture_main.src.original = `${rootLink}${spot.picture_main.src.original}`
          return tempSpot
        })

      const payload: searchResults = { articles, spots }
      response.status(200).send(JSON.stringify(payload))
    }
  }
})
