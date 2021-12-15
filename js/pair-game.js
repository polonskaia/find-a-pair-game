document.addEventListener('DOMContentLoaded', () => {
  const startWindow = document.querySelector('.start-wind');
  const input = document.querySelector('.number-input');
  const form = document.querySelector('.start-wind-form');

  const gameContainer = document.querySelector('.game-container');
  const cardArray = [];

  const mediaBigger1024 = window.matchMedia('(min-width: 1025px)');
  const media1024 = window.matchMedia('(max-width: 1024px)');
  const media768 = window.matchMedia('(max-width: 768px)');
  const media576 = window.matchMedia('(max-width: 576px)');
  const media475 = window.matchMedia('(max-width: 475px)');
  const media375 = window.matchMedia('(max-width: 375px)');

  const restartContainer = document.querySelector('.restart-container');
  const restartButton = document.querySelector('.restart-button');
  const restartInput = document.querySelector('.restart-input');

  const timerContainer = document.querySelector('.timer-container');
  const timer = document.querySelector('.timer-block');
  const playTime = 60;

  let card;
  let flippedCard = false;
  let blockCards = false;
  let firstFlippedCard;
  let secondFlippedCard;
  let timerNumber;
  timer.textContent = playTime;
  let intervalID;

  function checkMedia() {
    if (mediaBigger1024.matches) {
      gameContainer.classList.remove('game-container-1024');
    }

    if (media1024.matches) {
      gameContainer.classList.add('game-container-1024');
      gameContainer.classList.remove('game-container-768', 'game-container-576', 'game-container-475', 'game-container-375');
    }

    if (media768.matches) {
      gameContainer.classList.add('game-container-768');
      gameContainer.classList.remove('game-container-1024', 'game-container-576', 'game-container-475', 'game-container-375');
    }

    if (media576.matches) {
      gameContainer.classList.add('game-container-576');
      gameContainer.classList.remove('game-container-1024', 'game-container-768', 'game-container-475', 'game-container-375');
    }

    if (media475.matches) {
      gameContainer.classList.add('game-container-475');
      gameContainer.classList.remove('game-container-1024', 'game-container-768', 'game-container-576', 'game-container-375');
    }

    if (media375.matches) {
      gameContainer.classList.add('game-container-375');
      gameContainer.classList.remove('game-container-1024', 'game-container-768', 'game-container-576', 'game-container-475');
    }
  }

  checkMedia();

  function isAllFliped() {
    return document.querySelectorAll('.card').length === document.querySelectorAll('.card.flip').length
  }

  function startGameTimer() {
    intervalID = setInterval(() => {
      if (isAllFliped()) {
        clearInterval(intervalID);
        timer.textContent = playTime;
        timerNumber = playTime;
        return;
      }

      timerNumber = parseInt(timer.textContent);
      if (timerNumber > 0) {
        timer.textContent = timerNumber - 1;
      } else {
        timerContainer.classList.remove('visible-timer');
        timer.textContent = playTime;
        timerNumber = playTime;

        clearInterval(intervalID);
        restartGame();
      }
    }, 1000);
  }

  function getImageNumbers(numberUniqPict) {
    const imageNums = [];
    for (let i = 1; i <= numberUniqPict; i++ ) {
      imageNums.push(i);
      imageNums.push(i);
    }
    return imageNums.sort(() => Math.random() - 0.5);
  }

  function flipCard() {
    if (blockCards) return;

    if (this.classList.contains('flip')) return;

    this.classList.add('flip');

    if (!flippedCard) {
      firstFlippedCard = this;
      flippedCard = true;
      return;
    } else {
      flippedCard = false;
      secondFlippedCard = this;
    }

    compareCards();

    if (isAllFliped()) {
      restartGame();
      timerContainer.classList.remove('visible-timer');
    }
  }

  function compareCards() {
    if (firstFlippedCard.dataset.number === secondFlippedCard.dataset.number) {
      firstFlippedCard.removeEventListener('click', flipCard);
      secondFlippedCard.removeEventListener('click', flipCard);
    } else {
      blockCards = true;
      setTimeout(() => {
        firstFlippedCard.classList.remove('flip');
        secondFlippedCard.classList.remove('flip');
        blockCards = false;
      }, 1000);
    }
  }

  function restartGame() {
    restartContainer.classList.add('visible');
    document.querySelectorAll('.card').forEach(c => c.removeEventListener('click', flipCard));
  }

  function changeCardSize(v, card) {
    switch(v) {
      case 2:
        card.classList.add('card2');
        break;
      case 6:
        card.classList.add('card6');
        break;
      case 8:
        card.classList.add('card8');
        break;
      case 10:
        card.classList.add('card10');
        break;
    }
    return card;
  }

  function createCards(n) {
    const pictures = getImageNumbers(n/2);

    for(let i = 0; i < n; i++) {
      card = document.createElement('div');
      cardArray.push(card);

      const backImg = document.createElement('img');
      backImg.src = './img/card_back.png';
      backImg.classList.add('back-img');

      const frontImg = document.createElement('img');
      frontImg.src = `./img/${pictures[i]}.png`;
      frontImg.classList.add('front-img');

      card.classList.add('card');
      changeCardSize(Math.sqrt(n), card);
      card.setAttribute('data-number', `${pictures[i]}`);
      card.append(frontImg);
      card.append(backImg);
      gameContainer.append(card);

      card.addEventListener('click', flipCard);
    }
  }

  restartButton.addEventListener('click', () => {
    document.querySelectorAll('.card').forEach(c => c.remove());
    if (restartInput.value < 2 || restartInput.value > 10 || restartInput.value % 2 !== 0) {
      restartInput.value = 4;
    }

    setTimeout(createCards, 500, restartInput.value*restartInput.value);

    startGameTimer();

    restartInput.value = '';

    restartContainer.classList.remove('visible');
    timerContainer.classList.add('visible-timer');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value < 2 || input.value > 10 || input.value % 2 !== 0) {
      input.value = 4;
    }

    startWindow.classList.add('start-wind-close');

    setTimeout(createCards, 1000, input.value*input.value);

    timerContainer.classList.add('visible-timer');

    startGameTimer();
  });

  this.addEventListener('resize', () => {
    checkMedia();
  }, true);
});
