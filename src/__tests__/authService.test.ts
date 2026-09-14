import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../services/authService';
import { StorageAdapter } from '../services/storageAdapter';

describe('AuthService & Initial User State Validation', () => {
  beforeEach(async () => {
    await AuthService.signOut();
    localStorage.clear();
  });

  it('initializes freshly registered user with clean zero-state without dummy data', async () => {
    const signupResult = await AuthService.signUp(
      'student.zero@university.edu',
      'SecurePassword123!',
      'Jordan Lee'
    );

    expect(signupResult.error).toBeNull();
    expect(signupResult.session).not.toBeNull();
    
    const { user, profile } = signupResult.session!;
    expect(user.email).toBe('student.zero@university.edu');
    expect(user.role).toBe('student');

    // Verify freshly initialized profile
    expect(profile).not.toBeNull();
    expect(profile.xp).toBe(0);
    expect(profile.level).toBe(1);
    expect(profile.lives).toBe(4);
    expect(profile.onboardingCompleted).toBe(false);

    // Verify all 8 skills are completely unassessed (score === null, confidence === 'none')
    const skillScores = StorageAdapter.getSkillScores(user.id);
    expect(skillScores.length).toBe(8);
    for (const score of skillScores) {
      expect(score.score).toBeNull();
      expect(score.confidence).toBe('none');
      expect(score.attemptsCount).toBe(0);
    }
  });

  it('rejects signup with short password', async () => {
    const result = await AuthService.signUp(
      'valid@edu.org',
      'short',
      'Tester Name'
    );

    expect(result.session).toBeNull();
    expect(result.error).toContain('at least 6 characters');
  });

  it('authenticates registered user with correct credentials and rejects incorrect password', async () => {
    await AuthService.signUp(
      'carol@institute.edu',
      'MyPassword123!',
      'Carol Danvers'
    );

    await AuthService.signOut();
    expect(StorageAdapter.getCurrentUserId()).toBeNull();

    // Wrong password
    const failLogin = await AuthService.signIn('carol@institute.edu', 'WrongPass!');
    expect(failLogin.session).toBeNull();
    expect(failLogin.error).toContain('Invalid password');

    // Correct password
    const successLogin = await AuthService.signIn('carol@institute.edu', 'MyPassword123!');
    expect(successLogin.error).toBeNull();
    expect(successLogin.session?.user.email).toBe('carol@institute.edu');
    expect(StorageAdapter.getCurrentUserId()).toBe(successLogin.session?.user.id);
  });
});
