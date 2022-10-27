const navLink = document.querySelector(".header__menu");
const menuLink = document.querySelector(".header__menu-item");
for (let i = 0; i < navLink.length; i++) {
  menuLink[i].addEventListener("click", function () {
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

const userURL = "https://project-1-api.herokuapp.com/comments/";

// this function send response to server and ask all information
function getComments() {
  axios
    .get(userURL + '?api_key="api_key":"3ee1c4f0-fe60-4286-8f27-da9b85a4cfa9')
    .then((response) => {
      console.log(response.data);
      render(response.data);
    });
}

getComments();

// this part convert date into the format dd/mm/yyyy

function convertData(myDate) {
  let date = new Date(myDate).toLocaleDateString("en-GB");
  return date;
}

//this block create elements, add classes

const commentSection = (dataObj, commentsContainer) => {
  const commentsItem = document.createElement("div");
  commentsItem.classList.add("comments");
  commentsItem.setAttribute("id", dataObj.id);

  const commentsLeft = document.createElement("div");
  commentsLeft.classList.add("comments__left");

  const commentsRight = document.createElement("div");
  commentsRight.classList.add("comments__right");

  const commentsImg = document.createElement("img");
  commentsImg.classList.add("comments__left--img");

  const commentsUser = document.createElement("h");
  commentsUser.classList.add("comments__right--user");

  commentsUser.innerText = dataObj.name;
  const commentsDate = document.createElement("p");
  commentsDate.classList.add("comments__right--date");
  commentsDate.innerText = convertData(dataObj.timestamp);

  const commentsText = document.createElement("p");
  commentsText.classList.add("comments__right--comment");
  commentsText.innerText = dataObj.comment;

  commentsItem.addEventListener("click", (event) => {
    console.log(event.target);
  });

  commentsItem.appendChild(commentsLeft);
  commentsItem.appendChild(commentsRight);
  commentsLeft.appendChild(commentsImg);
  commentsRight.appendChild(commentsUser);
  commentsRight.appendChild(commentsDate);
  commentsRight.appendChild(commentsText);
  commentsContainer.appendChild(commentsItem);
};

// this function clear section and iterate over comments elements

const render = (data) => {
  const sortedComments = data.sort(
    (commentOne, commentTwo) => commentTwo.timestamp - commentOne.timestamp //sorted comments
  );
  const commentsContainer = document.querySelector(".section");
  commentsContainer.innerHTML = ""; // cleared section
  for (let i = 0; i < sortedComments.length; i++) {
    commentSection(sortedComments[i], commentsContainer); // iterated over comments
  }
};

// this function submit form

const addComment = (event) => {
  event.preventDefault();
  const commenterName = event.target.userName.value;
  const commentText = event.target.userComment.value;

  if (!commenterName) {
    showError("Please, provide your name"); // did the validation
    return;
  }
  if (!commentText) {
    showError("Please, provide your comment");
    return;
  } else if (commentText === "Add a new comment") {
    showError("Please, provide your personal comment");
    return;
  }

  axios // send body
    .post(
      userURL + '?api_key="api_key":"3ee1c4f0-fe60-4286-8f27-da9b85a4cfa9',
      {
        name: commenterName,
        comment: commentText,
      }
    )
    .then((response) => {
      console.log(response.data);
    });

  getComments(); // called function with comments to add response
  // clear everything from the form
  event.target.reset();
};

const commentForm = document.querySelector(".form");
commentForm.addEventListener("submit", addComment);

const clearError = (inputField, addError) => {
  inputField.removeChild(addError);
  //inputField.classList.remove("comment__error");
  inputField.classList.remove("comment__input--error");
};

const showError = (errorMessage) => {
  const formRight = document.querySelector(".form__right");
  const inputField = document.createElement("div");
  inputField.classList.add("comment__input--error");
  const addError = document.createElement("p");
  addError.textContent = errorMessage;
  inputField.appendChild(addError);
  formRight.appendChild(inputField);

  setTimeout(() => clearError(inputField, addError, formRight), 2000);
};
