// Vorschau: Freunde — noch nicht benutzbar (nur zum Anschauen)
export default function FriendsPreview() {
  const demoFriends = [
    { name: 'Max M.', points: 72, stars: 10, status: 'online' },
    { name: 'Lena K.', points: 55, stars: 7, status: 'offline' },
    { name: 'Tom S.', points: 38, stars: 5, status: 'online' },
  ]

  return (
    <div className="py-4 space-y-4">
      <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-center">
        <span className="text-sm font-bold text-amber-800">👀 Vorschau – Freunde kann man nutzen, wenn die App später online ist.</span>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Meine Freunde</h2>
        <div className="space-y-2">
          {demoFriends.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg">👤</div>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{f.name}</div>
                <div className="text-xs text-gray-500">{f.points} Punkte · ⭐{f.stars}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${f.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {f.status === 'online' ? '🟢 Online' : '⚫ Offline'}
              </span>
            </div>
          ))}
        </div>

        <button disabled className="w-full mt-4 py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed">
          ➕ Freund hinzufügen (noch nicht verfügbar)
        </button>
      </div>
    </div>
  )
}
