import { useState, useEffect } from 'react'
import { loadProfiles } from '../profiles'
import { createCloudProfile } from '../lib/cloudDataService'

export default function MigrateDialog({ userId, onDone }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const local = loadProfiles()
    const meaningful = local.filter(
      p => (p.player?.points ?? 0) > 0 || (p.player?.coins ?? 0) > 0 || (p.player?.items?.length ?? 0) > 0
    )
    setProfiles(meaningful)
  }, [])

  if (profiles.length === 0) return null

  async function handleMigrate() {
    setLoading(true)
    setError(null)
    try {
      for (const profile of profiles) {
        await createCloudProfile(userId, {
          name: profile.player?.name || 'Spieler',
          player: profile.player,
          appearance: profile.appearance,
          equipment: profile.equipment,
          myCharacters: profile.myCharacters,
          activeCharIdx: profile.activeCharIdx,
        })
      }
      localStorage.setItem('soccerStarCloudMigrated', 'true')
      onDone()
    } catch (err) {
      setError(err.message || 'Fehler beim Übertragen.')
      setLoading(false)
    }
  }

  function handleSkip() {
    localStorage.setItem('soccerStarCloudMigrated', 'true')
    onDone()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-2">📦</div>
          <h2 className="text-xl font-extrabold text-gray-800">Lokale Daten übernehmen?</h2>
          <p className="text-gray-500 text-sm mt-1">
            {profiles.length === 1
              ? 'Es gibt 1 lokales Profil mit Daten.'
              : `Es gibt ${profiles.length} lokale Profile mit Daten.`}
          </p>
        </div>

        <div className="space-y-2">
          {profiles.map((profile, idx) => (
            <div
              key={profile.id || idx}
              className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-4 py-3"
            >
              <span className="font-bold text-gray-800">
                {profile.player?.name || `Spieler ${idx + 1}`}
              </span>
              <span className="text-sm text-gray-500 space-x-2">
                <span>🏆 {profile.player?.points ?? 0}</span>
                <span>⭐ {profile.player?.stars ?? 0}</span>
                <span>🪙 {profile.player?.coins ?? 0}</span>
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl px-4 py-3 text-sm text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'Übertrage...' : 'Ja, übernehmen!'}
          </button>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-60"
          >
            Nein, leer starten
          </button>
        </div>
      </div>
    </div>
  )
}
