import { useState, useEffect } from 'react'
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
import RankingPreview from './components/RankingPreview'
import FriendsPreview from './components/FriendsPreview'
import LoginPreview from './components/LoginPreview'
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
    // If there's no profile yet or no active profile, show profile select
    const profs = loadProfiles()
    if (profs.length === 0) return 'profileselect'
    const active = getActiveProfile(profs)
    if (!active) return 'profileselect'
    return 'start'
  })
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    if (player) savePlayer(player)
  }, [player])

  // Save current profile snapshot when switching away or on changes
  function saveCurrentToProfile() {
    if (!activeProfileId) return
    const updated = profiles.map(p => {
      if (p.id === activeProfileId) return snapshotCurrentProfile(p)
      return p
    })
    setProfiles(updated)
    saveProfiles(updated)
  }

  function handleSelectProfile(profile) {
    // Save current profile first
    saveCurrentToProfile()
    // Activate new profile
    activateProfile(profile)
    setActiveId(profile.id)
    let p = profile.player
    p = applyRefundIfNeeded(p)
    setPlayer(p)
    savePlayer(p)
    setScreen('start')
  }

  function handleCreateProfile(name) {
    saveCurrentToProfile()
    const newProf = createNewProfile(name)
    const updated = [...profiles, newProf]
    setProfiles(updated)
    saveProfiles(updated)
    // Activate new profile
    activateProfile(newProf)
    setActiveId(newProf.id)
    setPlayer(newProf.player)
    savePlayer(newProf.player)
    setScreen('start')
  }

  function handleDeleteProfile(id) {
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
      // Store rewards per difficulty
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

  // Exchange per difficulty: type = 'points'|'stars'|'goldenStars', diff = 'leicht'|'mittel'|'schwer'
  function handleExchange(type, amount, diff) {
    const RATES = {
      leicht: { points: 2, stars: 25, goldenStars: 50 },
      mittel: { points: 5, stars: 40, goldenStars: 75 },
      schwer: { points: 20, stars: 75, goldenStars: 200 },
    }
    const rate = (RATES[diff] || RATES.mittel)[type]
    const coins = amount * rate
    setPlayer(prev => {
      const byDiff = { ...(prev._byDifficulty || {}) }
      const d = byDiff[diff] || { points: 0, stars: 0, goldenStars: 0 }
      byDiff[diff] = { ...d, [type]: Math.max(0, d[type] - amount) }
      return {
        ...prev,
        [type]: prev[type] - amount,
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
          <ExchangeScreen player={player} onExchange={handleExchange} />
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
          <RankingPreview player={player} />
        )}
        {screen === 'friends' && (
          <FriendsPreview />
        )}
        {screen === 'login' && (
          <LoginPreview setScreen={setScreen} />
        )}
      </div>
    </div>
  )
}
