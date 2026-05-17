import FootballerSVG from './FootballerSVG'
import { loadAppearance } from './CharacterEditor'
import { loadEquipment, TRIKOT_DATA } from './EquipmentScreen'
import { shopItems } from '../shopData'
import StadiumBg from './StadiumBg'
import { getOverallTier } from '../unlocks'

export default function ProfileScreen({ player, setScreen }) {
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
