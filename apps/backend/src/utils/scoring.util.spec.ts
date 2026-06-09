import { calculatePoints } from './scoring.util';

describe('Scoring Utility (Business Rules)', () => {
  it('should award 3 points for an exact score match (Home Win)', () => {
    const points = calculatePoints(2, 1, 2, 1);
    expect(points).toBe(3);
  });

  it('should award 3 points for an exact score match (Draw)', () => {
    const points = calculatePoints(0, 0, 0, 0);
    expect(points).toBe(3);
  });

  it('should award 1 point for predicting the correct outcome but wrong exact score (Home Win)', () => {
    // Predicted 2-0, Actual 3-1 (both are Home Wins)
    const points = calculatePoints(2, 0, 3, 1);
    expect(points).toBe(1);
  });

  it('should award 1 point for predicting a draw but wrong exact score', () => {
    // Predicted 1-1, Actual 2-2
    const points = calculatePoints(1, 1, 2, 2);
    expect(points).toBe(1);
  });

  it('should award 0 points for completely wrong outcome', () => {
    // Predicted Home Win (2-1), Actual Away Win (0-3)
    const points = calculatePoints(2, 1, 0, 3);
    expect(points).toBe(0);
  });

  it('should award 0 points when predicting a win but actual is a draw', () => {
    // Predicted Home Win (1-0), Actual Draw (1-1)
    const points = calculatePoints(1, 0, 1, 1);
    expect(points).toBe(0);
  });
});
