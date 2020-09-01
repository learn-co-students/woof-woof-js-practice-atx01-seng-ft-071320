const DOGS_URL = "http://localhost:3000/pups"
//const dogBar = document.getElementById('dog-bar')


document.addEventListener('DOMContentLoaded', () => {
    function fetchDogs() {
        return fetch(DOGS_URL)
            .then(resp => resp.json())
    }
    fetchDogs().then(renderPups)

    let filterBtn = document.querySelector('#good-dog-filter')
    filterBtn.addEventListener("click", (e) => filterDogs(e))

    function filterDogs(e) {
        document.getElementById('dog-bar').innerHTML = ""
        const onOrOff = e.target.innerText.split(": ")[1]
        console.log(onOrOff)
        if (onOrOff == "OFF") {
            e.target.innerText = "Filter good dogs: ON"
            fetchDogs().then(dogs => dogs.filter(dog => dog.isGoodDog))
            .then(goodDogs => renderPups(goodDogs))
        } else {
            e.target.innerText = "Filter good dogs: OFF"
            fetchDogs().then(renderPups)
        }
    }

    function renderPups(pups) {
        pups.forEach(pup => renderPup(pup))
    };

    function renderPup(pup) {
        console.log(pup.name)
        const dogBar = document.getElementById('dog-bar')
        let span = document.createElement('span')
        span.innerText = pup.name
        span.setAttribute("data-id", pup.id)
        console.log(span)
        span.addEventListener("click", (e) => showPupInfo(e))
        dogBar.appendChild(span)
    };


    function showPupInfo(e) {
        const dogId = e.target.dataset.id
        fetch(`${DOGS_URL}/${dogId}`)
            .then(res => res.json())
            .then(dog => renderDogInfo(dog))

    }

    function renderDogInfo(dog) {
        let infoDiv = document.getElementById('dog-info')
        let img = document.createElement('img')
        img.setAttribute('src', dog.image)
        let h2 = document.createElement('h2')
        h2.innerText = dog.name
        let button = document.createElement('button')
        const goodOrBad = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
        button.setAttribute("data-id", dog.id)
        button.innerText = `${goodOrBad}`
        button.addEventListener("click", (e) => toggleDog(e))
        infoDiv.append(img, h2, button)
    }

    function toggleDog(e) {
        let dogId = e.target.dataset.id
        let goodOrBad = e.target.innerText.slice(0, -5)
        let isGoodDog = goodOrBad == "Good" ? true : false
        let newStatus = isGoodDog ? "Bad dog!" : "Good dog!"
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isGoodDog: !isGoodDog })
        }
        fetch(`${DOGS_URL}/${dogId}`, configObj)
            .then(res => res.json())
            .then(() => e.target.innerText = newStatus)
    }

});



