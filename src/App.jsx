import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import {
  Flame,
  Gem,
  Heart,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Search,
  BookMarked,
  Zap,
  Check,
  Star,
  LayoutGrid,
  Route,
  Sparkles,
} from 'lucide-react';
import { GRADES, ALL_TOPICS, CAT_TIPS } from './data/curriculum';
import CatMascot from './components/CatMascot';
import MathText from './components/MathText';
import LessonModal from './components/LessonModal';
import FormulaSheetModal from './components/FormulaSheetModal';
import { soundFX } from './utils/sound';

const STORAGE_KEY = 'matematicar_state_v1';

const PATH_OFFSETS = [0, 58, 86, 58, 0, -58, -86, -58];

function getTopicIcon(name, size = 28) {
  const IconComp = Icons[name] || Icons.Sparkles;
  return <IconComp size={size} strokeWidth={2.5} />;
}

export default function App() {
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {
      xp: 0,
      streak: 1,
      hearts: 5,
      completed: {}, // { topicId: { stars: 3, bestAcc: 100 } }
      activeGrade: 1,
      sound: true,
      theme: 'light',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', saved.theme);
  }, [saved.theme]);

  const [activeLesson, setActiveLesson] = useState(null); // { topic, grade, isDaily }
  const [showFormulas, setShowFormulas] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('path'); // 'path' | 'grid'
  const [tipIndex, setTipIndex] = useState(0);
  const [catMood, setCatMood] = useState('happy');
  const [catBurst, setCatBurst] = useState(false);

  const activeGradeObj = useMemo(
    () => GRADES.find((g) => g.id === saved.activeGrade) || GRADES[0],
    [saved.activeGrade]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortTitle.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalCompletedCount = Object.keys(saved.completed).length;

  const handleSelectGrade = (gradeId) => {
    soundFX.click(saved.sound);
    setSaved((prev) => ({ ...prev, activeGrade: gradeId }));
    setSearchQuery('');
  };

  const handleOpenTopic = (topic, grade = activeGradeObj) => {
    soundFX.purr(saved.sound);
    setActiveLesson({ topic, grade, isDaily: false });
  };

  const handleStartDailyChallenge = () => {
    soundFX.purr(saved.sound);
    const pool = activeGradeObj.topics.flatMap((t) =>
      t.quiz.map((q) => ({ ...q, topicName: t.title }))
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    const dailyTopic = {
      id: `daily-g${activeGradeObj.id}`,
      title: `Brzi izazov: ${activeGradeObj.title}`,
      xp: 75,
      steps: [],
      formulas: [],
      quiz: shuffled,
    };
    setActiveLesson({ topic: dailyTopic, grade: activeGradeObj, isDaily: true });
  };

  const handlePetCat = () => {
    soundFX.purr(saved.sound);
    const moods = ['happy', 'cool', 'cheering', 'teacher'];
    setCatMood(moods[(tipIndex + 1) % moods.length]);
    setTipIndex((i) => (i + 1) % CAT_TIPS.length);
    setCatBurst(true);
    setTimeout(() => setCatBurst(false), 500);
    // Refill hearts if low when petting Maca!
    if (saved.hearts < 5) {
      setSaved((prev) => ({ ...prev, hearts: 5 }));
    }
  };

  const handleLoseHeart = () => {
    setSaved((prev) => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const handleCompleteLesson = (topicId, earnedXp, correct, total) => {
    const acc = total > 0 ? Math.round((correct / total) * 100) : 100;
    const stars = acc >= 95 ? 3 : acc >= 65 ? 2 : 1;
    setSaved((prev) => {
      const nextCompleted = { ...prev.completed };
      if (!topicId.startsWith('daily-')) {
        const old = nextCompleted[topicId];
        nextCompleted[topicId] = {
          stars: Math.max(old?.stars || 0, stars),
          bestAcc: Math.max(old?.bestAcc || 0, acc),
        };
      }
      return {
        ...prev,
        xp: prev.xp + earnedXp,
        hearts: Math.max(prev.hearts, 3),
        completed: nextCompleted,
      };
    });
  };

  const gradeCompletedCount = activeGradeObj.topics.filter(
    (t) => saved.completed[t.id]
  ).length;
  const gradeProgressPct = Math.round(
    (gradeCompletedCount / activeGradeObj.topics.length) * 100
  );

  // First uncompleted topic in current grade gets the "POČNI!" bounce
  const nextTopicId =
    activeGradeObj.topics.find((t) => !saved.completed[t.id])?.id ||
    activeGradeObj.topics[0].id;

  return (
    <div className="app-shell">
      {/* Left Navigation Sidebar */}
      <aside className="sidebar">
        <div
          className="brand"
          onClick={handlePetCat}
          role="button"
          tabIndex={0}
          title="Klikni macu!"
        >
          <div className="brand-cat-badge">
            <CatMascot mood="happy" size={44} />
          </div>
          <div>
            <div className="brand-name">Matematičar</div>
            <div className="brand-tag">Gimnazija 1–4</div>
          </div>
        </div>

        <nav className="side-nav" aria-label="Razredi">
          <div className="nav-section-label">Izaberi razred</div>
          {GRADES.map((g) => {
            const doneCount = g.topics.filter((t) => saved.completed[t.id]).length;
            const isActive = g.id === saved.activeGrade && !searchQuery;
            return (
              <button
                key={g.id}
                className={`nav-grade-btn ${isActive ? 'active' : ''}`}
                style={{ '--grade-color': g.color }}
                onClick={() => handleSelectGrade(g.id)}
              >
                <span className="grade-dot" style={{ background: g.color }}>
                  {g.id}
                </span>
                <span className="grade-btn-text">
                  <strong>{g.id}. razred</strong>
                  <small>
                    {doneCount}/{g.topics.length} oblasti
                  </small>
                </span>
              </button>
            );
          })}

          <div className="nav-section-label" style={{ marginTop: 18 }}>
            Alati
          </div>
          <button
            className="nav-tool-btn"
            onClick={() => {
              soundFX.click(saved.sound);
              setShowFormulas(true);
            }}
          >
            <BookMarked size={20} color="#1CB0F6" />
            <span>Macin Šalabahter</span>
          </button>

          <button className="nav-tool-btn" onClick={handleStartDailyChallenge}>
            <Zap size={20} color="#FF9600" />
            <span>Brzi izazov (+75 XP)</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="mini-toggle"
            onClick={() =>
              setSaved((p) => ({ ...p, sound: !p.sound }))
            }
            title="Zvuk"
          >
            {saved.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{saved.sound ? 'Zvuk uklj.' : 'Bez zvuka'}</span>
          </button>
          <button
            className="mini-toggle"
            onClick={() =>
              setSaved((p) => ({
                ...p,
                theme: p.theme === 'light' ? 'dark' : 'light',
              }))
            }
            title="Promeni temu"
          >
            {saved.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{saved.theme === 'light' ? 'Tamna' : 'Svetla'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <main className="main-area">
        {/* Top Bar: Search + Duolingo Stats */}
        <header className="top-bar">
          <div className="top-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Pretraži oblast (npr. polinomi, parabola, sinus, izvod...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Obriši pretragu"
              >
                ×
              </button>
            )}
          </div>

          <div className="stats-bar">
            <div className="stat-pill streak" title="Dnevni niz">
              <Flame size={20} fill="#FF9600" color="#FF9600" />
              <span>{saved.streak}</span>
            </div>
            <div className="stat-pill xp" title="Ukupno XP poena">
              <Gem size={20} fill="#1CB0F6" color="#1CB0F6" />
              <span>{saved.xp} XP</span>
            </div>
            <button
              className="stat-pill hearts"
              onClick={handlePetCat}
              title="Klikni da pomaziš macu i dopuniš srca!"
            >
              <Heart size={20} fill="#FF4B4B" color="#FF4B4B" />
              <span>{saved.hearts}</span>
            </button>
          </div>
        </header>

        {/* Mobile Grade Switcher */}
        <div className="mobile-grade-strip">
          {GRADES.map((g) => (
            <button
              key={g.id}
              className={`mobile-grade-pill ${saved.activeGrade === g.id ? 'active' : ''}`}
              style={{ '--grade-color': g.color }}
              onClick={() => handleSelectGrade(g.id)}
            >
              {g.id}. razred
            </button>
          ))}
          <button
            className="mobile-grade-pill formula-pill"
            onClick={() => setShowFormulas(true)}
          >
            Formule
          </button>
        </div>

        {/* Search Results Mode OR Grade Learning Path */}
        {searchQuery.trim() ? (
          <section className="search-results-wrap">
            <h2 className="section-heading">
              Rezultati pretrage ({searchResults.length})
            </h2>
            {searchResults.length === 0 ? (
              <div className="empty-search">
                <CatMascot mood="thinking" size={110} />
                <p>Mjau! Nisam našla tu oblast. Probaj: skupovi, koren, sinus, integral...</p>
              </div>
            ) : (
              <div className="topic-grid">
                {searchResults.map((t) => {
                  const done = saved.completed[t.id];
                  return (
                    <button
                      key={t.id}
                      className="grid-topic-card"
                      style={{ '--card-color': t.gradeColor }}
                      onClick={() =>
                        handleOpenTopic(
                          t,
                          GRADES.find((g) => g.id === t.gradeId)
                        )
                      }
                    >
                      <div className="gtc-top">
                        <span
                          className="gtc-icon"
                          style={{ background: t.gradeColor }}
                        >
                          {getTopicIcon(t.icon, 22)}
                        </span>
                        <span className="gtc-grade">{t.gradeId}. razred</span>
                      </div>
                      <h3>{t.title}</h3>
                      <p><MathText text={t.summary} /></p>
                      <div className="gtc-footer">
                        <span>+{t.xp} XP</span>
                        {done && <span className="done-tag">✓ Pređeno</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section className="path-canvas">
            {/* Duolingo-style Unit Header Banner */}
            <div
              className="unit-banner"
              style={{
                background: activeGradeObj.color,
                borderBottomColor: activeGradeObj.darkColor,
              }}
            >
              <div className="unit-banner-left">
                <div className="unit-kicker">{activeGradeObj.badge}</div>
                <h1>{activeGradeObj.title}</h1>
                <p>{activeGradeObj.subtitle}</p>
              </div>
              <div className="unit-banner-actions">
                <button
                  className="banner-btn"
                  onClick={() => {
                    soundFX.click(saved.sound);
                    setViewMode((v) => (v === 'path' ? 'grid' : 'path'));
                  }}
                >
                  {viewMode === 'path' ? (
                    <>
                      <LayoutGrid size={18} /> Mreža
                    </>
                  ) : (
                    <>
                      <Route size={18} /> Putanja
                    </>
                  )}
                </button>
                <button className="banner-btn" onClick={handleStartDailyChallenge}>
                  <Zap size={18} /> Kviz
                </button>
              </div>
              <div className="unit-progress-row">
                <div className="unit-progress-track">
                  <div
                    className="unit-progress-fill"
                    style={{ width: `${gradeProgressPct}%` }}
                  />
                </div>
                <span>
                  {gradeCompletedCount}/{activeGradeObj.topics.length} završeno
                </span>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="topic-grid">
                {activeGradeObj.topics.map((t, idx) => {
                  const done = saved.completed[t.id];
                  return (
                    <button
                      key={t.id}
                      className="grid-topic-card"
                      style={{ '--card-color': activeGradeObj.color }}
                      onClick={() => handleOpenTopic(t, activeGradeObj)}
                    >
                      <div className="gtc-top">
                        <span
                          className="gtc-icon"
                          style={{ background: activeGradeObj.color }}
                        >
                          {getTopicIcon(t.icon, 22)}
                        </span>
                        <span className="gtc-grade">Oblast {idx + 1}</span>
                      </div>
                      <h3>{t.title}</h3>
                      <p><MathText text={t.summary} /></p>
                      <div className="gtc-footer">
                        <span>+{t.xp} XP</span>
                        {done ? (
                          <span className="done-tag">★ {done.stars}/3</span>
                        ) : (
                          <span className="start-tag">Klikni →</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Winding Duolingo Path */
              <div className="winding-path">
                {activeGradeObj.topics.map((topic, idx) => {
                  const offset = PATH_OFFSETS[idx % PATH_OFFSETS.length];
                  const done = saved.completed[topic.id];
                  const isNext = topic.id === nextTopicId;

                  return (
                    <div key={topic.id} className="path-step-row">
                      {/* Decorative cat companion sitting along the trail */}
                      {idx === 1 && (
                        <div
                          className="path-cat-companion left"
                          onClick={handlePetCat}
                          title="Klikni macu Pitu!"
                        >
                          <CatMascot mood="teacher" size={105} />
                          <div className="mini-cat-note">Klikni bilo koju oblast!</div>
                        </div>
                      )}
                      {idx === 5 && (
                        <div
                          className="path-cat-companion right"
                          onClick={handlePetCat}
                          title="Klikni macu Pitu!"
                        >
                          <CatMascot mood="cool" size={105} />
                          <div className="mini-cat-note">Sve je preprosto! 🐾</div>
                        </div>
                      )}

                      <div
                        className="path-node-wrap"
                        style={{ transform: `translateX(${offset}px)` }}
                      >
                        {isNext && (
                          <div
                            className="start-bubble"
                            style={{ color: activeGradeObj.darkColor }}
                          >
                            {done ? 'PONOVI' : 'POČNI!'}
                          </div>
                        )}

                        <button
                          className={`path-node-btn ${done ? 'completed' : ''} ${
                            isNext ? 'is-next' : ''
                          }`}
                          style={{
                            '--node-bg': done ? '#FFC800' : activeGradeObj.color,
                            '--node-shadow': done
                              ? '#D4A100'
                              : activeGradeObj.darkColor,
                          }}
                          onClick={() => handleOpenTopic(topic, activeGradeObj)}
                          aria-label={`Otvori oblast: ${topic.title}`}
                        >
                          <span className="node-inner-icon">
                            {done ? (
                              <Check size={30} strokeWidth={3.5} />
                            ) : (
                              getTopicIcon(topic.icon, 28)
                            )}
                          </span>

                          {done && (
                            <span className="node-stars">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  fill={s <= done.stars ? '#FF9600' : '#E5E7EB'}
                                  color={s <= done.stars ? '#FF9600' : '#CBD5E1'}
                                />
                              ))}
                            </span>
                          )}
                        </button>

                        <button
                          className="node-label-pill"
                          onClick={() => handleOpenTopic(topic, activeGradeObj)}
                        >
                          <span className="node-num">{idx + 1}.</span> {topic.shortTitle}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* End-of-grade trophy */}
                <div className="path-finish-banner">
                  <CatMascot mood="cheering" size={96} />
                  <div>
                    <h3>Kraj {activeGradeObj.id}. razreda!</h3>
                    <p>
                      Pređi sve oblasti za zlatnu krunu ili pređi odmah na sledeći razred.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Right Mascot & Progress Panel */}
      <aside className="right-panel">
        <div
          className={`cat-corner-card ${catBurst ? 'burst' : ''}`}
          onClick={handlePetCat}
          role="button"
          tabIndex={0}
        >
          <div className="cat-corner-header">
            <span className="cat-badge">Maca Pita · Mentor</span>
            <span className="cat-tap-hint">Klikni me!</span>
          </div>
          <div className="cat-corner-body">
            <CatMascot mood={catMood} size={118} />
            <div className="cat-tip-bubble">
              <MathText text={CAT_TIPS[tipIndex]} />
            </div>
          </div>
        </div>

        <div className="progress-card">
          <h3>
            <Sparkles size={18} color="#FF9600" /> Tvoj napredak
          </h3>
          <div className="overall-stat">
            <span>Pređene oblasti</span>
            <strong>
              {totalCompletedCount} / {ALL_TOPICS.length}
            </strong>
          </div>
          <div className="grade-mini-bars">
            {GRADES.map((g) => {
              const cnt = g.topics.filter((t) => saved.completed[t.id]).length;
              const pct = Math.round((cnt / g.topics.length) * 100);
              return (
                <div
                  key={g.id}
                  className="mini-bar-row"
                  onClick={() => handleSelectGrade(g.id)}
                >
                  <div className="mini-bar-top">
                    <span>{g.id}. razred</span>
                    <span>
                      {cnt}/{g.topics.length}
                    </span>
                  </div>
                  <div className="mini-bar-track">
                    <div
                      className="mini-bar-fill"
                      style={{ width: `${pct}%`, background: g.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="challenge-card">
          <h3>Brzi kviz za {activeGradeObj.id}. razred</h3>
          <p>5 nasumičnih pitanja da proveriš znanje i uzmeš +75 XP!</p>
          <button
            className="btn-3d btn-orange full-width"
            onClick={handleStartDailyChallenge}
          >
            <Zap size={18} /> Pokreni izazov
          </button>
        </div>
      </aside>

      {/* Modals */}
      {activeLesson && (
        <LessonModal
          topic={activeLesson.topic}
          gradeColor={activeLesson.grade.color}
          gradeDarkColor={activeLesson.grade.darkColor}
          hearts={saved.hearts}
          onLoseHeart={handleLoseHeart}
          onComplete={handleCompleteLesson}
          onClose={() => setActiveLesson(null)}
          soundEnabled={saved.sound}
          isDailyChallenge={activeLesson.isDaily}
        />
      )}

      {showFormulas && (
        <FormulaSheetModal
          onClose={() => setShowFormulas(false)}
          onOpenTopic={(topic, grade) => handleOpenTopic(topic, grade)}
        />
      )}
    </div>
  );
}
