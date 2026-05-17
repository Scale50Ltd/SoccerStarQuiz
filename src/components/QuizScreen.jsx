import { useState, useEffect, useRef } from 'react'
import { loadQuestions, getLoadedQuestions } from '../questionsLoader'
import { playCorrectSound, playWrongSound } from '../sounds'
import confetti from 'canvas-confetti'

const PRAISE = ['Stark! 💪', 'Treffer! 🎯', 'Weltklasse! 🌟', 'Tor! ⚽', 'Perfekt! ✨', 'Super! 🔥']
const ENCOURAGE = ['Knapp daneben! 😊', 'Kein Problem, weiter geht\'s! 💪', 'Nächstes Mal! 🍀', 'Fast! 😄']

const LEARNED_KEY = 'soccerStarLearned'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function shuffleAnswers(q) {
  const indices = [0, 1, 2, 3]
  const shuffled = shuffle(indices)
  return {
    ...q,
    answers: shuffled.map(i => q.answers[i]),
    correctIndex: shuffled.indexOf(q.correctIndex),
    _originalQuestion: q.question,
  }
}

function getLearned() {
  try { return JSON.parse(localStorage.getItem(LEARNED_KEY)) || {} } catch { return {} }
}

function saveLearned(data) {
  localStorage.setItem(LEARNED_KEY, JSON.stringify(data))
}

function pickQuestions(difficulty, allQuestions) {
  const all = allQuestions
  const learned = getLearned()
  const diffData = learned[difficulty] || { correct: [], wrong: [], wrongRound: 0 }

  // Questions answered correctly are "learned" - exclude them
  const correctSet = new Set(diffData.correct || [])
  // Wrong questions: only include if at least 2 rounds have passed since last wrong
  const wrongEntries = diffData.wrong || [] // [{idx, round}]
  const currentRound = (diffData.wrongRound || 0) + 1

  const available = []
  const wrongAvailable = []

  all.forEach((q, idx) => {
    if (correctSet.has(idx)) return // learned, skip
    const wrongEntry = wrongEntries.find(w => w.idx === idx)
    if (wrongEntry && (currentRound - wrongEntry.round) < 2) {
      // Too recent, skip for now
      return
    }
    if (wrongEntry) {
      wrongAvailable.push(idx)
    } else {
      available.push(idx)
    }
  })

  let pool = []
  // Prefer fresh questions, then include old wrong ones
  const fresh = shuffle(available)
  const oldWrong = shuffle(wrongAvailable)
  const combined = [...fresh, ...oldWrong]

  if (combined.length >= 10) {
    pool = combined.slice(0, 10)
  } else if (combined.length > 0) {
    pool = combined
  } else {
    // Almost all learned! Reset wrong questions
    pool = shuffle(wrongEntries.map(w => w.idx)).slice(0, 10)
  }

  // If still not enough (nearly all learned), show message and use wrong ones
  const allLearned = pool.length === 0

  // Save updated round
  learned[difficulty] = { ...diffData, wrongRound: currentRound }
  saveLearned(learned)

  const selectedQuestions = pool.map(idx => ({ ...all[idx], _idx: idx }))
  return { questions: selectedQuestions.map(shuffleAnswers), allLearned }
}

function markCorrect(difficulty, questionText) {
  const all = getLoadedQuestions(difficulty) || []
  const idx = all.findIndex(q => q.question === questionText)
  if (idx === -1) return

  const learned = getLearned()
  const diffData = learned[difficulty] || { correct: [], wrong: [], wrongRound: 0 }
  if (!diffData.correct.includes(idx)) {
    diffData.correct.push(idx)
  }
  diffData.wrong = (diffData.wrong || []).filter(w => w.idx !== idx)
  learned[difficulty] = diffData
  saveLearned(learned)
}

function markWrong(difficulty, questionText) {
  const all = getLoadedQuestions(difficulty) || []
  const idx = all.findIndex(q => q.question === questionText)
  if (idx === -1) return

  const learned = getLearned()
  const diffData = learned[difficulty] || { correct: [], wrong: [], wrongRound: 0 }
  // Update or add wrong entry with current round
  const existing = (diffData.wrong || []).find(w => w.idx === idx)
  if (existing) {
    existing.round = diffData.wrongRound || 0
  } else {
    diffData.wrong = [...(diffData.wrong || []), { idx, round: diffData.wrongRound || 0 }]
  }
  learned[difficulty] = diffData
  saveLearned(learned)
}

