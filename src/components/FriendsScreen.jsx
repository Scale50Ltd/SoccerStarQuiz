import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  loadFriends,
  sendFriendRequestByName,
  respondToFriendRequest,
  removeFriend,
  loadFriendStats,
} from '../lib/cloudDataService'

export default function FriendsScreen() {
  const auth = useAuth()
  const [friends, setFriends] = useState([])
  const [statsMap, setStatsMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function getFriendName(f) {
    if (f.from_user_id === auth.user?.id) {
      return f.to_profile?.display_name ?? '?'
    }
    return f.from_profile?.display_name ?? '?'
  }

  function getFriendUserId(f) {
    if (f.from_user_id === auth.user?.id) {
      return f.to_user_id
    }
    return f.from_user_id
  }

  async function refresh() {
    if (!auth.user) return
    setLoading(true)
    try {
      const data = await loadFriends(auth.user.id)
      const list = data ?? []
      setFriends(list)

      const acceptedIds = list
        .filter(f => f.status === 'accepted')
        .map(f => getFriendUserId(f))

      if (acceptedIds.length > 0) {
        const stats = await loadFriendStats(acceptedIds)
        const map = {}
        for (const s of stats ?? []) {
          map[s.owner_user_id] = s
        }
        setStatsMap(map)
      } else {
        setStatsMap({})
      }
    } catch (e) {
      console.error('Friends load error:', e)
      setError('Fehler beim Laden der Freunde. ' + (e?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth.user) {
      refresh()
    }
  }, [auth.user])

  async function handleSendRequest(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!nameInput.trim()) return
    setSending(true)
    try {
      await sendFriendRequestByName(auth.user.id, nameInput.trim())
      setSuccess(`Anfrage an "${nameInput.trim()}" gesendet!`)
      setNameInput('')
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Fehler beim Senden der Anfrage.')
    } finally {
      setSending(false)
    }
  }

  async function handleRespond(requestId, accept) {
    setError('')
    setSuccess('')
    try {
      await respondToFriendRequest(requestId, accept)
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Fehler beim Antworten.')
    }
  }

  async function handleRemove(requestId) {
    setError('')
    setSuccess('')
    try {
      await removeFriend(requestId)
      await refresh()
    } catch (err) {
      setError(err.message ?? 'Fehler beim Entfernen.')
    }
  }

  // Not logged in
  if (!auth.user) {
    return (
      <div className="py-4 space-y-4">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
          <span className="text-sm font-bold text-amber-800">
            👫 Melde dich an, um Freunde hinzuzufügen!
          </span>
        </div>
      </div>
    )
  }

  const pending = friends.filter(
    f => f.status === 'pending' && f.to_user_id === auth.user.id
  )
  const accepted = friends.filter(f => f.status === 'accepted')
  const sent = friends.filter(
    f => f.status === 'pending' && f.from_user_id === auth.user.id
  )

  return (
    <div className="py-4 space-y-4">
      {/* Add friend form */}
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-3">👥 Freunde</h2>
        <form onSubmit={handleSendRequest} className="flex gap-2">
          <input
            type="text"
            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            placeholder="Anzeige-Name eingeben..."
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !nameInput.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold px-4 py-2 rounded-xl text-lg transition-colors"
          >
            ➕
          </button>
        </form>

        {error && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-xl text-sm text-red-700 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-xl text-sm text-green-700 font-medium">
            {success}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-6">Laden...</div>
      ) : (
        <>
          {/* Pending received */}
          {pending.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <h3 className="font-bold text-gray-700 mb-3">🔔 Neue Anfragen</h3>
              <div className="space-y-2">
                {pending.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate">{getFriendName(f)}</div>
                      <div className="text-xs text-gray-500">möchte dein Freund sein</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(f.id, true)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-lg transition-colors"
                      >
                        Ja
                      </button>
                      <button
                        onClick={() => handleRespond(f.id, false)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold px-3 py-1 rounded-lg transition-colors"
                      >
                        Nein
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accepted friends */}
          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <h3 className="font-bold text-gray-700 mb-3">🤝 Meine Freunde</h3>
            {accepted.length === 0 && sent.length === 0 && pending.length === 0 ? (
              <div className="text-center text-gray-400 py-4 text-sm">
                Noch keine Freunde. Suche jemanden über den Anzeige-Namen!
              </div>
            ) : accepted.length === 0 ? (
              <div className="text-center text-gray-400 py-4 text-sm">
                Noch keine bestätigten Freunde.
              </div>
            ) : (
              <div className="space-y-2">
                {accepted.map(f => {
                  const uid = getFriendUserId(f)
                  const stat = statsMap[uid]
                  return (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg">
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 truncate">{getFriendName(f)}</div>
                        <div className="text-xs text-gray-500">
                          {stat
                            ? `${stat.points ?? 0} Punkte · ⭐${stat.stars ?? 0}`
                            : 'Noch keine Stats'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(f.id)}
                        className="text-gray-400 hover:text-red-500 font-bold text-lg px-2 transition-colors"
                        title="Freund entfernen"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pending sent */}
          {sent.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <h3 className="font-bold text-gray-700 mb-3">📤 Gesendet (warten auf Antwort)</h3>
              <div className="space-y-2">
                {sent.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-lg">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate">{getFriendName(f)}</div>
                    </div>
                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full font-medium">
                      Warten...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Refresh button */}
      <button
        onClick={refresh}
        disabled={loading}
        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
      >
        🔄 Aktualisieren
      </button>
    </div>
  )
}
