let filterOn = false;
const filterBtn = document.getElementById("good-dog-filter");
const dogBar = document.querySelector('#dog-bar');
const dogInfo = document.getElementById('dog-info');



document.addEventListener('DOMContentLoaded', () => {
    loadDogs();
});



function loadDogs() {
    fetch("http://localhost:3000/pups")
        .then(res => res.json())
        .then(json => {
    dogs = json
    dogBar.innerHTML = ''
    addDogToDogBar(dogs);
    });
}



function addDogToDogBar(dogs) {

    dogs.forEach(dog => {
        let dogSpan = document.createElement('span');
        dogSpan.innerText = dog.name;

        dogSpan.addEventListener('click', (e) => {
            e.preventDefault();
            if (dogInfo.childNodes.length > 0) {
                dogInfo.innerHTML = ''
            };


            let img = document.createElement('img');
            img.setAttribute('src', dog.image);


            let h2 = document.createElement('h2');
            h2.innerText = dog.name;


            let goodnessBtn = document.createElement('button');
            goodnessBtn.setAttribute('id', dog.id);
            if (dog.isGoodDog == true) {
                goodnessBtn.innerText = "Good Dog!";
            } else {
                goodnessBtn.innerText = "Bad Dog!";
            };
            goodnessBtn.addEventListener('click', (e) => {
            updateDog(e);
            });


            dogInfo.append(img, h2, goodnessBtn);
        });
        dogBar.append(dogSpan);
    });
}



function updateDog(e) {
    e.preventDefault();
    let dogId = e.target.id;
    let goodDog = dogs[dogId - 1].isGoodDog

    fetch(`http://localhost:3000/pups/${dogId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            "isGoodDog": !goodDog
        })
    })
        .then(res => res.json())
        .then(dog => {
    
    if (e.target.innerText == "Good Dog!") {
        e.target.innerText = "Bad Dog!";
    } else {
        e.target.innerText = "Good Dog!";
    };

    loadDogs();
    });
}


filterBtn.addEventListener('click', () => {
    filterOn = !filterOn;
    if (filterOn) {
        filterBtn.innerText = "Filter good dogs: ON";
        dogInfo.innerHTML = '';
        let goodDogs = [];

        for (let i = 0; i < dogs.length; i++) {
            if (dogs[i].isGoodDog == true) {
                goodDogs.push(dogs[i]);
            }
        
            dogBar.innerHTML = ''
            addDogToDogBar(goodDogs);
        };

    } else {
        filterBtn.innerText = "Filter good dogs: OFF";
        dogInfo.innerHTML = '';
        loadDogs();
    };
});





