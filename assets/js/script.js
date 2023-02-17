var titleCard = document.getElementById("title-card");
var textCard = document.getElementById("text-card");
var startBtn = document.querySelector("#start-btn"); 
var timerDisplay = document.querySelector(".timer-display");
var badgesCard = document.getElementById("badges-card");
var currentQuestion = {};
var timer;
var timerCount;
var dangerColor = "";
var score = 0;

//create a questions array containing question objects.
var questionArray = [
    {question: "Commonly used data types DO Not Include:", 
    solution: "3. alerts",
    ans1: "1. strings",
    ans2: "2. booleans", 
    ans3: "3. alerts", 
    ans4: "4. numbers"},
    {question: "The condition in an if / else statement is enclosed with ______.", 
    solution: "3. parenthesis", 
    ans1: "1. quotes", 
    ans2: "2. curly brackets", 
    ans3: "3. parenthesis", 
    ans4: "4. square brackets"},
    {question: "Arrays in JavaScript can be used to store ______.",  
    solution: "4. all of the above",
    ans1: "1. numbers and strings", 
    ans2: "2. other arrays", 
    ans3: "3. booleans", 
    ans4: "4. all of the above"},
    {question: "String values must be enclosed within ______ when being assigned to variables.",  
    solution: "3. quotes",
    ans1: "1. commas", 
    ans2: "2. curly brackets", 
    ans3: "3. quotes", 
    ans4: "4. parenthesis"},
    {question: "A very useful tool used during development and debugging for printing content to the debugger is:",  
    solution: "4. console.log",
    ans1: "1. JavaScript", 
    ans2: "2. terminal/bash", 
    ans3: "3. for loops", 
    ans4: "4. console.log"}
];

//while additional questions are unanswered, load another
function selectNextQuestion() {
    console.log("Current Score is:", score);
    //make sure we have additional questions    
    if (questionArray.length <= 0){
        console.log("Game Over, Out of Questions");
        timerCount = 1;
        //go to final page
    }
    else {
        //grab a question from end of array and set to currentQuestion
        currentQuestion = questionArray.pop();
        createQuestion();
    }
}

//using the current question, create a question screen
function createQuestion() {
    //overwrite titleCard to have new Question
    titleCard.textContent = currentQuestion.question;
    //set text card style to answer buttons
    textCard.setAttribute("class", "sec-quest");
    //wipe previous text card content
    textCard.textContent = "";
    //create questions
    var arrayOfAnswers = Object.entries(currentQuestion);
    //create the answer buttons
    for (var i=2; i < arrayOfAnswers.length; i++) {
        var currentAnswer = document.createElement("div");
        currentAnswer.textContent = arrayOfAnswers[i][1];
        // console.log(arrayOfAnswers[i][1]);
        currentAnswer.setAttribute("class", "btn");
        textCard.appendChild(currentAnswer);
    }

    //add eventListeners to answer buttons
    for (var j=0; j<4; j++) {
        textCard.children[j].addEventListener("click", function(){
            // console.log("button clicked was:", this.textContent);
            //check clicked answer vs solution
            var currentBadge = document.createElement("div");
            if (this.textContent === currentQuestion.solution){
                console.log("Correct!");
                //create correct badge
                currentBadge.textContent = "Correct!";
                currentBadge.setAttribute("id", "correct");
                score = score+10;
            }
            else {
                console.log("Incorrect.");
                //penalize time
                timerCount = timerCount-5;
                //create incorrect badge
                currentBadge.textContent = "Incorrect.";
                currentBadge.setAttribute("id", "incorrect");
                score = score-5;
            }
            badgesCard.appendChild(currentBadge);
            //move along to next question, if any
            selectNextQuestion();
        });
    }

}

function startTimer() {
    timer = setInterval(function() {
        timerCount--;
        timerDisplay.textContent = timerCount;
        if (timerCount <= 0) {
            clearInterval(timer);
            //endGame    
            console.log("Game Over, Timer Expired");
        }
        //start counter effect
        colorBooster = 236-(timerCount*8); //
        dangerColor = "rgb("+colorBooster+", 0, 0);"; //
        // console.log(dangerColor);
        timerDisplay.setAttribute("style", "color:"+String(dangerColor));//
    }, 1000);
}

//add event listener to start button
startBtn.addEventListener("click", function() {
    timerCount = 30;
    startTimer();
    selectNextQuestion();
});



