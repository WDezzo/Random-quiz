
const apiUrl = "https://the-trivia-api.com/v2/questions";
const quizContainer = document.getElementById("quiz-container");
const showAnswersButton = document.getElementById("show-answers-btn");
const tryAgainButton = document.getElementById("try-again-btn"); 

// <<<<<<<<start comment>>>>>>>>
// for testing the app offline
// let questions = [{"category":"arts_and_literature","id":"622a1c3d7cc59eab6f951c9b","correctAnswer":"Charles Dickens","incorrectAnswers":["Thomas Hardy","Jane Austen","Edgar Allen Poe"],"question":{"text":"Who was the author of 'A Christmas Carol'?"},"tags":["literature","christmas","arts_and_literature"],"type":"text_choice","difficulty":"easy","regions":[],"isNiche":false},{"category":"geography","id":"622a1c357cc59eab6f94ffe9","correctAnswer":"Yamagata","incorrectAnswers":["Ōsaka","Kyoto","Yokohama"],"question":{"text":"Which city used to be called Takase?"},"tags":["cities","geography"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false},{"category":"music","id":"622a1c387cc59eab6f950b18","correctAnswer":"Spice Girls","incorrectAnswers":["Editors","Cradle of Filth","The Sweet"],"question":{"text":"Which band includes 'Melanie Brown'?"},"tags":["music"],"type":"text_choice","difficulty":"medium","regions":[],"isNiche":false},{"category":"music","id":"625063b5e12f6dec240bdf7c","correctAnswer":"a-ha","incorrectAnswers":["Biz Markie","Haddaway","Bobby McFerrin"],"question":{"text":"Who had a hit in 1985 with Take on Me?"},"tags":["songs","one_hit_wonders","1980's","music"],"type":"text_choice","difficulty":"medium","regions":[],"isNiche":false},{"category":"food_and_drink","id":"625007270d86c8f685d80f18","correctAnswer":"Tubular pasta","incorrectAnswers":["Ribbon pasta","Strand pasta","Stuffed pasta"],"question":{"text":"What type of pasta is ziti?"},"tags":["food","italy","food_and_drink"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false},{"category":"general_knowledge","id":"622a1c357cc59eab6f94fc70","correctAnswer":"Lollygag","incorrectAnswers":["Hullaballoo","Sprunt","Collywobbles"],"question":{"text":"Which word is defined as 'to spend time aimlessly'?"},"tags":["words","general_knowledge"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false},{"category":"society_and_culture","id":"6495b50be831b1ab5aa11111","correctAnswer":"Air Force One","incorrectAnswers":["The Big One","US One","The Reagan Jet"],"question":{"text":"What is the name of the plane that carried the President of the United States?"},"tags":["aviation","usa","presidents","society_and_culture"],"type":"text_choice","difficulty":"easy","regions":[],"isNiche":false},{"category":"geography","id":"6237359acfe13103f55eb54b","correctAnswer":"Niger","incorrectAnswers":["New Zealand","Nepal","Netherlands"],"question":{"text":"Which region of the world uses '.ne' at the end of its web addresses?"},"tags":["the_internet","geography"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false},{"category":"geography","id":"622a1c357cc59eab6f94fe44","correctAnswer":"Greenland","incorrectAnswers":["Madagascar","Borneo","New Guinea"],"question":{"text":"What is the largest island in the world? "},"tags":["islands","records","geography"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false},{"category":"music","id":"622a1c387cc59eab6f950bb4","correctAnswer":"Dire Straits","incorrectAnswers":["Deep Purple","The Moody Blues","The Shadows"],"question":{"text":"Which British rock band released the song 'Money for Nothing'?"},"tags":["rock_music","music"],"type":"text_choice","difficulty":"hard","regions":[],"isNiche":false}];
// <<<<<<<<end comment>>>>>>>>

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
  quizContainer.innerHTML = ""; // Clear previous questions
  questions.forEach((question, index) => {
    const card = createQuestionCard(question, index);
    quizContainer.appendChild(card);
  });

  showAnswersButton.classList.remove("d-none");
  showAnswersButton.addEventListener("click", showAnswers);

  tryAgainButton.classList.remove("d-none");
  tryAgainButton.addEventListener("click", (event) => {
    event.preventDefault();
    correctAnswers = 0;
    quizContainer.innerHTML = ""; // Clear previous questions
    // showQuestions();
    fetchQuestions();
    showAnswersButton.disabled = false;
    tryAgainButton.disabled = true;
  });
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
    label.addEventListener("click", () => {
      if (!input.checked) {
        input.checked = true;
      }
    });
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
  tryAgainButton.disabled = false;
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

// showQuestions();
fetchQuestions();