import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GERMAN_ERRORS = {
  'Invalid login credentials': 'E-Mail oder Passwort falsch.',
  'Email not confirmed': 'Bitte zuerst die E-Mail-Adresse bestätigen.',
  'User already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
  'Password should be at least 6 characters': 'Das Passwort muss mindestens 6 Zeichen lang sein.',
  'Unable to validate email address: invalid format': 'Ungültige E-Mail-Adresse.',
  'signup_disabled': 'Registrierung ist derzeit deaktiviert.',
}

function translateError(message) {
  if (!message) return 'Ein Fehler ist aufgetreten.'
  for (const [key, val] of Object.entries(GERMAN_ERRORS)) {
    if (message.includes(key)) return val
  }
  return message
}

export default function LoginScreen({ setScreen, onOffline }) {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function clearMessages() {
    setError('')
    setSuccess('')
  }

  function switchMode(newMode) {
    clearMessages()
    setPassword('')
    setConfirmPassword('')
    setMode(newMode)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    clearMessages()

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
        return
      }
      if (password !== confirmPassword) {
        setError('Die Passwörter stimmen nicht überein.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
        setSuccess('Erfolgreich angemeldet!')
        setScreen('start')
      } else if (mode === 'register') {
        await signUp(email, password)
        setSuccess('Registrierung erfolgreich! Bitte überprüfe deine E-Mail.')
      } else if (mode === 'reset') {
        await resetPassword(email)
        setSuccess('Passwort-Reset-Link wurde gesendet. Bitte überprüfe deine E-Mail.')
      }
    } catch (err) {
      setError(translateError(err?.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4 space-y-4 max-w-md mx-auto px-4">
      {/* Eltern-Hinweis */}
      <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-3 text-center">
        <span className="text-sm font-bold text-blue-800">
          👪 Eltern-Anmeldung: Bitte einen Erwachsenen für die E-Mail-Anmeldung fragen.
        </span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-5">
          <div className="text-5xl mb-2">🔐</div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            {mode === 'login' && 'Anmelden'}
            {mode === 'register' && 'Registrieren'}
            {mode === 'reset' && 'Passwort zurücksetzen'}
          </h2>
        </div>

        {/* Error box */}
        {error && (
          <div className="mb-4 bg-red-100 border-2 border-red-300 rounded-2xl p-3 text-center">
            <span className="text-sm font-bold text-red-700">{error}</span>
          </div>
        )}

        {/* Success box */}
        {success && (
          <div className="mb-4 bg-green-100 border-2 border-green-300 rounded-2xl p-3 text-center">
            <span className="text-sm font-bold text-green-700">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-left text-gray-700 font-bold mb-1 text-sm">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="eltern@beispiel.de"
              required
              className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl focus:border-green-500 focus:outline-none shadow-inner text-base"
            />
          </div>

          {/* Password field (not shown in reset mode) */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-left text-gray-700 font-bold mb-1 text-sm">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={mode === 'register' ? 6 : undefined}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl focus:border-green-500 focus:outline-none shadow-inner text-base"
              />
            </div>
          )}

          {/* Confirm password field (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-left text-gray-700 font-bold mb-1 text-sm">
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl focus:border-green-500 focus:outline-none shadow-inner text-base"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-xl hover:from-green-600 hover:to-emerald-600 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Bitte warten...' : (
              mode === 'login' ? '✅ Anmelden' :
              mode === 'register' ? '🎉 Registrieren' :
              '📧 Link senden'
            )}
          </button>
        </form>

        {/* Mode switchers */}
        <div className="mt-5 space-y-2 text-center">
          {mode === 'login' && (
            <>
              <button
                onClick={() => switchMode('register')}
                className="block w-full text-sm text-green-600 font-bold hover:underline"
              >
                Noch kein Konto? Jetzt registrieren
              </button>
              <button
                onClick={() => switchMode('reset')}
                className="block w-full text-sm text-gray-500 hover:underline"
              >
                Passwort vergessen?
              </button>
            </>
          )}
          {(mode === 'register' || mode === 'reset') && (
            <button
              onClick={() => switchMode('login')}
              className="block w-full text-sm text-green-600 font-bold hover:underline"
            >
              ← Zurück zur Anmeldung
            </button>
          )}
        </div>
      </div>

      {/* Offline / skip button */}
      <button
        onClick={() => onOffline ? onOffline() : setScreen('start')}
        className="w-full py-3 bg-gray-50 text-gray-500 font-semibold rounded-2xl hover:bg-gray-100 active:scale-95 transition-all text-sm border border-gray-200"
      >
        Ohne Anmeldung weiterspielen (offline)
      </button>
    </div>
  )
}
