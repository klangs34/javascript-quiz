var questionEl = document.getElementById("question");
var answersEl = document.getElementById('answers');
var headerEl = document.getElementById('header');
var time = document.getElementById('time');
var highScoresEl = document.getElementById('high-scores');
var rightWrongEl = document.getElementById('right-wrong');

var questions = [
  {
    title: "Commonly used data types DO NOT include:",
    choices: ["strings", "booleans", "alerts", "numbers"],
    answer: "alerts"
  },
  {
    title: "The condition in an if / else statement is enclosed within ____.",
    choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
    answer: "parentheses"
  },
  {
    title: "What is the javascript DOM acronym?",
    choices: ["Document Object Model", "Department of Management", "Dominate Open Maps", "Devlopement of Models"],
    answer: "Document Object Model"
  },
  {
    title: "What is the ES2015 way to declare a variable that can be reassigned?",
    choices: ["var", "const", "let", "declare"],
    answer: "let"
  },
  {
    title: "Javascript supports native object creation",
    choices: ["true", "false"],
    answer: "false"
  }
];

var totalTime = 15 * questions.length;
var timeRemaining = 0;
var minutes;
var index = 1;
var isCorrect = [];
var scores = [];
var yourScore = 0;
var setTimer;

function reset() {
  questionEl.textContent = "";
  if (answersEl) {
    answersEl.textContent = "";
  }
}

function init() {
  questionEl.textContent = `This quiz will test your javascript skills.  The speed in which you can answer these questions correctly will impact your overall score! 
  You will be asked 5 challenging questions that you will need to answer correctly within the alotted time.  Good Luck!`

  if (answersEl) {
    answersEl.textContent = "";
  }

  //add start button
  var startBtn = document.createElement('button');
  startBtn.textContent = 'Start Quiz';
  startBtn.setAttribute('class', 'btn rounded-pill btn-info d-block m-3');
  startBtn.addEventListener("click", function (e) {
    e.preventDefault();
    startBtn.setAttribute('class', 'hide');
    startTimer();
    reset();
    nextQuestion();
  })
  headerEl.append(startBtn);
}

function endGame() {
  if (isCorrect.length > 0) {
    answersEl.textContent = "";
    calculateScore();
  } else {
    answersEl.textContent = "Time's up!  No Score Calculated";
  }
}

function startTimer() {
  totalTime = 15 * questions.length;
  setTimer = setInterval(function () {
    time.textContent = totalTime;
    timeRemaining = totalTime--;
    if (totalTime === 0) {
      time.textContent = 0;
      clearInterval(setTimer);
      endGame();
    }
  }, 1000)
}

function enforcePenalty() {
  totalTime = timeRemaining - 15;
}

function displayClearStorage() {

  if (!document.getElementById('clear-storage')) {
    var clearStorageBtn = document.createElement('button');
    clearStorageBtn.textContent = "Clear Scores";
    clearStorageBtn.setAttribute('id', 'clear-storage');
    clearStorageBtn.setAttribute('class', 'btn rounded-pill btn-info m-3')
    clearStorageBtn.addEventListener('click', function () {
      localStorage.clear();
      scores = [];
      answersEl.textContent = "";
    });
    var containerDiv = document.querySelector('.container');
    containerDiv.append(clearStorageBtn);
  } else {
    var showClearStorageBtn = document.getElementById('clear-storage');
    showClearStorageBtn.setAttribute('style', 'display: inline;');
  }
}

function displayGoBack() {

  if (!document.getElementById('go-back')) {
    var goBackBtn = document.createElement('button');
    goBackBtn.textContent = "Go Back";
    goBackBtn.setAttribute('style', 'display: inline;');
    goBackBtn.setAttribute('class', 'btn rounded-pill btn-info m-3');
    goBackBtn.setAttribute('id', 'go-back');
    goBackBtn.addEventListener('click', function () {
      //start game over
      index = 1;
      time.textContent = 0;
      //hide go back and clear storage button
      goBackBtn.setAttribute('style', 'display: none;');
      //goBackBtn.setAttribute('class', 'hide');
      var clearStorageBtn = document.getElementById('clear-storage');
      clearStorageBtn.setAttribute('style', 'display: none;');
      init();
    });
    var containerDiv = document.querySelector('.container');
    containerDiv.append(goBackBtn);
  } else {
    var showGoBackBtn = document.getElementById('go-back');
    showGoBackBtn.setAttribute('style', 'display: inline;');
  }
}

