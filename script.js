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

// Когда страница будет загружена, посты будут получены и отрисованы
fetchPosts();
