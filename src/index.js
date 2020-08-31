let filterDogs = false;

document.addEventListener("DOMContentLoaded", (e) => {

    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");

    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(dogs => {
            dogs.forEach(dog => {
                const dogSpan = document.createElement("span");
                dogSpan.innerText = dog.name;
                dogSpan.id = dog.name;
                dogBar.append(dogSpan);
                dogSpan.addEventListener("click", (e) => {
                    dogInfo.innerHTML = `<img src=${dog["image"]}><h2>${dog["name"]}</h2>`;
                    const goodDogButton = document.createElement("button");
                    setButtonText(goodDogButton, dog.isGoodDog);
                    dogInfo.append(goodDogButton);
                    goodDogButton.addEventListener("click", (e) => {
                        dog.isGoodDog = !dog.isGoodDog;
                        fetch(`http://localhost:3000/pups/${dog["id"]}`, {
                            method: "PATCH",
                            headers:
                            {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({
                                "isGoodDog": dog.isGoodDog
                            })
                        })
                        setButtonText(goodDogButton, dog.isGoodDog);
                        filterDog(dog);
                    });
                });
            });
            setFilterDogs(filterButton);
            filterButton.addEventListener("click", (e) => {
                filterDogs = !filterDogs
                setFilterDogs(filterButton, filterDogs);
                dogs.forEach(dog => {
                    filterDog(dog);
                })
            });
        });
});

function setButtonText(button, isGood) {
    if (isGood) {
        button.innerText = "Good Dog!";
    }
    else {
        button.innerText = "Bad Dog!";
    };
}

function setFilterDogs(button) {
    if (filterDogs) {
        button.innerText = "Filter good dogs: ON";
    }
    else {
        button.innerText = "Filter good dogs: OFF"
    };
}

function filterDog(dog) {
    if (filterDogs && dog.isGoodDog == false) {
        const dogSpan = document.getElementById(dog.name);
        dogSpan.style.display = "none";
    }
    else {
        const dogSpan = document.getElementById(dog.name);
        dogSpan.style.display = "flex";
    };
}