import { useState, useEffect } from 'react'
import FootballerSVG from './FootballerSVG'
import { loadAppearance } from './CharacterEditor'
import { shopItems } from '../shopData'

const EQUIP_KEY = 'soccerStarEquipment'

const TRIKOT_DATA = {
  tri_rot: { color: '#ef4444', accent: '#ffffff', name: 'TURBO', number: '10', pattern: null },
  tri_blau: { color: '#3b82f6', accent: '#ffffff', name: 'BLITZ', number: '7', pattern: null },
  tri_gruen: { color: '#22c55e', accent: '#ffffff', name: 'RASEN', number: '5', pattern: null },
  tri_schwarz: { color: '#1f2937', accent: '#f59e0b', name: 'NACHT', number: '3', pattern: null },
  tri_weiss: { color: '#f9fafb', accent: '#1f2937', name: 'SNOW', number: '11', pattern: null },
  tri_orange: { color: '#f97316', accent: '#ffffff', name: 'FIRE', number: '14', pattern: null },
  tri_lila: { color: '#a855f7', accent: '#ffffff', name: 'MAGIC', number: '8', pattern: null },
  tri_gold: { color: '#fbbf24', accent: '#1e1e1e', name: 'GOLD', number: '9', pattern: 'gold' },
  tri_silber: { color: '#9ca3af', accent: '#1f2937', name: 'SILBER', number: '2', pattern: 'silber' },
  tri_neon: { color: '#4ade80', accent: '#064e3b', name: 'NEON', number: '99', pattern: 'neon' },
  tri_regenbogen: { color: '#ffffff', accent: '#1e1e1e', name: 'RAINBOW', number: '77', pattern: 'regenbogen' },
  tri_flammen: { color: '#1f2937', accent: '#fbbf24', name: 'FLAMME', number: '13', pattern: 'flammen' },
  tri_eis: { color: '#e0f2fe', accent: '#0e7490', name: 'ICE', number: '6', pattern: 'eis' },
  tri_galaxie: { color: '#0f172a', accent: '#a78bfa', name: 'GALAXY', number: '42', pattern: 'galaxie' },
  tri_blitz: { color: '#1e1e1e', accent: '#fbbf24', name: 'FLASH', number: '15', pattern: 'blitz' },
  tri_diamant: { color: '#bfdbfe', accent: '#0c4a6e', name: 'DIAMANT', number: '1', pattern: 'diamant' },
  tri_champion: { color: '#b91c1c', accent: '#fbbf24', name: 'CHAMP', number: '10', pattern: 'champion' },
  tri_legend: { color: '#7c3aed', accent: '#fbbf24', name: 'LEGEND', number: '7', pattern: 'legend' },
  tri_wm: { color: '#1e1e1e', accent: '#fbbf24', name: 'STAR', number: '1', pattern: 'wm' },
}

function loadEquipment() {
  try {
    return JSON.parse(localStorage.getItem(EQUIP_KEY)) || {}
  } catch { return {} }
}

function saveEquipment(equip) {
  localStorage.setItem(EQUIP_KEY, JSON.stringify(equip))
}

export default function EquipmentScreen({ player }) {
  const [equip, setEquip] = useState(loadEquipment)
  const appearance = loadAppearance()

  useEffect(() => {
    saveEquipment(equip)
  }, [equip])

  const ownedChars = shopItems.charaktere.filter(c => player.items.includes(c.id))
  const ownedTrikots = shopItems.trikots.filter(t => player.items.includes(t.id))
  const ownedBalls = shopItems.baelle.filter(b => player.items.includes(b.id))
  const ownedBgs = shopItems.hintergruende.filter(b => player.items.includes(b.id))

  const trikotInfo = equip.trikotId ? TRIKOT_DATA[equip.trikotId] : null
  const activeChar = equip.charId ? shopItems.charaktere.find(c => c.id === equip.charId) : null

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ausrüstung</h2>
        <div className="flex justify-center mb-2">
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
            size={240}
          />
        </div>
        {activeChar && (
          <p className="text-sm text-purple-600 font-semibold mt-1">{activeChar.name}: {activeChar.description}</p>
        )}
      </div>

      {/* Character / Pose selection */}
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-700 mb-2">Charakter-Pose</h3>
        {ownedChars.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Charaktere gekauft. Kaufe einen im Shop!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEquip(e => ({ ...e, charId: null }))}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                !equip.charId ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
              }`}
            >
              Standard
            </button>
            {ownedChars.map(c => (
              <button
                key={c.id}
                onClick={() => setEquip(e => ({ ...e, charId: c.id }))}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  equip.charId === c.id ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trikot selection */}
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-700 mb-2">Trikot anziehen</h3>
        {ownedTrikots.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Trikots gekauft.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEquip(e => ({ ...e, trikotId: null }))}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                !equip.trikotId ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
              }`}
            >
              Standard
            </button>
            {ownedTrikots.map(t => (
              <button
                key={t.id}
                onClick={() => setEquip(e => ({ ...e, trikotId: t.id }))}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  equip.trikotId === t.id ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
                }`}
              >
                <span className="inline-block w-4 h-4 rounded mr-1" style={{ backgroundColor: TRIKOT_DATA[t.id]?.color }}></span>
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ball selection */}
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-700 mb-2">Ball auswählen</h3>
        {ownedBalls.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Bälle gekauft.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEquip(e => ({ ...e, ballId: null }))}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                !equip.ballId ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
              }`}
            >
              Keiner
            </button>
            {ownedBalls.map(b => (
              <button
                key={b.id}
                onClick={() => setEquip(e => ({ ...e, ballId: b.id }))}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  equip.ballId === b.id ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
                }`}
              >
                {b.emoji} {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Background selection */}
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-700 mb-2">Hintergrund</h3>
        {ownedBgs.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Hintergründe gekauft.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEquip(e => ({ ...e, bgId: null }))}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                !equip.bgId ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
              }`}
            >
              Standard
            </button>
            {ownedBgs.map(b => (
              <button
                key={b.id}
                onClick={() => setEquip(e => ({ ...e, bgId: b.id }))}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  equip.bgId === b.id ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-green-100'
                }`}
              >
                {b.emoji} {b.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { TRIKOT_DATA, loadEquipment, saveEquipment }
