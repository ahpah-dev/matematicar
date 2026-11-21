import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import CatMascot from './CatMascot';
import MathText from './MathText';
import InteractiveWidget from './InteractiveWidget';
import { soundFX } from '../utils/sound';

export default function LessonModal({
  topic,
  gradeColor,
  gradeDarkColor,
  hearts,
  onLoseHeart,
  onComplete,
  onClose,
  soundEnabled,
  isDailyChallenge = false,
}) {
  const steps = topic.steps || [];
  const quiz = topic.quiz || [];
  const formulas = topic.formulas || [];

  // phase: 'learn' | 'quiz' | 'formulas' | 'done'
  const [phase, setPhase] = useState(isDailyChallenge ? 'quiz' : 'learn');
  const [stepIdx, setStepIdx] = useState(0);

  // Quiz state
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const totalProgressSteps = (isDailyChallenge ? 0 : steps.length) + quiz.length;
  const currentProgressStep =
    phase === 'done'
      ? totalProgressSteps
      : phase === 'learn'
      ? stepIdx + 1
      : (isDailyChallenge ? 0 : steps.length) + qIdx + (checked ? 1 : 0);
  const progressPct = totalProgressSteps > 0 ? Math.min(100, Math.round((currentProgressStep / totalProgressSteps) * 100)) : 100;

  const currentStep = steps[stepIdx];
  const currentQ = quiz[qIdx];

  const handleCheck = () => {
    if (selectedOpt === null || checked) return;
    const isRight = selectedOpt === currentQ.correct;
    setChecked(true);
    if (isRight) {
      setCorrectCount((c) => c + 1);
      soundFX.correct(soundEnabled);
    } else {
      onLoseHeart();
      soundFX.wrong(soundEnabled);
    }
  };

  const handleNextQuiz = () => {
    soundFX.click(soundEnabled);
    if (qIdx + 1 < quiz.length) {
      setQIdx((i) => i + 1);
      setSelectedOpt(null);
      setChecked(false);
    } else {
      soundFX.complete(soundEnabled);
      setPhase('done');
      const earnedXp = isDailyChallenge ? correctCount * 15 + 15 : topic.xp;
      onComplete(topic.id, earnedXp, correctCount, quiz.length);
    }
  };

  // Keyboard shortcuts for quiz (1-4 & Enter)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (phase === 'quiz' && currentQ) {
        if (!checked && ['1', '2', '3', '4'].includes(e.key)) {
          const idx = Number(e.key) - 1;
          if (idx < currentQ.options.length) {
            setSelectedOpt(idx);
            soundFX.click(soundEnabled);
          }
        } else if (e.key === 'Enter') {
          if (!checked && selectedOpt !== null) {
            handleCheck();
          } else if (checked) {
            handleNextQuiz();
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const handleNextLearn = () => {
    soundFX.click(soundEnabled);
    if (stepIdx + 1 < steps.length) {
      setStepIdx((i) => i + 1);
    } else {
      setPhase('quiz');
      setQIdx(0);
      setSelectedOpt(null);
      setChecked(false);
    }
  };

  const handlePrevLearn = () => {
    soundFX.click(soundEnabled);
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  };

  const isCorrect = checked && currentQ && selectedOpt === currentQ.correct;

  return (
    <div className="lesson-overlay" role="dialog" aria-modal="true">
      <div className="lesson-shell">
        {/* Top Bar */}
        <header className="lesson-topbar">
          <button className="icon-btn" onClick={onClose} aria-label="Zatvori lekciju">
            <X size={24} />
          </button>

          <div className="lesson-progress-wrap">
            <div className="lesson-progress-track">
              <div
                className="lesson-progress-fill"
                style={{
                  width: `${progressPct}%`,
                  background: gradeColor || '#58CC02',
                }}
              />
            </div>
          </div>

          <div className="hearts-pill" title="Preostali životi">
            <Heart size={20} fill="#FF4B4B" color="#FF4B4B" />
            <span>{hearts}</span>
          </div>
        </header>

        {/* Sub-navigation tabs inside topic */}
        {!isDailyChallenge && phase !== 'done' && (
          <div className="lesson-mode-tabs">
            <button
              className={`mode-tab ${phase === 'learn' ? 'active' : ''}`}
              onClick={() => {
                soundFX.click(soundEnabled);
                setPhase('learn');
              }}
            >
              <BookOpen size={16} />
              <span>Preprosto ({steps.length})</span>
            </button>
            <button
              className={`mode-tab ${phase === 'quiz' ? 'active' : ''}`}
              onClick={() => {
                soundFX.click(soundEnabled);
                setPhase('quiz');
              }}
            >
              <HelpCircle size={16} />
              <span>Vežba ({quiz.length})</span>
            </button>
            <button
              className={`mode-tab ${phase === 'formulas' ? 'active' : ''}`}
              onClick={() => {
                soundFX.click(soundEnabled);
                setPhase('formulas');
              }}
            >
              <FileText size={16} />
              <span>Formule</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="lesson-body">
          {phase === 'learn' && currentStep && (
            <div className="learn-stage">
              <div className="topic-kicker" style={{ color: gradeColor }}>
                {topic.title} · Korak {stepIdx + 1} od {steps.length}
              </div>

              {/* Mascot + Speech Bubble */}
              <div className="mascot-dialogue">
                <div className="mascot-avatar-wrap">
                  <CatMascot mood={currentStep.mood || 'teacher'} size={96} />
                </div>
                <div className="speech-bubble">
                  <MathText text={currentStep.speech} />
                </div>
              </div>

              {/* Core Explanation Card */}
              <div className="explain-card">
                <h2 className="explain-title">
                  <MathText text={currentStep.title} />
                </h2>
                <div className="explain-text">
                  {currentStep.body.split('\n').map((line, i) => (
                    <p key={i}>
                      <MathText text={line} />
                    </p>
                  ))}
                </div>

                {currentStep.analogy && (
                  <div className="callout callout-analogy">
                    <div className="callout-badge">
                      <Lightbulb size={16} /> Zamisli ovako
                    </div>
                    <div>
                      <MathText text={currentStep.analogy} />
                    </div>
                  </div>
                )}

                {currentStep.example && (
                  <div className="callout callout-example">
                    <div className="callout-badge">
                      <Sparkles size={16} /> Primer korak po korak
                    </div>
                    <div>
                      {currentStep.example.split('\n').map((l, i) => (
                        <div key={i}>
                          <MathText text={l} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep.tip && (
                  <div className="callout callout-tip">
                    <div className="callout-badge">🐾 Macin trik</div>
                    <div>
                      <MathText text={currentStep.tip} />
                    </div>
                  </div>
                )}
              </div>

              {/* Show interactive widget on the first step or last learn step */}
              {topic.widget && stepIdx === 0 && (
                <InteractiveWidget type={topic.widget} />
              )}
            </div>
          )}

          {phase === 'formulas' && (
            <div className="learn-stage">
              <div className="topic-kicker" style={{ color: gradeColor }}>
                {topic.title} · Najvažnije formule
              </div>
              <div className="mascot-dialogue">
                <CatMascot mood="cool" size={88} />
                <div className="speech-bubble">
                  Sve formule za ovu oblast na jednom mestu — kratko i pregledno!
                </div>
              </div>
              <div className="formula-list">
                {formulas.map((f, idx) => (
                  <div key={idx} className="formula-card">
                    <div className="formula-label">{f.label}</div>
                    <div className="formula-tex">
                      <MathText text={`$$${f.tex}$$`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase === 'quiz' && currentQ && (
            <div className="quiz-stage">
              <div className="topic-kicker" style={{ color: gradeColor }}>
                {isDailyChallenge ? 'Dnevni izazov' : topic.title} · Pitanje {qIdx + 1} od {quiz.length}
              </div>

              <div className="mascot-dialogue compact">
                <CatMascot
                  mood={!checked ? 'thinking' : isCorrect ? 'cheering' : 'oops'}
                  size={84}
                />
                <div className="speech-bubble">
                  {!checked
                    ? 'Izaberi tačan odgovor! (Možeš i tasterima 1–4)'
                    : isCorrect
                    ? 'Mjau-tastično! Tačan odgovor!'
                    : 'Ups! Pogledaj objašnjenje dole — maca navija za tebe!'}
                </div>
              </div>

              <h2 className="quiz-question">
                <MathText text={currentQ.q} />
              </h2>

              <div className="quiz-options">
                {currentQ.options.map((opt, idx) => {
                  let stateClass = '';
                  if (checked) {
                    if (idx === currentQ.correct) stateClass = 'correct';
                    else if (idx === selectedOpt) stateClass = 'wrong';
                  } else if (idx === selectedOpt) {
                    stateClass = 'selected';
                  }

                  return (
                    <button
                      key={idx}
                      className={`quiz-option ${stateClass}`}
                      onClick={() => {
                        if (checked) return;
                        soundFX.click(soundEnabled);
                        setSelectedOpt(idx);
                      }}
                      disabled={checked}
                    >
                      <span className="opt-num">{idx + 1}</span>
                      <span className="opt-text">
                        <MathText text={opt} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="done-stage">
              <CatMascot mood="cheering" size={145} />
              <h2 className="done-title">Lekcija završena! 🐾</h2>
              <p className="done-subtitle">
                Maca Pita je preponosna! Uspešno si prošao oblast <strong>{topic.title}</strong>.
              </p>

              <div className="done-stats">
                <div className="done-stat-card xp">
                  <div className="done-stat-val">+{isDailyChallenge ? correctCount * 15 + 15 : topic.xp} XP</div>
                  <div className="done-stat-lbl">Osvojeno iskustvo</div>
                </div>
                <div className="done-stat-card acc">
                  <div className="done-stat-val">
                    {quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 100}%
                  </div>
                  <div className="done-stat-lbl">Tačnost ({correctCount}/{quiz.length})</div>
                </div>
              </div>

              <div className="done-actions">
                <button
                  className="btn-3d btn-ghost"
                  onClick={() => {
                    soundFX.click(soundEnabled);
                    setPhase('learn');
                    setStepIdx(0);
                    setQIdx(0);
                    setSelectedOpt(null);
                    setChecked(false);
                    setCorrectCount(0);
                  }}
                >
                  <RotateCcw size={18} /> Ponovi lekciju
                </button>
                <button
                  className="btn-3d btn-green"
                  onClick={() => {
                    soundFX.click(soundEnabled);
                    onClose();
                  }}
                >
                  <Trophy size={18} /> Nazad na mapu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Footer */}
        {phase !== 'done' && (
          <footer
            className={`lesson-footer ${
              checked ? (isCorrect ? 'feedback-correct' : 'feedback-wrong') : ''
            }`}
          >
            {phase === 'learn' && (
              <div className="footer-row">
                <button
                  className="btn-3d btn-ghost"
                  onClick={handlePrevLearn}
                  disabled={stepIdx === 0}
                >
                  <ArrowLeft size={18} /> Nazad
                </button>
                <button
                  className="btn-3d btn-green"
                  style={{
                    '--btn-bg': gradeColor,
                    '--btn-shadow': gradeDarkColor,
                  }}
                  onClick={handleNextLearn}
                >
                  {stepIdx + 1 < steps.length ? (
                    <>
                      Dalje <ArrowRight size={18} />
                    </>
                  ) : (
                    <>
                      Idemo na vežbu! <Sparkles size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

            {phase === 'formulas' && (
              <div className="footer-row right">
                <button
                  className="btn-3d btn-green"
                  onClick={() => {
                    soundFX.click(soundEnabled);
                    setPhase('quiz');
                  }}
                >
                  Testiraj ove formule <ArrowRight size={18} />
                </button>
              </div>
            )}

            {phase === 'quiz' && !checked && (
              <div className="footer-row right">
                <button
                  className="btn-3d btn-green"
                  disabled={selectedOpt === null}
                  onClick={handleCheck}
                >
                  PROVERI
                </button>
              </div>
            )}

            {phase === 'quiz' && checked && (
              <div className="footer-feedback-row">
                <div className="feedback-content">
                  <div className="feedback-head">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={24} /> Tačno! Bravo!
                      </>
                    ) : (
                      <>
                        <XCircle size={24} /> Skoro! Tačan odgovor je #{currentQ.correct + 1}
                      </>
                    )}
                  </div>
                  <div className="feedback-explain">
                    <MathText text={currentQ.explain} />
                  </div>
                </div>
                <button
                  className={`btn-3d ${isCorrect ? 'btn-green' : 'btn-red'}`}
                  onClick={handleNextQuiz}
                >
                  {qIdx + 1 < quiz.length ? 'NASTAVI' : 'ZAVRŠI'}
                </button>
              </div>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
