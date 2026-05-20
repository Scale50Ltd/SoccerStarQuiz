import { supabase } from '../lib/supabase'

// ─── Users Profile ────────────────────────────────────────────────────────────

export async function getOrCreateUserProfile(userId) {
  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found — create new
      const { data: created, error: insertError } = await supabase
        .from('users_profile')
        .insert({ user_id: userId, display_name: '' })
        .select()
        .single()
      if (insertError) throw insertError
      return created
    }
    throw error
  }

  return data
}

export async function updateDisplayName(userId, displayName) {
  const { data, error } = await supabase
    .from('users_profile')
    .update({ display_name: displayName })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Player Profiles ──────────────────────────────────────────────────────────

export async function loadCloudProfiles(userId) {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*, stats(*)')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createCloudProfile(userId, profileData) {
  const { name, player, appearance, equipment, myCharacters, activeCharIdx } = profileData

  const { data: profile, error: profileError } = await supabase
    .from('player_profiles')
    .insert({
      owner_user_id: userId,
      name,
      appearance: appearance ?? null,
      equipment: equipment ?? null,
      my_characters: myCharacters ?? null,
      active_char_idx: activeCharIdx ?? 0,
    })
    .select()
    .single()

  if (profileError) throw profileError

  const { error: statsError } = await supabase
    .from('stats')
    .insert(_playerToStatsRow(profile.id, player))

  if (statsError) throw statsError

  return profile
}

export async function updateCloudProfile(profileId, profileData) {
  const { name, appearance, equipment, myCharacters, activeCharIdx } = profileData

  const { data, error } = await supabase
    .from('player_profiles')
    .update({
      name,
      appearance: appearance ?? null,
      equipment: equipment ?? null,
      my_characters: myCharacters ?? null,
      active_char_idx: activeCharIdx ?? 0,
    })
    .eq('id', profileId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCloudProfile(profileId) {
  const { error } = await supabase
    .from('player_profiles')
    .delete()
    .eq('id', profileId)

  if (error) throw error
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function _playerToStatsRow(profileId, player) {
  return {
    player_profile_id: profileId,
    points: player.points ?? 0,
    stars: player.stars ?? 0,
    golden_stars: player.goldenStars ?? 0,
    coins: player.coins ?? 0,
    items: player.items ?? [],
    by_difficulty: player._byDifficulty ?? {},
    rounds_played: player._roundsPlayed ?? 0,
    correct_answers: player._correctAnswers ?? 0,
    week_bonus: player._weekBonus ?? {},
    claimed_goals: player._claimedGoals ?? [],
    character_name: player.character ?? 'Rookie',
    difficulty: player.difficulty ?? 'leicht',
  }
}

export async function saveCloudStats(profileId, player) {
  const row = {
    ..._playerToStatsRow(profileId, player),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('stats')
    .upsert(row, { onConflict: 'player_profile_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Converters ───────────────────────────────────────────────────────────────

export function cloudToLocalPlayer(stats) {
  return {
    points: stats.points ?? 0,
    stars: stats.stars ?? 0,
    goldenStars: stats.golden_stars ?? 0,
    coins: stats.coins ?? 0,
    items: stats.items ?? [],
    _byDifficulty: stats.by_difficulty ?? {},
    _roundsPlayed: stats.rounds_played ?? 0,
    _correctAnswers: stats.correct_answers ?? 0,
    _weekBonus: stats.week_bonus ?? {},
    _claimedGoals: stats.claimed_goals ?? [],
    character: stats.character_name ?? 'Rookie',
    difficulty: stats.difficulty ?? 'leicht',
    _galaxieRefundV2: true,
  }
}

export function cloudToLocalProfile(cloudProfile) {
  const stats = Array.isArray(cloudProfile.stats)
    ? cloudProfile.stats[0]
    : cloudProfile.stats

  return {
    id: cloudProfile.id,
    cloudId: cloudProfile.id,
    player: stats
      ? { ...cloudToLocalPlayer(stats), name: cloudProfile.name }
      : { name: cloudProfile.name, character: 'Rookie', difficulty: 'leicht', points: 0, stars: 0, goldenStars: 0, coins: 0, items: [], _galaxieRefundV2: true },
    appearance: cloudProfile.appearance ?? null,
    equipment: cloudProfile.equipment ?? null,
    learned: null,
    myCharacters: cloudProfile.my_characters ?? null,
    activeCharIdx: cloudProfile.active_char_idx ?? 0,
  }
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export async function loadLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('points', { ascending: false })
    .limit(100)

  if (error) throw error
  return data
}

// ─── Friends ──────────────────────────────────────────────────────────────────

export async function loadFriends(userId) {
  const { data, error } = await supabase
    .from('friends')
    .select(
      '*, from_profile:users_profile!friends_from_user_profile_fkey(display_name), to_profile:users_profile!friends_to_user_profile_fkey(display_name)'
    )
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)

  if (error) throw error
  return data
}

export async function sendFriendRequestByName(fromUserId, displayName) {
  // Find target user by display name (case-insensitive)
  const { data: users, error: findError } = await supabase
    .from('users_profile')
    .select('user_id')
    .ilike('display_name', displayName)
    .limit(1)

  if (findError) throw findError
  if (!users || users.length === 0) {
    throw new Error('Kein Spieler mit diesem Namen gefunden.')
  }

  const toUserId = users[0].user_id

  if (toUserId === fromUserId) {
    throw new Error('Du kannst dich nicht selbst als Freund hinzufügen!')
  }

  // Check for existing friendship in either direction
  const { data: existing, error: checkError } = await supabase
    .from('friends')
    .select('id')
    .or(
      `and(from_user_id.eq.${fromUserId},to_user_id.eq.${toUserId}),and(from_user_id.eq.${toUserId},to_user_id.eq.${fromUserId})`
    )
    .limit(1)

  if (checkError) throw checkError
  if (existing && existing.length > 0) {
    throw new Error('Ihr seid schon Freunde oder die Anfrage existiert bereits.')
  }

  const { data, error } = await supabase
    .from('friends')
    .insert({ from_user_id: fromUserId, to_user_id: toUserId, status: 'pending' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function respondToFriendRequest(requestId, accept) {
  const status = accept ? 'accepted' : 'rejected'

  const { data, error } = await supabase
    .from('friends')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeFriend(requestId) {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)

  if (error) throw error
}

export async function loadFriendStats(friendUserIds) {
  if (!friendUserIds || friendUserIds.length === 0) return []

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .in('owner_user_id', friendUserIds)

  if (error) throw error
  return data
}
