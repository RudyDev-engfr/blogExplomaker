export default function handler(req, res) {
  // Simplement renvoyer une réponse pour confirmer que l'API fonctionne
  res.status(200).json({ message: 'API est accessible' })
}
