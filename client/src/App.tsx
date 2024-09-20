import './App.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import io from './socket'
import ReactTimeAgo from 'react-time-ago'

async function wait (millis:number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, millis)
  })
}

const quiz = [
  { word: 'voici', img: 'https://img.le-dictionnaire.com/voici-indiquer.jpg', herrings: ['voissi', 'voicy', 'voisit', 'voisi'] },
  { word: 'deux', img: 'https://img.freepik.com/photos-premium/numero-deux_2227-160.jpg', herrings: ['deu', 'deuz', 'deuex', 'de'] },
  { word: 'élève', img: 'https://www.education.gouv.fr/sites/default/files/styles/banner_1340x730/public/2020-02/evaluations-cp-29444.jpg?itok=iqI8ofTG', herrings: ['éléve', 'élèvee', 'éleve', 'élèv'] },
  { word: 'année', img: 'https://fr.calcuworld.com/wp-content/uploads/sites/5/2019/01/365-jours.jpg', herrings: ['anné', 'anée', 'hanée', 'ané'] },
  { word: 'école', img: 'https://img.freepik.com/vecteurs-libre/garcons-jouant-au-football-ecole_1308-28036.jpg', herrings: ['écolle', 'écol', 'éccole'] },
  { word: 'tableau', img: 'https://www.shutterstock.com/image-vector/empty-blackboard-blank-classboard-education-260nw-1061565734.jpg', herrings: ['tableux', 'tablaux', 'tablau', 'tablo'] },
  { word: 'maîtresse', img: 'https://media.sudouest.fr/7998123/1000x500/so-57eb8b7d66a4bd7760bbf31a-ph0.jpg?v=1420671600', herrings: ['maitresse', 'maittresse', 'maitesse', 'métres'] },
  { word: 'noter', img: 'https://www.cahier-effacable.fr/wp-content/uploads/2022/05/Bloc-note-numerique.jpg', herrings: ['notter', 'nooter', 'noterre', 'noté'] },
  { word: 'mot', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStC1CEVu1ark8QB-lDo9jBaXGGYU67sgtlag&s', herrings: ['motte', 'mott', 'mo', 'mote'] },
  { word: 'français', img: 'https://by.ambafrance.org/IMG/arton5049.jpg?1510666945', herrings: ['françai', 'fransé', 'francçais', 'fransé'] },
  { word: 'découvrir', img: 'https://media.idkids.fr/media/content/images/thumbs/0037145_900.jpeg', herrings: ['découvire', 'decourir', 'déccouvrir', 'découvrire'] },
  { word: 'nouvelle', img: 'https://c8.alamy.com/compfr/m6pyen/les-jeunes-parents-embrassant-leur-enfant-nouveau-ne-plein-d-amour-dessin-illustration-m6pyen.jpg', herrings: ['nouvel', 'nouvell', 'noovelle'] },
  { word: 'classe', img: 'https://www.lasalledesmaitres.com/wp-content/uploads/2018/10/travail-atelier-cycle2-cp-ce1-ce2.jpg', herrings: ['clace', 'cllasse', 'clacee', 'clas'] },
  { word: 'arriver', img: 'https://globalsymbols.com/uploads/production/image/imagefile/19471/17_19472_aa1d121d-b9a5-4421-a18e-32037cc85ecd.png', herrings: ['ariver', 'arivé'] },
  { word: 'dans', img: 'https://www.earnshaws.com/new/wp-content/uploads/baby-box.jpg', herrings: ['dan', 'dens', 'dants', 'dent'] },
  { word: 'copain', img: 'https://cache.magicmaman.com/data/photo/w1000_ci/1pe/enfant-betises.jpg', herrings: ['copaing', 'copin', 'copan', 'copun'] },
  { word: 'retrouver', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7wm6OnWEZq86JJPAZEkHBCriOZd-3Rh_ULA&s', herrings: ['retrouer', 'retrouveer', 'rétrouver'] },
  { word: 'le car', img: 'https://www.bihan.fr/scripts/files/6698d594de0fc6.93953572/bandeau.jpg', herrings: ['le qar', 'le carr', 'le cart', 'le kar'] },
  { word: 'la cour', img: 'https://www.radiofrance.fr/s3/cruiser-production/2018/09/551c2622-7583-4c84-afde-0eb5a87d4fe0/1200x680_gettyimages-952576466.jpg', herrings: ['la courre', 'la courr', 'la coor', 'la kour'] }
]

function speak (word: string) {
  // Create a SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(word)

  // Select a voice
  const voices = speechSynthesis.getVoices().filter(v => v.lang === 'fr-FR')
  utterance.voice = voices[Math.floor(Math.random() * voices.length)] // Choose a specific voice

  // Speak the text
  speechSynthesis.cancel()
  speechSynthesis.speak(utterance)
}

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function App () {
  const [quizIdx, setQuizIdx] = useState(0)
  const [question, setQuestion] = useState(quiz[0])
  const [state, setState] = useState('guessing')
  const [options, setOptions] = useState([])

  useEffect(() => {
    const q = quiz[quizIdx]
    setQuestion(q)
    setState('guessing')
    const opts = [
      { label: q.word, correct: true },
      ...q.herrings.map(word => ({ label: word, correct: false }))
    ]
    shuffle(opts)
    setOptions(opts)
    speak(q.word)
  }, [quizIdx])

  function handleClickImg () {
    speak(question.word)
  }

  function handleOptionClick (idx: number) {
    if (state === 'guessing') {
      setState('result')
    } else {
      setState('guessing')
      setQuizIdx((quizIdx + 1) % quiz.length)
    }
  }

  return (
    <div className='App'>

      <div onClick={() => handleClickImg()} className='img-container'>
        <img className='img' src={question.img} />
      </div>
      <div className='words-container'>
        {options.map((option, idx) => (
          <div key={idx} className='option-container'>
            <button
              onClick={() => handleOptionClick(idx)}
              className={`button-33 ${state === 'result' && !option.correct && 'wrong'}`}
              role='button'
            >
              {option.label}
            </button>
          </div>
        ))}
      </div>

      <div className='cat'>
        <div className='ear ear--left' />
        <div className='ear ear--right' />
        <div className='face'>
          <div className='eye eye--left'>
            <div className='eye-pupil' />
          </div>
          <div className='eye eye--right'>
            <div className='eye-pupil' />
          </div>
          <div className='muzzle' />
        </div>
      </div>

    </div>
  )
}

export default App
