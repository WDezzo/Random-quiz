const apiUrl = "https://the-trivia-api.com/v2/questions";
const quizContainer = document.getElementById("quiz-container");
const showAnswersButton = document.getElementById("show-answers-btn");

let questions = [];
let correctAnswers = 0;

async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data;
    showQuestions();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function showQuestions() {
  questions.forEach((question, index) => {
    const card = createQuestionCard(question, index);
    quizContainer.appendChild(card);
  });

  showAnswersButton.classList.remove("d-none");
  showAnswersButton.addEventListener("click", showAnswers);
}

function createQuestionCard(question, index) {
  const card = document.createElement("div");
  card.classList.add("card", "mb-4");

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const questionElement = document.createElement("h5");
  questionElement.textContent = `${index + 1}. ${question.question.text}`;

  const answerList = document.createElement("ul");
  answerList.classList.add("list-unstyled");
  let listAnswer = [...question.incorrectAnswers, question.correctAnswer];
  listAnswer = listAnswer.sort((a, b) => 0.5 - Math.random());

  listAnswer.forEach((answer) => {
    const answerItem = document.createElement("li");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${index}`;
    input.value = answer;
    input.classList.add("form-check-input");
    answerItem.appendChild(input);
    
    const label = document.createElement("label");
    label.textContent = answer;
    label.classList.add("form-check-label");
    answerItem.appendChild(label);

    answerList.appendChild(answerItem);
  });

  cardBody.appendChild(questionElement);
  cardBody.appendChild(answerList);
  card.appendChild(cardBody);

  return card;
}

function showAnswers() {
  questions.forEach((question, index) => {
    const correctAnswer = question.correctAnswer;
    const card = quizContainer.children[index];
    const selectedAnswer = card.querySelector(`input[name="question-${index}"]:checked`);
    
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("mt-3", "font-weight-bold");

    if (selectedAnswer) {
      if (selectedAnswer.value === correctAnswer) {
        correctAnswers++;
        card.classList.add("correct");
        feedbackElement.textContent = "Correct!";
      } else {
        card.classList.add("incorrect");
        feedbackElement.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
      }
    } else {
      card.classList.add("unanswered");
      feedbackElement.textContent = `Unanswered! The correct answer is: ${correctAnswer}`;
    }

    card.appendChild(feedbackElement);
  });

  showAnswersButton.disabled = true;
  showResult();
}

function showResult() {
  const resultCard = document.createElement("div");
  resultCard.classList.add("card", "mb-4");

  const resultCardBody = document.createElement("div");
  resultCardBody.classList.add("card-body");

  const resultElement = document.createElement("p");
  resultElement.textContent = `You answered ${correctAnswers} out of ${questions.length} questions correctly. (${correctAnswers}/${questions.length})`;

  const commentElement = document.createElement("p");
  if (correctAnswers === questions.length) {
    commentElement.textContent = "Congratulations! You got all the answers right!";
  } else if (correctAnswers >= questions.length / 2) {
    commentElement.textContent = "Good job! You did well, but keep practicing!";
  } else {
    commentElement.textContent = "Too bad! Try again and improve your score!";
  }

  resultCardBody.appendChild(resultElement);
  resultCardBody.appendChild(commentElement);
  resultCard.appendChild(resultCardBody);

  quizContainer.appendChild(resultCard);
}

fetchQuestions();
