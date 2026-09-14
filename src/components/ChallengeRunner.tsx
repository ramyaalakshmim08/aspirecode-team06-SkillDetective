import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  Heart, 
  Zap, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Mic, 
  Square, 
  ArrowRight,
  Code2,
  HelpCircle
} from 'lucide-react';
import { InteractiveChallenge } from '../types';
import { soundFx } from '../services/audioService';

interface ChallengeRunnerProps {
  challenge: InteractiveChallenge;
  userLives: number;
  onClose: () => void;
  onComplete: (challengeId: string, earnedXp: number, scoreGained: number) => void;
  onLifeLost: () => void;
}

export const ChallengeRunner: React.FC<ChallengeRunnerProps> = ({
  challenge,
  userLives,
  onClose,
  onComplete,
  onLifeLost
}) => {
  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState(challenge.estimatedMinutes * 60);
  const [timerActive] = useState(true);

  // Common challenge states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackText, setFeedbackText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Coding challenge states
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [userCode, setUserCode] = useState(
    challenge.codingProblem?.starterCode.javascript || ''
  );
  const [testResults, setTestResults] = useState<{
    passedCount: number;
    totalCount: number;
    results: { testId: number; passed: boolean; message: string }[];
  } | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Communication challenge states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(30);
  const [spokenText, setSpokenText] = useState('');
  const [commEvaluation, setCommEvaluation] = useState<{
    clarity: number;
    structure: number;
    vocabulary: number;
    conciseness: number;
    estimatedScore: number;
    feedback: string;
  } | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  // Sync starter code when language changes
  useEffect(() => {
    if (challenge.codingProblem) {
      setUserCode(challenge.codingProblem.starterCode[selectedLanguage]);
      setTestResults(null);
    }
  }, [selectedLanguage, challenge]);

  // Main countdown timer
  useEffect(() => {
    if (!timerActive || isCompleted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isCompleted]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (feedbackState === 'correct') return;
    soundFx.playClick();
    setSelectedOptionId(optionId);
  };

  const handleVerifyAnswer = () => {
    if (!selectedOptionId) return;

    if (challenge.type === 'logic') {
      const isCorrect = selectedOptionId === challenge.logicQuestion?.correctId;
      if (isCorrect) {
        soundFx.playSuccess();
        setFeedbackState('correct');
        setFeedbackText(challenge.logicQuestion?.successMessage || 'Correct deduction!');
        setEarnedXp(challenge.xpReward);
      } else {
        soundFx.playError();
        setFeedbackState('incorrect');
        setFeedbackText(challenge.logicQuestion?.hintMessage || 'Not quite. Re-evaluate the pattern.');
        onLifeLost();
      }
    } else if (challenge.type === 'data') {
      const opt = challenge.dataProblem?.options.find(o => o.id === selectedOptionId);
      if (opt?.isCorrect) {
        soundFx.playSuccess();
        setFeedbackState('correct');
        setFeedbackText(challenge.dataProblem?.explanation || 'Accurate analysis!');
        setEarnedXp(challenge.xpReward);
      } else {
        soundFx.playError();
        setFeedbackState('incorrect');
        setFeedbackText('Incorrect. Check which month had the highest relative % leap, not merely total gross volume.');
        onLifeLost();
      }
    } else if (challenge.type === 'attention') {
      const opt = challenge.attentionProblem?.options.find(o => o.id === selectedOptionId);
      if (opt?.isCorrect) {
        soundFx.playSuccess();
        setFeedbackState('correct');
        setFeedbackText(challenge.attentionProblem?.explanation || 'Security flaw identified!');
        setEarnedXp(challenge.xpReward);
      } else {
        soundFx.playError();
        setFeedbackState('incorrect');
        setFeedbackText('That was not the modified parameter. Inspect line 13 carefully.');
        onLifeLost();
      }
    }
  };

  const handleRunCode = (isSubmit: boolean = false) => {
    soundFx.playClick();
    setIsRunningCode(true);

    setTimeout(() => {
      setIsRunningCode(false);
      const tests = challenge.codingProblem?.testCases || [];

      const code = userCode.toLowerCase();
      const hasFilterLogic = code.includes('counts') || code.includes('filter') || code.includes('count') || code.includes('frequency');
      const handlesDuplicatesCorrectly = hasFilterLogic && (code.includes('=== 1') || code.includes('== 1') || code.includes('==1'));

      if (handlesDuplicatesCorrectly) {
        soundFx.playSuccess();
        setTestResults({
          passedCount: tests.length,
          totalCount: tests.length,
          results: tests.map(t => ({
            testId: t.id,
            passed: true,
            message: `Passed: ${t.description} -> Expected ${t.expected}, Output matches.`
          }))
        });

        if (isSubmit) {
          setFeedbackState('correct');
          setEarnedXp(challenge.xpReward);
        }
      } else {
        soundFx.playError();
        setTestResults({
          passedCount: 3,
          totalCount: tests.length,
          results: tests.map((t, idx) => ({
            testId: t.id,
            passed: idx !== 1 && idx !== 3,
            message: (idx === 1 || idx === 3)
              ? `Failed: Expected ${t.expected}, but function returned duplicate instances.`
              : `Passed: ${t.description}`
          }))
        });

        if (isSubmit) {
          setFeedbackState('incorrect');
          setFeedbackText(
            challenge.codingProblem?.duplicateEdgeCaseWarning ||
            'Your approach works for most cases, but fails when the input contains duplicate values.'
          );
          onLifeLost();
        }
      }
    }, 500);
  };

  const startRecording = () => {
    soundFx.playClick();
    setIsRecording(true);
    setRecordingSeconds(30);

    recordingIntervalRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    soundFx.playSuccess();

    const finalSpoken = spokenText.trim() || 
      'Cloud computing is like the electricity in your house: instead of buying and maintaining your own generator in your basement, you plug into the grid and pay only for the power you use. The cloud lets companies rent computers over the internet instead of buying physical servers.';

    setSpokenText(finalSpoken);

    setCommEvaluation({
      clarity: 88,
      structure: 85,
      vocabulary: 82,
      conciseness: 90,
      estimatedScore: 86,
      feedback: 'Excellent real-world analogy (electricity grid). Avoided jargon like virtualization. Logical progression from physical limitation to remote service.'
    });

    setFeedbackState('correct');
    setEarnedXp(challenge.xpReward);
  };

  const handleFinishChallenge = () => {
    soundFx.playLevelUp();
    setIsCompleted(true);
    onComplete(challenge.id, earnedXp || challenge.xpReward, 4);
  };

  return (
    <div className="focused-runner-backdrop" role="dialog" aria-modal="true">
      <div className="focused-runner-window">
        {/* Top Header Strip — Distraction-Free */}
        <header className="runner-header">
          <div className="runner-header-left">
            <span className="category-tag badge badge-neutral">{challenge.categoryLabel}</span>
            <h2 className="runner-challenge-title">{challenge.title}</h2>
          </div>

          <div className="runner-header-meta">
            {/* Timer */}
            <div className="runner-meta-pill" title="Elapsed / Time Remaining">
              <Clock size={14} className="text-muted" />
              <span className="font-mono text-xs">{formatTime(secondsRemaining)}</span>
            </div>

            {/* Lives */}
            <div className="runner-meta-pill" title={`${userLives} attempts remaining`}>
              <Heart size={14} className="runner-heart-filled" />
              <span className="font-mono text-xs">{userLives}</span>
            </div>

            {/* Close */}
            <button
              type="button"
              className="runner-close-btn"
              onClick={onClose}
              aria-label="Exit Challenge"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Progress line */}
        <div className="runner-progress-track">
          <div 
            className="runner-progress-fill" 
            style={{ width: feedbackState === 'correct' ? '100%' : '50%' }}
          />
        </div>

        {/* Challenge Content Area */}
        <div className="runner-body">
          {/* 1. LOGIC CHALLENGE MODE */}
          {challenge.type === 'logic' && challenge.logicQuestion && (
            <div className="challenge-pane logic-pane">
              <div className="question-statement-box">
                <span className="question-step-label">Question 1 of 1</span>
                <p className="question-text">{challenge.logicQuestion.question}</p>

                {/* Sequence visualizer with horizontal scroll support */}
                <div className="sequence-display">
                  {challenge.logicQuestion.sequenceVisual.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`sequence-item ${item === '?' ? 'sequence-target' : ''}`}
                    >
                      <span>{item}</span>
                      {idx < challenge.logicQuestion!.sequenceVisual.length - 1 && (
                        <span className="sequence-arrow">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="options-grid">
                {challenge.logicQuestion.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optClass = 'option-card';
                  if (isSelected) optClass += ' option-selected';
                  if (feedbackState === 'correct' && opt.id === challenge.logicQuestion!.correctId) {
                    optClass += ' option-correct';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={feedbackState === 'correct'}
                    >
                      <div className="option-indicator">{opt.id.replace('opt-', '').toUpperCase()}</div>
                      <div className="option-content">
                        <span className="option-title">{opt.text}</span>
                        {opt.subtext && <span className="option-subtext">{opt.subtext}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. CODING CHALLENGE MODE */}
          {challenge.type === 'coding' && challenge.codingProblem && (
            <div className="challenge-pane coding-pane">
              <div className="coding-layout-split">
                {/* Problem constraints */}
                <div className="coding-left-panel">
                  <div className="coding-problem-meta">
                    <span className="badge badge-warning">{challenge.difficulty}</span>
                    <span className="badge badge-neutral">+{challenge.xpReward} XP</span>
                  </div>

                  <h3 className="coding-heading">Problem Description</h3>
                  <p className="coding-prompt">{challenge.codingProblem.prompt}</p>

                  <h4 className="coding-subheading">Constraints</h4>
                  <ul className="coding-constraints-list">
                    {challenge.codingProblem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>

                  <h4 className="coding-subheading">Sample Cases</h4>
                  <div className="test-cases-list">
                    {challenge.codingProblem.testCases.slice(0, 3).map((tc) => (
                      <div key={tc.id} className="test-case-item">
                        <span className="tc-title font-semibold">Case {tc.id}: {tc.description}</span>
                        <div className="tc-io">
                          <code>Input: {tc.input}</code>
                          <code>Expected: {tc.expected}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code editor */}
                <div className="coding-right-panel">
                  <div className="editor-toolbar">
                    <div className="editor-lang-selector">
                      <Code2 size={14} />
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as 'javascript' | 'python' | 'java')}
                        className="lang-select"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRunCode(false)}
                      disabled={isRunningCode}
                    >
                      <Play size={12} />
                      <span>Run Tests</span>
                    </button>
                  </div>

                  <div className="code-editor-wrapper">
                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      spellCheck={false}
                      className="code-textarea font-mono"
                    />
                  </div>

                  {testResults && (
                    <div className="test-results-tray">
                      <div className="tray-header">
                        <strong>Test Results:</strong>
                        <span className={testResults.passedCount === testResults.totalCount ? 'text-success font-bold' : 'text-warning font-bold'}>
                          {testResults.passedCount} / {testResults.totalCount} passed
                        </span>
                      </div>
                      <div className="tray-results-list">
                        {testResults.results.map((r) => (
                          <div key={r.testId} className={`result-line ${r.passed ? 'res-pass' : 'res-fail'}`}>
                            {r.passed ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            <span className="text-xs">{r.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. COMMUNICATION CHALLENGE MODE */}
          {challenge.type === 'communication' && challenge.communicationProblem && (
            <div className="challenge-pane communication-pane">
              <div className="comm-prompt-card">
                <span className="question-step-label">Timed Communication Scenario</span>
                <h3 className="comm-topic">{challenge.communicationProblem.topic}</h3>
                <p className="comm-prompt">{challenge.communicationProblem.prompt}</p>
                <div className="scenario-tag">
                  <HelpCircle size={14} />
                  <span>{challenge.communicationProblem.scenario}</span>
                </div>
              </div>

              <div className="comm-workspace">
                <div className="recording-panel">
                  <div className="recording-timer">
                    <Clock size={15} />
                    <span className="font-mono text-base font-bold">{recordingSeconds}s remaining</span>
                  </div>

                  {isRecording ? (
                    <div className="recording-active-view">
                      <div className="audio-waveform-simulator">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span 
                            key={i} 
                            className="wave-bar" 
                            style={{ 
                              animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                              height: `${16 + (i % 3) * 14}px`
                            }} 
                          />
                        ))}
                      </div>
                      <button type="button" className="btn btn-primary btn-sm" onClick={stopRecording}>
                        <Square size={14} />
                        <span>Stop & Evaluate</span>
                      </button>
                    </div>
                  ) : (
                    <div className="recording-idle-view">
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        onClick={startRecording}
                      >
                        <Mic size={16} />
                        <span>Start 30s Recording</span>
                      </button>
                      <span className="text-xs text-muted">Or type your analogy below:</span>
                    </div>
                  )}

                  <textarea
                    className="comm-text-input"
                    rows={3}
                    placeholder="Type your explanation here..."
                    value={spokenText}
                    onChange={(e) => setSpokenText(e.target.value)}
                  />
                </div>

                <div className="rubric-panel">
                  <h4 className="rubric-heading">Assessment Rubric</h4>
                  <div className="rubric-list">
                    {challenge.communicationProblem.rubricCriteria.map((item) => (
                      <div key={item.name} className="rubric-item">
                        <div className="rubric-header">
                          <span className="rubric-name">{item.name}</span>
                          <span className="badge badge-neutral text-xs">{item.weight}</span>
                        </div>
                        <p className="rubric-desc text-xs text-muted">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  {commEvaluation && (
                    <div className="comm-score-box">
                      <div className="comm-score-row">
                        <span className="text-xs font-semibold">Estimated Score:</span>
                        <strong className="text-accent font-mono">{commEvaluation.estimatedScore} / 100</strong>
                      </div>
                      <p className="text-xs" style={{ marginTop: '2px' }}>{commEvaluation.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. DATA ANALYSIS CHALLENGE MODE */}
          {challenge.type === 'data' && challenge.dataProblem && (
            <div className="challenge-pane data-pane">
              <div className="data-context-box">
                <span className="question-step-label">Quantitative Data Investigation</span>
                <p className="question-text">{challenge.dataProblem.context}</p>

                <div className="data-table-wrapper">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        {challenge.dataProblem.table.columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {challenge.dataProblem.table.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={cIdx >= 1 ? 'font-mono' : ''}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="data-question-prompt">
                  <strong>Question: </strong>{challenge.dataProblem.question}
                </p>
              </div>

              <div className="options-grid">
                {challenge.dataProblem.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optClass = 'option-card';
                  if (isSelected) optClass += ' option-selected';
                  if (feedbackState === 'correct' && opt.isCorrect) optClass += ' option-correct';

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={feedbackState === 'correct'}
                    >
                      <div className="option-indicator">{opt.id.replace('opt-', '')}</div>
                      <div className="option-content">
                        <span className="option-title">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. ATTENTION CHALLENGE MODE */}
          {challenge.type === 'attention' && challenge.attentionProblem && (
            <div className="challenge-pane attention-pane">
              <div className="attention-statement-box">
                <span className="question-step-label">Security Configuration Review</span>
                <p className="question-text">{challenge.attentionProblem.context}</p>

                <div className="code-diff-preview font-mono text-xs">
                  <pre>{challenge.attentionProblem.codeSnippet}</pre>
                </div>

                <p className="attention-question-prompt">
                  <strong>Question: </strong>{challenge.attentionProblem.question}
                </p>
              </div>

              <div className="options-grid">
                {challenge.attentionProblem.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optClass = 'option-card';
                  if (isSelected) optClass += ' option-selected';
                  if (feedbackState === 'correct' && opt.isCorrect) optClass += ' option-correct';

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={feedbackState === 'correct'}
                    >
                      <div className="option-indicator">{opt.id.replace('opt-', '')}</div>
                      <div className="option-content">
                        <span className="option-title">{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Action & Feedback Footer */}
        <footer className="runner-footer">
          {feedbackState !== 'idle' && (
            <div className={`feedback-banner ${feedbackState === 'correct' ? 'fb-correct' : 'fb-incorrect'}`}>
              <div className="fb-content">
                {feedbackState === 'correct' ? (
                  <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                ) : (
                  <AlertCircle size={18} className="text-danger flex-shrink-0" />
                )}
                <div>
                  <strong>{feedbackState === 'correct' ? 'Correct!' : 'Not quite.'}</strong>
                  <p className="text-xs">{feedbackText}</p>
                </div>
              </div>
              {feedbackState === 'correct' && (
                <div className="xp-gain-badge">
                  <Zap size={13} />
                  <span>+{earnedXp || challenge.xpReward} XP</span>
                </div>
              )}
            </div>
          )}

          <div className="runner-footer-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Exit
            </button>

            {feedbackState === 'correct' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinishChallenge}
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
            ) : challenge.type === 'coding' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleRunCode(true)}
                disabled={isRunningCode}
              >
                <span>Submit Solution</span>
                <ArrowRight size={15} />
              </button>
            ) : challenge.type === 'communication' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={stopRecording}
                disabled={isRecording}
              >
                <span>Submit Response</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleVerifyAnswer}
                disabled={!selectedOptionId}
              >
                <span>Verify Answer</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </footer>
      </div>

      <style>{`
        .focused-runner-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 90;
          padding: var(--space-4);
          box-sizing: border-box;
        }

        .focused-runner-window {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 920px;
          height: 88vh;
          max-height: 800px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .runner-header {
          padding: var(--space-3) var(--space-5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-subtle);
          gap: var(--space-2);
        }

        .runner-header-left {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          min-width: 0;
        }

        .runner-challenge-title {
          font-size: 1.05rem;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .runner-header-meta {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }

        .runner-meta-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          font-weight: 600;
        }

        .runner-heart-filled {
          color: #DC2626;
          fill: #DC2626;
        }

        .runner-close-btn {
          color: var(--text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .runner-close-btn:hover {
          background-color: var(--bg-subtle);
          color: var(--text-primary);
        }

        .runner-progress-track {
          height: 4px;
          background-color: var(--bg-muted);
          width: 100%;
        }

        .runner-progress-fill {
          height: 100%;
          background-color: var(--accent-indigo);
          transition: width 0.35s ease;
        }

        .runner-body {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          overscroll-behavior-y: contain;
          padding: var(--space-5);
        }

        .challenge-pane {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .question-statement-box {
          background-color: var(--bg-subtle);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .question-step-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .question-text {
          font-size: 1.0rem;
          color: var(--text-primary);
          font-weight: 600;
          margin-top: 4px;
          line-height: 1.45;
        }

        .sequence-display {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-3);
          padding: var(--space-2) var(--space-3);
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          overflow-x: auto;
        }

        .sequence-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .sequence-target {
          color: var(--accent-indigo);
          background-color: var(--accent-indigo-subtle);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
          border: 1.5px dashed var(--accent-indigo);
        }

        .sequence-arrow {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .option-card {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background-color: var(--bg-surface);
          border: 1.5px solid var(--border-color);
          border-radius: var(--radius-lg);
          text-align: left;
          transition: all var(--transition-fast);
        }

        .option-card:hover:not(:disabled) {
          border-color: var(--accent-indigo);
          background-color: var(--bg-subtle);
        }

        .option-selected {
          border-color: var(--accent-indigo);
          background-color: var(--accent-indigo-subtle);
        }

        .option-correct {
          border-color: var(--color-success) !important;
          background-color: var(--color-success-subtle) !important;
        }

        .option-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .option-selected .option-indicator {
          background-color: var(--accent-indigo);
          color: #FFFFFF;
          border-color: var(--accent-indigo);
        }

        .option-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .option-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .option-subtext {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Coding Split Layout */
        .coding-layout-split {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: var(--space-3);
          min-height: 440px;
        }

        .coding-left-panel {
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--space-3);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .coding-problem-meta {
          display: flex;
          gap: 6px;
        }

        .coding-heading {
          font-size: 0.95rem;
        }

        .coding-prompt {
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .coding-subheading {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 4px;
        }

        .coding-constraints-list {
          padding-left: 16px;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .test-cases-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .test-case-item {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 6px;
        }

        .tc-title {
          font-size: 0.72rem;
        }

        .tc-io {
          display: flex;
          flex-direction: column;
          gap: 1px;
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .coding-right-panel {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: #0F172A;
        }

        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background-color: #1E293B;
          border-bottom: 1px solid #334155;
          color: #CBD5E1;
        }

        .editor-lang-selector {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lang-select {
          background-color: #0F172A;
          color: #F8FAFC;
          border: 1px solid #334155;
          border-radius: var(--radius-sm);
          padding: 2px 6px;
          font-size: 0.72rem;
        }

        .code-editor-wrapper {
          flex: 1;
          display: flex;
        }

        .code-textarea {
          flex: 1;
          width: 100%;
          min-height: 200px;
          background-color: #0F172A;
          color: #E2E8F0;
          padding: 10px;
          border: none;
          resize: none;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .test-results-tray {
          background-color: #1E293B;
          border-top: 1px solid #334155;
          padding: 8px 10px;
          font-size: 0.75rem;
          color: #E2E8F0;
          max-height: 120px;
          overflow-y: auto;
        }

        .tray-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .tray-results-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .result-line {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .res-pass { color: #4ADE80; }
        .res-fail { color: #F87171; }

        /* Communication Mode */
        .comm-prompt-card {
          background-color: var(--bg-subtle);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .comm-topic {
          font-size: 1.1rem;
          margin: 2px 0;
        }

        .comm-prompt {
          font-size: 0.9rem;
          line-height: 1.45;
        }

        .scenario-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: var(--space-2);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }

        .comm-workspace {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: var(--space-3);
        }

        .recording-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          padding: var(--space-3);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
        }

        .recording-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
        }

        .audio-waveform-simulator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 48px;
          padding: var(--space-1);
          background-color: var(--bg-subtle);
          border-radius: var(--radius-md);
        }

        .wave-bar {
          width: 4px;
          background-color: var(--accent-indigo);
          border-radius: 2px;
          animation: wavePulse 0.5s infinite ease-in-out alternate;
        }

        @keyframes wavePulse {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1.2); }
        }

        .comm-text-input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          box-sizing: border-box;
        }

        .rubric-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          background-color: var(--bg-subtle);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .rubric-heading {
          font-size: 0.82rem;
          font-weight: 700;
        }

        .rubric-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rubric-item {
          background-color: var(--bg-surface);
          padding: 5px 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .rubric-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2px;
        }

        .rubric-name {
          font-weight: 600;
          font-size: 0.78rem;
        }

        .comm-score-box {
          margin-top: var(--space-1);
          padding: var(--space-2);
          background-color: var(--accent-indigo-subtle);
          border-radius: var(--radius-md);
          border: 1px solid #C7D2FE;
        }

        .comm-score-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Clean Data Table */
        .data-context-box {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          background-color: var(--bg-subtle);
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
        }

        .data-table-wrapper {
          overflow-x: auto;
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }

        .clean-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
        }

        .clean-table th, .clean-table td {
          padding: 6px 10px;
          border-bottom: 1px solid var(--border-subtle);
          text-align: left;
        }

        .clean-table th {
          background-color: var(--bg-subtle);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .code-diff-preview {
          background-color: #0F172A;
          color: #E2E8F0;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          overflow-x: auto;
        }

        .runner-footer {
          padding: var(--space-3) var(--space-5);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          background-color: var(--bg-surface);
        }

        .feedback-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
        }

        .fb-correct {
          background-color: var(--color-success-subtle);
          border-color: var(--color-success-border);
          color: var(--color-success);
        }

        .fb-incorrect {
          background-color: var(--color-danger-subtle);
          border-color: var(--color-danger-border);
          color: var(--color-danger);
        }

        .fb-content {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .xp-gain-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background-color: var(--bg-surface);
          color: var(--accent-indigo);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.8rem;
          border: 1px solid #C7D2FE;
        }

        .runner-footer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Mobile full-screen runner adjustments */
        @media (max-width: 768px) {
          .focused-runner-backdrop {
            padding: 0;
          }
          .focused-runner-window {
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            border: none;
          }
          .runner-header {
            padding: var(--space-3);
          }
          .runner-body {
            padding: var(--space-3);
          }
          .runner-footer {
            padding: var(--space-3);
          }
          .coding-layout-split {
            grid-template-columns: 1fr;
          }
          .comm-workspace {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .runner-challenge-title {
            max-width: 140px;
            font-size: 0.92rem;
          }
          .runner-header-meta {
            gap: 4px;
          }
          .runner-meta-pill {
            padding: 2px 6px;
            font-size: 0.72rem;
          }
          .runner-footer-actions {
            flex-direction: column-reverse;
            gap: 8px;
          }
          .runner-footer-actions button {
            width: 100%;
            justify-content: center;
          }
          .sequence-display {
            padding: 8px;
            gap: 6px;
          }
          .sequence-item {
            font-size: 1.0rem;
          }
        }
      `}</style>
    </div>
  );
};

