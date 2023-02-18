//list of global variables
var titleCard = document.getElementById("title-card");
var textCard = document.getElementById("text-card");
var startBtn = document.getElementById("start-btn"); 
var timerDisplay = document.querySelector(".timer-display");
var badgesCard = document.getElementById("badges-card");
var currentQuestion = {};
var timer;
var timerCount;
var dangerColor = "";
var score = 0;
var gameRecs = [];

//create a questions array containing question objects.
var questionArray = [];

//restart the game to original settings
function restartGame() {
    //reset titleCard to original message
    titleCard.textContent = "";
    var restartH1 = document.createElement("h1");
    restartH1.textContent = "Coding Quiz Challenge";
    titleCard.appendChild(restartH1);

    //remove question class from text card section
    textCard.removeAttribute("class", "sec-quest");
    textCard.setAttribute("class", "sec-rules");
    //wipe previous text card content
    textCard.textContent = "";
    //create div with rules
    var rulesDiv = document.createElement("div");
    rulesDiv.textContent = "Answer these code-related questions in 30 seconds for 10 points each. Incorrect answers cost 5 points and reduce time by 5 seconds. Unused time will be added to your score.";
    textCard.appendChild(rulesDiv);
    var btnDiv = document.createElement("div");
    btnDiv.setAttribute("id", "start-btn");
    btnDiv.textContent = "Start Quiz";
    textCard.appendChild(btnDiv);
    startBtn = document.querySelector("#start-btn");
    init();
}

//display records from localStorage
function displayRecords () {
    //stop timer if it is still running
    clearInterval(timer);
    //get stored game records from localStorage
    var previousRecs = JSON.parse(localStorage.getItem("gameRecs"));
    
    //if game records available, update game array
    if (previousRecs != "[]") {
        gameRecs = previousRecs;
    }
    else {
        gameRecs = [];
    }

    //create record list screen
    titleCard.textContent = "High Scores";

    //remove previous content
    textCard.textContent = "";
    badgesCard.textContent = "";

    //set style of text card section to record list
    textCard.setAttribute("class", "sec-record");

    //add game records to list
    var initOrderedList = document.createElement("ol");
    initOrderedList.setAttribute("list-style", "1");
    for (var i=0; i<gameRecs.length; i++) {
        var initListItem = document.createElement("li");
        initListItem.textContent = gameRecs[i];
        initOrderedList.appendChild(initListItem);
    }
    textCard.appendChild(initOrderedList);
    
    //create buttons
    var scoreButtons = document.createElement("div");
    scoreButtons.setAttribute("class", "sec-badges");
    //create back button
    var backButton = document.createElement("button");
    backButton.setAttribute("class", "init-btn");
    backButton.setAttribute("id", "back-btn");
    backButton.textContent = "Go Back";
    scoreButtons.appendChild(backButton);
    //create clear button
    var clearButton = document.createElement("button");
    clearButton.setAttribute("class", "init-btn");
    clearButton.setAttribute("id", "clear-btn");
    clearButton.textContent = "Clear High Scores";
    scoreButtons.appendChild(clearButton);
    //event listener is handled below

    //attach buttons below to high score list
    textCard.appendChild(scoreButtons);
}

//store records
function storeRecords (newInitials) {
    var newRecord = newInitials+ " - " + String(score);
    // load previous records if any
    var previousRecs = JSON.parse(localStorage.getItem("gameRecs"));

    //if previous recs don't exist then make new array 
    if (!previousRecs || previousRecs == "[]") {
        gameRecs[0] = newRecord;
    }
    else {
        gameRecs = previousRecs;
        gameRecs.push(newRecord);
    }
    //record score
    localStorage.setItem("gameRecs", JSON.stringify(gameRecs));
}

