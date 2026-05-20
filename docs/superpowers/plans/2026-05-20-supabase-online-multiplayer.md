# Supabase Online-Multiplayer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Soccer Star Quiz from a local-only game into a family online game with Supabase Auth, cloud storage, leaderboard, and friends system.

**Architecture:** Supabase handles auth (email/password for parents), Postgres database (profiles, stats, friends), and RLS for security. The frontend uses `@supabase/supabase-js` to connect directly — no custom server needed. Offline mode (localStorage) is preserved for non-logged-in users. An `AuthContext` wraps the app to provide auth state everywhere.

**Tech Stack:** React 19 + Vite + Tailwind 4 (existing), Supabase JS v2 (new), Supabase Auth + Postgres + RLS

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/supabase.js` | Supabase client singleton (reads env vars) |
| `src/contexts/AuthContext.jsx` | React context: auth state, login/logout/register, session |
| `src/lib/cloudDataService.js` | CRUD for cloud data: profiles, stats, friends, leaderboard |
| `src/components/LoginScreen.jsx` | Real login/register/reset UI (replaces LoginPreview) |
| `src/components/RankingScreen.jsx` | Real leaderboard from Supabase (replaces RankingPreview) |
| `src/components/FriendsScreen.jsx` | Real friends system (replaces FriendsPreview) |
| `src/components/MigrateDialog.jsx` | One-time "import local data to cloud?" dialog |
| `src/components/DisplayNameDialog.jsx` | Set/edit display name for leaderboard |
| `.env.example` | Template for Supabase env vars |
| `sql/01-schema.sql` | Database tables |
| `sql/02-rls.sql` | Row Level Security policies |
| `sql/03-views.sql` | Leaderboard view |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.jsx` | Wrap in AuthContext, route to LoginScreen, pass auth state |
| `src/components/Nav.jsx` | Replace "Login" nav item with "Abmelden" when logged in, show display name |
| `src/dataService.js` | Add cloud read/write that delegates to cloudDataService when logged in |
| `src/profiles.js` | Add cloud-aware profile load/save |
| `package.json` | Add `@supabase/supabase-js` dependency |

---

## Task 0: Manual Setup (User Action Required)

These are steps the user (father) must do manually. Not code tasks.

### 0a: Create Supabase Project

**DAS MUSST DU (dein Vater) TUN:**

1. Gehe zu **https://supabase.com** und klicke **"Start your project"**
2. Melde dich an (mit GitHub oder E-Mail)
3. Klicke **"New Project"**
4. Wähle:
   - **Name:** `soccer-star-quiz`
   - **Database Password:** Ein sicheres Passwort (aufschreiben!)
   - **Region:** `West EU (Frankfurt)` (am nächsten zu euch)
5. Warte ~2 Minuten bis das Projekt fertig ist

### 0b: Copy API Keys

**DAS MUSST DU (dein Vater) TUN:**

1. Im Supabase-Dashboard: klicke links auf **"Settings"** (Zahnrad-Symbol)
2. Dann auf **"API"** (unter "Configuration")
3. Kopiere diese zwei Werte:
   - **Project URL** — sieht aus wie `https://xxxxx.supabase.co`
   - **anon public key** — ein langer Text, der mit `eyJ...` anfängt
4. Gib mir beide Werte, damit ich sie einbauen kann

**WICHTIG:** Den **service_role key** NIEMALS kopieren oder teilen! Den brauchen wir nicht.

---

## Task 1: Install Supabase & Environment Setup

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Create: `src/lib/supabase.js`

- [ ] **Step 1: Install @supabase/supabase-js**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 2: Create `.env.example`**

Create file `.env.example`:

```env
# Supabase-Verbindung (Werte aus dem Supabase-Dashboard kopieren)
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key-hier
```

- [ ] **Step 3: Create `src/lib/supabase.js`**

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase nicht konfiguriert – App läuft im Offline-Modus.')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .env.example src/lib/supabase.js
git commit -m "feat: add Supabase client setup with env vars"
```

---

## Task 2: SQL Schema (for user to paste into Supabase SQL Editor)

**Files:**
- Create: `sql/01-schema.sql`
- Create: `sql/02-rls.sql`
- Create: `sql/03-views.sql`

**DAS MUSST DU TUN:** Jedes SQL-Skript im Supabase SQL Editor einfügen und auf "Run" klicken.

- [ ] **Step 1: Create `sql/01-schema.sql`**

```sql
-- =============================================
-- Soccer Star Quiz: Datenbank-Schema
-- Im Supabase SQL Editor einfügen und "Run" klicken
-- =============================================

-- 1) Eltern-Profil (1 pro Account)
CREATE TABLE users_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Spieler-Profile (mehrere pro Eltern-Account)
CREATE TABLE player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Spieler',
  appearance JSONB DEFAULT NULL,
  equipment JSONB DEFAULT NULL,
  my_characters JSONB DEFAULT NULL,
  active_char_idx INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_player_profiles_owner ON player_profiles(owner_user_id);