function showHighScores() {
  reset();
  var highScores = localStorage.getItem('score');

  questionEl.textContent = "View High Scores";
  headerEl.textContent = "";

  highScores = JSON.parse(highScores);

  if(highScores) {
    highScores.sort(function (a, b) {
      return b.score - a.score;
    });
  }

  if (highScores) {
    highScores.forEach((val, index) => {
      console.log(val)
      var div = document.createElement('div');
      div.setAttribute('key', index);
      div.textContent = `${index + 1}.)  ${val.user} - ${val.score}`;
      answersEl.appendChild(div);
    })
  }

  //display go back button and clear scores button
  displayGoBack();
  displayClearStorage()
}

//display score function
function displayScore() {
  //all done! - your final score is.. - enter initials
  questionEl.textContent = "All Done!"

  //create p tag to reveal final score
  var ptag = document.createElement('p');
  ptag.innerHTML = "Your final score is <span id='score'></span>";
  answersEl.appendChild(ptag);
  var score = document.getElementById('score');
  score.textContent = yourScore;

  //enter initials
  var inputTag = document.createElement('input');
  inputTag.setAttribute('id', 'initials');
  inputTag.setAttribute('placeholder', 'enter initials here');
  inputTag.setAttribute('style', 'display: inline;');
  answersEl.appendChild(inputTag);

  //create submit button
  var submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  submitBtn.setAttribute('class', 'btn rounded-pill btn-info d-block m-3');
  //add event listener to button
  submitBtn.addEventListener('click', function () {
    //save score and initials to local storage
    var userScore = document.getElementById('score');
    var userInitials = document.getElementById('initials')
    //push score to score array
    if (localStorage.getItem('score')) {
      //pare the string
      scores = JSON.parse(localStorage.getItem('score'));
      scores.push({
        user: userInitials.value,
        score: userScore.textContent
      })
    } else {
      scores.push({
        user: userInitials.value,
        score: userScore.textContent
      });
    }
    localStorage.setItem('score', JSON.stringify(scores));
    //show high score(s)
    showHighScores();

  })
  answersEl.appendChild(submitBtn);

}

function calculateScore() {

  //yourScore = (countTrue / questions.length) * 100 + (timeRemaining - penalty);
  yourScore = timeRemaining;

  displayScore();
}

function displalyChoices() {
  for (var i = 0; i < questions[index - 1].choices.length; i++) {
    //create button element with id and data-index attributes
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute('data-index', i);
    buttonEl.setAttribute('id', 'btn-style');
    buttonEl.setAttribute('class', 'btn rounded-pill btn-info d-block m-3');
    buttonEl.textContent = questions[index - 1].choices[i];

    //add event listener to button with callback that checks the selection to the answer
    buttonEl.addEventListener('click', function (e) {
      e.preventDefault();
      var id = e.target.getAttribute('data-index');
      //record answer as right or wrong
      recordAnswer(id);
    })
    answersEl.appendChild(buttonEl);
  }
}

function nextQuestion() {
  //clear answer response
  rightWrongEl.textContent = "";
  //initialize game by displaying question and answer options
  questionEl.textContent = questions[index - 1].title;
  //set array for question answers
  displalyChoices();
}

function recordAnswer(id) {
  if (questions[index - 1].answer === questions[index - 1].choices[id]) {
    //console.log("correct answer");
    isCorrect.push(true);
    rightWrongEl.textContent = "Correct Answer!";
  } else {
    //console.log("wrong answer");
    rightWrongEl.textContent = "Wrong Answer!";
    isCorrect.push(false);
    enforcePenalty();
  }
  //increment the index to have the game move on to the next question
  if (index < questions.length) {
    index++;
    //provide 8/10ths of a second to see the answer response before moving on
    setTimeout(function () {
      reset();
      nextQuestion();
    }, 800)
  } else {
    //provide 8/10ths of a second to see the answer response before moving on
    setTimeout(function () {
      //clear answer response
      rightWrongEl.textContent = "";
      //clear timer
      clearInterval(setTimer);
      //initilize screen
      reset();
      //display score
      calculateScore();
    }, 800)
  }
}

highScoresEl.addEventListener('click', function () {
  showHighScores();
})

init();

