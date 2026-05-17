export default function ResultScreen({ result, player, onPlayAgain, setScreen }) {
  const { correct, earned, details, questions } = result

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
        <div className="text-6xl mb-3">
          {correct === 10 ? '🏆' : correct >= 7 ? '🌟' : correct >= 5 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Du hast {correct} von 10 Fragen richtig beantwortet!
        </h2>

        <div className="grid grid-cols-2 gap-3 mt-4 text-left">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-sm text-gray-600">Punkte diese Runde</div>
            <div className="text-xl font-bold text-green-700">+{earned.points}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3">
            <div className="text-sm text-gray-600">Stern-Bonus</div>
            <div className="text-xl font-bold text-yellow-600">
              {earned.stars > 0 ? `⭐ +${earned.stars}` : '—'}
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="text-sm text-gray-600">Goldener Stern</div>
            <div className="text-xl font-bold text-amber-600">
              {earned.goldenStars > 0 ? '🌟 +1' : '—'}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="text-sm text-gray-600">Münzen gesamt</div>
            <div className="text-xl font-bold text-blue-600">🪙 {player.coins}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-2 text-center text-sm">
          <div><div className="font-bold text-lg">{player.points}</div>Punkte</div>
          <div><div className="font-bold text-lg">⭐ {player.stars}</div>Sterne</div>
          <div><div className="font-bold text-lg">🌟 {player.goldenStars}</div>Gold</div>
          <div><div className="font-bold text-lg">🪙 {player.coins}</div>Münzen</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h3 className="font-bold text-gray-700 mb-3">Übersicht</h3>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-lg">{details[i]?.correct ? '✅' : '❌'}</span>
              <span className="text-gray-700">{q.question}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onPlayAgain}
          className="py-3 bg-green-500 text-white font-bold rounded-xl shadow hover:bg-green-600 active:scale-95 transition-all"
        >
          🔄 Noch mal
        </button>
        <button
          onClick={() => setScreen('shop')}
          className="py-3 bg-purple-500 text-white font-bold rounded-xl shadow hover:bg-purple-600 active:scale-95 transition-all"
        >
          🛒 Shop
        </button>
        <button
          onClick={() => setScreen('exchange')}
          className="py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 active:scale-95 transition-all"
        >
          💰 Umtauschen
        </button>
        <button
          onClick={() => setScreen('start')}
          className="py-3 bg-gray-500 text-white font-bold rounded-xl shadow hover:bg-gray-600 active:scale-95 transition-all"
        >
          🏠 Startseite
        </button>
      </div>
    </div>
  )
}
