-- ============================================================
-- Soccer Star Quiz: Datenbank-Schema
-- Dieses Script in den Supabase SQL Editor einfuegen und ausfuehren.
-- ============================================================


-- ------------------------------------------------------------
-- 1) Eltern-Profil
--    Ein Profil pro registriertem Account (Email/Passwort).
--    Enthaelt nur den angezeigten Namen des Elternteils.
-- ------------------------------------------------------------
CREATE TABLE users_profile (
  user_id      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT        NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- 2) Spieler-Profile
--    Mehrere Kinder-Profile pro Eltern-Account moeglich.
--    Jedes Profil hat seinen eigenen Namen, sein Aussehen
--    (Figur, Ausruestung) und seinen eigenen Spielstand.
-- ------------------------------------------------------------
CREATE TABLE player_profiles (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT        NOT NULL DEFAULT 'Spieler',
  appearance     JSONB       DEFAULT NULL,   -- Aussehen der Spielfigur (Farben, Stil)
  equipment      JSONB       DEFAULT NULL,   -- Ausgeruestete Items
  my_characters  JSONB       DEFAULT NULL,   -- Alle freigeschalteten Charaktere
  active_char_idx INT        NOT NULL DEFAULT 0, -- Aktuell aktiver Charakter (Index)
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index fuer schnellen Zugriff auf alle Profile eines Eltern-Accounts
CREATE INDEX idx_player_profiles_owner ON player_profiles(owner_user_id);


-- ------------------------------------------------------------
-- 3) Spielstand pro Spieler-Profil
--    Speichert Punkte, Sterne, Muenzen, Items und Statistiken.
--    Wird bei jedem Spielende aktualisiert.
-- ------------------------------------------------------------
CREATE TABLE stats (
  player_profile_id UUID        PRIMARY KEY REFERENCES player_profiles(id) ON DELETE CASCADE,
  points            INT         NOT NULL DEFAULT 0,           -- Gesamtpunkte
  stars             INT         NOT NULL DEFAULT 0,           -- Normale Sterne
  golden_stars      INT         NOT NULL DEFAULT 0,           -- Goldene Sterne
  coins             INT         NOT NULL DEFAULT 0,           -- Muenzen (Waehrung)
  items             JSONB       NOT NULL DEFAULT '[]'::jsonb, -- Gekaufte Items
  by_difficulty     JSONB       NOT NULL DEFAULT '{}'::jsonb, -- Punkte je Schwierigkeit
  rounds_played     INT         NOT NULL DEFAULT 0,           -- Gespielte Runden gesamt
  correct_answers   INT         NOT NULL DEFAULT 0,           -- Richtige Antworten gesamt
  week_bonus        JSONB       NOT NULL DEFAULT '{}'::jsonb, -- Wochen-Bonus-Tracking
  claimed_goals     JSONB       NOT NULL DEFAULT '[]'::jsonb, -- Abgeholte Ziele/Achievements
  character_name    TEXT        NOT NULL DEFAULT 'Rookie',    -- Aktueller Charaktertitel
  difficulty        TEXT        NOT NULL DEFAULT 'leicht',    -- Bevorzugte Schwierigkeit
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- 4) Freundschafts-Anfragen
--    Spieler koennen sich gegenseitig als Freunde hinzufuegen.
--    Status: 'pending' (ausstehend), 'accepted' oder 'rejected'.
-- ------------------------------------------------------------
CREATE TABLE friends (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id) -- Verhindert doppelte Anfragen
);

-- Indizes fuer schnelle Suche nach gesendeten und empfangenen Anfragen
CREATE INDEX idx_friends_from ON friends(from_user_id);
CREATE INDEX idx_friends_to   ON friends(to_user_id);