-- 3) Spielstand pro Spieler-Profil
CREATE TABLE stats (
  player_profile_id UUID PRIMARY KEY REFERENCES player_profiles(id) ON DELETE CASCADE,
  points INT NOT NULL DEFAULT 0,
  stars INT NOT NULL DEFAULT 0,
  golden_stars INT NOT NULL DEFAULT 0,
  coins INT NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  by_difficulty JSONB NOT NULL DEFAULT '{}'::jsonb,
  rounds_played INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  week_bonus JSONB NOT NULL DEFAULT '{}'::jsonb,
  claimed_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  character_name TEXT NOT NULL DEFAULT 'Rookie',
  difficulty TEXT NOT NULL DEFAULT 'leicht',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Freundschafts-Anfragen
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX idx_friends_from ON friends(from_user_id);
CREATE INDEX idx_friends_to ON friends(to_user_id);
```

- [ ] **Step 2: Create `sql/02-rls.sql`**

```sql
-- =============================================
-- Row Level Security: Jeder darf nur seine eigenen Daten ändern
-- Im Supabase SQL Editor einfügen und "Run" klicken
-- =============================================

-- Aktiviere RLS auf allen Tabellen
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- === users_profile ===
-- Eigenes Profil lesen
CREATE POLICY "users_profile_select_own"
  ON users_profile FOR SELECT
  USING (auth.uid() = user_id);

-- Eigenes Profil erstellen
CREATE POLICY "users_profile_insert_own"
  ON users_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Eigenes Profil bearbeiten
CREATE POLICY "users_profile_update_own"
  ON users_profile FOR UPDATE
  USING (auth.uid() = user_id);

-- Anzeige-Name von ALLEN lesen (für Rangliste)
CREATE POLICY "users_profile_select_display_name"
  ON users_profile FOR SELECT
  USING (true);

-- === player_profiles ===
-- Eigene Spieler-Profile lesen
CREATE POLICY "player_profiles_select_own"
  ON player_profiles FOR SELECT
  USING (auth.uid() = owner_user_id);

-- Eigene Spieler-Profile erstellen
CREATE POLICY "player_profiles_insert_own"
  ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

-- Eigene Spieler-Profile bearbeiten
CREATE POLICY "player_profiles_update_own"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = owner_user_id);

-- Eigene Spieler-Profile löschen
CREATE POLICY "player_profiles_delete_own"
  ON player_profiles FOR DELETE
  USING (auth.uid() = owner_user_id);

-- === stats ===
-- Eigene Stats lesen (über player_profiles Join)
CREATE POLICY "stats_select_own"
  ON stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM player_profiles
      WHERE player_profiles.id = stats.player_profile_id
        AND player_profiles.owner_user_id = auth.uid()
    )
  );

-- Eigene Stats erstellen
CREATE POLICY "stats_insert_own"
  ON stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM player_profiles
      WHERE player_profiles.id = stats.player_profile_id
        AND player_profiles.owner_user_id = auth.uid()
    )
  );

-- Eigene Stats bearbeiten
CREATE POLICY "stats_update_own"
  ON stats FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM player_profiles
      WHERE player_profiles.id = stats.player_profile_id
        AND player_profiles.owner_user_id = auth.uid()
    )
  );

-- === friends ===
-- Freundschaften lesen: nur wenn man beteiligt ist
CREATE POLICY "friends_select_involved"
  ON friends FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Freundschafts-Anfrage senden: nur als Absender
CREATE POLICY "friends_insert_own"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Freundschaft aktualisieren: nur Empfänger darf Status ändern
CREATE POLICY "friends_update_recipient"
  ON friends FOR UPDATE
  USING (auth.uid() = to_user_id);

-- Freundschaft löschen: beide Seiten dürfen
CREATE POLICY "friends_delete_involved"
  ON friends FOR DELETE
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
```

- [ ] **Step 3: Create `sql/03-views.sql`**

```sql
-- =============================================
-- Rangliste-View: zeigt öffentliche Daten aller Spieler
-- Im Supabase SQL Editor einfügen und "Run" klicken
-- =============================================

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  pp.id AS player_profile_id,
  pp.owner_user_id,
  pp.name AS player_name,
  up.display_name,
  s.points,
  s.stars,
  s.golden_stars,
  s.coins,
  s.rounds_played,
  s.correct_answers
FROM player_profiles pp
JOIN stats s ON s.player_profile_id = pp.id
JOIN users_profile up ON up.user_id = pp.owner_user_id
WHERE up.display_name != ''
ORDER BY s.points DESC;

-- Jeder eingeloggte User darf die Rangliste lesen
-- (Views nutzen die RLS der zugrunde liegenden Tabellen nicht automatisch,
--  aber wir müssen SELECT erlauben für die Stats anderer Spieler in der View)

-- Stats-Leserecht für Rangliste: alle eingeloggten User dürfen Stats lesen
CREATE POLICY "stats_select_for_leaderboard"
  ON stats FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

- [ ] **Step 4: Commit**

```bash
git add sql/
git commit -m "feat: add Supabase SQL schema, RLS policies, and leaderboard view"
```

---

## Task 3: Auth Context

**Files:**
- Create: `src/contexts/AuthContext.jsx`

