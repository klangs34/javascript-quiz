var startBtn = document.getElementById("start");
var questionEl = document.getElementById("question");
var answersEl = document.getElementById('answers');
var time = document.getElementById('time');

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
  answersEl.textContent = "";
  startBtn.setAttribute('class', 'hide');
}

function init() {
  questionEl.textContent = `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
  Quae voluptatem ut, quos minima doloremque explicabo obcaecati voluptas placeat. Molestias, exercitationem!`
  answersEl.textContent = "";
  startBtn.setAttribute('class', 'show');
  var goBackBtn = document.getElementById('go-back');
  goBackBtn.setAttribute('style', '');
  goBackBtn.setAttribute('class', 'hide');
  var clearStorageBtn = document.getElementById('clear-storage');
  clearStorageBtn.setAttribute('class', 'hide');
}

function startTimer() {
  setTimer = setInterval(function(){
    time.textContent = totalTime;
    timeRemaining = totalTime--;
    if(totalTime <= 0) {
      clearInterval(setTimer);
    }
  }, 1000)
}

function formatMinutes() {
  minutes = Math.floor(totalTime / 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
}

function displayClearStorage() {
  var clearStorageBtn = document.createElement('button');
  clearStorageBtn.textContent = "Clear Scores";
  clearStorageBtn.setAttribute('id', 'clear-storage');
  clearStorageBtn.addEventListener('click', function(){
    localStorage.clear();
    answersEl.textContent = "";
  });
  var containerDiv = document.querySelector('.container');
  containerDiv.append(clearStorageBtn);
}

function displayGoBack() {
  var goBackBtn = document.createElement('button');
  goBackBtn.textContent = "Go Back";
  goBackBtn.setAttribute('style', 'display: inline;');
  goBackBtn.setAttribute('id', 'go-back');
  goBackBtn.addEventListener('click', function(){
    //start game over
    index = 1;
    time.textContent = 0;
    init();
    //window.location.href = 'index.html';
  });
  var containerDiv = document.querySelector('.container');
  containerDiv.append(goBackBtn);
}

function showHighScores() {
  reset();
  var highScores = localStorage.getItem('score');

  questionEl.textContent = "High Scores"

  highScores = JSON.parse(highScores);

  highScores.forEach((val, index) => {
    var li = document.createElement('li');
    li.setAttribute('key', index);
    li.textContent = `${index + 1}.)  ${val.user} - ${val.score}`;
    answersEl.appendChild(li);
  })

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
  //add event listener to button
  submitBtn.addEventListener('click', function(){
    //save score and initials to local storage
    var userScore = document.getElementById('score');
    var userInitials = document.getElementById('initials')
    //push score to score array
    if(localStorage.getItem('score')) {
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
  var countFalse = 0;
  var countTrue = 0;
  //determine the number of wrong entries
  isCorrect.forEach(val => {
    if (val === false) {
      countFalse++;
    } else {
      countTrue++;
    }
  })

  var penalty = countFalse * 15;
  yourScore = (countTrue / questions.length) * 100 + (timeRemaining - penalty);

  displayScore();
}

function displalyChoices() {
  for(var i=0; i<questions[index - 1].choices.length; i++) {
    //create button element with id and data-index attributes
    var buttonEl = document.createElement("button");
    buttonEl.setAttribute('data-index', i);
    buttonEl.setAttribute('id', 'btn-style');
    buttonEl.textContent = questions[index - 1].choices[i];

    //add event listener to button with callback that checks the selection to the answer
    buttonEl.addEventListener('click', function(e){
      e.preventDefault();
      var id = e.target.getAttribute('data-index');
      //record answer as right or wrong
      recordAnswer(id);
    })
    answersEl.appendChild(buttonEl);
  }
}

function nextQuestion() {
  //initialize game by displaying question and answer options
  questionEl.textContent = questions[index - 1].title;
  //set array for question answers
  displalyChoices();
}

function recordAnswer(id) {
  if(questions[index - 1].answer === questions[index - 1].choices[id]) {
      console.log("correct answer");
      isCorrect.push(true);
    } else {
      console.log("wrong answer");
      isCorrect.push(false);
    }
  //increment the index to have the game move on to the next question
  if(index < questions.length) {
    index++;
    reset();
    nextQuestion();
  } else {
    //clear timer
    clearInterval(setTimer);
    //initilize screen
    reset();
    //display score
    calculateScore();
  }
}

startBtn.addEventListener("click", function(e){
  e.preventDefault();
  startTimer();
  reset();
  nextQuestion();
})


