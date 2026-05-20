import { useState, useEffect } from 'react'
import FootballerSVG from './FootballerSVG'
import { loadAppearance } from './CharacterEditor'
import { loadEquipment, TRIKOT_DATA } from './EquipmentScreen'
import { shopItems } from '../shopData'
import StadiumBg from './StadiumBg'
import { getOverallTier } from '../unlocks'
import { useAuth } from '../contexts/AuthContext'
import { getOrCreateUserProfile, updateDisplayName, loadCloudProfiles } from '../lib/cloudDataService'
import { supabase } from '../lib/supabase'

export default function ProfileScreen({ player, setScreen }) {
  const auth = useAuth()
  const appearance = loadAppearance()
  const equip = loadEquipment()
  const trikotInfo = equip.trikotId ? TRIKOT_DATA[equip.trikotId] : null
  const activeChar = equip.charId ? shopItems.charaktere.find(c => c.id === equip.charId) : null
  const playerTier = getOverallTier(player.items || [])

  return (
    <div className="screen-with-stadium">
      <StadiumBg />

      <div className="relative z-10">
        {/* Character - scrolls normally with content */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="bg-black/25 backdrop-blur-sm rounded-3xl px-8 py-4 shadow-xl">
            <FootballerSVG
              {...appearance}
              trikotColor={trikotInfo?.color || '#22c55e'}
              trikotAccent={trikotInfo?.accent || '#ffffff'}
              trikotPattern={trikotInfo?.pattern || null}
              trikotName={trikotInfo?.name || ''}
              trikotNumber={trikotInfo?.number || ''}
              ballId={equip.ballId || null}
              bgId={equip.bgId || null}
              pose={activeChar?.pose || null}
              animation={activeChar?.animation || null}
              size={200}
            />
            <div className="text-center mt-2">
              <h2 className="text-2xl font-extrabold text-white drop-shadow">{player.name}</h2>
              <p className="text-green-200 font-semibold">{player.character}</p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="px-4 pb-12 max-w-md mx-auto space-y-4">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
              <div className="text-3xl font-extrabold text-green-600">{player.points}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Punkte</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
              <div className="text-3xl font-extrabold text-yellow-500">⭐ {player.stars}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Sterne</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
              <div className="text-3xl font-extrabold text-amber-500">🌟 {player.goldenStars}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Goldene Sterne</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
              <div className="text-3xl font-extrabold text-blue-500">🪙 {player.coins}</div>
              <div className="text-sm font-bold text-gray-600 mt-1">Münzen</div>
            </div>
          </div>

          {/* Tier & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 backdrop-blur rounded-2xl p-4 text-center shadow-lg border border-amber-200">
              <div className="text-2xl font-extrabold text-amber-600">🏅 Stufe {playerTier}</div>
              <div className="text-xs font-bold text-amber-700 mt-1">Freigeschaltet</div>
            </div>
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 text-center shadow-lg">
              <div className="text-sm font-bold text-gray-500">Schwierigkeit</div>
              <div className="text-xl font-bold text-gray-800 capitalize">{player.difficulty}</div>
            </div>
          </div>

          {/* Items */}
          {player.items.length > 0 && (
            <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
              <h3 className="font-bold text-gray-700 mb-3 text-lg">Gekaufte Items</h3>
              <div className="flex flex-wrap gap-2">
                {player.items.map(id => {
                  const allItems = [...shopItems.charaktere, ...shopItems.trikots, ...shopItems.baelle, ...shopItems.hintergruende]
                  const item = allItems.find(i => i.id === id)
                  return item ? (
                    <span key={id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-sm font-semibold">
                      {item.emoji || '⚽'} {item.name}
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Display name editor (only when online) */}
          {auth?.isOnline && <DisplayNameEditor userId={auth.user.id} />}

          {/* Sync debug info (only when online) */}
          {auth?.isOnline && <SyncDebug userId={auth.user.id} />}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setScreen('editor')}
              className="py-4 btn-fun-purple text-white font-bold text-lg rounded-2xl hover:brightness-110 active:scale-95 transition-all"
            >
              ✏️ Aussehen
            </button>
            <button
              onClick={() => setScreen('quiz')}
              className="py-4 btn-fun-green text-white font-bold text-lg rounded-2xl hover:brightness-110 active:scale-95 transition-all"
            >
              ⚽ Quiz
            </button>
            <button
              onClick={() => setScreen('equipment')}
              className="py-4 btn-fun-blue text-white font-bold text-lg rounded-2xl hover:brightness-110 active:scale-95 transition-all"
            >
              👕 Ausrüstung
            </button>
            <button
              onClick={() => setScreen('exchange')}
              className="py-4 btn-fun-amber text-white font-bold text-lg rounded-2xl hover:brightness-110 active:scale-95 transition-all"
            >
              💰 Tauschen
            </button>
          </div>

          {/* Extra scroll space */}
          <div className="h-32"></div>
        </div>
      </div>
    </div>
  )
}

function DisplayNameEditor({ userId }) {
  const [name, setName] = useState('')
  const [original, setOriginal] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getOrCreateUserProfile(userId).then(p => {
      setName(p.display_name || '')
      setOriginal(p.display_name || '')
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [userId])

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed || trimmed.length < 2) {
      setMessage('Mindestens 2 Zeichen!')
      return
    }
    if (trimmed.length > 20) {
      setMessage('Maximal 20 Zeichen!')
      return
    }
    if (trimmed === original) {
      setMessage('Name ist unverändert.')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      await updateDisplayName(userId, trimmed)
      setOriginal(trimmed)
      setMessage('Anzeige-Name gespeichert!')
    } catch (err) {
      setMessage('Fehler: ' + (err.message || 'Bitte erneut versuchen.'))
    }
    setSaving(false)
  }

  if (!loaded) return null

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
      <h3 className="font-bold text-gray-700 mb-2 text-lg">🏷️ Anzeige-Name</h3>
      <p className="text-xs text-gray-500 mb-2">So sehen dich andere in der Rangliste und Freundesliste.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setMessage('') }}
          maxLength={20}
          placeholder="z.B. Familie Müller"
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-base"
        />
        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? '...' : 'Speichern'}
        </button>
      </div>
      {message && (
        <p className={`text-sm font-semibold mt-2 ${message.includes('gespeichert') ? 'text-green-600' : 'text-amber-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

function SyncDebug({ userId }) {
  const [info, setInfo] = useState(null)
  const [open, setOpen] = useState(false)

  async function loadDebug() {
    try {
      const profiles = await loadCloudProfiles(userId)
      setInfo({ profiles, error: null })
    } catch (e) {
      setInfo({ profiles: [], error: e.message })
    }
  }

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); loadDebug() }}
        className="w-full text-xs text-gray-400 py-1 hover:text-gray-600">
        Sync-Status anzeigen
      </button>
    )
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-3 shadow-inner text-xs space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-600">Sync-Debug</span>
        <button onClick={() => setOpen(false)} className="text-gray-400">✕</button>
      </div>
      <div className="text-gray-500">User-ID: <span className="font-mono">{userId.slice(0, 8)}...</span></div>
      {info?.error && <div className="text-red-500 font-bold">Fehler: {info.error}</div>}
      {info?.profiles?.map((p, i) => (
        <div key={i} className="bg-white rounded-lg p-2 space-y-1">
          <div>Profil: <span className="font-bold">{p.name}</span> <span className="font-mono text-gray-400">({p.id?.slice(0, 8)}...)</span></div>
          {p.stats && (Array.isArray(p.stats) ? p.stats : [p.stats]).map((s, j) => (
            <div key={j} className="text-green-700">
              Cloud-Stats: {s.points} Pkt, {s.stars} Sterne, {s.golden_stars} Gold, {s.coins} Münzen, {s.rounds_played} Runden
            </div>
          ))}
          {(!p.stats || (Array.isArray(p.stats) && p.stats.length === 0)) && (
            <div className="text-red-500 font-bold">KEINE STATS-ZEILE!</div>
          )}
        </div>
      ))}
      {info?.profiles?.length === 0 && !info?.error && (
        <div className="text-red-500 font-bold">KEINE CLOUD-PROFILE GEFUNDEN!</div>
      )}
      <button onClick={loadDebug} className="text-blue-500 font-bold">Neu laden</button>
    </div>
  )
}
