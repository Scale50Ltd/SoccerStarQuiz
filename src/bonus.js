// Weekly bonus (Sunday) & achievement goals system (per-profile via player object)

const WEEKLY_BONUS = 50

// Get the Monday of the current week as YYYY-MM-DD
function getWeekMonday() {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon...
  const diff = day === 0 ? 6 : day - 1 // days since Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  return monday.toISOString().slice(0, 10)
}

// Get today as YYYY-MM-DD
function getToday() {
  return new Date().toISOString().slice(0, 10)
}

// Day index: 0=Mon, 1=Tue, ..., 6=Sun
function getTodayIndex() {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export function getWeeklyBonusInfo(player) {
  const weekKey = getWeekMonday()
  const weekData = player._weekBonus || {}

  // If stored week doesn't match current week, reset
  const days = weekData.week === weekKey ? (weekData.days || []) : []
  const claimed = weekData.week === weekKey ? (weekData.claimed || false) : false
  const todayIdx = getTodayIndex()
  const isSunday = todayIdx === 6
  const allDaysPlayed = days.length === 7 && days.every(Boolean)
  const canClaim = isSunday && allDaysPlayed && !claimed
  const todayPlayed = days[todayIdx] || false

  return {
    weekKey,
    days, // array of 7 booleans (or less if week just started)
    todayIdx,
    todayPlayed,
    isSunday,
    allDaysPlayed,
    canClaim,
    claimed,
    dayLabels: DAY_LABELS,
    bonus: WEEKLY_BONUS,
  }
}

// Mark today as played (call when a full 10-question round is completed)
export function markDayPlayed(player) {
  const weekKey = getWeekMonday()
  const weekData = player._weekBonus || {}
  let days = weekData.week === weekKey ? [...(weekData.days || [])] : Array(7).fill(false)
  // Ensure array is 7 long
  while (days.length < 7) days.push(false)
  const todayIdx = getTodayIndex()
  days[todayIdx] = true

  return {
    ...player,
    _weekBonus: { week: weekKey, days, claimed: weekData.week === weekKey ? (weekData.claimed || false) : false },
  }
}

export function claimWeeklyBonus(player) {
  const info = getWeeklyBonusInfo(player)
  if (!info.canClaim) return { player, amount: 0 }

  const weekKey = getWeekMonday()
  const weekData = player._weekBonus || {}
  return {
    player: {
      ...player,
      coins: (player.coins || 0) + WEEKLY_BONUS,
      _weekBonus: { ...weekData, week: weekKey, claimed: true },
    },
    amount: WEEKLY_BONUS,
  }
}

// Achievement goals (unchanged)
export const GOALS = [
  { id: 'rounds5', label: 'Spiele 5 Runden', target: 5, reward: 100, field: '_roundsPlayed' },
  { id: 'rounds20', label: 'Spiele 20 Runden', target: 20, reward: 250, field: '_roundsPlayed' },
  { id: 'rounds50', label: 'Spiele 50 Runden', target: 50, reward: 500, field: '_roundsPlayed' },
  { id: 'correct50', label: '50 Fragen richtig', target: 50, reward: 150, field: '_correctAnswers' },
  { id: 'correct200', label: '200 Fragen richtig', target: 200, reward: 400, field: '_correctAnswers' },
  { id: 'golden3', label: '3 goldene Sterne', target: 3, reward: 200, field: 'goldenStars' },
  { id: 'golden10', label: '10 goldene Sterne', target: 10, reward: 500, field: 'goldenStars' },
  { id: 'stars10', label: '10 Sterne sammeln', target: 10, reward: 150, field: 'stars' },
  { id: 'stars30', label: '30 Sterne sammeln', target: 30, reward: 400, field: 'stars' },
  { id: 'items5', label: '5 Sachen kaufen', target: 5, reward: 100, field: '_itemCount' },
  { id: 'items15', label: '15 Sachen kaufen', target: 15, reward: 300, field: '_itemCount' },
]

export function getGoalProgress(player, goal) {
  if (goal.field === '_itemCount') return (player.items || []).length
  return player[goal.field] || 0
}

export function isGoalCompleted(player, goal) {
  return getGoalProgress(player, goal) >= goal.target
}

export function isGoalClaimed(player, goalId) {
  return (player._claimedGoals || []).includes(goalId)
}

export function claimGoal(player, goalId) {
  const goal = GOALS.find(g => g.id === goalId)
  if (!goal || !isGoalCompleted(player, goal) || isGoalClaimed(player, goalId)) return player
  return {
    ...player,
    coins: (player.coins || 0) + goal.reward,
    _claimedGoals: [...(player._claimedGoals || []), goalId],
  }
}
