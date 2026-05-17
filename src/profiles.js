// Multi-profile system: each profile is a completely independent save game

const PROFILES_KEY = 'soccerStarProfiles'
const ACTIVE_PROFILE_KEY = 'soccerStarActiveProfile'

export function loadProfiles() {
  try {
    const data = JSON.parse(localStorage.getItem(PROFILES_KEY))
    if (Array.isArray(data) && data.length > 0) return data
  } catch {}
  // Migrate existing single-player data into profile 0
  return migrateToProfiles()
}

function migrateToProfiles() {
  try {
    const oldPlayer = JSON.parse(localStorage.getItem('soccerStarPlayer'))
    if (oldPlayer) {
      const profile = {
        id: generateId(),
        player: oldPlayer,
        appearance: safeParseJSON('soccerStarAppearance'),
        equipment: safeParseJSON('soccerStarEquipment'),
        learned: safeParseJSON('soccerStarLearned'),
        myCharacters: safeParseJSON('soccerStarMyCharacters'),
        activeCharIdx: parseInt(localStorage.getItem('soccerStarActiveCharIdx') || '0') || 0,
      }
      return [profile]
    }
  } catch {}
  return []
}

function safeParseJSON(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || null
}

export function setActiveProfileId(id) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id)
}

export function getActiveProfile(profiles) {
  const id = getActiveProfileId()
  return profiles.find(p => p.id === id) || profiles[0] || null
}

export function createNewProfile(name) {
  return {
    id: generateId(),
    player: {
      name,
      character: 'Rookie',
      difficulty: 'leicht',
      points: 0,
      stars: 0,
      goldenStars: 0,
      coins: 0,
      items: [],
    },
    appearance: null,
    equipment: null,
    learned: null,
    myCharacters: null,
    activeCharIdx: 0,
  }
}

// Load a profile's data into the localStorage slots that other components expect
export function activateProfile(profile) {
  if (!profile) return
  localStorage.setItem('soccerStarPlayer', JSON.stringify(profile.player))
  if (profile.appearance) localStorage.setItem('soccerStarAppearance', JSON.stringify(profile.appearance))
  else localStorage.removeItem('soccerStarAppearance')
  if (profile.equipment) localStorage.setItem('soccerStarEquipment', JSON.stringify(profile.equipment))
  else localStorage.removeItem('soccerStarEquipment')
  if (profile.learned) localStorage.setItem('soccerStarLearned', JSON.stringify(profile.learned))
  else localStorage.removeItem('soccerStarLearned')
  if (profile.myCharacters) localStorage.setItem('soccerStarMyCharacters', JSON.stringify(profile.myCharacters))
  else localStorage.removeItem('soccerStarMyCharacters')
  localStorage.setItem('soccerStarActiveCharIdx', String(profile.activeCharIdx || 0))
  setActiveProfileId(profile.id)
}

// Save current localStorage state back into the profile object
export function snapshotCurrentProfile(profile) {
  if (!profile) return profile
  return {
    ...profile,
    player: safeParseJSON('soccerStarPlayer') || profile.player,
    appearance: safeParseJSON('soccerStarAppearance'),
    equipment: safeParseJSON('soccerStarEquipment'),
    learned: safeParseJSON('soccerStarLearned'),
    myCharacters: safeParseJSON('soccerStarMyCharacters'),
    activeCharIdx: parseInt(localStorage.getItem('soccerStarActiveCharIdx') || '0') || 0,
  }
}
