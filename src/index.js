document.addEventListener("DOMContentLoaded", () => {
    const dogbar = document.getElementById("dog-bar");
    const dogInfoDiv = document.querySelector("#dog-info")
    const goodDogFilter = document.getElementById('good-dog-filter')
    goodDogFilter.addEventListener('click', filterDogs)
    console.log(dogInfoDiv)
    const dogsURL = "http://localhost:3000/pups";
    
    fetchDogs().then(renderDogBar)


    function fetchDogs() {
        return fetch(dogsURL)
               .then((r) => r.json())
    }

    function renderDogBar(dogs) {
        dogs.forEach(dog => addDogToDogBar(dog))
    }


    function addDogToDogBar(dog) {
        const span = document.createElement("span")
        span.innerHTML = dog.name
        span.setAttribute('data-id', dog.id)
        // console.log(span)
        span.addEventListener("click", showDogInfo)
        dogbar.append(span)
    }

    function showDogInfo(event) {
        const dogId = event.target.dataset.id
        // console.log(event.target.getAttribute('data-id'))
        fetch(`http://localhost:3000/pups/${dogId}`)
            .then(response => response.json())
            .then(dog => {
                const goodOrBad = dog.isGoodDog ? "Good dog!" : "Bad dog!"

                dogInfoDiv.innerHTML = ` 
                    <img src="${dog.image}">
                    <h2>${dog.name}</h2>
                    <button data-id=${dog.id}>${goodOrBad}</button>`
                const button = dogInfoDiv.querySelector('button')
                // const button = document.querySelector('#dog-info button')
                button.addEventListener("click", toggleDog)
            })
    }

    function toggleDog(event) {
        const goodOrBad = event.target.innerText.slice(0, -5)
        const isGoodDog = goodOrBad === "Good" ? true : false //tells me status of dog behavior change
        const newStatus = isGoodDog ? "Bad dog!" : "Good dog!"//changes button text
        const dogId = event.target.dataset.id
        fetch(`http://localhost:3000/pups/${dogId}`, {
            method: "PATCH",
            body: JSON.stringify({ isGoodDog: !isGoodDog }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(() => event.target.innerText = newStatus)
        // event.target.innerText = newStatus
    }

    function filterDogs() {
        dogbar.innerHTML = ""
        const onOrOff = event.target.innerText.split(": ")[1]
        if (onOrOff === "OFF") {
            event.target.innerText = "Filter good dogs: ON"
            fetchDogs()
            .then(dogs => dogs.filter(dog => dog.isGoodDog))
            .then(goodDogs => renderDogBar(goodDogs))
        } else {
            event.target.innerText = "Filter good dogs: OFF"
            fetchDogs().then(renderDogBar)
        }
    }



})