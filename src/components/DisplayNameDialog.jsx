import { useState } from 'react'
import { updateDisplayName } from '../lib/cloudDataService'

export default function DisplayNameDialog({ userId, currentName, onDone }) {
  const [name, setName] = useState(currentName || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const trimmed = name.trim()
  const isValid = trimmed.length >= 2 && trimmed.length <= 20

  async function handleSave() {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      await updateDisplayName(userId, trimmed)
      onDone(trimmed)
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern.')
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-2">🏷️</div>
          <h2 className="text-xl font-extrabold text-gray-800">Dein Anzeige-Name</h2>
          <p className="text-gray-500 text-sm mt-1">
            So sehen dich andere in der Rangliste und Freundesliste.
          </p>
        </div>

        <div>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="z.B. Familie Müller"
            maxLength={20}
            autoFocus
            className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{trimmed.length}/20</p>
        </div>

        {!isValid && trimmed.length > 0 && trimmed.length < 2 && (
          <p className="text-sm text-amber-600 font-medium">Mindestens 2 Zeichen erforderlich.</p>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl px-4 py-3 text-sm text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!isValid || loading}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
