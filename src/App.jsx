import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { loadCloudProfiles, createCloudProfile, updateCloudProfile, deleteCloudProfile, saveCloudStats, cloudToLocalProfile, getOrCreateUserProfile } from './lib/cloudDataService'
import LoginScreen from './components/LoginScreen'
import RankingScreen from './components/RankingScreen'
import FriendsScreen from './components/FriendsScreen'
import MigrateDialog from './components/MigrateDialog'
import DisplayNameDialog from './components/DisplayNameDialog'
import StartScreen from './components/StartScreen'
import CharacterScreen from './components/CharacterScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import ProfileScreen from './components/ProfileScreen'
import ShopScreen from './components/ShopScreen'
import ExchangeScreen from './components/ExchangeScreen'
import EquipmentScreen from './components/EquipmentScreen'
import CharacterEditor from './components/CharacterEditor'
import MyCharacters from './components/MyCharacters'
import BonusScreen from './components/BonusScreen'
import ProfileSelect from './components/ProfileSelect'
import Nav from './components/Nav'
import { loadProfiles, saveProfiles, getActiveProfile, activateProfile, snapshotCurrentProfile, createNewProfile } from './profiles'
import { markDayPlayed } from './bonus'

const STARTER_CHARACTERS = [
  { name: 'Rookie' },
  { name: 'Sprinter' },
  { name: 'Dribbler' },
  { name: 'Flitzer' },
  { name: 'Joker' },
]

// Galaxie-Ball refund: runs once per profile. Uses a flag INSIDE the player object so it's per-profile.
function applyRefundIfNeeded(player) {
  if (!player) return player
  if (player._galaxieRefundV2) return player // already refunded
  if ((player.items || []).includes('ball_galaxie')) {
    player.items = player.items.filter(id => id !== 'ball_galaxie')
    player.coins = (player.coins || 0) + 700
    player._galaxieRefundV2 = true
    // Reset equipment ball if needed
    try {
      const equip = JSON.parse(localStorage.getItem('soccerStarEquipment') || '{}')
      if (equip.ballId === 'ball_galaxie') {
        equip.ballId = null
        localStorage.setItem('soccerStarEquipment', JSON.stringify(equip))
      }
    } catch {}
  } else {
    player._galaxieRefundV2 = true // mark as processed even if ball wasn't there
  }
  return player
}

function loadPlayer() {
  const saved = localStorage.getItem('soccerStarPlayer')
  if (!saved) return null
  let player = JSON.parse(saved)
  player = applyRefundIfNeeded(player)
  return player
}

