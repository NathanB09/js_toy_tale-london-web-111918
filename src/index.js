document.addEventListener('DOMContentLoaded', init)
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const formBtn = document.querySelector('.submit')
const baseURL = 'http://localhost:3000/toys'
let addToy = false
let likedToy = false

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    formBtn.addEventListener('click', addNewToy)
  } else {
    toyForm.style.display = 'none'
  }
})

function init() {
  getToys().then(renderAllToys)
}

function renderAllToys(toyArray) {
  toyArray.forEach(addToyInfo)
}

function addToyInfo(toy) {
  const toyCollect = document.querySelector('#toy-collection')

  const toyDiv = document.createElement('div')
  toyDiv.classList.add('card')

  const likeBtn = document.createElement('button')
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img class="toy-avatar" src="${toy.image}">
    <p id="toy-likes">Likes: ${toy.likes}</p>
  `
  likeBtn.innerHTML = 'Like'
  likeBtn.classList.add('like-btn')
  likeBtn.dataset.likes = toy.likes
  likeBtn.dataset.id = toy.id
  likeBtn.addEventListener('click', likeToy)
  toyDiv.append(likeBtn)
  toyCollect.append(toyDiv)
}

// -------------------
//      API Calls
// -------------------

function getToys() {
  return fetch(baseURL)
    .then(response => response.json())
}

function addNewToy(e) {
  const toyName = e.target.form[0].value
  const toyImage = e.target.form[1].value
  if (toyName.length > 0 && toyImage.length > 0) {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    }
    fetch(baseURL, options)
  }
}

function likeToy(e) {
  const toyId = e.target.dataset.id
  const toyLikes = parseInt(e.target.dataset.likes)
  const options = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    }
  }

  likedToy = !likedToy
  if (likedToy) {
    options.body = JSON.stringify({likes: toyLikes + 1})
    e.target.parentElement.querySelector('p').innerText = `Likes: ${toyLikes + 1}`
    e.target.innerText = 'Unlike'
  } else {
    options.body = JSON.stringify({likes: toyLikes})
    e.target.parentElement.querySelector('p').innerText = `Likes: ${toyLikes}`
    e.target.innerText = 'Like'
  }

  fetch(baseURL + `/${toyId}`, options)
}
