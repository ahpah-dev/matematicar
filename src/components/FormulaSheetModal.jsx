import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { GRADES } from '../data/curriculum';
import MathText from './MathText';
import CatMascot from './CatMascot';

export default function FormulaSheetModal({ onClose, onOpenTopic }) {
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState(0);

  const q = query.trim().toLowerCase();

  return (
    <div className="lesson-overlay" role="dialog" aria-modal="true">
      <div className="sheet-modal">
        <header className="sheet-header">
          <div className="sheet-title-wrap">
            <CatMascot mood="teacher" size={56} />
            <div>
              <h2>Macin Šalabahter (Sve formule)</h2>
              <p>Brz pregled svih formula od 1. do 4. razreda gimnazije</p>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Zatvori">
            <X size={24} />
          </button>
        </header>

        <div className="sheet-controls">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Pretraži formule (npr. Pitagora, sinus, integral, parabola...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grade-pills-mini">
            <button
              className={`widget-pill ${gradeFilter === 0 ? 'active' : ''}`}
              onClick={() => setGradeFilter(0)}
            >
              Svi razredi
            </button>
            {GRADES.map((g) => (
              <button
                key={g.id}
                className={`widget-pill ${gradeFilter === g.id ? 'active' : ''}`}
                onClick={() => setGradeFilter(g.id)}
              >
                {g.id}. razred
              </button>
            ))}
          </div>
        </div>

        <div className="sheet-body">
          {GRADES.filter((g) => gradeFilter === 0 || g.id === gradeFilter).map((grade) => {
            const matchingTopics = grade.topics.filter((t) => {
              if (!q) return true;
              const hay =
                t.title.toLowerCase() +
                ' ' +
                (t.formulas || []).map((f) => f.label.toLowerCase() + ' ' + f.tex.toLowerCase()).join(' ');
              return hay.includes(q);
            });

            if (matchingTopics.length === 0) return null;

            return (
              <div key={grade.id} className="sheet-grade-section">
                <h3 className="sheet-grade-heading" style={{ color: grade.color }}>
                  {grade.title}
                </h3>
                <div className="sheet-grid">
                  {matchingTopics.map((topic) => (
                    <div key={topic.id} className="sheet-topic-card">
                      <div className="sheet-topic-head">
                        <strong>{topic.title}</strong>
                        <button
                          className="link-btn"
                          onClick={() => {
                            onClose();
                            onOpenTopic(topic, grade);
                          }}
                        >
                          Otvori lekciju →
                        </button>
                      </div>
                      <div className="sheet-formulas">
                        {(topic.formulas || []).map((f, idx) => (
                          <div key={idx} className="sheet-formula-row">
                            <span className="sf-label">{f.label}:</span>
                            <span className="sf-tex">
                              <MathText text={`$${f.tex}$`} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
