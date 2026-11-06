/* Мініквіз у статтях працює локально й не збирає даних користувача. */
(function () {
  'use strict';

  const quiz = document.querySelector('.opr-article-quiz');
  if (!quiz) return;

  const start = quiz.querySelector('[data-quiz-start]');
  const topicStep = quiz.querySelector('[data-quiz-step="topic"]');
  const depthStep = quiz.querySelector('[data-quiz-step="depth"]');
  const result = quiz.querySelector('[data-quiz-result]');
  const title = quiz.querySelector('[data-quiz-title]');
  const description = quiz.querySelector('[data-quiz-description]');
  let topic = '';

  const suggestions = {
    love: {
      quick: ['Love reading', 'A focused card can help you reflect on what matters most in this connection.'],
      deep: ['Relationship reading', 'Look at both perspectives and the connection between them.']
    },
    choice: {
      quick: ['Yes or no reading', 'Start with one card and a clear question about the choice ahead.'],
      deep: ['Two choices reading', 'Compare both options and a possible next step.']
    },
    growth: {
      quick: ['Card of the day', 'Take a short pause and notice a theme for today.'],
      deep: ['Open question reading', 'Explore where you are, what shapes this moment, and what may help.']
    }
  };

  function show(step) {
    start.hidden = step !== 'intro';
    topicStep.hidden = step !== 'topic';
    depthStep.hidden = step !== 'depth';
    result.hidden = step !== 'result';
    const heading = step === 'topic' ? topicStep.querySelector('h3') : step === 'depth' ? depthStep.querySelector('h3') : step === 'result' ? title : null;
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }

  start.addEventListener('click', function () { show('topic'); });
  quiz.querySelectorAll('[data-quiz-topic]').forEach(function (button) {
    button.addEventListener('click', function () {
      topic = button.dataset.quizTopic;
      show('depth');
    });
  });
  quiz.querySelectorAll('[data-quiz-depth]').forEach(function (button) {
    button.addEventListener('click', function () {
      const suggestion = suggestions[topic] && suggestions[topic][button.dataset.quizDepth];
      if (!suggestion) return;
      title.textContent = suggestion[0];
      description.textContent = suggestion[1];
      show('result');
    });
  });
  quiz.querySelector('[data-quiz-back]').addEventListener('click', function () { show('topic'); });
  quiz.querySelector('[data-quiz-reset]').addEventListener('click', function () {
    topic = '';
    title.textContent = '';
    description.textContent = '';
    show('intro');
    start.focus();
  });
}());
