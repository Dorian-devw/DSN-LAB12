/**
 * Calculates the points earned for a prediction based on the GOLEATE gamification rules.
 * 
 * Rules:
 * - Exact score match (both home and away): 3 points
 * - Correct outcome (win, lose, or draw) but incorrect score: 1 point
 * - Incorrect outcome: 0 points
 */
export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
): number {
  // 1. Exact match
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return 3;
  }

  // 2. Determine outcomes
  const predictedOutcome = getOutcome(predictedHome, predictedAway);
  const actualOutcome = getOutcome(actualHome, actualAway);

  // 3. Correct outcome
  if (predictedOutcome === actualOutcome) {
    return 1;
  }

  // 4. Incorrect outcome
  return 0;
}

/**
 * Helper to determine if a score is a home win, away win, or draw.
 */
function getOutcome(home: number, away: number): 'HOME_WIN' | 'AWAY_WIN' | 'DRAW' {
  if (home > away) return 'HOME_WIN';
  if (away > home) return 'AWAY_WIN';
  return 'DRAW';
}
