import { useState, useEffect } from 'react'
import FootballerSVG from './FootballerSVG'
import { loadEquipment, TRIKOT_DATA } from './EquipmentScreen'
import { shopItems } from '../shopData'
import { loadMyCharacters, saveMyCharacters, getActiveCharIdx } from './MyCharacters'

const SKIN_COLORS = ['#ffe0bd', '#f5c19c', '#e0a370', '#c68642', '#8d5524', '#4a2c17']
const HAIR_COLORS = ['#4a2c17', '#1a1a1a', '#d4a437', '#c0392b', '#e67e22', '#8e44ad', '#2ecc71']
const EYE_COLORS = ['#1e40af', '#166534', '#78350f', '#1e1e1e', '#6d28d9', '#0e7490']
const SHOE_COLORS = ['#1e1e1e', '#ffffff', '#ef4444', '#3b82f6', '#f59e0b', '#10b981']
const SOCK_COLORS = ['#ffffff', '#1e1e1e', '#ef4444', '#3b82f6', '#fbbf24', '#10b981']
const HAIRSTYLES_LIST = ['kurz', 'stachel', 'lang', 'locken', 'irokese', 'zopf']
const HAIRSTYLE_LABELS = { kurz: 'Kurz', stachel: 'Stachel', lang: 'Lang', locken: 'Locken', irokese: 'Irokese', zopf: 'Zopf' }

export function getDefaultAppearance() {
  return {
    skinColor: '#f4c28d',
    hairColor: '#4a2c17',
    hairstyle: 'kurz',
    eyeColor: '#1e40af',
    shoeColor: '#1e1e1e',
    sockColor: '#ffffff',
  }
}

export function loadAppearance() {
  try {
    const chars = loadMyCharacters()
    const idx = getActiveCharIdx()
    return chars[idx] || getDefaultAppearance()
  } catch { return getDefaultAppearance() }
}

export function saveAppearance(appearance) {
  const chars = loadMyCharacters()
  const idx = getActiveCharIdx()
  chars[idx] = { ...chars[idx], ...appearance }
  saveMyCharacters(chars)
}

function ColorPicker({ label, colors, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-bold text-gray-700 mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {colors.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === c ? 'border-green-500 scale-110 shadow-md' : 'border-gray-300 hover:border-green-300'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  )
}

export default function CharacterEditor({ player, setScreen }) {
  const [appearance, setAppearance] = useState(loadAppearance)
  const [charName, setCharName] = useState(appearance.name || '')

  useEffect(() => {
    saveAppearance({ ...appearance, name: charName })
  }, [appearance, charName])

  const equip = loadEquipment()
  const trikotInfo = equip.trikotId ? TRIKOT_DATA[equip.trikotId] : null
  const activeChar = equip.charId ? shopItems.charaktere.find(c => c.id === equip.charId) : null

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Charakter-Editor</h2>
        <div className="flex justify-center mb-4">
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
            size={220}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-800 mb-3 text-lg">Aussehen anpassen</h3>

        <div className="mb-3">
          <div className="text-sm font-bold text-gray-700 mb-1">Name</div>
          <input
            type="text"
            value={charName}
            onChange={e => setCharName(e.target.value)}
            placeholder="Name..."
            className="w-full px-3 py-2 border-2 border-green-300 rounded-xl text-sm focus:border-green-500 focus:outline-none"
          />
        </div>

        <ColorPicker label="Hautfarbe" colors={SKIN_COLORS} value={appearance.skinColor}
          onChange={v => setAppearance(a => ({ ...a, skinColor: v }))} />
        <ColorPicker label="Haarfarbe" colors={HAIR_COLORS} value={appearance.hairColor}
          onChange={v => setAppearance(a => ({ ...a, hairColor: v }))} />

        <div className="mb-3">
          <div className="text-sm font-bold text-gray-700 mb-1">Frisur</div>
          <div className="flex flex-wrap gap-2">
            {HAIRSTYLES_LIST.map(h => (
              <button
                key={h}
                onClick={() => setAppearance(a => ({ ...a, hairstyle: h }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  appearance.hairstyle === h
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                }`}
              >
                {HAIRSTYLE_LABELS[h]}
              </button>
            ))}
          </div>
        </div>

        <ColorPicker label="Augenfarbe" colors={EYE_COLORS} value={appearance.eyeColor}
          onChange={v => setAppearance(a => ({ ...a, eyeColor: v }))} />
        <ColorPicker label="Schuhe" colors={SHOE_COLORS} value={appearance.shoeColor}
          onChange={v => setAppearance(a => ({ ...a, shoeColor: v }))} />
        <ColorPicker label="Stutzen" colors={SOCK_COLORS} value={appearance.sockColor}
          onChange={v => setAppearance(a => ({ ...a, sockColor: v }))} />
      </div>

      <button
        onClick={() => { saveAppearance({ ...appearance, name: charName }); if (setScreen) setScreen('mycharacters') }}
        className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow hover:bg-green-600 active:scale-95 transition-all"
      >
        Fertig!
      </button>
    </div>
  )
}
