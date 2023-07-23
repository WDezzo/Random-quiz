// API URL to fetch random questions
const apiUrl = "https://the-trivia-api.com/v2/questions";

// DOM elements
const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

let currentQuestion = {};

// Function to fetch a random question from the API
async function getQuestion(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    currentQuestion = data[0];
    showQuestion(currentQuestion);
  } catch (error) {
    console.error("Error fetching question:", error);
  }
}

// Function to display the current question and answer options
function showQuestion(data) {
  questionElement.textContent = data.question.text;
  console.log(data.question)
  answersElement.innerHTML = "";
  let answerList=[];
  for(let i=0; i<4; i++){
    i===0?answerList.push(data.correctAnswer):answerList.push(data.incorrectAnswers[i-1]);
  }
  answerList = answerList.sort((a, b) => 0.5 - Math.random());
  answerList.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("btn", "btn-light");
    button.addEventListener("click", checkAnswer);
    answersElement.appendChild(button);
  });
}

// Function to check the selected answer and provide feedback
function checkAnswer(event) {
  const selectedAnswer = event.target.textContent;
  const correctAnswer = currentQuestion.correctAnswer;

  if (selectedAnswer === correctAnswer) {
    event.target.classList.add("correct");
    showFeedback("Correct!", true);
  } else {
    event.target.classList.add("incorrect");
    showFeedback(`Incorrect! The correct answer is: ${correctAnswer}`, false);
  }

  // Disable all answer buttons after selection
  document.querySelectorAll("#answers button").forEach((button) => {
    button.disabled = true;
  });

  nextButton.style.display = "block";
  nextButton.addEventListener("click", nextQuestion);
}

// Function to show feedback after user selects an answer
function showFeedback(feedbackText, isCorrect) {
  const feedbackElement = document.createElement("div");
  feedbackElement.textContent = feedbackText;
  feedbackElement.classList.add("mt-3", "font-weight-bold", isCorrect ? "text-success" : "text-danger");
  quizContainer.appendChild(feedbackElement);
}

// Function to move to the next question
function nextQuestion() {
  // Enable all answer buttons and remove any highlighting
  document.querySelectorAll("#answers button").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "incorrect");
  });

  // Hide the feedback from the previous question
  nextButton.style.display = "none";
  quizContainer.removeChild(quizContainer.lastChild);

  // Fetch the next question
  getQuestion(apiUrl);
}

// Fetch the first question to start the quiz
getQuestion(apiUrl);
