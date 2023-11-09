import { cookies } from 'next/headers'
import admin from 'firebase-admin'

// ... Initialisation de Firebase Admin ...

const serviceAccountJson = require('../../explomaker-3010b-firebase-adminsdk-ehzf0-445dfce34f.json')

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
    })
    console.log('Firebase Admin initialisé avec succès')
  } catch (error) {
    console.error('Erreur lors de l’initialisation de Firebase Admin:', error)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Seules les requêtes POST sont autorisées' })
  }

  const { uid } = req.body

  try {
    const customToken = await admin.auth().createCustomToken(uid)

    // Utilisation de la fonction cookies pour définir le cookie
    res.setHeader(
      'Set-Cookie',
      `customToken=${customToken}; Path=/; Domain=.explomaker.fr; Max-Age=3600; HttpOnly; Secure; SameSite=None`
    )

    res.status(200).send({ customToken })
  } catch (error) {
    console.error('Erreur lors de la génération du custom token:', error.message)
    res.status(500).send({ error: error.message })
  }
}
