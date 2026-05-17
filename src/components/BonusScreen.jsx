import { useState } from 'react'
import { getWeeklyBonusInfo, claimWeeklyBonus, GOALS, getGoalProgress, isGoalCompleted, isGoalClaimed, claimGoal } from '../bonus'
import { playKaChingSound, playUnlockSound } from '../sounds'

export default function BonusScreen({ player, setPlayer }) {
  const [showClaimed, setShowClaimed] = useState(null)

  const weekInfo = getWeeklyBonusInfo(player)

  function handleClaimBonus() {
    if (!weekInfo.canClaim) return
    const { player: newPlayer, amount } = claimWeeklyBonus(player)
    playKaChingSound()
    setPlayer(newPlayer)
    setShowClaimed(amount)
    setTimeout(() => setShowClaimed(null), 3000)
  }

  function handleClaimGoal(goalId) {
    const updated = claimGoal(player, goalId)
    if (updated !== player) {
      playUnlockSound()
      setPlayer(updated)
    }
  }

  const daysCompleted = weekInfo.days.filter(Boolean).length

  return (
    <div className="py-4 space-y-4">
      {/* Weekly Bonus */}
      <div className="bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-amber-300 rounded-3xl p-5 shadow-xl text-center">
        <div className="text-4xl mb-2">🎁</div>
        <h2 className="text-xl font-extrabold text-amber-800 mb-2">Wochen-Bonus</h2>
        <p className="text-sm text-amber-700 mb-4">
          Spiele jeden Tag eine volle Runde (10 Fragen) und hole am Sonntag <span className="font-bold">50 Münzen</span>!
        </p>

        {/* Week overview */}
        <div className="flex justify-center gap-1.5 mb-4">
          {weekInfo.dayLabels.map((label, idx) => {
            const played = weekInfo.days[idx] || false
            const isToday = idx === weekInfo.todayIdx
            return (
              <div
                key={label}
                className={`flex flex-col items-center px-2 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isToday ? 'ring-2 ring-amber-400 shadow-md' : ''
                } ${played ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
              >
                <span>{label}</span>
                <span className="text-lg mt-0.5">{played ? '✅' : '⬜'}</span>
              </div>
            )
          })}
        </div>

        {/* Status */}
        {showClaimed ? (
          <div className="animate-bounce py-3">
            <div className="text-3xl font-extrabold text-green-600">+{showClaimed} 🪙</div>
            <div className="text-sm text-green-700 font-bold mt-1">Wochen-Bonus erhalten!</div>
          </div>
        ) : weekInfo.claimed ? (
          <div className="py-2">
            <p className="text-green-700 font-bold">✅ Bonus diese Woche abgeholt!</p>
            <p className="text-xs text-amber-600 mt-1">Nächste Woche geht es weiter!</p>
          </div>
        ) : weekInfo.canClaim ? (
          <button
            onClick={handleClaimBonus}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-extrabold text-lg rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            🎁 50 Münzen abholen!
          </button>
        ) : weekInfo.isSunday && !weekInfo.allDaysPlayed ? (
          <div className="py-2">
            <p className="text-amber-700 font-semibold">Leider nicht jeden Tag gespielt.</p>
            <p className="text-sm text-amber-600 mt-1">Nächste Woche schaffst du es bestimmt! 💪</p>
          </div>
        ) : (
          <div className="py-2">
            <p className="text-amber-700 font-semibold">
              {weekInfo.todayPlayed
                ? '✅ Heute schon gespielt!'
                : 'Spiele heute eine Runde mit 10 Fragen!'}
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {daysCompleted}/7 Tage geschafft · Am Sonntag gibt es den Bonus!
            </p>
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl">
        <h2 className="text-lg font-extrabold text-gray-800 mb-3">🏆 Ziele & Belohnungen</h2>
        <div className="space-y-2.5">
          {GOALS.map(goal => {
            const progress = getGoalProgress(player, goal)
            const completed = isGoalCompleted(player, goal)
            const claimed = isGoalClaimed(player, goal.id)
            const pct = Math.round((Math.min(progress, goal.target) / goal.target) * 100)

            return (
              <div key={goal.id} className={`rounded-2xl p-3 border-2 transition-all ${
                claimed ? 'bg-green-50 border-green-200 opacity-75'
                  : completed ? 'bg-amber-50 border-amber-300 shadow-md'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-800">
                      {claimed && '✅ '}{goal.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${claimed ? 'bg-green-400' : completed ? 'bg-amber-400' : 'bg-blue-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500">{Math.min(progress, goal.target)}/{goal.target}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    {claimed ? (
                      <span className="text-xs font-bold text-green-600">Erledigt</span>
                    ) : completed ? (
                      <button
                        onClick={() => handleClaimGoal(goal.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 font-bold text-xs rounded-xl shadow hover:brightness-110 active:scale-95"
                      >
                        🪙 +{goal.reward}
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">🪙 {goal.reward}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
