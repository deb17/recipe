const apiKey = 'ab2025ac279e4bc8957a173ec2ead44b'
const recipe_search_endpoint = `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query={keywords}&number=1`
const recipe_info_endpoint = `https://api.spoonacular.com/recipes/{id}/information?apiKey=${apiKey}`

const getRecipe = () => {
  let keywords = document.querySelector('#terms').value
  if (!keywords.trim()) return
  keywords = keywords.replace(' ', '+').trim()

  const search_endpoint = recipe_search_endpoint.replace('{keywords}', keywords)
  document.querySelector('#load').style.display = 'inline'
  document.querySelector('#recipe').style.display = 'none'
  initializeRecipe()
  document.querySelector('#error').textContent = ''

  fetch(search_endpoint)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length === 0) {
        errorRtn('Data not found. Check spelling and retry.')
        return
      }
      const info_endpoint = recipe_info_endpoint.replace(
        '{id}',
        data.results[0].id
      )
      fetch(info_endpoint)
        .then((response) => response.json())
        .then((data) => {
          document.querySelector('#load').style.display = 'none'
          showData(data)
        })
        .catch(() => errorRtn('Error fetching data'))
    })
    .catch(() => errorRtn('Error fetching data'))
}

const errorRtn = (msg) => {
  document.querySelector('#load').style.display = 'none'
  const ele = document.querySelector('#error')
  ele.textContent = msg
}

const initializeRecipe = () => {
  const recipe = document.querySelector('#recipe')
  const image = recipe.querySelector('img')
  if (image) {
    recipe.removeChild(image)
  }
  recipe.querySelector('#title').textContent = ''
  recipe.querySelector('#serves span').textContent = ''
  recipe.querySelector('#readyin span').textContent = ''
  recipe.querySelector('#list').innerHTML = ''
  recipe.querySelector('#instr').textContent = ''
}

const showData = (data) => {
  document.querySelector('#recipe').style.display = 'block'
  document.querySelector('h2').textContent = data.title
  const image = document.createElement('img')
  image.style.width = '250px'
  image.style.height = '250px'
  image.alt = 'Image not available'
  image.src = data.image
  const info = document.querySelector('#info')
  document.querySelector('#recipe').insertBefore(image, info)
  document.querySelector('#serves span').textContent = data.servings
  document.querySelector('#readyin span').textContent =
    data.readyInMinutes + ' minutes'
  const list = document.querySelector('#list')
  data.extendedIngredients.forEach((ingr) => {
    const li = document.createElement('li')
    li.textContent = ingr.original
    list.appendChild(li)
  })
  document.querySelector('#instr').textContent = data.instructions
}

document.querySelector('#find').addEventListener('click', getRecipe)
