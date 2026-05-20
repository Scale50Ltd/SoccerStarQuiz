import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { loadLeaderboard } from '../lib/cloudDataService'

const SORT_OPTIONS = [
  { key: 'points', label: 'Punkte', icon: '🎯' },
  { key: 'stars', label: 'Sterne', icon: '⭐' },
  { key: 'golden_stars', label: 'Goldene Sterne', icon: '🌟' },
  { key: 'coins', label: 'Münzen', icon: '🪙' },
]

export default function RankingScreen({ player }) {
  const auth = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortKey, setSortKey] = useState('points')

  async function fetchLeaderboard() {
    setLoading(true)
    setError(null)
    try {
      const data = await loadLeaderboard()
      setEntries(data || [])
    } catch (err) {
      setError(err.message || 'Fehler beim Laden der Rangliste.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.user) {
      fetchLeaderboard()
    }
  }, [auth?.user])

  const sorted = [...entries].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))

  function rankStyle(i) {
    if (i === 0) return 'bg-yellow-400 text-yellow-900'
    if (i === 1) return 'bg-gray-300 text-gray-700'
    if (i === 2) return 'bg-amber-600 text-white'
    return 'bg-gray-200 text-gray-600'
  }

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Bestenliste</h2>

        {!auth?.user ? (
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
            <span className="text-sm font-bold text-amber-800">
              🏆 Melde dich an, um die Online-Rangliste zu sehen!
            </span>
          </div>
        ) : (
          <>
            {/* Sort buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                    sortKey === opt.key
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* States */}
            {loading && (
              <p className="text-center text-gray-500 py-6">Lade Rangliste...</p>
            )}

            {error && !loading && (
              <p className="text-center text-red-500 py-6">{error}</p>
            )}

            {!loading && !error && sorted.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                Noch keine Einträge. Spiel ein Quiz!
              </p>
            )}

            {!loading && !error && sorted.length > 0 && (
              <div className="space-y-2">
                {sorted.map((entry, i) => {
                  const isOwn = entry.owner_user_id === auth.user?.id
                  return (
                    <div
                      key={entry.player_profile_id || i}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isOwn
                          ? 'bg-green-50 border-2 border-green-300'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${rankStyle(i)}`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 truncate">
                          {entry.display_name || entry.player_name}{' '}
                          {entry.display_name && entry.player_name && entry.display_name !== entry.player_name && (
                            <span className="text-gray-400 font-normal text-xs">({entry.player_name})</span>
                          )}
                          {isOwn && (
                            <span className="text-green-600 text-xs ml-1">(Du)</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          🎯{entry.points ?? 0} · ⭐{entry.stars ?? 0} · 🌟{entry.golden_stars ?? 0} · 🪙{entry.coins ?? 0}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Refresh button */}
            <div className="mt-4 text-center">
              <button
                onClick={fetchLeaderboard}
                disabled={loading}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Aktualisieren
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
