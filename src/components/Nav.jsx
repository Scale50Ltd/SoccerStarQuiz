import { useState, useEffect, useRef, useCallback } from 'react'
import { startMusic, stopMusic, unlockAudio, setVolume, getVolume } from '../music'
import { useAuth } from '../contexts/AuthContext'

const MUSIC_SCREENS = ['start', 'profile', 'shop', 'exchange', 'equipment', 'editor', 'mycharacters', 'bonus']

export default function Nav({ screen, setScreen, onSwitchProfiles }) {
  const auth = useAuth()

  const NAV_GROUPS = [
    {
      label: 'Spielen',
      items: [
        { id: 'start', icon: '🏠', label: 'Start' },
        { id: 'profile', icon: '👤', label: 'Profil' },
        { id: 'mycharacters', icon: '🧍', label: 'Figur' },
        { id: 'equipment', icon: '👕', label: 'Outfit' },
      ],
    },
    {
      label: 'Belohnungen',
      items: [
        { id: 'shop', icon: '🛒', label: 'Shop' },
        { id: 'exchange', icon: '🔄', label: 'Tausch' },
        { id: 'bonus', icon: '🎁', label: 'Bonus' },
      ],
    },
    {
      label: 'Online',
      items: [
        { id: 'ranking', icon: '🏆', label: 'Rang' },
        { id: 'friends', icon: '👫', label: 'Freunde' },
        ...(auth?.isOnline
          ? [{ id: '_logout', icon: '🚪', label: 'Abmelden' }]
          : [{ id: 'login', icon: '🔑', label: 'Login' }]
        ),
      ],
    },
  ]
  const [musicOn, setMusicOn] = useState(() => {
    try { return localStorage.getItem('soccerStarMusic') !== 'off' } catch { return true }
  })
  const [vol, setVol] = useState(getVolume)
  const [menuOpen, setMenuOpen] = useState(false)
  const userClicked = useRef(false)

  const shouldPlay = musicOn && MUSIC_SCREENS.includes(screen)

  const tryPlayMusic = useCallback(() => {
    if (shouldPlay && userClicked.current) {
      unlockAudio()
      startMusic()
    } else {
      stopMusic()
    }
  }, [shouldPlay])

  useEffect(() => {
    tryPlayMusic()
  }, [tryPlayMusic])

  useEffect(() => {
    function onClick() {
      if (!userClicked.current) {
        userClicked.current = true
        unlockAudio()
        if (shouldPlay) {
          startMusic()
        }
      }
    }
    document.addEventListener('click', onClick, { once: false })
    document.addEventListener('touchstart', onClick, { once: false })
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('touchstart', onClick)
    }
  }, [shouldPlay])

  // Close menu when navigating
  function navigate(id) {
    if (id === '_logout') {
      auth.signOut().then(() => {
        setScreen('start')
      })
      setMenuOpen(false)
      return
    }
    setScreen(id)
    setMenuOpen(false)
  }

  function toggleMusic() {
    userClicked.current = true
    unlockAudio()
    const next = !musicOn
    setMusicOn(next)
    localStorage.setItem('soccerStarMusic', next ? 'on' : 'off')
    if (next && MUSIC_SCREENS.includes(screen)) {
      stopMusic()
      setTimeout(() => startMusic(), 10)
    } else {
      stopMusic()
    }
  }

  function handleVolume(level) {
    setVol(level)
    setVolume(level)
  }

  // Find current screen label for display
  const allItems = NAV_GROUPS.flatMap(g => g.items)
  const currentItem = allItems.find(i => i.id === screen)
  const currentLabel = currentItem ? `${currentItem.icon} ${currentItem.label}` : '⚽ Menü'

  return (
    <nav className="sticky top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-2 py-1.5">
          {/* Hamburger + current page (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 text-white font-bold text-base active:scale-95 transition-all"
          >
            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
            <span>{currentLabel}</span>
          </button>

          {/* Desktop: inline nav buttons */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} className="flex items-center">
                {gi > 0 && <div className="w-px h-6 bg-white/20 mx-1" />}
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      screen === item.id
                        ? 'bg-white/25 text-white shadow-inner ring-2 ring-white/30 scale-105'
                        : 'text-green-100 hover:text-white hover:bg-white/10 active:scale-95'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Right side: controls (always visible) */}
          <div className="flex items-center gap-1.5">
            {/* Profile switch */}
            {onSwitchProfiles && (
              <button
                onClick={() => { onSwitchProfiles(); setMenuOpen(false) }}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-sm font-bold text-green-100 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                title="Profil wechseln"
              >
                <span className="text-base">🔀</span>
                <span className="hidden sm:inline">Wechsel</span>
              </button>
            )}

            {/* Music toggle */}
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                musicOn ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
              title={musicOn ? 'Musik aus' : 'Musik an'}
            >
              <span className="text-base">{musicOn ? '🎵' : '🔇'}</span>
              <span className="hidden sm:inline">{musicOn ? 'An' : 'Aus'}</span>
            </button>

            {/* Volume */}
            {musicOn && (
              <div className="flex gap-0.5">
                {['leise', 'mittel', 'laut'].map(l => (
                  <button
                    key={l}
                    onClick={() => handleVolume(l)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all active:scale-90 ${
                      vol === l
                        ? 'bg-white text-green-700 shadow-md'
                        : 'bg-white/15 text-white/70 hover:bg-white/30'
                    }`}
                    title={l}
                  >
                    {l === 'leise' ? '🔈' : l === 'mittel' ? '🔉' : '🔊'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-emerald-600 to-green-700 shadow-2xl border-t border-white/10 animate-[slideDown_0.2s_ease-out]">
          <div className="max-w-lg mx-auto px-3 py-3 space-y-3">
            {NAV_GROUPS.map(group => (
              <div key={group.label}>
                <div className="text-xs font-bold text-green-200/70 uppercase tracking-wider px-2 mb-1.5">
                  {group.label}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`flex flex-col items-center gap-1 px-2 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        screen === item.id
                          ? 'bg-white/25 text-white shadow-lg ring-2 ring-yellow-300/50 scale-105'
                          : 'bg-white/10 text-green-100 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  )
}