//add event listener to record your initals form submission
textCard.addEventListener("click", function(event) {
    event.preventDefault();

    //check which button was clicked, if any
    var element = event.target;
    if (element.matches("#clear-btn")) {
        localStorage.setItem("gameRecs", JSON.stringify("[]")); 
        displayRecords();
    } 
    else if (element.matches("#back-btn")) { 
        restartGame();
    }
    else if (element.matches(".init-btn")) {
        var initFieldInput = document.querySelector("#user-initials").value;
        initFieldInput = initFieldInput.trim();

        //exit if no content
        if (initFieldInput === ""){
            return;
        }

        // var initText = initFieldInput.value.trim();
        storeRecords(initFieldInput);
        displayRecords ();
    }  
});

//display user's final score
function displayScore () {    
    //display user score
    titleCard.textContent = "All done!";
    var scoreText = ("Your final score is " + score + ".");
    textCard.textContent = scoreText;

    //create input form
    var initForm = document.createElement("form");
    initForm.setAttribute("id", "init-form");
    initForm.setAttribute("method", "POST");
    
    //collect user's name
    var initLabel = document.createElement("label");
    initLabel.setAttribute("for", "user-initials");
    initLabel.textContent = "Enter initials:";
    initForm.appendChild(initLabel);

    //add input field
    var initField = document.createElement("input")
    initField.setAttribute("type", "text");
    initField.setAttribute("name", "user-initials");
    initField.setAttribute("id", "user-initials");
    initForm.appendChild(initField);
   
    //add submit btn
    var initBtn = document.createElement("button");
    initBtn.textContent = "Submit";
    initBtn.setAttribute("class", "init-btn");
    initForm.appendChild(initBtn);

    //add completed form to text-area (textCard)
    textCard.appendChild(initForm);
}

//add event listeners to each button
function listenToAnswers () {
    //add eventListeners to answer buttons
    for (var j=0; j<4; j++) {
        textCard.children[j].addEventListener("click", function(){
            // console.log("button clicked was:", this.textContent);
            //check clicked answer vs solution
            var currentBadge = document.createElement("div");
            //handle correct answer
            if (this.textContent === currentQuestion.solution){
                //create correct answer badge
                currentBadge.textContent = "Correct!";
                currentBadge.setAttribute("id", "correct");
                score = score+10;
            }
            //handle incorrect answer
            else {
                //penalize time
                timerCount -= 5;
                //create incorrect answer badge
                currentBadge.textContent = "Incorrect.";
                currentBadge.setAttribute("id", "incorrect");
                score -= 5;
            }
            badgesCard.appendChild(currentBadge);
            //move along to next question, if any
            selectNextQuestion();
        });
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
        currentAnswer.setAttribute("class", "btn");
        textCard.appendChild(currentAnswer);
    }
    //add event listeners to new buttons
    listenToAnswers ();
}

//while additional questions are unanswered, load another
function selectNextQuestion () {
    //make sure we have additional questions    
    if (questionArray.length <= 0){
        //stop timer
        clearInterval(timer);
        //add remaining time to score
        score += timerCount;
        //go to final page
        displayScore();
    }
    else {
        //pop a question from end of array and set to currentQuestion
        currentQuestion = questionArray.pop();
        createQuestion();
    }
}

//create a timer when start button is clicked
function startTimer() {
    timer = setInterval(function() {
        timerCount--;
        timerDisplay.textContent = timerCount;
        if (timerCount <= 0) {
            clearInterval(timer);
            //endGame if time runs out
            displayScore();
        }
        //start counter red effect - what's a game without stress?
        colorBooster = 236-(timerCount*8); 
        dangerColor = "rgb("+colorBooster+", 0, 0);"; 
        timerDisplay.setAttribute("style", "color:"+String(dangerColor));
    }, 1000);
}

//(re)initialize game conditions
function init() {
    //(re)set variables
    timerCount = 30
    score = 0;
    timerDisplay.textContent = timerCount;
    timerDisplay.setAttribute("style", "color:black");

    questionArray = [
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

    //add event listener to start button
    startBtn.addEventListener("click", function() {
        startTimer();
        selectNextQuestion();
    });
}

//start initial conditions
init();