export default function QuizScreen({ difficulty, onComplete }) {
  const [roundQuestions, setRoundQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [allLearned, setAllLearned] = useState(false)
  const [jokersLeft, setJokersLeft] = useState(2)
  const [eliminated, setEliminated] = useState([])
  const [jokerUsedThisQuestion, setJokerUsedThisQuestion] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [loading, setLoading] = useState(true)
  const feedbackRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadQuestions(difficulty).then(allQ => {
      if (cancelled) return
      const { questions: picked, allLearned: done } = pickQuestions(difficulty, allQ)
      setRoundQuestions(picked)
      setAllLearned(done)
      setCurrent(0)
      setSelected(null)
      setAnswers([])
      setJokersLeft(2)
      setEliminated([])
      setJokerUsedThisQuestion(false)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [difficulty])

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="text-4xl mb-3 animate-bounce">⚽</div>
          <p className="text-gray-600 font-bold">Fragen werden geladen...</p>
        </div>
      </div>
    )
  }

  if (allLearned && roundQuestions.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Stark!</h2>
          <p className="text-gray-700">Du hast fast alle Fragen dieser Schwierigkeit gemeistert! Die falsch beantworteten kommen bald wieder.</p>
        </div>
      </div>
    )
  }

  if (roundQuestions.length === 0) return null

  const totalQuestions = Math.min(10, roundQuestions.length)
  const q = roundQuestions[current]
  const isAnswered = selected !== null
  const isCorrect = selected === q.correctIndex

  function handleAnswer(idx) {
    if (isAnswered) return
    setSelected(idx)
    const correct = idx === q.correctIndex
    if (correct) {
      playCorrectSound()
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })
      markCorrect(difficulty, q._originalQuestion)
      setFeedbackText(PRAISE[Math.floor(Math.random() * PRAISE.length)])
    } else {
      playWrongSound()
      markWrong(difficulty, q._originalQuestion)
      setFeedbackText(ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)])
    }
    setAnswers(prev => [...prev, { questionIndex: current, correct }])
  }

  function handleJoker() {
    if (jokersLeft <= 0 || jokerUsedThisQuestion || isAnswered) return
    // Find wrong answer indices (not the correct one)
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correctIndex)
    // Shuffle and pick 2 to eliminate
    const shuffled = wrongIndices.sort(() => Math.random() - 0.5)
    setEliminated([shuffled[0], shuffled[1]])
    setJokersLeft(prev => prev - 1)
    setJokerUsedThisQuestion(true)
  }

  function handleNext() {
    if (current + 1 >= totalQuestions) {
      // Use the full answers array (including current question which was already added)
      // answers state is updated by the time user clicks "Next" (separate event)
      const correctCount = answers.filter(a => a.correct).length
      onComplete({ correct: correctCount, total: totalQuestions, details: answers, questions: roundQuestions })
    } else {
      setCurrent(current + 1)
      setSelected(null)
      setEliminated([])
      setJokerUsedThisQuestion(false)
      setFeedbackText('')
    }
  }

  const labels = ['A', 'B', 'C', 'D']

  // Color themes per question — cycles through, never same as previous
  const THEMES = [
    { bg: 'from-blue-500 to-blue-600', card: 'bg-blue-50', bar: 'bg-blue-500', barText: 'text-white', badge: 'bg-blue-200 text-blue-800', btnBorder: 'border-blue-200', btnHover: 'hover:border-blue-400 hover:bg-blue-50', next: 'bg-blue-500 hover:bg-blue-600' },
    { bg: 'from-orange-400 to-orange-500', card: 'bg-orange-50', bar: 'bg-orange-500', barText: 'text-white', badge: 'bg-orange-200 text-orange-800', btnBorder: 'border-orange-200', btnHover: 'hover:border-orange-400 hover:bg-orange-50', next: 'bg-orange-500 hover:bg-orange-600' },
    { bg: 'from-purple-500 to-purple-600', card: 'bg-purple-50', bar: 'bg-purple-500', barText: 'text-white', badge: 'bg-purple-200 text-purple-800', btnBorder: 'border-purple-200', btnHover: 'hover:border-purple-400 hover:bg-purple-50', next: 'bg-purple-500 hover:bg-purple-600' },
    { bg: 'from-emerald-500 to-emerald-600', card: 'bg-emerald-50', bar: 'bg-emerald-500', barText: 'text-white', badge: 'bg-emerald-200 text-emerald-800', btnBorder: 'border-emerald-200', btnHover: 'hover:border-emerald-400 hover:bg-emerald-50', next: 'bg-emerald-500 hover:bg-emerald-600' },
    { bg: 'from-pink-500 to-pink-600', card: 'bg-pink-50', bar: 'bg-pink-500', barText: 'text-white', badge: 'bg-pink-200 text-pink-800', btnBorder: 'border-pink-200', btnHover: 'hover:border-pink-400 hover:bg-pink-50', next: 'bg-pink-500 hover:bg-pink-600' },
    { bg: 'from-cyan-500 to-cyan-600', card: 'bg-cyan-50', bar: 'bg-cyan-500', barText: 'text-white', badge: 'bg-cyan-200 text-cyan-800', btnBorder: 'border-cyan-200', btnHover: 'hover:border-cyan-400 hover:bg-cyan-50', next: 'bg-cyan-500 hover:bg-cyan-600' },
    { bg: 'from-amber-500 to-amber-600', card: 'bg-amber-50', bar: 'bg-amber-500', barText: 'text-white', badge: 'bg-amber-200 text-amber-800', btnBorder: 'border-amber-200', btnHover: 'hover:border-amber-400 hover:bg-amber-50', next: 'bg-amber-500 hover:bg-amber-600' },
    { bg: 'from-indigo-500 to-indigo-600', card: 'bg-indigo-50', bar: 'bg-indigo-500', barText: 'text-white', badge: 'bg-indigo-200 text-indigo-800', btnBorder: 'border-indigo-200', btnHover: 'hover:border-indigo-400 hover:bg-indigo-50', next: 'bg-indigo-500 hover:bg-indigo-600' },
  ]

  const theme = THEMES[current % THEMES.length]

  return (
    <div className="py-4">
      {/* Progress bar */}
      <div className={`${theme.bar} rounded-2xl px-5 py-3 mb-4 flex items-center justify-between shadow-md`}>
        <span className={`font-bold text-lg ${theme.barText}`}>Frage {current + 1} von {totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < current ? 'bg-white/80' : i === current ? 'bg-white ring-2 ring-white/50' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className={`rounded-3xl p-6 shadow-xl border-2 border-white/20 ${theme.card}`}>
        {/* Category badge */}
        {q.category && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${theme.badge}`}>
            {q.category}
          </span>
        )}

        <h2 className="text-xl font-bold text-gray-800 mb-4 leading-snug">{q.question}</h2>

        {/* 50:50 Joker button */}
        {!isAnswered && (
          <div className="mb-4">
            <button
              onClick={handleJoker}
              disabled={jokersLeft <= 0 || jokerUsedThisQuestion}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                jokersLeft > 0 && !jokerUsedThisQuestion
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-900 shadow-md hover:brightness-110 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              🃏 50:50 Joker ({jokersLeft} übrig)
            </button>
            {jokersLeft > 0 && !jokerUsedThisQuestion && (
              <span className="text-xs text-gray-500 ml-2">Entfernt 2 falsche Antworten</span>
            )}
          </div>
        )}

        <div className="space-y-3">
          {q.answers.map((answer, idx) => {
            const isEliminated = eliminated.includes(idx)
            let btnClass = `w-full text-left px-4 py-4 rounded-2xl font-semibold text-lg border-2 transition-all `

            if (isEliminated && !isAnswered) {
              btnClass += 'border-gray-200 bg-gray-100 opacity-30 line-through cursor-not-allowed'
            } else if (!isAnswered) {
              btnClass += `${theme.btnBorder} ${theme.btnHover} active:scale-[0.98]`
            } else if (idx === q.correctIndex) {
              btnClass += 'border-green-500 bg-green-100 text-green-800 ring-2 ring-green-300'
            } else if (idx === selected && !isCorrect) {
              btnClass += 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-300'
            } else {
              btnClass += 'border-gray-200 opacity-50'
            }

            return (
              <button
                key={idx}
                onClick={() => !isEliminated && handleAnswer(idx)}
                disabled={isEliminated}
                className={btnClass}
              >
                <span className={`inline-block w-9 h-9 rounded-full ${isEliminated ? 'bg-gray-300' : theme.bar} text-white text-center leading-9 mr-3 text-sm font-bold shadow-sm`}>
                  {labels[idx]}
                </span>
                {answer}
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <div ref={feedbackRef} className={`mt-5 p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'}`}>
            <p className="text-lg font-bold mb-1">
              {feedbackText}
            </p>
            <p className="text-gray-700">{q.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className={`w-full mt-4 py-4 ${theme.next} text-white text-lg font-bold rounded-2xl shadow-lg active:scale-95 transition-all`}
          >
            {current + 1 >= totalQuestions ? '🏁 Ergebnis anzeigen' : '➡️ Nächste Frage'}
          </button>
        )}
      </div>
    </div>
  )
}
