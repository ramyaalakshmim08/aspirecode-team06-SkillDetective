import { describe, it, expect, beforeEach } from 'vitest';
import { CareerService } from '../services/careerService';
import { StorageAdapter } from '../services/storageAdapter';
import { SkillScore } from '../types';

describe('CareerService', () => {
  const testUserId = 'usr-test-career-eval';

  beforeEach(() => {
    localStorage.clear();
    StorageAdapter.createInitialProfile(testUserId, 'test@university.edu', 'Test Student');
  });

  it('evaluates completely unassessed users to 0% compatibility with baseline guidance', () => {
    const matches = CareerService.getCareerMatches(testUserId);
    expect(matches.length).toBeGreaterThan(0);

    for (const match of matches) {
      expect(match.matchPercentage).toBe(0);
      expect(match.whyItMatches[0]).toContain('Complete initial diagnostic assessments');
      expect(match.skillGapScore).toBe(100);
    }
  });

  it('dynamically computes realistic match percentage and identifies strengths and gaps after assessment', () => {
    // Calibrate scores for actual core skills
    const scores = StorageAdapter.getSkillScores(testUserId);
    
    // Set high scores for Software / QA competencies
    const updatedScores: SkillScore[] = scores.map((s) => {
      if (s.skillId === 'problem-solving') {
        return { ...s, score: 85, confidence: 'high', attemptsCount: 6 };
      }
      if (s.skillId === 'logical') {
        return { ...s, score: 82, confidence: 'medium', attemptsCount: 4 };
      }
      if (s.skillId === 'coding') {
        return { ...s, score: 78, confidence: 'high', attemptsCount: 7 };
      }
      if (s.skillId === 'attention-to-detail') {
        return { ...s, score: 88, confidence: 'high', attemptsCount: 6 };
      }
      return s;
    });

    for (const s of updatedScores) {
      StorageAdapter.saveSkillScore(testUserId, s);
    }

    const matches = CareerService.getCareerMatches(testUserId);
    expect(matches.length).toBeGreaterThan(0);

    const topMatch = matches[0];
    // With 4 high competency scores exceeding benchmarks, top match should have a high match percentage
    expect(topMatch.matchPercentage).toBeGreaterThan(70);
    expect(topMatch.compatibilityBreakdown.length).toBeGreaterThan(0);

    // Verify strengths are logged in whyItMatches
    const hasEvidence = topMatch.whyItMatches.some(
      (w) => w.includes('Strong') || w.includes('benchmark')
    );
    expect(hasEvidence).toBe(true);
  });

  it('allows saving career goals and comparing multiple careers side-by-side', () => {
    const matches = CareerService.getCareerMatches(testUserId);
    const firstCareer = matches[0];
    const secondCareer = matches[1];

    CareerService.setGoalStatus(testUserId, firstCareer.id, 'primary_goal');
    CareerService.setGoalStatus(testUserId, secondCareer.id, 'exploring');

    const updatedMatches = CareerService.getCareerMatches(testUserId);
    const updatedFirst = updatedMatches.find((m) => m.id === firstCareer.id);
    const updatedSecond = updatedMatches.find((m) => m.id === secondCareer.id);

    expect(updatedFirst?.isSaved).toBe(true);
    expect(updatedFirst?.goalStatus).toBe('primary_goal');
    expect(updatedSecond?.goalStatus).toBe('exploring');

    const compared = CareerService.compareCareers(testUserId, [firstCareer.id, secondCareer.id]);
    expect(compared.length).toBe(2);
  });
});
