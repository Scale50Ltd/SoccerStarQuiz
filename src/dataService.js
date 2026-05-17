// Zentraler Datendienst — aktuell localStorage, später Online/Login anbinden.
// Alle Lese-/Schreiboperationen können hier zentral auf einen Server umgestellt werden.

// Hier später Online/Login anbinden: save/load über fetch() statt localStorage.

export function saveData(key, data) {
  // Hier später: an Server senden statt localStorage
  localStorage.setItem(key, JSON.stringify(data))
}

export function loadData(key) {
  // Hier später: vom Server laden statt localStorage
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function removeData(key) {
  // Hier später: auf Server löschen
  localStorage.removeItem(key)
}

// Hier später: Login-Status prüfen, Token speichern, etc.
export function isLoggedIn() {
  return false // Noch nicht implementiert — immer lokal
}
