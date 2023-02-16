var titleCard = document.getElementById("title-card");
var textCard = document.getElementById("text-card");
var startBtn = document.querySelector("#start-btn"); //was querySelector
// var answerBtn = document.querySelector(".btn");
var currentQuestion = {};

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

//test function to get things started
function init (){
    console.log("The title is:", titleCard.children[0].textContent);

}

//while additional questions are unanswered, load another
function selectNextQuestion() {
    //make sure we have additional questions    
    if (questionArray.length <= 0){
        console.log("Out of questions");
        //go to final page
    }
    else {
        //grab a question from end of array and set to currentQuestion
        currentQuestion = questionArray.pop();
    }
    createQuestion();
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
        console.log(arrayOfAnswers[i][1]);
        currentAnswer.setAttribute("class", "btn");
        textCard.appendChild(currentAnswer);
    }

    //add eventListeners to answer buttons
    for (var j=0; j<4; j++) {
        textCard.children[j].addEventListener("click", function(){
            console.log("button clicked was:", this.textContent);
            //check clicked answer vs solution
            if (this.textContent === currentQuestion.solution){
                console.log("Correct!");
            }
            else {
                console.log("Incorrect.");
            }
            //move along to next question, if any
            selectNextQuestion();
        });
    }
    // textCard.children[1].addEventListener("click", function(){
    //     console.log("button clicked was:", textCard.children[1].textContent);
    // });
    // textCard.children[2].addEventListener("click", function(){
    //     console.log("button clicked was:", textCard.children[2].textContent);
    // });
    // textCard.children[3].addEventListener("click", function(){
    //     console.log("button clicked was:", textCard.children[3].textContent);
    // });

    // <div class="btn">1. strings</div>
    // <div class="btn">2. booleans</div>
    // <div class="btn">3. alerts</div>
    // <div class="btn">4. numbers</div>
}


//add event listener to start button
startBtn.addEventListener("click", function() {
    
    selectNextQuestion();
});


//start test function
init();

