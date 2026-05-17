// Vorschau: Login — noch nicht benutzbar (nur zum Anschauen)
export default function LoginPreview({ setScreen }) {
  return (
    <div className="py-4 space-y-4">
      <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-center">
        <span className="text-sm font-bold text-amber-800">👀 Vorschau – echter Login kommt, wenn die App später online geht.</span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Anmelden</h2>

        <div className="space-y-3 max-w-xs mx-auto">
          <div>
            <label className="block text-left text-gray-600 text-sm font-bold mb-1">Benutzername</label>
            <input type="text" placeholder="Dein Name..." disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-left text-gray-600 text-sm font-bold mb-1">Passwort</label>
            <input type="password" placeholder="••••••••" disabled
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>

          <button disabled className="w-full py-3 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed">
            Anmelden (noch nicht verfügbar)
          </button>
          <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
            Registrieren (noch nicht verfügbar)
          </button>
        </div>

        <button onClick={() => setScreen('start')}
          className="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 active:scale-95 transition-all">
          ↩️ Weiter ohne Login (lokal spielen)
        </button>
      </div>
    </div>
  )
}
