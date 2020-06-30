document.addEventListener('DOMContentLoaded', () => {
  //when the page loads, fetch the dogs
  fetchDoges()

  //define our dog form and slap an event listener on it
  let dogForm = document.querySelector('#dog-form')
  dogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    editDog(event.target)
  })
})

function fetchDoges(){
  fetch('http://localhost:3000/dogs')
  .then(resp => resp.json())
  .then(dogs => renderDogs(dogs))
}

function renderDogs(dogs){
  const table = document.getElementById('table-body')
  dogs.forEach(dog => {
    let row = document.createElement('tr')
    /// if you need unique identifiers on your HTML elements but you don't have them, add 'em!
    row.id = dog.id
    row.innerHTML = ` 
                    <td name="name">${dog.name}</td>
                    <td name="breed">${dog.breed}</td>
                    <td name="sex">${dog.sex}</td>
                    <td>
                      <button class="dog-btn" data-id="${dog.id}">Edit</button>
                    </td>
                    `
    table.append(row)
  })
  // find all the dog buttons and mutate the node list that querySelectorAll returns to us into an array...
  const dogBtns = Array.from(document.querySelectorAll(".dog-btn"))
  /// and slap an event listener on each of them
  dogBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      if (event.target.dataset.id === btn.dataset.id){
        populateForm(btn.dataset.id)
      }
    })
  })
}

function populateForm(id){
  /// use the id we're sending to find our whole dog element so we can populate the form values
  let dogForm = document.querySelector('#dog-form')
  
  let dog = document.getElementById(`${id}`)
  let name = dog.children['name'].innerText
  let breed = dog.children['breed'].innerText
  let sex = dog.children['sex'].innerText
  
  dogForm.children['name'].value = name
  dogForm.children['breed'].value = breed
  dogForm.children['sex'].value = sex
  dogForm.dataset.id = id
}

function editDog(dog){
  let id = dog.dataset.id
  /// defining a dog object to send to our patch request
  let dogObject = {
    id: id,
    name: dog.name.value,
    breed: dog.breed.value,
    sex: dog.sex.value
  }

  fetch(`http://localhost:3000/dogs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accepts': 'application/json'
    }, 
    body: JSON.stringify(dogObject)
  })

  //optimistique rendering! this is happening *independent* of the patch
  let currentDog = document.getElementById(id)
  currentDog.children.name.textContent = dogObject.name
  currentDog.children.breed.textContent = dogObject.breed
  currentDog.children.sex.textContent = dogObject.sex
}