function savePlayer(player) {
  localStorage.setItem('soccerStarPlayer', JSON.stringify(player))
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

function AppInner() {
  const auth = useAuth()

  const [profiles, setProfiles] = useState(loadProfiles)
  const [activeProfileId, setActiveId] = useState(() => {
    const active = getActiveProfile(loadProfiles())
    return active?.id || null
  })
  const [player, setPlayer] = useState(() => {
    const p = loadPlayer()
    return p ? applyRefundIfNeeded(p) : null
  })
  const [screen, setScreen] = useState(() => {
    const profs = loadProfiles()
    if (profs.length === 0) return 'profileselect'
    const active = getActiveProfile(profs)
    if (!active) return 'profileselect'
    return 'start'
  })
  const [lastResult, setLastResult] = useState(null)
  const [offlineMode, setOfflineMode] = useState(false)

  // Cloud state
  const [cloudProfileId, setCloudProfileId] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [showMigrate, setShowMigrate] = useState(false)
  const [showDisplayName, setShowDisplayName] = useState(false)
  const [cloudLoaded, setCloudLoaded] = useState(false)

  // Save player to localStorage
  useEffect(() => {
    if (player) savePlayer(player)
  }, [player])

  // Cloud sync: save stats to Supabase when player changes (debounced)
  useEffect(() => {
    if (!auth.isOnline || !cloudProfileId || !player) return
    const timer = setTimeout(() => {
      saveCloudStats(cloudProfileId, player).catch(console.error)
    }, 1000)
    return () => clearTimeout(timer)
  }, [auth.isOnline, cloudProfileId, player])

  // Load cloud profiles when user logs in
  useEffect(() => {
    if (!auth.isOnline || !auth.user || cloudLoaded) return

    async function loadCloud() {
      try {
        const userProfile = await getOrCreateUserProfile(auth.user.id)
        setDisplayName(userProfile.display_name || '')

        if (!userProfile.display_name) {
          setShowDisplayName(true)
        }

        let cloudProfiles = await loadCloudProfiles(auth.user.id)

        // Self-heal: no cloud profiles → try to create one
        if (cloudProfiles.length === 0) {
          // First try: upload local data if available
          const localProfs = loadProfiles()
          const hasLocalData = localProfs.length > 0 && localProfs[0].player &&
            (localProfs[0].player.points > 0 || localProfs[0].player.coins > 0)

          if (hasLocalData) {
            try {
              await createCloudProfile(auth.user.id, {
                name: localProfs[0].player.name || userProfile.display_name || 'Spieler',
                player: localProfs[0].player,
                appearance: localProfs[0].appearance,
                equipment: localProfs[0].equipment,
                myCharacters: localProfs[0].myCharacters,
                activeCharIdx: localProfs[0].activeCharIdx || 0,
              })
              cloudProfiles = await loadCloudProfiles(auth.user.id)
            } catch (e) {
              console.error('Local data upload failed:', e)
            }
          }

          // Second try: create a fresh profile
          if (cloudProfiles.length === 0) {
            try {
              const name = userProfile.display_name || 'Spieler'
              await createCloudProfile(auth.user.id, {
                name,
                player: createNewProfile(name).player,
              })
              cloudProfiles = await loadCloudProfiles(auth.user.id)
            } catch (e) {
              console.error('Fresh profile creation failed:', e)
            }
          }
        }

        const localFormatProfiles = finalCloudProfiles.map(cloudToLocalProfile)
        setProfiles(localFormatProfiles)

        if (localFormatProfiles.length > 0) {
          const first = localFormatProfiles[0]
          setActiveId(first.id)
          setCloudProfileId(first.cloudId || first.id)
          setPlayer(first.player)
          activateProfile(first)
          setScreen('start')
        } else {
          setScreen('profileselect')
        }
        setCloudLoaded(true)
      } catch (err) {
        console.error('Cloud load error:', err)
        setCloudLoaded(true)
      }
    }
    loadCloud()
  }, [auth.isOnline, auth.user?.id, cloudLoaded])

  // Reset cloud state on logout → go back to login screen
  useEffect(() => {
    if (!auth.isOnline && cloudLoaded) {
      setCloudLoaded(false)
      setCloudProfileId(null)
      setDisplayName('')
      setOfflineMode(false)
      setActiveId(null)
      setPlayer(null)
      setScreen('login')
    }
  }, [auth.isOnline])

  // Save current profile snapshot when switching away or on changes
  function saveCurrentToProfile() {
    if (!activeProfileId) return
    const updated = profiles.map(p => {
      if (p.id === activeProfileId) return snapshotCurrentProfile(p)
      return p
    })
    setProfiles(updated)
    saveProfiles(updated)

    // Cloud sync: save profile data
    if (auth.isOnline && cloudProfileId) {
      const snapshot = snapshotCurrentProfile(profiles.find(p => p.id === activeProfileId))
      if (snapshot) {
        updateCloudProfile(cloudProfileId, {
          name: snapshot.player?.name || 'Spieler',
          appearance: snapshot.appearance,
          equipment: snapshot.equipment,
          myCharacters: snapshot.myCharacters,
          activeCharIdx: snapshot.activeCharIdx,
        }).catch(console.error)
      }
    }
  }

  function handleSelectProfile(profile) {
    saveCurrentToProfile()
    activateProfile(profile)
    setActiveId(profile.id)
    setCloudProfileId(profile.cloudId || profile.id)
    let p = profile.player
    p = applyRefundIfNeeded(p)
    setPlayer(p)
    savePlayer(p)
    setScreen('start')
  }

  function handleCreateProfile(name) {
    saveCurrentToProfile()
    if (auth.isOnline) {
      createCloudProfile(auth.user.id, { name, player: createNewProfile(name).player })
        .then(() => loadCloudProfiles(auth.user.id))
        .then(cloudProfiles => {
          const local = cloudProfiles.map(cloudToLocalProfile)
          setProfiles(local)
          const newest = local[local.length - 1]
          if (newest) handleSelectProfile(newest)
        })
        .catch(console.error)
    } else {
      const newProf = createNewProfile(name)
      const updated = [...profiles, newProf]
      setProfiles(updated)
      saveProfiles(updated)
      activateProfile(newProf)
      setActiveId(newProf.id)
      setPlayer(newProf.player)
      savePlayer(newProf.player)
      setScreen('start')
    }
  }

  function handleDeleteProfile(id) {
    if (auth.isOnline) {
      deleteCloudProfile(id)
        .then(() => loadCloudProfiles(auth.user.id))
        .then(cloudProfiles => {
          const local = cloudProfiles.map(cloudToLocalProfile)
          setProfiles(local)
          if (local.length > 0) {
            handleSelectProfile(local[0])
          } else {
            setActiveId(null)
            setPlayer(null)
            setScreen('profileselect')
          }
        })
        .catch(console.error)
    } else {
      const updated = profiles.filter(p => p.id !== id)
      setProfiles(updated)
      saveProfiles(updated)
      if (id === activeProfileId && updated.length > 0) {
        handleSelectProfile(updated[0])
      } else if (updated.length === 0) {
        setActiveId(null)
        setPlayer(null)
        setScreen('profileselect')
      }
    }
  }

  function handleSwitchProfiles() {
    saveCurrentToProfile()
    setScreen('profileselect')
  }

  function handleStart(name, difficulty) {
    if (player && player.name === name) {
      setPlayer({ ...player, difficulty })
      setScreen('quiz')
    } else {
      const starter = STARTER_CHARACTERS[Math.floor(Math.random() * STARTER_CHARACTERS.length)]
      const newPlayer = {
        ...player,
        name,
        character: starter.name,
        difficulty,
        points: player?.points || 0,
        stars: player?.stars || 0,
        goldenStars: player?.goldenStars || 0,
        coins: player?.coins || 0,
        items: player?.items || [],
        _galaxieRefundV2: player?._galaxieRefundV2 || false,
      }
      setPlayer(newPlayer)
      setScreen('quiz')
    }
  }

  function handleQuizComplete(result) {
    const earned = { points: result.correct, stars: 0, goldenStars: 0 }
    if (result.correct >= 5) earned.stars = 1
    if (result.correct === 10) { earned.stars = 2; earned.goldenStars = 1 }

    const diff = player.difficulty || 'mittel'

    setPlayer(prev => {
      const byDiff = { ...(prev._byDifficulty || {}) }
      const d = byDiff[diff] || { points: 0, stars: 0, goldenStars: 0 }
      byDiff[diff] = {
        points: d.points + earned.points,
        stars: d.stars + earned.stars,
        goldenStars: d.goldenStars + earned.goldenStars,
      }

      const updated = {
        ...prev,
        points: prev.points + earned.points,
        stars: prev.stars + earned.stars,
        goldenStars: prev.goldenStars + earned.goldenStars,
        _roundsPlayed: (prev._roundsPlayed || 0) + 1,
        _correctAnswers: (prev._correctAnswers || 0) + result.correct,
        _byDifficulty: byDiff,
      }
      if (result.total === 10) {
        return markDayPlayed(updated)
      }
      return updated
    })
    setLastResult({ ...result, earned })
    setScreen('result')
  }

  // Exchange: 10 points → 1 golden star (from a specific difficulty)
  function handlePointsToGold(diff, amount) {
    const pointsCost = amount * 10
    setPlayer(prev => {
      const byDiff = { ...(prev._byDifficulty || {}) }
      const d = byDiff[diff] || { points: 0, stars: 0, goldenStars: 0 }
      if (d.points < pointsCost) return prev
      byDiff[diff] = { ...d, points: d.points - pointsCost, goldenStars: d.goldenStars + amount }
      return {
        ...prev,
        points: prev.points - pointsCost,
        goldenStars: prev.goldenStars + amount,
        _byDifficulty: byDiff,
      }
    })
  }

  // Exchange: 2 normal stars → 1 golden star (from a specific difficulty)
  function handleStarsToGold(diff, amount) {
    const starsCost = amount * 2
    setPlayer(prev => {
      const byDiff = { ...(prev._byDifficulty || {}) }
      const d = byDiff[diff] || { points: 0, stars: 0, goldenStars: 0 }
      if (d.stars < starsCost) return prev
      byDiff[diff] = { ...d, stars: d.stars - starsCost, goldenStars: d.goldenStars + amount }
      return {
        ...prev,
        stars: prev.stars - starsCost,
        goldenStars: prev.goldenStars + amount,
        _byDifficulty: byDiff,
      }
    })
  }

  // Exchange: golden stars → coins (from a specific difficulty)
  function handleGoldToCoins(diff, amount) {
    const GOLD_RATES = { leicht: 50, mittel: 75, schwer: 200 }
    const rate = GOLD_RATES[diff] || GOLD_RATES.mittel
    const coins = amount * rate
    setPlayer(prev => {
      const byDiff = { ...(prev._byDifficulty || {}) }
      const d = byDiff[diff] || { points: 0, stars: 0, goldenStars: 0 }
      if (d.goldenStars < amount) return prev
      byDiff[diff] = { ...d, goldenStars: d.goldenStars - amount }
      return {
        ...prev,
        goldenStars: prev.goldenStars - amount,
        coins: prev.coins + coins,
        _byDifficulty: byDiff,
      }
    })
  }

  function handleBuy(item) {
    if (player.coins >= item.price && !player.items.includes(item.id)) {
      setPlayer(prev => ({
        ...prev,
        coins: prev.coins - item.price,
        items: [...prev.items, item.id],
      }))
    }
  }

  function handleChangeCharacter(name) {
    setPlayer(prev => ({ ...prev, character: name }))
  }

  // Show loading while auth initializes
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚽</div>
          <p className="text-green-100 font-bold text-lg">Laden...</p>
        </div>
      </div>
    )
  }

  // Login gate: show login screen first if not logged in and not in offline mode
  // supabase being null means env vars not set (local dev without .env) — skip gate
  const supabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  if (!auth.isOnline && !offlineMode && supabaseConfigured) {
    return (
      <div className="min-h-screen">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
          <LoginScreen setScreen={() => {}} onOffline={() => {
            setOfflineMode(true)
            // Reload local profiles for offline play
            const localProfs = loadProfiles()
            setProfiles(localProfs)
            const active = getActiveProfile(localProfs)
            if (active) {
              setActiveId(active.id)
              activateProfile(active)
              setPlayer(active.player ? applyRefundIfNeeded(active.player) : null)
              setScreen('start')
            } else {
              setScreen('profileselect')
            }
          }} />
        </div>
      </div>
    )
  }

  // Profile select screen (no nav)
  if (screen === 'profileselect') {
    return (
      <div className="min-h-screen">
        <ProfileSelect
          profiles={profiles}
          onSelect={handleSelectProfile}
          onCreate={handleCreateProfile}
          onDelete={handleDeleteProfile}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {player && <Nav screen={screen} setScreen={setScreen} onSwitchProfiles={handleSwitchProfiles} />}

      {/* Migration dialog */}
      {showMigrate && auth.isOnline && (
        <MigrateDialog
          userId={auth.user.id}
          onDone={() => {
            setShowMigrate(false)
            loadCloudProfiles(auth.user.id).then(cp => {
              const local = cp.map(cloudToLocalProfile)
              setProfiles(local)
              if (local.length > 0) {
                handleSelectProfile(local[0])
              } else {
                setScreen('profileselect')
              }
            }).catch(console.error)
          }}
        />
      )}

      {/* Display name dialog */}
      {showDisplayName && auth.isOnline && (
        <DisplayNameDialog
          userId={auth.user.id}
          currentName={displayName}
          onDone={(name) => {
            setDisplayName(name)
            setShowDisplayName(false)
          }}
        />
      )}

      <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
        {screen === 'start' && (
          <StartScreen player={player} onStart={handleStart} />
        )}
        {screen === 'character' && (
          <CharacterScreen player={player} onContinue={() => setScreen('quiz')} />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            difficulty={player.difficulty}
            onComplete={handleQuizComplete}
          />
        )}
        {screen === 'result' && lastResult && (
          <ResultScreen
            result={lastResult}
            player={player}
            onPlayAgain={() => setScreen('quiz')}
            setScreen={setScreen}
          />
        )}
        {screen === 'profile' && (
          <ProfileScreen
            player={player}
            setScreen={setScreen}
          />
        )}
        {screen === 'shop' && (
          <ShopScreen player={player} onBuy={handleBuy} />
        )}
        {screen === 'exchange' && (
          <ExchangeScreen player={player} onPointsToGold={handlePointsToGold} onStarsToGold={handleStarsToGold} onGoldToCoins={handleGoldToCoins} />
        )}
        {screen === 'equipment' && (
          <EquipmentScreen player={player} />
        )}
        {screen === 'editor' && (
          <CharacterEditor player={player} setScreen={setScreen} />
        )}
        {screen === 'mycharacters' && (
          <MyCharacters setScreen={setScreen} />
        )}
        {screen === 'bonus' && (
          <BonusScreen player={player} setPlayer={setPlayer} />
        )}
        {screen === 'ranking' && (
          <RankingScreen player={player} />
        )}
        {screen === 'friends' && (
          <FriendsScreen />
        )}
        {screen === 'login' && (
          <LoginScreen setScreen={setScreen} />
        )}
      </div>
    </div>
  )
}
