// Vorschau: Rangliste — noch nicht benutzbar (nur zum Anschauen)
export default function RankingPreview({ player }) {
  const demoPlayers = [
    { name: player?.name || 'Du', points: player?.points || 0, stars: player?.stars || 0, goldenStars: player?.goldenStars || 0, coins: player?.coins || 0, isYou: true },
    { name: 'Demo-Spieler 1', points: 85, stars: 12, goldenStars: 3, coins: 620 },
    { name: 'Demo-Spieler 2', points: 64, stars: 9, goldenStars: 2, coins: 440 },
    { name: 'Demo-Spieler 3', points: 42, stars: 6, goldenStars: 1, coins: 280 },
    { name: 'Demo-Spieler 4', points: 28, stars: 4, goldenStars: 0, coins: 150 },
  ].sort((a, b) => b.points - a.points)

  return (
    <div className="py-4 space-y-4">
      <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-center">
        <span className="text-sm font-bold text-amber-800">👀 Vorschau – kommt, wenn die App später online ist.</span>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Bestenliste</h2>
        <div className="space-y-2">
          {demoPlayers.map((p, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${p.isYou ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{p.name} {p.isYou && <span className="text-green-600 text-xs">(Du)</span>}</div>
                <div className="text-xs text-gray-500">{p.points} Pkt · ⭐{p.stars} · 🌟{p.goldenStars} · 🪙{p.coins}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
