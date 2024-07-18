const form = document.querySelector(".form");
const postsContainer = document.getElementById("posts-container");
let posts = []; // Cюда сохраняем посты

// Получаем посты
function fetchPosts() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((response) => response.json())
    .then((data) => {
      posts = data.slice(0, 10); // Чтобы не было слишком много постов - ограничим
      renderPosts();
    })
    .catch((error) => console.error("Error fetching posts:", error)); // Ошитбки
}

// Чистим контейнер с постами
function clearPostsContainer() {
  while (postsContainer.firstChild) {
    postsContainer.removeChild(postsContainer.firstChild);
  }
}

// Отрисовываем посты
function renderPosts() {
  clearPostsContainer();
  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

// Создаем элемент поста
function createPostElement(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.dataset.id = post.id;

  // Заголовок
  const title = document.createElement("span");
  title.className = "post__title";
  title.textContent = post.title;

  // Тело поста
  const body = document.createElement("span");
  body.className = "post__body";
  body.textContent = post.body;

  // Кнопка редактировать
  const editButton = document.createElement("button");
  editButton.className = "post__edit-button";
  editButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"><g fill="#26AF74"><path fill="currentColor" d="M4 5H2v13h10v-2H4V5zm13.9-1.6l-1.3-1.3c-.4-.4-1.1-.5-1.6-.1l-1 1H5v12h9V9l4-4c.4-.5.3-1.2-.1-1.6zm-5.7 6l-2.5.9l.9-2.5L15 3.4L16.6 5l-4.4 4.4z"/></g></svg>`;
  editButton.onclick = () => editPost(postDiv);

  // Кнопка удалить
  const deleteButton = document.createElement("button");
  deleteButton.className = "post__delete-button";
  deleteButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"><g fill="#E8403E"><path fill="currentColor" d="M12 4h3c.6 0 1 .4 1 1v1H3V5c0-.6.5-1 1-1h3c.2-1.1 1.3-2 2.5-2s2.3.9 2.5 2zM8 4h3c-.2-.6-.9-1-1.5-1S8.2 3.4 8 4zM4 7h11l-.9 10.1c0 .5-.5.9-1 .9H5.9c-.5 0-.9-.4-1-.9L4 7z"/></g></svg>`;
  deleteButton.onclick = () => deletePost(post.id);

  postDiv.appendChild(title);
  postDiv.appendChild(body);
  postDiv.appendChild(editButton);
  postDiv.appendChild(deleteButton);

  return postDiv;
}

// Отправка формы
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = form.querySelector("#title").value;
  const body = form.querySelector("#body").value;

  const newPost = {
    title,
    body,
    userId: 1, // userId всегда = 1
  };

  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  })
    .then((response) => response.json())
    .then((data) => {
      posts.unshift(data);
      renderPosts();
      form.reset();
    })
    .catch((error) => console.error("Error adding post:", error)); // Если ошибки
});

// Редактируем пост
function editPost(postElement) {
  const postId = postElement.dataset.id;
  const title = postElement.querySelector(".post__title");
  const body = postElement.querySelector(".post__body");
  const editButton = postElement.querySelector(".post__edit-button");
  const deleteButton = postElement.querySelector(".post__delete-button");

  // Создаем поля ввода для редактирования
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = title.textContent;
  titleInput.className = "post__input-title";

  const bodyInput = document.createElement("textarea");
  bodyInput.value = body.textContent;
  bodyInput.className = "post__input-body";

  // Заменяем на поля ввода
  postElement.replaceChild(titleInput, title);
  postElement.replaceChild(bodyInput, body);

  // Меняем иконку
  editButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon"><g fill="#26AF74"><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8zm-.615 12.66h-1.34l-3.24-4.54l1.341-1.25l2.569 2.4l5.141-5.931l1.34.94l-5.811 8.381z"/></g></svg>`;
  editButton.className = "post__save-button";
  deleteButton.style.display = "none";

  editButton.onclick = () =>
    savePost(postElement, titleInput, bodyInput, postId);
}

// Сохраняем пост
function savePost(postElement, titleInput, bodyInput, postId) {
  const updatedPost = {
    title: titleInput.value,
    body: bodyInput.value,
  };

  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedPost),
  })
    .then((response) => response.json())
    .then((data) => {
      const index = posts.findIndex((post) => post.id === parseInt(postId));
      if (index !== -1) {
        posts[index] = { ...posts[index], ...data };
        renderPosts();
      }
    })
    .catch((error) => console.error("Error updating post:", error)); // Ошибки
}

// Удаляем пост
function deletePost(postId) {
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        posts = posts.filter((post) => post.id !== parseInt(postId));
        renderPosts();
      }
    })
    .catch((error) => console.error("Error deleting post:", error)); // Ошибки
}

// Когда страница будет загружена, посты будут получены и отрисованы
fetchPosts();