- [ ] **Step 1: Create `src/contexts/AuthContext.jsx`**

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function resetPassword(email) {
    if (!supabase) throw new Error('Supabase nicht konfiguriert')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = {
    user,
    loading,
    isOnline: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/AuthContext.jsx
git commit -m "feat: add AuthContext with Supabase auth (login, register, logout, reset)"
```

---

## Task 4: Cloud Data Service

**Files:**
- Create: `src/lib/cloudDataService.js`

- [ ] **Step 1: Create `src/lib/cloudDataService.js`**

```js
import { supabase } from './supabase'

// ==========================================
// Users Profile (Eltern-Account)
// ==========================================

export async function getOrCreateUserProfile(userId) {
  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Not found — create new
    const { data: newProfile, error: insertError } = await supabase
      .from('users_profile')
      .insert({ user_id: userId, display_name: '' })
      .select()
      .single()
    if (insertError) throw insertError
    return newProfile
  }
  if (error) throw error
  return data
}

export async function updateDisplayName(userId, displayName) {
  const { error } = await supabase
    .from('users_profile')
    .update({ display_name: displayName })
    .eq('user_id', userId)
  if (error) throw error
}

// ==========================================
// Player Profiles (Spieler innerhalb eines Accounts)
// ==========================================

export async function loadCloudProfiles(userId) {
  const { data, error } = await supabase
    .from('player_profiles')
    .select('*, stats(*)')
    .eq('owner_user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createCloudProfile(userId, profileData) {
  const { data: profile, error } = await supabase
    .from('player_profiles')
    .insert({
      owner_user_id: userId,
      name: profileData.name || 'Spieler',
      appearance: profileData.appearance || null,
      equipment: profileData.equipment || null,
      my_characters: profileData.myCharacters || null,
      active_char_idx: profileData.activeCharIdx || 0,
    })
    .select()
    .single()
  if (error) throw error

  // Create stats row
  const statsData = profileData.player || {}
  const { error: statsError } = await supabase
    .from('stats')
    .insert({
      player_profile_id: profile.id,
      points: statsData.points || 0,
      stars: statsData.stars || 0,
      golden_stars: statsData.goldenStars || 0,
      coins: statsData.coins || 0,
      items: statsData.items || [],
      by_difficulty: statsData._byDifficulty || {},
      rounds_played: statsData._roundsPlayed || 0,
      correct_answers: statsData._correctAnswers || 0,
      week_bonus: statsData._weekBonus || {},
      claimed_goals: statsData._claimedGoals || [],
      character_name: statsData.character || 'Rookie',
      difficulty: statsData.difficulty || 'leicht',
    })
  if (statsError) throw statsError

  return profile
}

export async function updateCloudProfile(profileId, profileData) {
  const { error } = await supabase
    .from('player_profiles')
    .update({
      name: profileData.name,
      appearance: profileData.appearance || null,
      equipment: profileData.equipment || null,
      my_characters: profileData.myCharacters || null,
      active_char_idx: profileData.activeCharIdx || 0,
    })
    .eq('id', profileId)
  if (error) throw error
}

export async function deleteCloudProfile(profileId) {
  // Stats are deleted via CASCADE
  const { error } = await supabase
    .from('player_profiles')
    .delete()
    .eq('id', profileId)
  if (error) throw error
}

// ==========================================
// Stats (Spielstand)
// ==========================================

export async function saveCloudStats(profileId, player) {
  const { error } = await supabase
    .from('stats')
    .upsert({
      player_profile_id: profileId,
      points: player.points || 0,
      stars: player.stars || 0,
      golden_stars: player.goldenStars || 0,
      coins: player.coins || 0,
      items: player.items || [],
      by_difficulty: player._byDifficulty || {},
      rounds_played: player._roundsPlayed || 0,
      correct_answers: player._correctAnswers || 0,
      week_bonus: player._weekBonus || {},
      claimed_goals: player._claimedGoals || [],
      character_name: player.character || 'Rookie',
      difficulty: player.difficulty || 'leicht',
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
}

// Convert cloud data back to local player object format
export function cloudToLocalPlayer(stats) {
  return {
    name: stats.character_name || 'Rookie',
    character: stats.character_name || 'Rookie',
    difficulty: stats.difficulty || 'leicht',
    points: stats.points || 0,
    stars: stats.stars || 0,
    goldenStars: stats.golden_stars || 0,
    coins: stats.coins || 0,
    items: stats.items || [],
    _byDifficulty: stats.by_difficulty || {},
    _roundsPlayed: stats.rounds_played || 0,
    _correctAnswers: stats.correct_answers || 0,
    _weekBonus: stats.week_bonus || {},
    _claimedGoals: stats.claimed_goals || [],
    _galaxieRefundV2: true, // cloud profiles don't need old refund
  }
}

// Convert cloud profile to local profile format
export function cloudToLocalProfile(cloudProfile) {
  const stats = cloudProfile.stats?.[0] || cloudProfile.stats || {}
  return {
    id: cloudProfile.id,
    cloudId: cloudProfile.id,
    player: {
      ...cloudToLocalPlayer(stats),
      name: cloudProfile.name,
    },
    appearance: cloudProfile.appearance || null,
    equipment: cloudProfile.equipment || null,
    learned: null,
    myCharacters: cloudProfile.my_characters || null,
    activeCharIdx: cloudProfile.active_char_idx || 0,
  }
}

// ==========================================
// Leaderboard (Rangliste)
// ==========================================

export async function loadLeaderboard() {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('points', { ascending: false })
    .limit(100)
  if (error) throw error
  return data || []
}

// ==========================================
// Friends (Freunde)
// ==========================================

export async function loadFriends(userId) {
  const { data, error } = await supabase
    .from('friends')
    .select(`
      id, status, created_at, from_user_id, to_user_id,
      from_profile:users_profile!friends_from_user_id_fkey(display_name),
      to_profile:users_profile!friends_to_user_id_fkey(display_name)
    `)
    .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
  if (error) throw error
  return data || []
}

export async function sendFriendRequest(fromUserId, toEmail) {
  // Find user by email in users_profile — we need a way to find them
  // Since we can't query auth.users directly, we look up by display_name
  // OR we use a Supabase function. For simplicity, we search display_name.
  // Actually, let's use a different approach: search by display name
  throw new Error('Use sendFriendRequestByName instead')
}

export async function sendFriendRequestByName(fromUserId, displayName) {
  // Find the user by display name
  const { data: profiles, error: searchError } = await supabase
    .from('users_profile')
    .select('user_id, display_name')
    .ilike('display_name', displayName)
    .limit(1)
  if (searchError) throw searchError
  if (!profiles || profiles.length === 0) {
    throw new Error('Kein Spieler mit diesem Namen gefunden.')
  }

  const targetUserId = profiles[0].user_id
  if (targetUserId === fromUserId) {
    throw new Error('Du kannst dich nicht selbst als Freund hinzufügen!')
  }

  // Check if friendship already exists
  const { data: existing } = await supabase
    .from('friends')
    .select('id')
    .or(`and(from_user_id.eq.${fromUserId},to_user_id.eq.${targetUserId}),and(from_user_id.eq.${targetUserId},to_user_id.eq.${fromUserId})`)
    .limit(1)

  if (existing && existing.length > 0) {
    throw new Error('Ihr seid schon Freunde oder die Anfrage existiert bereits.')
  }

  const { error } = await supabase
    .from('friends')
    .insert({ from_user_id: fromUserId, to_user_id: targetUserId })
  if (error) throw error
}

export async function respondToFriendRequest(requestId, accept) {
  const { error } = await supabase
    .from('friends')
    .update({ status: accept ? 'accepted' : 'rejected' })
    .eq('id', requestId)
  if (error) throw error
}

export async function removeFriend(requestId) {
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)
  if (error) throw error
}

// Load friend stats for comparison
export async function loadFriendStats(friendUserIds) {
  if (friendUserIds.length === 0) return []
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .in('owner_user_id', friendUserIds)
  if (error) throw error
  return data || []
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cloudDataService.js
git commit -m "feat: add cloud data service for profiles, stats, leaderboard, friends"
```

---

## Task 5: Login Screen (Real)

**Files:**
- Create: `src/components/LoginScreen.jsx` (replaces LoginPreview)

- [ ] **Step 1: Create `src/components/LoginScreen.jsx`**

```jsx
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginScreen({ setScreen }) {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      // Auth state change will redirect automatically
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'E-Mail oder Passwort falsch.'
          : err.message || 'Fehler beim Anmelden.'
      )
    }
    setLoading(false)
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }
    if (password !== password2) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      setSuccess('Registrierung erfolgreich! Bitte prüfe deine E-Mails und klicke den Bestätigungslink.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Fehler beim Registrieren.')
    }
    setLoading(false)
  }

  async function handleReset(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSuccess('Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet!')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Fehler beim Senden.')
    }
    setLoading(false)
  }

  return (
    <div className="py-4 space-y-4">
      {/* Eltern-Hinweis */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
        <div className="text-3xl mb-1">👨‍👩‍👧‍👦</div>
        <p className="text-sm font-bold text-blue-800">
          Eltern-Anmeldung: Bitte einen Erwachsenen für die E-Mail-Anmeldung fragen.
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Die Anmeldung erfolgt mit der E-Mail-Adresse eines Elternteils.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{mode === 'reset' ? '📧' : '🔐'}</div>
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'login' && 'Anmelden'}
            {mode === 'register' && 'Neues Konto erstellen'}
            {mode === 'reset' && 'Passwort zurücksetzen'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700 font-semibold">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700 font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleReset}
              className="space-y-3 max-w-xs mx-auto">
          <div>
            <label className="block text-left text-gray-600 text-sm font-bold mb-1">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="eltern@email.de"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-left text-gray-600 text-sm font-bold mb-1">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg"
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-left text-gray-600 text-sm font-bold mb-1">Passwort wiederholen</label>
              <input
                type="password"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Bitte warten...' : mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Link senden'}
          </button>
        </form>

        {/* Mode switchers */}
        <div className="mt-4 space-y-2 text-center">
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('register'); setError(''); setSuccess('') }}
                className="block w-full text-sm font-bold text-blue-600 hover:underline">
                Noch kein Konto? Jetzt registrieren
              </button>
              <button onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
                className="block w-full text-sm font-bold text-gray-500 hover:underline">
                Passwort vergessen?
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className="block w-full text-sm font-bold text-blue-600 hover:underline">
              Zurück zur Anmeldung
            </button>
          )}
        </div>

        {/* Continue offline */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button
            onClick={() => setScreen('start')}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
          >
            Weiter ohne Anmeldung (offline spielen)
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LoginScreen.jsx
git commit -m "feat: add real LoginScreen with email/password auth"
```

---

## Task 6: Migrate Dialog (Local Data to Cloud)

**Files:**
- Create: `src/components/MigrateDialog.jsx`

- [ ] **Step 1: Create `src/components/MigrateDialog.jsx`**

```jsx
import { useState } from 'react'
import { loadProfiles } from '../profiles'
import { createCloudProfile } from '../lib/cloudDataService'

export default function MigrateDialog({ userId, onDone }) {
  const [migrating, setMigrating] = useState(false)
  const [error, setError] = useState('')

  const localProfiles = loadProfiles()
  const hasLocalData = localProfiles.length > 0 &&
    localProfiles.some(p => p.player && (p.player.points > 0 || p.player.coins > 0 || (p.player.items && p.player.items.length > 0)))

  if (!hasLocalData) {
    // No meaningful local data — skip
    return null
  }

  async function handleMigrate() {
    setMigrating(true)
    setError('')
    try {
      for (const profile of localProfiles) {
        await createCloudProfile(userId, {
          name: profile.player?.name || 'Spieler',
          player: profile.player,
          appearance: profile.appearance,
          equipment: profile.equipment,
          myCharacters: profile.myCharacters,
          activeCharIdx: profile.activeCharIdx || 0,
        })
      }
      // Mark migration as done
      localStorage.setItem('soccerStarCloudMigrated', 'true')
      onDone()
    } catch (err) {
      setError(err.message || 'Fehler beim Übertragen.')
      setMigrating(false)
    }
  }

  function handleSkip() {
    localStorage.setItem('soccerStarCloudMigrated', 'true')
    onDone()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-2">📦</div>
          <h2 className="text-xl font-bold text-gray-800">Lokale Daten übernehmen?</h2>
          <p className="text-sm text-gray-600 mt-2">
            Du hast {localProfiles.length} {localProfiles.length === 1 ? 'Profil' : 'Profile'} auf diesem Gerät.
            Sollen die Spielstände in dein Online-Konto übertragen werden?
          </p>
        </div>

        {localProfiles.map((p, i) => (
          <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="font-bold text-gray-800">{p.player?.name || 'Spieler'}</div>
            <div className="text-xs text-gray-500">
              {p.player?.points || 0} Punkte · ⭐{p.player?.stars || 0} · 🪙{p.player?.coins || 0}
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-semibold">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleMigrate}
            disabled={migrating}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {migrating ? 'Übertrage...' : 'Ja, übernehmen!'}
          </button>
          <button
            onClick={handleSkip}
            disabled={migrating}
            className="py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
          >
            Nein, leer starten
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MigrateDialog.jsx
git commit -m "feat: add migration dialog for importing local data to cloud"
```

---

## Task 7: Display Name Dialog

**Files:**
- Create: `src/components/DisplayNameDialog.jsx`

- [ ] **Step 1: Create `src/components/DisplayNameDialog.jsx`**

```jsx
import { useState } from 'react'
import { updateDisplayName } from '../lib/cloudDataService'

export default function DisplayNameDialog({ userId, currentName, onDone }) {
  const [name, setName] = useState(currentName || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Bitte gib einen Namen ein.')
      return
    }
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError('Der Name muss zwischen 2 und 20 Zeichen lang sein.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateDisplayName(userId, trimmed)
      onDone(trimmed)
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🏷️</div>
          <h2 className="text-xl font-bold text-gray-800">Dein Anzeige-Name</h2>
          <p className="text-sm text-gray-600 mt-1">
            So sehen dich andere in der Rangliste und Freundesliste.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="z.B. Familie Müller"
            maxLength={20}
            autoFocus
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none text-lg text-center"
          />

          {error && (
            <div className="text-sm text-red-600 font-semibold text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Speichere...' : 'Speichern'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DisplayNameDialog.jsx
git commit -m "feat: add display name dialog for leaderboard identity"
```

---

## Task 8: Ranking Screen (Real)

**Files:**
- Create: `src/components/RankingScreen.jsx` (replaces RankingPreview)

- [ ] **Step 1: Create `src/components/RankingScreen.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { loadLeaderboard } from '../lib/cloudDataService'

const SORT_OPTIONS = [
  { key: 'points', label: 'Punkte', icon: '🎯' },
  { key: 'stars', label: 'Sterne', icon: '⭐' },
  { key: 'golden_stars', label: 'Goldene Sterne', icon: '🌟' },
  { key: 'coins', label: 'Münzen', icon: '🪙' },
]

export default function RankingScreen({ player }) {
  const auth = useAuth()
  const [entries, setEntries] = useState([])
  const [sortBy, setSortBy] = useState('points')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth?.isOnline) {
      setLoading(false)
      return
    }
    loadLeaderboard()
      .then(data => { setEntries(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [auth?.isOnline])

  if (!auth?.isOnline) {
    return (
      <div className="py-4 space-y-4">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <p className="font-bold text-amber-800">Melde dich an, um die Online-Rangliste zu sehen!</p>
        </div>
      </div>
    )
  }

  const sorted = [...entries].sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🏆 Bestenliste</h2>

        {/* Sort buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                sortBy === opt.key
                  ? 'bg-green-500 text-white shadow'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-gray-500 py-4">Lade Rangliste...</p>}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        {!loading && !error && (
          <div className="space-y-2">
            {sorted.length === 0 && (
              <p className="text-center text-gray-400 py-4">Noch keine Einträge. Spiel ein Quiz!</p>
            )}
            {sorted.map((entry, i) => {
              const isYou = auth.user && entry.owner_user_id === auth.user.id
              return (
                <div key={entry.player_profile_id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isYou ? 'bg-green-50 border-2 border-green-300 shadow' : 'bg-gray-50'
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-yellow-400 text-yellow-900' :
                    i === 1 ? 'bg-gray-300 text-gray-700' :
                    i === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 truncate">
                      {entry.display_name || 'Unbenannt'} — {entry.player_name}
                      {isYou && <span className="text-green-600 text-xs ml-1">(Du)</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      🎯{entry.points} · ⭐{entry.stars} · 🌟{entry.golden_stars} · 🪙{entry.coins}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={() => {
            setLoading(true)
            loadLeaderboard().then(data => { setEntries(data); setLoading(false) }).catch(() => setLoading(false))
          }}
          className="w-full mt-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
        >
          Aktualisieren
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RankingScreen.jsx
git commit -m "feat: add real RankingScreen with Supabase leaderboard"
```

---

## Task 9: Friends Screen (Real)

**Files:**
- Create: `src/components/FriendsScreen.jsx` (replaces FriendsPreview)

- [ ] **Step 1: Create `src/components/FriendsScreen.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { loadFriends, sendFriendRequestByName, respondToFriendRequest, removeFriend, loadFriendStats } from '../lib/cloudDataService'

export default function FriendsScreen() {
  const auth = useAuth()
  const [friends, setFriends] = useState([])
  const [friendStats, setFriendStats] = useState([])
  const [searchName, setSearchName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (auth?.isOnline) refresh()
    else setLoading(false)
  }, [auth?.isOnline])

  async function refresh() {
    setLoading(true)
    try {
      const data = await loadFriends(auth.user.id)
      setFriends(data)

      // Load stats for accepted friends
      const accepted = data.filter(f => f.status === 'accepted')
      const friendUserIds = accepted.map(f =>
        f.from_user_id === auth.user.id ? f.to_user_id : f.from_user_id
      )
      if (friendUserIds.length > 0) {
        const stats = await loadFriendStats(friendUserIds)
        setFriendStats(stats)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleSendRequest(e) {
    e.preventDefault()
    if (!searchName.trim()) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      await sendFriendRequestByName(auth.user.id, searchName.trim())
      setSuccess(`Freundschaftsanfrage an "${searchName.trim()}" gesendet!`)
      setSearchName('')
      refresh()
    } catch (err) {
      setError(err.message)
    }
    setSending(false)
  }

  async function handleRespond(requestId, accept) {
    try {
      await respondToFriendRequest(requestId, accept)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRemove(requestId) {
    try {
      await removeFriend(requestId)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!auth?.isOnline) {
    return (
      <div className="py-4 space-y-4">
        <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-2">👫</div>
          <p className="font-bold text-amber-800">Melde dich an, um Freunde hinzuzufügen!</p>
        </div>
      </div>
    )
  }

  const pendingReceived = friends.filter(f => f.status === 'pending' && f.to_user_id === auth.user.id)
  const pendingSent = friends.filter(f => f.status === 'pending' && f.from_user_id === auth.user.id)
  const accepted = friends.filter(f => f.status === 'accepted')

  function getFriendName(f) {
    if (f.from_user_id === auth.user.id) {
      return f.to_profile?.display_name || 'Unbenannt'
    }
    return f.from_profile?.display_name || 'Unbenannt'
  }

  function getFriendUserId(f) {
    return f.from_user_id === auth.user.id ? f.to_user_id : f.from_user_id
  }

  return (
    <div className="py-4 space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👫 Freunde</h2>

        {/* Add friend */}
        <form onSubmit={handleSendRequest} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="Anzeige-Name eingeben..."
            className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !searchName.trim()}
            className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {sending ? '...' : '➕'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2 mb-3 text-sm text-red-700 font-semibold">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-2 mb-3 text-sm text-green-700 font-semibold">{success}</div>
        )}

        {loading && <p className="text-center text-gray-500 py-4">Lade...</p>}

        {!loading && (
          <>
            {/* Pending received */}
            {pendingReceived.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Neue Anfragen</h3>
                {pendingReceived.map(f => (
                  <div key={f.id} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{getFriendName(f)}</div>
                      <div className="text-xs text-gray-500">möchte dein Freund sein</div>
                    </div>
                    <button onClick={() => handleRespond(f.id, true)}
                      className="px-3 py-1.5 bg-green-500 text-white font-bold rounded-lg text-sm active:scale-95">
                      Ja
                    </button>
                    <button onClick={() => handleRespond(f.id, false)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 font-bold rounded-lg text-sm active:scale-95">
                      Nein
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Accepted friends */}
            {accepted.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Meine Freunde</h3>
                {accepted.map(f => {
                  const friendId = getFriendUserId(f)
                  const stats = friendStats.filter(s => s.owner_user_id === friendId)
                  const totalPoints = stats.reduce((sum, s) => sum + (s.points || 0), 0)
                  const totalStars = stats.reduce((sum, s) => sum + (s.stars || 0), 0)
                  return (
                    <div key={f.id} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg">👤</div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{getFriendName(f)}</div>
                        <div className="text-xs text-gray-500">
                          🎯{totalPoints} Punkte · ⭐{totalStars} Sterne
                        </div>
                      </div>
                      <button onClick={() => handleRemove(f.id)}
                        className="px-2 py-1 bg-red-100 text-red-500 font-bold rounded-lg text-xs active:scale-95"
                        title="Freund entfernen">
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pending sent */}
            {pendingSent.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 text-sm mb-2">Gesendet (warten auf Antwort)</h3>
                {pendingSent.map(f => (
                  <div key={f.id} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-gray-700">{getFriendName(f)}</div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">Warten...</span>
                  </div>
                ))}
              </div>
            )}

            {accepted.length === 0 && pendingReceived.length === 0 && pendingSent.length === 0 && (
              <p className="text-center text-gray-400 py-4">
                Noch keine Freunde. Suche jemanden über den Anzeige-Namen!
              </p>
            )}
          </>
        )}

        {/* Refresh */}
        <button
          onClick={refresh}
          className="w-full mt-2 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
        >
          Aktualisieren
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FriendsScreen.jsx
git commit -m "feat: add real FriendsScreen with friend requests and stats"
```

---

## Task 10: Update App.jsx — Integrate Auth, Cloud Profiles, and New Screens

**Files:**
- Modify: `src/App.jsx`

This is the biggest task — it wires everything together.

- [ ] **Step 1: Update imports in App.jsx**

Replace the import section at the top of `src/App.jsx`. Remove `LoginPreview`, `RankingPreview`, `FriendsPreview` imports. Add new imports:

```jsx
import { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
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
```

- [ ] **Step 2: Refactor App into AppInner wrapped by AuthProvider**

Rename the current `App` function to `AppInner` and add auth logic. The new `App` just wraps in AuthProvider:

```jsx
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
```

- [ ] **Step 3: Add cloud state management to AppInner**

Inside `AppInner`, add auth-aware state. Key changes:

1. Use `useAuth()` to get auth state
2. When `isOnline`: load profiles from Supabase instead of localStorage
3. When offline: use existing localStorage logic (unchanged)
4. Add `showMigrate` and `showDisplayName` state for dialogs
5. Add `cloudProfileId` state to track which cloud profile is active
6. Add `displayName` state for the user's display name
7. Save stats to cloud after each player change (debounced)

The `handleQuizComplete`, `handleBuy`, exchange handlers, etc. stay the same — they update `player` state, and a useEffect syncs to cloud.

- [ ] **Step 4: Add cloud sync useEffect**

After the existing `useEffect(() => { if (player) savePlayer(player) }, [player])`, add cloud sync:

```jsx
// Cloud sync: save stats to Supabase when player changes (debounced)
useEffect(() => {
  if (!auth.isOnline || !cloudProfileId || !player) return
  const timer = setTimeout(() => {
    saveCloudStats(cloudProfileId, player).catch(console.error)
  }, 1000) // debounce 1 second
  return () => clearTimeout(timer)
}, [auth.isOnline, cloudProfileId, player])
```

- [ ] **Step 5: Add cloud profile load on login**

```jsx
// Load cloud profiles when user logs in
useEffect(() => {
  if (!auth.isOnline || !auth.user) return
  const alreadyMigrated = localStorage.getItem('soccerStarCloudMigrated') === 'true'

  async function loadCloud() {
    try {
      const userProfile = await getOrCreateUserProfile(auth.user.id)
      setDisplayName(userProfile.display_name || '')

      if (!userProfile.display_name) {
        setShowDisplayName(true)
      }

      const cloudProfiles = await loadCloudProfiles(auth.user.id)
      if (cloudProfiles.length === 0 && !alreadyMigrated) {
        setShowMigrate(true)
        return
      }

      const localFormatProfiles = cloudProfiles.map(cloudToLocalProfile)
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
    } catch (err) {
      console.error('Cloud load error:', err)
    }
  }
  loadCloud()
}, [auth.isOnline, auth.user?.id])
```

- [ ] **Step 6: Update screen rendering**

Replace the preview screen renderers with real ones:

```jsx
{screen === 'ranking' && <RankingScreen player={player} />}
{screen === 'friends' && <FriendsScreen />}
{screen === 'login' && <LoginScreen setScreen={setScreen} />}
```

Add dialogs after the Nav:

```jsx
{showMigrate && auth.isOnline && (
  <MigrateDialog userId={auth.user.id} onDone={() => {
    setShowMigrate(false)
    // Reload cloud profiles
    loadCloudProfiles(auth.user.id).then(cp => {
      const local = cp.map(cloudToLocalProfile)
      setProfiles(local)
      if (local.length > 0) {
        handleSelectProfile(local[0])
      }
    })
  }} />
)}

{showDisplayName && auth.isOnline && (
  <DisplayNameDialog
    userId={auth.user.id}
    currentName={displayName}
    onDone={(name) => { setDisplayName(name); setShowDisplayName(false) }}
  />
)}
```

- [ ] **Step 7: Update profile CRUD to use cloud when online**

```jsx
function handleCreateProfile(name) {
  saveCurrentToProfile()
  if (auth.isOnline) {
    createCloudProfile(auth.user.id, { name, player: createNewProfile(name).player })
      .then(cloudProfile => {
        return loadCloudProfiles(auth.user.id)
      })
      .then(cloudProfiles => {
        const local = cloudProfiles.map(cloudToLocalProfile)
        setProfiles(local)
        const newest = local[local.length - 1]
        if (newest) handleSelectProfile(newest)
      })
      .catch(console.error)
  } else {
    // existing localStorage logic
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
        if (local.length > 0) handleSelectProfile(local[0])
        else { setActiveId(null); setPlayer(null); setScreen('profileselect') }
      })
      .catch(console.error)
  } else {
    // existing localStorage logic
    const updated = profiles.filter(p => p.id !== id)
    setProfiles(updated)
    saveProfiles(updated)
    if (id === activeProfileId && updated.length > 0) handleSelectProfile(updated[0])
    else if (updated.length === 0) { setActiveId(null); setPlayer(null); setScreen('profileselect') }
  }
}
```

- [ ] **Step 8: Update handleSelectProfile for cloud**

```jsx
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
```

- [ ] **Step 9: Save appearance/equipment changes to cloud**

Add a function that syncs profile data (appearance, equipment, characters) to cloud:

```jsx
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
```

- [ ] **Step 10: Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate auth, cloud profiles, and online screens in App.jsx"
```

---

## Task 11: Update Nav — Auth-Aware Navigation

**Files:**
- Modify: `src/components/Nav.jsx`

- [ ] **Step 1: Update Nav to show auth state and logout**

Changes needed:
1. Import `useAuth` from `AuthContext`
2. In the "Online" nav group, replace "Login" with dynamic item:
   - If logged in: show "Abmelden" button instead of "Login"
   - Show display name or email in the top bar
3. Add `onSignOut` callback that calls `auth.signOut()`

Update the NAV_GROUPS to be computed based on auth state:

```jsx
import { useAuth } from '../contexts/AuthContext'

// Inside Nav component:
const auth = useAuth()

// Replace the static NAV_GROUPS with a computed version
const navGroups = [
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
```

Handle the special `_logout` nav item:

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat: make Nav auth-aware with login/logout toggle"
```

---

## Task 12: Update dataService.js — Keep Backward Compatible

**Files:**
- Modify: `src/dataService.js`

- [ ] **Step 1: Update `isLoggedIn` to check real auth state**

```js
import { supabase } from './lib/supabase'

// Zentraler Datendienst — localStorage im Offline-Modus, Supabase wenn online.

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadData(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function removeData(key) {
  localStorage.removeItem(key)
}

export function isLoggedIn() {
  if (!supabase) return false
  // Synchronous check — session is cached by Supabase client
  // For reactive checks, use AuthContext instead
  return false // Use AuthContext.isOnline for reactive checks
}
```

- [ ] **Step 2: Commit**

```bash
git add src/dataService.js
git commit -m "refactor: update dataService with Supabase import for future use"
```

---

## Task 13: Delete Old Preview Files

**Files:**
- Delete: `src/components/LoginPreview.jsx`
- Delete: `src/components/RankingPreview.jsx`
- Delete: `src/components/FriendsPreview.jsx`

- [ ] **Step 1: Remove old preview files**

```bash
rm src/components/LoginPreview.jsx src/components/RankingPreview.jsx src/components/FriendsPreview.jsx
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove preview screens replaced by real online screens"
```

---

## Task 14: Create .env.local (User Action)

**DAS MUSST DU (dein Vater) TUN:**

1. Erstelle eine Datei `.env.local` im Projektordner (dort wo `package.json` ist)
2. Schreibe rein:

```env
VITE_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key-hier
```

3. Ersetze die Platzhalter mit den echten Werten aus Schritt 0b.

**WICHTIG:** Diese Datei wird NICHT in Git eingecheckt (steht in `.gitignore`).

---

## Task 15: Vercel Environment Variables (User Action)

**DAS MUSST DU (dein Vater) TUN:**

1. Gehe zu **https://vercel.com** → dein Projekt
2. Klicke **"Settings"** → **"Environment Variables"**
3. Füge diese zwei Variablen hinzu:

| Name | Value | Environments |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://DEIN-PROJEKT.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `dein-anon-key-hier` | Production, Preview, Development |

4. Klicke jeweils **"Save"**

---

## Task 16: Run SQL Scripts (User Action)

**DAS MUSST DU (dein Vater) TUN:**

1. Gehe im Supabase-Dashboard links auf **"SQL Editor"**
2. Klicke **"New query"**
3. Kopiere den Inhalt von `sql/01-schema.sql` rein → klicke **"Run"** (grüner Knopf)
4. Neues Query → Inhalt von `sql/02-rls.sql` rein → **"Run"**
5. Neues Query → Inhalt von `sql/03-views.sql` rein → **"Run"**

Wenn alles grün ist: Fertig!

---

## Task 17: Test & Verify

- [ ] **Step 1: Test local build**

```bash
npm run build
```

Expected: Build succeeds without errors (Supabase not configured = offline mode).

- [ ] **Step 2: Test dev server with env vars**

```bash
npm run dev
```

Expected:
- App starts, shows login screen option in nav
- Without `.env.local`: runs in offline mode (localStorage), everything works as before
- With `.env.local`: can register, login, see cloud profiles

- [ ] **Step 3: Test online flow**

1. Register with a test email
2. Confirm email (check inbox)
3. Login
4. Set display name
5. Migrate local data dialog appears (if local data exists)
6. Play a quiz → stats save to cloud
7. Check leaderboard → see your entry
8. Test friend request (need 2 accounts)

- [ ] **Step 4: Push to deploy**

```bash
git push
```

Vercel auto-deploys. Check the deployment at your Vercel URL.

---

## Summary for the User (Post-Completion)

### Was jetzt funktioniert:
- **Eltern-Login:** E-Mail + Passwort Anmeldung mit Bestätigungs-E-Mail
- **Cloud-Speicher:** Spielstände werden in der Cloud gespeichert — auf jedem Gerät weiterspielen
- **Rangliste:** Echte Online-Bestenliste mit allen Spielern, sortierbar
- **Freunde:** Per Anzeige-Name Freunde finden, Anfrage senden, Stats vergleichen
- **Offline-Modus:** Wer nicht angemeldet ist, spielt wie bisher lokal weiter
- **Daten-Übernahme:** Beim ersten Login werden lokale Spielstände in die Cloud übernommen

### Link für die Familie:
Die Vercel-URL (z.B. `https://soccer-star-quiz.vercel.app`) — einfach im Browser öffnen.

### So meldet sich die Familie an:
1. App im Browser öffnen
2. Auf **"Login"** klicken
3. **"Registrieren"** wählen → E-Mail + Passwort eingeben
4. Bestätigungs-E-Mail im Postfach öffnen und Link klicken
5. Danach **"Anmelden"** mit E-Mail + Passwort
6. Anzeige-Name wählen (so sieht man euch in der Rangliste)
7. Spielen!

### Nächste Verbesserungen:
- Profilbilder/Avatare in der Rangliste anzeigen
- Push-Benachrichtigungen bei Freundesanfragen
- Challenges: Freunde direkt herausfordern
- Familien-Gruppen (mehrere Familien zusammen)
