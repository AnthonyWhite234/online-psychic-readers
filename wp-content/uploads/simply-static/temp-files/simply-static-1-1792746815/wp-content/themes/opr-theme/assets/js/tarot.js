/* Інтерактивні розклади: повна колода, вибір карт і локальні тлумачення. */
(function () {
  'use strict';

  const root = document.getElementById('tarot-reading');
  if (!root) return;

  const spreads = {
    day: { title: 'Card of the day', detail: 'One card for a mindful moment today.', positions: ['Today’s focus'] },
    yesno: { title: 'Yes or no', detail: 'A card to help you reflect on a focused question.', positions: ['A point to consider'] },
    choice: { title: 'Two choices', detail: 'See each option beside a possible next step.', positions: ['First option', 'Second option', 'What to consider'] },
    love: { title: 'Love', detail: 'Reflect on feelings, connection, and care.', positions: ['What you feel', 'What you need', 'A next step'] },
    relationship: { title: 'Relationship', detail: 'Make room for both perspectives.', positions: ['Your perspective', 'Their perspective', 'The connection'] },
    question: { title: 'Open question', detail: 'Explore a question from five angles.', positions: ['Where you are', 'What shapes this', 'What may help', 'What to release', 'A next step'] },
    month: { title: 'Month ahead', detail: 'One reflection for each coming week.', positions: ['Week one', 'Week two', 'Week three', 'Week four'] }
  };

  const major = [
    ['The Fool', '✧', 'A fresh start invites curiosity. Notice where a small step could open a new path.'],
    ['The Magician', '✦', 'You may already have useful tools. Consider how to put them to work.'],
    ['The High Priestess', '☾', 'Pause and listen to what you know quietly before seeking more noise.'],
    ['The Empress', '❀', 'Care, creativity, and patient growth deserve attention.'],
    ['The Emperor', '♜', 'Structure and clear boundaries may support your next decision.'],
    ['The Hierophant', '✣', 'A tradition, teacher, or shared value may offer perspective.'],
    ['The Lovers', '♡', 'Look closely at your values and the choice in front of you.'],
    ['The Chariot', '✺', 'Direction matters more than speed. Choose where to focus your energy.'],
    ['Strength', '♌', 'Gentle courage can help you meet a challenge without forcing it.'],
    ['The Hermit', '✶', 'A little solitude may clarify what outside voices cannot.'],
    ['Wheel of Fortune', '◉', 'Circumstances shift. Notice what you can adapt and what you can release.'],
    ['Justice', '⚖', 'Seek balance, facts, and accountability before deciding.'],
    ['The Hanged Man', '◇', 'A pause or different angle may reveal what effort alone cannot.'],
    ['Death', '✢', 'An ending can make room for a new chapter. Let change take its time.'],
    ['Temperance', '☯', 'A measured blend of patience and action may serve you best.'],
    ['The Devil', '⛓', 'Notice a habit or fear that limits your freedom to choose.'],
    ['The Tower', '⚡', 'When assumptions change, begin with what remains steady.'],
    ['The Star', '✧', 'Hope grows through small acts of trust and renewal.'],
    ['The Moon', '☾', 'Uncertainty is real. Give feelings space without treating them as facts.'],
    ['The Sun', '☼', 'Clarity and warmth are available. Notice what feels genuinely life giving.'],
    ['Judgement', '✺', 'Reflect on what you have learned and what calls for a response.'],
    ['The World', '◎', 'A cycle may be coming together. Honour the work that brought you here.']
  ];
  const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
  const rankIdeas = [
    'a beginning worth noticing', 'balance between two needs', 'collaboration and shared effort',
    'a foundation you can rely on', 'a challenge asking for care', 'support and a change in perspective',
    'patience while you assess progress', 'steady movement and practice', 'what is nearing completion',
    'the weight and reward of a full cycle', 'curiosity and a new message', 'action guided by purpose',
    'calm understanding and care', 'responsibility and mature direction'
  ];
  const suits = [
    { name: 'Wands', icon: '✺', theme: 'energy, creativity, and initiative' },
    { name: 'Cups', icon: '♡', theme: 'feelings, relationships, and intuition' },
    { name: 'Swords', icon: '✦', theme: 'thought, communication, and decisions' },
    { name: 'Pentacles', icon: '◇', theme: 'work, resources, and practical life' }
  ];
  const hopefulMajor = new Set([0, 1, 3, 6, 7, 8, 10, 14, 17, 19, 20, 21]);
  const cautiousMajor = new Set([9, 12, 13, 15, 16, 18]);
  const hopefulRanks = new Set([0, 2, 3, 5, 8, 9, 12, 13]);
  const cautiousRanks = new Set([4, 6, 7]);
  const deck = major.map((item, index) => ({ name: item[0], icon: item[1], meaning: item[2], number: String(index).padStart(2, '0'), family: 'MAJOR ARCANA', tone: hopefulMajor.has(index) ? 'hopeful' : cautiousMajor.has(index) ? 'cautious' : 'open' }));
  suits.forEach((suit) => ranks.forEach((rank, index) => deck.push({
    name: `${rank} of ${suit.name}`,
    icon: suit.icon,
    meaning: `This card connects ${suit.theme} with ${rankIdeas[index]}. Ask how that theme shows up in your situation.`,
    number: String(index + 1).padStart(2, '0'),
    family: suit.name.toUpperCase(),
    tone: hopefulRanks.has(index) ? 'hopeful' : cautiousRanks.has(index) ? 'cautious' : 'open'
  })));

  const ui = {
    intro: document.getElementById('opr-reading-intro'),
    app: document.getElementById('opr-reading-app'),
    name: document.getElementById('opr-reading-name'),
    description: document.getElementById('opr-reading-description'),
    step: document.getElementById('opr-reading-step'),
    status: document.getElementById('opr-reading-status'),
    questionWrap: document.getElementById('opr-question-wrap'),
    choiceWrap: document.getElementById('opr-choice-wrap'),
    question: document.getElementById('opr-question'),
    firstChoice: document.getElementById('opr-choice-a'),
    secondChoice: document.getElementById('opr-choice-b'),
    shuffle: document.getElementById('opr-shuffle'),
    reset: document.getElementById('opr-reading-reset'),
    deckStage: document.getElementById('opr-deck-stage'),
    cardDeck: document.getElementById('opr-card-deck'),
    selected: document.getElementById('opr-selected-cards'),
    count: document.getElementById('opr-draw-count'),
    result: document.getElementById('opr-reading-result'),
    resultTitle: document.getElementById('opr-result-title'),
    resultQuestion: document.getElementById('opr-result-question'),
    resultCards: document.getElementById('opr-result-cards')
  };
  let current = null;
  let shuffled = [];
  let picked = [];

  function randomIndex(max) {
    if (!window.crypto || !window.crypto.getRandomValues) return Math.floor(Math.random() * max);
    const limit = Math.floor(4294967296 / max) * max;
    const value = new Uint32Array(1);
    do { window.crypto.getRandomValues(value); } while (value[0] >= limit);
    return value[0] % max;
  }

  function shuffleDeck() {
    const items = deck.slice();
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = randomIndex(i + 1);
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function setStatus(message) { ui.status.textContent = message; }

  function chooseReading(key) {
    current = spreads[key];
    if (!current) return;
    shuffled = [];
    picked = [];
    ui.intro.hidden = true;
    ui.app.hidden = false;
    ui.deckStage.hidden = true;
    ui.result.hidden = true;
    ui.shuffle.hidden = false;
    ui.question.value = '';
    ui.firstChoice.value = '';
    ui.secondChoice.value = '';
    ui.name.textContent = current.title;
    ui.description.textContent = current.detail;
    ui.step.textContent = '01';
    ui.questionWrap.hidden = key === 'day';
    ui.choiceWrap.hidden = key !== 'choice';
    ui.cardDeck.replaceChildren();
    ui.selected.replaceChildren();
    ui.resultCards.replaceChildren();
    setStatus(`Ready to begin: ${current.title}.`);
    root.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function updateCount() {
    const remaining = current.positions.length - picked.length;
    ui.count.textContent = remaining === 1 ? 'Choose 1 more card' : `Choose ${remaining} more cards`;
    setStatus(ui.count.textContent);
  }

  function createBack(index) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'opr-card-back';
    button.dataset.position = String(index);
    button.style.setProperty('--card-index', String(Math.min(index, 20)));
    button.setAttribute('aria-label', `Choose face-down card ${index + 1}`);
    const emblem = document.createElement('span');
    emblem.setAttribute('aria-hidden', 'true');
    emblem.textContent = '✧';
    button.append(emblem);
    return button;
  }

  function makeFace(card, small) {
    const face = document.createElement('div');
    face.className = `opr-card-face${small ? ' opr-card-face--small' : ''}`;
    const number = document.createElement('span');
    number.className = 'opr-card-face__number';
    number.textContent = card.number;
    const symbol = document.createElement('span');
    symbol.className = 'opr-card-face__symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = card.icon;
    const family = document.createElement('span');
    family.className = 'opr-card-face__family';
    family.textContent = card.family;
    const name = document.createElement('strong');
    name.className = 'opr-card-face__name';
    name.textContent = card.name;
    face.append(number, symbol, family, name);
    return face;
  }

  function showResults() {
    ui.step.textContent = '03';
    ui.deckStage.hidden = true;
    ui.result.hidden = false;
    ui.resultTitle.textContent = current.title === 'Card of the day' ? 'Your card for today' : `Your ${current.title.toLowerCase()} reading`;
    const question = ui.question.value.trim();
    ui.resultQuestion.hidden = !question;
    ui.resultQuestion.textContent = question ? `Your question: “${question}”` : '';
    if (current === spreads.yesno) {
      const answer = picked[0].tone === 'hopeful' ? 'The card leans toward yes.' : picked[0].tone === 'cautious' ? 'The card asks for caution.' : 'The card leaves the answer open.';
      ui.resultTitle.textContent = answer;
    }
    picked.forEach((card, index) => {
      const article = document.createElement('article');
      article.className = 'opr-result-card';
      const position = document.createElement('p');
      position.className = 'opr-result-card__position';
      position.textContent = current.positions[index];
      const copy = document.createElement('div');
      const heading = document.createElement('h5');
      heading.textContent = card.name;
      const meaning = document.createElement('p');
      meaning.textContent = card.meaning;
      copy.append(position, heading, meaning);
      article.append(makeFace(card, false), copy);
      ui.resultCards.append(article);
    });
    setStatus(`Your ${picked.length} ${picked.length === 1 ? 'card is' : 'cards are'} revealed.`);
    ui.result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function pickCard(index, button) {
    if (!current || !shuffled.length || picked.length >= current.positions.length) return;
    const card = shuffled[index];
    if (!card || button.disabled) return;
    button.disabled = true;
    button.classList.add('is-picked');
    picked.push(card);
    const slot = document.createElement('div');
    slot.className = 'opr-picked-card';
    const label = document.createElement('span');
    label.textContent = current.positions[picked.length - 1];
    slot.append(makeFace(card, true), label);
    ui.selected.append(slot);
    if (picked.length === current.positions.length) {
      setStatus('All cards chosen. Revealing your reading.');
      window.setTimeout(showResults, 550);
    } else updateCount();
  }

  function beginShuffle() {
    if (!current) return;
    if (current === spreads.choice) {
      current.positions = [ui.firstChoice.value.trim() || 'First option', ui.secondChoice.value.trim() || 'Second option', 'What to consider'];
    }
    shuffled = shuffleDeck();
    picked = [];
    ui.step.textContent = '02';
    ui.shuffle.hidden = true;
    ui.result.hidden = true;
    ui.deckStage.hidden = false;
    ui.cardDeck.replaceChildren();
    ui.selected.replaceChildren();
    shuffled.forEach((_, index) => ui.cardDeck.append(createBack(index)));
    ui.cardDeck.classList.remove('is-shuffling');
    void ui.cardDeck.offsetWidth;
    ui.cardDeck.classList.add('is-shuffling');
    updateCount();
    ui.deckStage.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  document.querySelectorAll('[data-reading]').forEach((button) => button.addEventListener('click', () => chooseReading(button.dataset.reading)));
  ui.shuffle.addEventListener('click', beginShuffle);
  ui.reset.addEventListener('click', () => chooseReading(Object.keys(spreads).find((key) => spreads[key] === current)));
  ui.cardDeck.addEventListener('click', (event) => {
    const button = event.target.closest('.opr-card-back');
    if (button && ui.cardDeck.contains(button)) pickCard(Number(button.dataset.position), button);
  });
})();
