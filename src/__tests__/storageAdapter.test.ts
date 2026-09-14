import { describe, it, expect, beforeEach } from 'vitest';
import { StorageAdapter, StoredUserAccount } from '../services/storageAdapter';

describe('StorageAdapter - Multi-user Data Isolation & State Integrity', () => {
  const userA: StoredUserAccount = {
    id: 'usr-alice-123',
    email: 'alice@institution.edu',
    passwordHash: 'hashed-pw-1',
    fullName: 'Alice Wonder',
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  const userB: StoredUserAccount = {
    id: 'usr-bob-456',
    email: 'bob@institution.edu',
    passwordHash: 'hashed-pw-2',
    fullName: 'Bob Builder',
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('guarantees user profile data isolation between different authenticated accounts', () => {
    StorageAdapter.saveUser(userA);
    StorageAdapter.saveUser(userB);

    const profileA = StorageAdapter.createInitialProfile(userA.id, userA.email, userA.fullName);
    const profileB = StorageAdapter.createInitialProfile(userB.id, userB.email, userB.fullName);

    profileA.course = 'Computer Science';
    profileA.xp = 150;
    StorageAdapter.saveProfile(profileA);

    profileB.course = 'Mechanical Engineering';
    profileB.xp = 0;
    StorageAdapter.saveProfile(profileB);

    const fetchedA = StorageAdapter.getProfile(userA.id);
    const fetchedB = StorageAdapter.getProfile(userB.id);

    expect(fetchedA?.course).toBe('Computer Science');
    expect(fetchedA?.xp).toBe(150);

    expect(fetchedB?.course).toBe('Mechanical Engineering');
    expect(fetchedB?.xp).toBe(0);
  });

  it('strictly isolates challenge attempts between users', () => {
    const attemptA = {
      id: 'att-alice-1',
      challengeId: 'code-pattern-1',
      score: 88,
      isCorrect: true,
      timeTakenSeconds: 35,
      xpEarned: 45,
      completedAt: new Date().toISOString(),
      idempotencyKey: 'idem-alice-1',
    };

    const attemptB = {
      id: 'att-bob-1',
      challengeId: 'code-pattern-1',
      score: 40,
      isCorrect: false,
      timeTakenSeconds: 55,
      xpEarned: 10,
      completedAt: new Date().toISOString(),
      idempotencyKey: 'idem-bob-1',
    };

    StorageAdapter.recordChallengeAttempt(userA.id, attemptA);
    StorageAdapter.recordChallengeAttempt(userB.id, attemptB);

    const attemptsA = StorageAdapter.getChallengeAttempts(userA.id);
    const attemptsB = StorageAdapter.getChallengeAttempts(userB.id);

    expect(attemptsA.length).toBe(1);
    expect(attemptsA[0].id).toBe('att-alice-1');
    expect(attemptsA[0].score).toBe(88);

    expect(attemptsB.length).toBe(1);
    expect(attemptsB[0].id).toBe('att-bob-1');
    expect(attemptsB[0].score).toBe(40);
  });

  it('prevents duplicate XP addition via idempotent transactions', () => {
    StorageAdapter.createInitialProfile(userA.id, userA.email, userA.fullName);
    const txId = 'tx-unique-12345';

    // First award
    const firstResult = StorageAdapter.awardXp(userA.id, 50, txId);
    expect(firstResult.awarded).toBe(true);
    expect(firstResult.totalXp).toBe(50);
    expect(StorageAdapter.getProfile(userA.id)?.xp).toBe(50);

    // Duplicate award with exact same transaction ID
    const duplicateResult = StorageAdapter.awardXp(userA.id, 50, txId);
    expect(duplicateResult.awarded).toBe(false);
    // XP must not increase twice
    expect(duplicateResult.totalXp).toBe(50);
    expect(StorageAdapter.getProfile(userA.id)?.xp).toBe(50);
  });

  it('records audit logs and system activity correctly per user', () => {
    StorageAdapter.recordActivityLog(userA.id, 'challenge_completed', 'Solved binary search bug', { challengeId: 'ch-1' });

    const logsA = StorageAdapter.getActivityLogs(userA.id);
    expect(logsA.length).toBe(1);
    expect(logsA[0].eventType).toBe('challenge_completed');

    // Bob has zero logs
    expect(StorageAdapter.getActivityLogs(userB.id).length).toBe(0);
  });

  it('completely cleans up user data on GDPR account deletion', () => {
    StorageAdapter.saveUser(userA);
    StorageAdapter.createInitialProfile(userA.id, userA.email, userA.fullName);
    StorageAdapter.recordActivityLog(userA.id, 'test_event', 'Sample');

    expect(StorageAdapter.getUserById(userA.id)).not.toBeNull();
    expect(StorageAdapter.getProfile(userA.id)).not.toBeNull();

    StorageAdapter.deleteUserAccount(userA.id);

    expect(StorageAdapter.getUserById(userA.id)).toBeNull();
    expect(StorageAdapter.getProfile(userA.id)).toBeNull();
    expect(StorageAdapter.getActivityLogs(userA.id).length).toBe(0);
  });
});
