import { useState, useEffect, useRef } from 'react'
import { shopItems } from '../shopData'
import { playKaChingSound, playUnlockSound } from '../sounds'
import FootballerSVG from './FootballerSVG'
import { loadAppearance } from './CharacterEditor'
import { isTierUnlocked, itemsNeededForTier, getPrevTierNumber } from '../unlocks'

const CATEGORIES = [
  { key: 'charaktere', label: '⚽ Charaktere', gradient: 'from-purple-500 to-indigo-500', cardBg: 'bg-purple-50 border-purple-200', badgeColor: 'bg-purple-100 text-purple-700' },
  { key: 'trikots', label: '👕 Trikots', gradient: 'from-blue-500 to-cyan-500', cardBg: 'bg-blue-50 border-blue-200', badgeColor: 'bg-blue-100 text-blue-700' },
  { key: 'baelle', label: '⚽ Bälle', gradient: 'from-orange-400 to-amber-500', cardBg: 'bg-orange-50 border-orange-200', badgeColor: 'bg-orange-100 text-orange-700' },
  { key: 'hintergruende', label: '🏟️ Hintergründe', gradient: 'from-emerald-500 to-green-500', cardBg: 'bg-emerald-50 border-emerald-200', badgeColor: 'bg-emerald-100 text-emerald-700' },
]

export default function ShopScreen({ player, onBuy }) {
  const [displayCoins, setDisplayCoins] = useState(player.coins)
  const [boughtItem, setBoughtItem] = useState(null)
  const [newlyUnlocked, setNewlyUnlocked] = useState(null) // { category, tier }
  const animRef = useRef(null)
  const prevItemsRef = useRef(player.items)

  useEffect(() => {
    setDisplayCoins(player.coins)
  }, [player.coins])

  // Detect new tier unlocks after a purchase
  useEffect(() => {
    if (prevItemsRef.current.length < player.items.length) {
      // Check if any new tier was unlocked
      for (const cat of CATEGORIES) {
        const maxTier = Math.max(...shopItems[cat.key].map(i => i.tier))
        for (let t = 2; t <= maxTier; t++) {
          const wasUnlocked = isTierUnlocked(prevItemsRef.current, cat.key, t)
          const isNowUnlocked = isTierUnlocked(player.items, cat.key, t)
          if (!wasUnlocked && isNowUnlocked) {
            playUnlockSound()
            setNewlyUnlocked({ category: cat.key, tier: t })
            setTimeout(() => setNewlyUnlocked(null), 3000)
          }
        }
      }
    }
    prevItemsRef.current = player.items
  }, [player.items])

  function handleBuy(item) {
    if (player.coins < item.price || player.items.includes(item.id)) return
    playKaChingSound()
    setBoughtItem(item.id)

    const start = player.coins
    const end = player.coins - item.price
    const duration = 1000
    const startTime = performance.now()

    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const current = Math.round(start - (start - end) * progress)
      setDisplayCoins(current)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        onBuy(item)
        setTimeout(() => setBoughtItem(null), 1500)
      }
    }
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animate)
  }

  const appearance = loadAppearance()

  return (
    <div className="py-4 space-y-4">
      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl px-4 py-3 text-center shadow-lg">
        <span className="font-bold text-lg text-amber-900">🪙 {displayCoins} Münzen</span>
      </div>

      {/* Unlock notification */}
      {newlyUnlocked && (
        <div className="bg-gradient-to-r from-yellow-300 to-amber-300 rounded-2xl p-4 text-center shadow-lg animate-bounce border-2 border-yellow-400">
          <div className="text-2xl mb-1">🎉🔓</div>
          <div className="font-bold text-amber-900">Neu freigeschaltet!</div>
          <div className="text-sm text-amber-800">Stufe {newlyUnlocked.tier} ist jetzt offen!</div>
        </div>
      )}

      {CATEGORIES.map(cat => (
        <div key={cat.key} className="rounded-2xl overflow-hidden shadow-xl">
          <div className={`bg-gradient-to-r ${cat.gradient} px-5 py-3`}>
            <h3 className="font-bold text-white text-lg drop-shadow">{cat.label}</h3>
          </div>
          <div className="bg-white p-3 space-y-2.5">
            {shopItems[cat.key].map(item => {
              const owned = player.items.includes(item.id)
              const justBought = boughtItem === item.id
              const canAfford = player.coins >= item.price
              const isCharacter = cat.key === 'charaktere'
              const unlocked = owned || isTierUnlocked(player.items, cat.key, item.tier)
              const needed = owned ? 0 : itemsNeededForTier(player.items, cat.key, item.tier)

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-3 transition-all ${
                    !unlocked
                      ? 'bg-gray-100 border-gray-300 opacity-70'
                      : `${cat.cardBg} hover:shadow-md`
                  } ${justBought ? 'animate-bounce' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!unlocked ? (
                        <span className="text-3xl">🔒</span>
                      ) : isCharacter ? (
                        <div className="w-12 h-16 flex-shrink-0">
                          <FootballerSVG
                            {...appearance}
                            pose={item.pose}
                            animation={item.animation}
                            size={48}
                          />
                        </div>
                      ) : (
                        <span className={`text-3xl transition-transform ${justBought ? 'scale-125' : ''}`}>
                          {item.emoji}
                        </span>
                      )}
                      <div>
                        <div className={`font-bold ${!unlocked ? 'text-gray-500' : owned ? 'text-gray-800' : 'text-red-600'}`}>
                          {item.name}
                          {!unlocked && <span className="ml-1 text-xs text-gray-400">(Stufe {item.tier})</span>}
                        </div>
                        {isCharacter && item.description && unlocked && (
                          <div className="text-xs text-purple-600 font-semibold">{item.description}</div>
                        )}
                        {!unlocked ? (
                          <div className="text-xs text-orange-600 font-semibold mt-0.5">
                            🔒 Noch {needed} aus Stufe {getPrevTierNumber(cat.key, item.tier)} kaufen!
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1 text-sm font-bold mt-0.5 px-2 py-0.5 rounded-full ${owned ? cat.badgeColor : 'bg-red-50 text-red-600'}`}>
                            🪙 {item.price}
                          </div>
                        )}
                      </div>
                    </div>
                    {!unlocked ? (
                      <span className="px-3 py-2 bg-gray-200 text-gray-400 rounded-xl text-sm font-bold">
                        🔒
                      </span>
                    ) : owned || justBought ? (
                      <span className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-300">
                        ✓ Gekauft!
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          canAfford
                            ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md hover:brightness-110 active:scale-95`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Kaufen
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
