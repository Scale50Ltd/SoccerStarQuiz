-- ============================================================
-- Soccer Star Quiz: Row Level Security (RLS)
-- Dieses Script NACH 01-schema.sql ausfuehren.
-- RLS stellt sicher, dass jeder Nutzer nur seine eigenen
-- Daten lesen und veraendern kann.
-- ============================================================


-- ------------------------------------------------------------
-- RLS aktivieren
-- Ohne diese Befehle sind alle Tabellen oeffentlich zugaenglich!
-- ------------------------------------------------------------
ALTER TABLE users_profile   ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats            ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends          ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- users_profile
-- Lesen: alle duerfen lesen (benoetigt fuer die Rangliste)
-- Schreiben: nur das eigene Profil darf bearbeitet werden
-- ------------------------------------------------------------
CREATE POLICY "users_profile_select_all"
  ON users_profile FOR SELECT
  USING (true);

CREATE POLICY "users_profile_insert_own"
  ON users_profile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_profile_update_own"
  ON users_profile FOR UPDATE
  USING (auth.uid() = user_id);


-- ------------------------------------------------------------
-- player_profiles
-- Nur der Besitzer (Elternteil) darf seine Kinder-Profile
-- lesen, erstellen, aendern und loeschen.
-- ------------------------------------------------------------
CREATE POLICY "player_profiles_select_own"
  ON player_profiles FOR SELECT
  USING (auth.uid() = owner_user_id);

CREATE POLICY "player_profiles_insert_own"
  ON player_profiles FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "player_profiles_update_own"
  ON player_profiles FOR UPDATE
  USING (auth.uid() = owner_user_id);

CREATE POLICY "player_profiles_delete_own"
  ON player_profiles FOR DELETE
  USING (auth.uid() = owner_user_id);


-- ------------------------------------------------------------
-- stats
-- Lesen: alle eingeloggten Nutzer duerfen lesen (Rangliste)
-- Schreiben: nur der Besitzer des zugehoerigen Spieler-Profils
-- ------------------------------------------------------------
CREATE POLICY "stats_select_for_leaderboard"
  ON stats FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "stats_insert_own"
  ON stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM player_profiles
      WHERE player_profiles.id = stats.player_profile_id
        AND player_profiles.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "stats_update_own"
  ON stats FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM player_profiles
      WHERE player_profiles.id = stats.player_profile_id
        AND player_profiles.owner_user_id = auth.uid()
    )
  );


-- ------------------------------------------------------------
-- friends
-- Lesen/Loeschen: beide beteiligten Parteien duerfen zugreifen
-- Erstellen: nur der Absender
-- Aktualisieren (Annehmen/Ablehnen): nur der Empfaenger
-- ------------------------------------------------------------
CREATE POLICY "friends_select_involved"
  ON friends FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "friends_insert_own"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "friends_update_recipient"
  ON friends FOR UPDATE
  USING (auth.uid() = to_user_id);

CREATE POLICY "friends_delete_involved"
  ON friends FOR DELETE
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
