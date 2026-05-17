import { useState } from 'react'

const MAX_PROFILES = 5

export default function ProfileSelect({ profiles, onSelect, onCreate, onDelete }) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleCreate() {
    if (newName.trim()) {
      onCreate(newName.trim())
      setNewName('')
      setCreating(false)
    }
  }

  return (
    <div className="py-6 px-4 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">⚽</div>
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg mb-1">Soccer Star Quiz</h1>
        <p className="text-green-100 text-lg">Wer spielt heute?</p>
      </div>

      <div className="bg-white/95 backdrop-blur rounded-3xl p-5 shadow-2xl space-y-3">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Profile</h2>

        {profiles.map((profile, idx) => (
          <div key={profile.id} className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 hover:border-green-400 transition-all">
            <button
              onClick={() => onSelect(profile)}
              className="flex-1 text-left"
            >
              <div className="font-bold text-lg text-gray-800">{profile.player?.name || `Spieler ${idx + 1}`}</div>
              <div className="text-sm text-gray-500">
                🪙 {profile.player?.coins || 0} Münzen · ⭐ {profile.player?.stars || 0} Sterne
              </div>
            </button>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => onSelect(profile)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow hover:brightness-110 active:scale-95 transition-all"
              >
                Spielen
              </button>
              {profiles.length > 1 && (
                <button
                  onClick={() => setDeleteConfirm(profile.id)}
                  className="px-3 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 active:scale-95 transition-all"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Delete confirmation */}
        {deleteConfirm && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-center">
            <p className="font-bold text-red-700 mb-3">Profil wirklich löschen? Alle Daten gehen verloren!</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null) }}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl active:scale-95">
                Ja, löschen
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95">
                Abbrechen
              </button>
            </div>
          </div>
        )}

        {/* New profile */}
        {creating ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Name eingeben..."
              className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={!newName.trim()}
                className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 active:scale-95">
                Erstellen
              </button>
              <button onClick={() => { setCreating(false); setNewName('') }}
                className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl active:scale-95">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          profiles.length < MAX_PROFILES && (
            <button
              onClick={() => setCreating(true)}
              className="w-full py-4 border-2 border-dashed border-green-300 bg-green-50 rounded-2xl font-bold text-green-700 text-lg hover:bg-green-100 active:scale-95 transition-all"
            >
              ➕ Neues Profil erstellen
            </button>
          )
        )}
      </div>
    </div>
  )
}
