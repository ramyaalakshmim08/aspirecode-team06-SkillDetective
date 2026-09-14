import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../services/scoringEngine';
import { SkillScore } from '../types';

describe('ScoringEngine', () => {
  it('calculates attempt score with difficulty bonus and time efficiency', () => {
    // Correct solution, Easy difficulty, quick time (15s of 60s -> ratio 0.25 <= 0.4 -> +10)
    const scoreQuickEasy = ScoringEngine.calculateAttemptScore({
      isCorrect: true,
      difficulty: 'Easy',
      timeTakenSeconds: 15,
      timeLimitSeconds: 60,
    });
    // base: 70, diffBonus: 0, timeEfficiency: +10 => 80
    expect(scoreQuickEasy).toBe(80);

    // Correct solution, Hard difficulty (multiplier 1.3 -> +4.5 bonus), quick time
    const scoreQuickHard = ScoringEngine.calculateAttemptScore({
      isCorrect: true,
      difficulty: 'Hard',
      timeTakenSeconds: 20,
      timeLimitSeconds: 60,
    });
    expect(scoreQuickHard).toBeGreaterThan(scoreQuickEasy);
  });

  it('awards minimal partial score for failed/incorrect attempts', () => {
    const scoreIncorrect = ScoringEngine.calculateAttemptScore({
      isCorrect: false,
      difficulty: 'Medium',
      timeTakenSeconds: 58,
      timeLimitSeconds: 60,
    });
    // Incorrect uses 0.25 accuracy -> ~18 base score - 5 time pressure => ~15
    expect(scoreIncorrect).toBeLessThan(30);
    expect(scoreIncorrect).toBeGreaterThanOrEqual(10);
  });

  it('calibrates first baseline assessment cleanly', () => {
    const unassessed: SkillScore = {
      id: 'score-1',
      userId: 'user-1',
      skillId: 'problem-solving',
      score: null,
      initialScore: null,
      level: 1,
      confidence: 'none',
      attemptsCount: 0,
      previousScore: null,
      scoreDelta: 0,
      strength: '',
      practice: '',
    };

    const calibration = ScoringEngine.calibrateCompetencyScore(unassessed, 85);
    expect(calibration.newScore).toBe(85);
    expect(calibration.attemptsCount).toBe(1);
    expect(calibration.confidence).toBe('low');
    expect(calibration.previousScore).toBeNull();
    expect(calibration.scoreDelta).toBe(0);
  });

  it('smooths subsequent attempts via weighted moving average and upgrades confidence', () => {
    const assessedLow: SkillScore = {
      id: 'score-1',
      userId: 'user-1',
      skillId: 'problem-solving',
      score: 80,
      initialScore: 80,
      level: 3,
      confidence: 'low',
      attemptsCount: 2,
      previousScore: null,
      scoreDelta: 0,
      strength: '',
      practice: '',
    };

    // 3rd attempt: 80 * 0.65 + 95 * 0.35 = 52 + 33.25 = 85.25 -> 85
    const calibration = ScoringEngine.calibrateCompetencyScore(assessedLow, 95);
    expect(calibration.newScore).toBe(85);
    expect(calibration.attemptsCount).toBe(3);
    expect(calibration.confidence).toBe('medium');
    expect(calibration.scoreDelta).toBe(5);

    // High confidence after 6 attempts
    const assessedMed: SkillScore = {
      ...assessedLow,
      score: 85,
      attemptsCount: 5,
      confidence: 'medium',
    };
    const sixthCalibration = ScoringEngine.calibrateCompetencyScore(assessedMed, 90);
    expect(sixthCalibration.attemptsCount).toBe(6);
    expect(sixthCalibration.confidence).toBe('high');
  });

  it('categorizes score into qualitative mastery levels', () => {
    expect(ScoringEngine.getMasteryStatus(null)).toBe('unassessed');
    expect(ScoringEngine.getMasteryStatus(92)).toBe('strong');
    expect(ScoringEngine.getMasteryStatus(72)).toBe('developing');
    expect(ScoringEngine.getMasteryStatus(54)).toBe('needs-practice');
  });

  it('generates rich pedagogical feedback based on skill performance', () => {
    const feedback = ScoringEngine.generateFeedback('problem-solving', 88);
    expect(feedback.strength).toContain('problem solving');
    expect(feedback.practice.length).toBeGreaterThan(10);
  });
});
