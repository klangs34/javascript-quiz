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
var minutes;
var index = 1;
var scores = [];
var setTimer;

function init() {
  questionEl.textContent = "";
  answersEl.textContent = "";
  startBtn.setAttribute('class', 'hide');
}

function startTimer() {
  setTimer = setInterval(function(){
    time.textContent = totalTime;
    totalTime--;
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

function displayGoBack() {
  var goBackBtn = document.createElement('button');
  goBackBtn.textContent = "Go Back";
  goBackBtn.addEventListener('click', function(){
    //start game over
    init();
    index = 1;
    time.textContent = 0;
    goBackBtn.setAttribute('class', 'hide');
    window.location.href = 'index.html';
  });
  var containerDiv = document.querySelector('.container');
  containerDiv.append(goBackBtn);
}

function showHighScores() {
  init();
  var ul = document.createElement('ul');
  var li = document.createElement('li');
  var div = document.createElement('div');
  var list = div.appendChild(ul);
  var highScores = localStorage.getItem('score');

  questionEl.textContent = "High Scores"

  highScores = JSON.parse(highScores);

  highScores.forEach((val, index) => {
    var listItems = list.appendChild(li);
    listItems.textContent = `${index + 1}.)  ${val.user} - ${val.score}`;
    questionEl.appendChild(listItems);
  })

  //display go back button and clear scores button
  displayGoBack();

}

//display score function
function displayScore() {
  //all done! - your final score is.. - enter initials
  questionEl.textContent = "All Done!"

  //create p tag to reveal final score
  var ptag = document.createElement('p');
  ptag.innerHTML = "Your final score is <span id='score'>100</span>";
  answersEl.appendChild(ptag);

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
    scores.push({
      user: userInitials.value,
      score: userScore.textContent
    });
    localStorage.setItem('score', JSON.stringify(scores));
    //show high score(s)
    showHighScores();

  })
  answersEl.appendChild(submitBtn);

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
    } else {
      console.log("wrong answer");
    }
  //increment the index to have the game move on to the next question
  if(index < questions.length) {
    index++;
    init();
    nextQuestion();
  } else {
    //clear timer
    clearInterval(setTimer);
    //initilize screen
    init();
    //display score
    displayScore();
  }
}

startBtn.addEventListener("click", function(e){
  e.preventDefault();
  startTimer();
  init();
  nextQuestion();
})


