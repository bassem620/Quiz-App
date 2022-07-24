//select
let quiz = document.querySelector(".quiz");
let resultsSection = document.querySelector(".results");
let startSection = document.querySelector(".start");
let questionsArea = document.querySelector(".quiz .question-area");
let answersArea = document.querySelector(".quiz .answers-area");
let bulletsArea = document.querySelector(".quiz .lower .bullets");
let questionCount = document.querySelector(".quiz .title .count");
let submitBtn = document.querySelector(".quiz button");
let countdownArea = document.querySelector(".quiz .lower .countdown");
let resultsBox = document.querySelector(".results .container .box");
let startBtn = document.querySelector(".start button");

//variables
let currentIndex = 0;
let rightAnsCount = 0;
let countdownInterval;

//Start
startBtn.onclick= () => {
    startSection.classList.remove("d-block");
    startSection.classList.add("d-none");
    quiz.classList.remove("d-none");
    quiz.classList.add("d-block");
    getQuestions();
}

//Questions
function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionObj = JSON.parse(this.responseText);
            let questionsLength = questionObj.length;
            questionCount.innerHTML=`No. of questions : ${questionsLength}`;
            addQuestionData(questionObj[currentIndex],questionsLength);
            bullets(currentIndex,questionsLength);
            countdown(75,questionsLength);
            // Submit Button
            submitBtn.onclick = () => {
                let rightAns = questionObj[currentIndex].right_answer;
                checkAns(rightAns);
                currentIndex++;
                questionsArea.innerHTML="";
                answersArea.innerHTML="";
                addQuestionData(questionObj[currentIndex],questionsLength);
                handleBullets();
                clearInterval(countdownInterval);
                countdown(75,questionsLength);
                showResults(questionsLength);
            };
        }
    };
    myRequest.open("GET","questions.json",true);
    myRequest.send();
}

// Add Questions Data
function addQuestionData(obj,count){
    if(currentIndex < count){
        let questionH2 = document.createElement("h2");
        questionH2.className="question text-primary"
        let questionText = document.createTextNode(`Q${currentIndex+1}: ${obj.title}`);
        questionH2.appendChild(questionText);
        questionsArea.appendChild(questionH2);
        for(let i=1 ; i<=4 ; i++){
            let answerDiv = document.createElement("div");
            answerDiv.className="answer bg-light p-3";
            if(i==0){
                answerDiv.classList.add("rounded-top");
            }
            else if(i==4){
                answerDiv.classList.add("rounded-bottom");
            }
            let answerInput = document.createElement("input");
            answerInput.type="radio";
            answerInput.name="question";
            answerInput.id=`answer_${i}`;
            answerInput.dataset.answer=obj[`answer_${i}`];
            answerDiv.appendChild(answerInput);
            let answerLabel = document.createElement("label");
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            answerLabel.appendChild(labelText);
            answerLabel.for=`answer_${i}`;
            answerLabel.className="ms-2";
            answerDiv.appendChild(answerLabel);
            answersArea.appendChild(answerDiv);
        }  
        if(currentIndex=== (count-1)){
            submitBtn.innerHTML="Show Results";
        }
        else{
            submitBtn.innerHTML="Next";
        }
    }
}

//Bullets Function
function bullets(currentIndex,questionsLength){
    for(let i = 0 ; i < questionsLength ; i++){
        let bullet = document.createElement("span");
        if(i === 0){
            bullet.classList.add("on");
        }
        bulletsArea.appendChild(bullet);
    }
}

//Handle Bullets
function handleBullets(){
    let bulletSpans = document.querySelectorAll(".quiz .lower .bullets span");
    let bulletsArray = Array.from(bulletSpans);
    bulletsArray.forEach((span , index) => {
        if(currentIndex === index){
            span.className="on";
        }
    });
}

//Check Answer
function checkAns(rightAns){
    let answers = document.getElementsByName("question");
    let chosen;
    for(let i=0 ; i < answers.length ; i++){
        if(answers[i].checked){
            chosen = answers[i].dataset.answer;
        }
    }
    if(rightAns===chosen){
        rightAnsCount++;
    }
}

//Countdown Timer
function countdown(duration,count){
    if(currentIndex<count){
        let minutes , seconds;
        countdownInterval = setInterval(function (){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes<10 ? `0${minutes}` : minutes ;
            seconds = seconds<10 ? `0${seconds}` : seconds ;
            countdownArea.innerHTML=`${minutes}:${seconds}`;
            if(--duration<0){
                clearInterval(countdownInterval);
                countdownArea.innerHTML='';
                submitBtn.click();
            }
        },1000);
    }
}

//Show results
function showResults(questionsLength){
    let theResults;
    if(currentIndex===questionsLength){
        quiz.classList.add('d-none');
        if(rightAnsCount < (questionsLength/2)){
            let resultImg = document.createElement("img");
            resultImg.src="failed.jpg";
            resultImg.alt="Failed";
            resultImg.className="img-fluid";
            let rank = document.createElement("span");
            rank.innerHTML="Bad";
            rank.className="bad";
            let grade = document.createElement("span");
            grade.innerHTML=`${rightAnsCount} / ${questionsLength}`;
            let tryAgainBtn = document.createElement("button");
            tryAgainBtn.type="button";
            tryAgainBtn.className="btn btn-danger mt-2 w-100";
            tryAgainBtn.innerHTML="Try Again";
            tryAgainBtn.onclick = function (){
                currentIndex=0;
                rightAnsCount=0;
                bulletsArea.innerHTML='';
                clearInterval(countdownInterval);
                resultsBox.innerHTML='';
                resultsSection.classList.remove("d-block");
                resultsSection.classList.add("d-none");
                quiz.classList.remove('d-none');
                quiz.classList.add('d-block');
                getQuestions();
            }
            resultsBox.append(resultImg);
            resultsBox.append(rank);
            resultsBox.append(grade);
            resultsBox.append(tryAgainBtn);
        }
        else if((rightAnsCount >= (questionsLength/2)) && (rightAnsCount <= (questionsLength-2))){
            let resultImg = document.createElement("img");
            resultImg.src="success.png";
            resultImg.alt="Success";
            resultImg.className="img-fluid";
            let rank = document.createElement("span");
            rank.innerHTML="Good";
            rank.className="good";
            let grade = document.createElement("span");
            grade.innerHTML=`${rightAnsCount} / ${questionsLength}`;
            let msg = document.createElement("span");
            msg.innerHTML="Congratulations";
            msg.className="good fw-bold"; 
            resultsBox.append(resultImg);
            resultsBox.append(rank);
            resultsBox.append(grade);
            resultsBox.append(msg);
        }
        else{
            let resultImg = document.createElement("img");
            resultImg.src="success.png";
            resultImg.alt="Success";
            resultImg.className="img-fluid";
            let rank = document.createElement("span");
            rank.innerHTML="Excellent";
            rank.className="excellent";
            let grade = document.createElement("span");
            grade.innerHTML=`${rightAnsCount} / ${questionsLength}`;
            let msg = document.createElement("span");
            msg.innerHTML="Congratulations";
            msg.className="perfect fw-bold"; 
            resultsBox.append(resultImg);
            resultsBox.append(rank);
            resultsBox.append(grade);
            resultsBox.append(msg);
        }
        resultsSection.classList.remove("d-none");
        resultsSection.classList.add("d-block");
    }
}
