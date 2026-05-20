// Zentraler Datendienst — localStorage für Offline-Modus.
// Online-Daten laufen über cloudDataService.js + AuthContext.

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
