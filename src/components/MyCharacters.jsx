import { useState } from 'react'
import FootballerSVG from './FootballerSVG'
import { getDefaultAppearance } from './CharacterEditor'

const CHARS_KEY = 'soccerStarMyCharacters'
const ACTIVE_CHAR_KEY = 'soccerStarActiveCharIdx'
const MAX_CHARACTERS = 6

export function loadMyCharacters() {
  try {
    const data = JSON.parse(localStorage.getItem(CHARS_KEY))
    if (Array.isArray(data) && data.length > 0) return data
  } catch {}
  // Migrate from old single-character system
  try {
    const old = JSON.parse(localStorage.getItem('soccerStarAppearance'))
    if (old) return [{ ...old, name: 'Spieler 1' }]
  } catch {}
  return [{ ...getDefaultAppearance(), name: 'Spieler 1' }]
}

export function saveMyCharacters(chars) {
  localStorage.setItem(CHARS_KEY, JSON.stringify(chars))
  // Keep old key in sync with active character for backward compat
  const activeIdx = getActiveCharIdx()
  if (chars[activeIdx]) {
    localStorage.setItem('soccerStarAppearance', JSON.stringify(chars[activeIdx]))
  }
}

export function getActiveCharIdx() {
  try {
    const idx = parseInt(localStorage.getItem(ACTIVE_CHAR_KEY))
    return isNaN(idx) ? 0 : idx
  } catch { return 0 }
}

export function setActiveCharIdx(idx) {
  localStorage.setItem(ACTIVE_CHAR_KEY, String(idx))
  // Sync appearance
  const chars = loadMyCharacters()
  if (chars[idx]) {
    localStorage.setItem('soccerStarAppearance', JSON.stringify(chars[idx]))
  }
}

export default function MyCharacters({ setScreen }) {
  const [characters, setCharacters] = useState(loadMyCharacters)
  const [activeIdx, setActiveIdx] = useState(getActiveCharIdx)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleSetActive(idx) {
    setActiveIdx(idx)
    setActiveCharIdx(idx)
  }

  function handleCreate() {
    if (characters.length >= MAX_CHARACTERS) return
    const newChar = { ...getDefaultAppearance(), name: `Spieler ${characters.length + 1}` }
    const updated = [...characters, newChar]
    setCharacters(updated)
    saveMyCharacters(updated)
    // Switch to editor for the new character
    setActiveCharIdx(updated.length - 1)
    setActiveIdx(updated.length - 1)
    setScreen('editor')
  }

  function handleDelete(idx) {
    if (characters.length <= 1) return
    const updated = characters.filter((_, i) => i !== idx)
    setCharacters(updated)
    saveMyCharacters(updated)
    if (activeIdx >= updated.length) {
      setActiveCharIdx(0)
      setActiveIdx(0)
    } else if (idx < activeIdx) {
      setActiveCharIdx(activeIdx - 1)
      setActiveIdx(activeIdx - 1)
    }
    setDeleteConfirm(null)
  }

  function handleEdit(idx) {
    setActiveCharIdx(idx)
    setActiveIdx(idx)
    setScreen('editor')
  }

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Meine Charaktere</h2>
        <p className="text-sm text-gray-500 mb-4">Du kannst bis zu {MAX_CHARACTERS} eigene Charaktere erstellen.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {characters.map((char, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-3 text-center transition-all border-2 ${
                idx === activeIdx
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-green-300'
              }`}
            >
              {idx === activeIdx && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  Aktiv
                </div>
              )}
              <div className="flex justify-center mb-2">
                <FootballerSVG {...char} size={100} />
              </div>
              <div className="text-sm font-bold text-gray-700 truncate">{char.name || `Spieler ${idx + 1}`}</div>
              <div className="flex gap-1 mt-2 justify-center">
                <button
                  onClick={() => handleSetActive(idx)}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    idx === activeIdx ? 'bg-green-200 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {idx === activeIdx ? '✓' : 'Wählen'}
                </button>
                <button
                  onClick={() => handleEdit(idx)}
                  className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                  ✏️
                </button>
                {characters.length > 1 && (
                  <button
                    onClick={() => setDeleteConfirm(idx)}
                    className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add new character button */}
          {characters.length < MAX_CHARACTERS && (
            <button
              onClick={handleCreate}
              className="rounded-2xl p-3 border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 flex flex-col items-center justify-center gap-2 transition-all min-h-[140px]"
            >
              <span className="text-3xl">➕</span>
              <span className="text-sm font-bold text-green-700">Neuer Charakter</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm !== null && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-center">
          <p className="font-bold text-red-700 mb-3">
            "{characters[deleteConfirm]?.name || `Spieler ${deleteConfirm + 1}`}" wirklich löschen?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-95"
            >
              Ja, löschen
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 active:scale-95"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
