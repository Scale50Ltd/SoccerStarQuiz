import FootballerSVG from './FootballerSVG'
import { loadAppearance } from './CharacterEditor'

export default function CharacterScreen({ player, onContinue }) {
  const appearance = loadAppearance()

  return (
    <div className="text-center py-8">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="flex justify-center mb-4">
          <FootballerSVG {...appearance} size={160} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Willkommen, {player.name}!
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Dein Starter-Charakter ist:
        </p>
        <p className="text-3xl font-extrabold text-green-600 mb-6">
          {player.character}
        </p>
        <button
          onClick={onContinue}
          className="w-full py-4 bg-green-500 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all"
        >
          ⚽ Quiz starten
        </button>
      </div>
    </div>
  )
}
