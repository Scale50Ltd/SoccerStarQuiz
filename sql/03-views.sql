-- ============================================================
-- Soccer Star Quiz: Views (Datenbankansichten)
-- Dieses Script NACH 01-schema.sql und 02-rls.sql ausfuehren.
-- ============================================================


-- ------------------------------------------------------------
-- Rangliste (Leaderboard)
-- Zeigt alle Spieler mit ihren Punkten, Sternen und Statistiken.
-- Nur Spieler, deren Elternteil einen display_name gesetzt hat,
-- erscheinen in der Rangliste (Datenschutz: kein leerer Name).
-- Sortierung: hoechste Punktzahl zuerst.
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  pp.id              AS player_profile_id,  -- Eindeutige ID des Spieler-Profils
  pp.owner_user_id,                          -- Eltern-Account (fuer Beziehungen)
  pp.name            AS player_name,         -- Name des Kindes / Spielers
  up.display_name,                           -- Anzeigename des Elternteils
  s.points,                                  -- Gesamtpunkte
  s.stars,                                   -- Normale Sterne
  s.golden_stars,                            -- Goldene Sterne
  s.coins,                                   -- Muenzen
  s.rounds_played,                           -- Anzahl gespielte Runden
  s.correct_answers                          -- Anzahl richtige Antworten
FROM player_profiles pp
JOIN stats          s  ON s.player_profile_id = pp.id
JOIN users_profile  up ON up.user_id = pp.owner_user_id
WHERE up.display_name != ''   -- Nur Spieler mit gesetztem Eltern-Anzeigenamen
ORDER BY s.points DESC;       -- Bester Spieler zuerst
