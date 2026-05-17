import { shopItems, UNLOCK_REQUIREMENTS } from './shopData'

export function countOwnedInTier(playerItems, category, tier) {
  return shopItems[category]
    .filter(item => item.tier === tier && playerItems.includes(item.id))
    .length
}

// Get the tier just before a given tier in a category (handles skipped tiers)
function getPreviousTier(category, tier) {
  const allTiers = [...new Set(shopItems[category].map(i => i.tier))].sort((a, b) => a - b)
  const idx = allTiers.indexOf(tier)
  return idx > 0 ? allTiers[idx - 1] : null
}

export function isTierUnlocked(playerItems, category, tier) {
  if (tier <= 1) return true
  const req = UNLOCK_REQUIREMENTS[category]?.[tier]
  if (req === undefined) return true
  const prevTier = getPreviousTier(category, tier)
  if (prevTier === null) return true
  const prevTierOwned = countOwnedInTier(playerItems, category, prevTier)
  return prevTierOwned >= req
}

export function itemsNeededForTier(playerItems, category, tier) {
  if (tier <= 1) return 0
  const req = UNLOCK_REQUIREMENTS[category]?.[tier]
  if (req === undefined) return 0
  const prevTier = getPreviousTier(category, tier)
  if (prevTier === null) return 0
  const prevTierOwned = countOwnedInTier(playerItems, category, prevTier)
  return Math.max(0, req - prevTierOwned)
}

export function getPrevTierNumber(category, tier) {
  return getPreviousTier(category, tier) || tier - 1
}

export function getHighestUnlockedTier(playerItems, category) {
  const allTiers = [...new Set(shopItems[category].map(i => i.tier))].sort((a, b) => b - a)
  for (const t of allTiers) {
    if (isTierUnlocked(playerItems, category, t)) return t
  }
  return 1
}

export function getOverallTier(playerItems) {
  const categories = ['charaktere', 'trikots', 'baelle', 'hintergruende']
  return Math.max(...categories.map(c => getHighestUnlockedTier(playerItems, c)))
}
