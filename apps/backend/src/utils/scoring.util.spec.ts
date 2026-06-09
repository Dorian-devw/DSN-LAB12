import { calculatePoints } from './scoring.util';

describe('Scoring Utility (Business Rules)', () => {
  it('should award 5 points for an exact score match (Case 1)', () => {
    const points = calculatePoints(2, 1, 2, 1);
    expect(points).toBe(5);
  });

  it('should award 3 points for a correct outcome but wrong exact score (Case 2 - Winner)', () => {
    // Predicted 3-1, Actual 1-0 (both Home Win, diff differs)
    const points = calculatePoints(3, 1, 1, 0);
    expect(points).toBe(3);
  });

  it('should award 2 points for correct winner and correct goal difference (Case 3 - Difference)', () => {
    // Predicted 3-1, Actual 2-0 (both Home Win, difference +2)
    const points = calculatePoints(3, 1, 2, 0);
    expect(points).toBe(2);
  });

  it('should award 0 points for completely incorrect outcome (Case 4)', () => {
    // Predicted Away Win (0-2), Actual Home Win (2-0)
    const points = calculatePoints(0, 2, 2, 0);
    expect(points).toBe(0);
  });

  it('should award 3 points for a correct draw prediction but incorrect exact score (Case 5)', () => {
    // Predicted 1-1, Actual 2-2
    const points = calculatePoints(1, 1, 2, 2);
    expect(points).toBe(3);
  });
});
