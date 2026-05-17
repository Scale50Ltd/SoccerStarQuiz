import { useState } from 'react'
import StadiumBg from './StadiumBg'

export default function StartScreen({ player, onStart }) {
  const [name, setName] = useState(player?.name || '')
  const [difficulty, setDifficulty] = useState(player?.difficulty || 'leicht')

  return (
    <div className="screen-with-stadium">
      <StadiumBg />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="text-6xl sm:text-7xl mb-3 drop-shadow-lg">⚽</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] mb-2">
            Soccer Star Quiz
          </h1>
          <p className="text-green-100 text-lg sm:text-xl drop-shadow-md">
            Das Fußball-Quiz für junge und ältere Kinder
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <label className="block text-left text-gray-700 font-bold mb-2 text-lg sm:text-xl">
              Wie heißt du?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Dein Name..."
              className="w-full px-5 py-4 text-lg sm:text-xl border-2 border-green-300 rounded-2xl focus:border-green-500 focus:outline-none shadow-inner"
            />
          </div>

          <div>
            <label className="block text-left text-gray-700 font-bold mb-2 text-lg sm:text-xl">
              Schwierigkeit
            </label>
            <div className="flex gap-2 sm:gap-3">
              {['leicht', 'mittel', 'schwer'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg capitalize transition-all ${
                    difficulty === d
                      ? 'bg-green-500 text-white shadow-lg scale-105 ring-2 ring-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                  }`}
                >
                  {d === 'leicht' ? '⭐' : d === 'mittel' ? '⭐⭐' : '⭐⭐⭐'}
                  <br />
                  <span className="text-sm sm:text-base">{d}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => name.trim() && onStart(name.trim(), difficulty)}
            disabled={!name.trim()}
            className="w-full py-5 bg-green-500 text-white text-xl sm:text-2xl font-bold rounded-2xl shadow-lg hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ring-2 ring-green-400/50"
          >
            🚀 Spiel starten
          </button>
        </div>
      </div>
    </div>
  )
}
