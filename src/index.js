

let dogHash = {};


document.addEventListener("DOMContentLoaded", () => {
  let dogBar = document.getElementById('dog-bar')
  let dogInfo = document.getElementById('dog-info')
  let filterButton = document.getElementById('good-dog-filter')

  fetch("http://localhost:3000/pups")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      data.forEach(function(dog) {
        dogHash[`${dog.name}`] = `${dog.id}`;
        dogBar.append(createDogSpan(dog));
      })
      console.log(dogHash)
    })

    dogBar.addEventListener('click', function(e) {
      if (e.target.tagName == 'SPAN') {
        let dogName = e.target.textContent;
        let dogId = dogHash[`${dogName}`];
        fetch(`http://localhost:3000/pups/${dogId}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            createDogInfo(data, dogInfo);
            goodDogButton = document.getElementsByTagName('button')[1]
            console.log(goodDogButton)
          })
      }
    })

    dogInfo.addEventListener('click', function(e) {
      let pupName = e.target.parentNode.childNodes[3].textContent;
      let good = false;

      if (e.target.tagName == 'BUTTON') {
        if (e.target.textContent == "Good Dog!") {
          e.target.textContent = "Bad Dog!";
          good = false;
        } else {
          e.target.textContent = "Good Dog!";
          good = true;
        }
      }

      let configObj = {
          method: "PATCH",
          headers:
          { "Content-Type": "application/json",
            Accept: "application/json" },

          body: JSON.stringify({
            "isGoodDog": good
          })
        }

        fetch(`http://localhost:3000/pups/${dogHash[pupName]}`, configObj)
          .then(function(response) {
            return response.json();
          })
          .then(function(element) {
            console.log(element)
          })
    });


    filterButton.addEventListener('click', function(e) {
      let spans = dogBar.getElementsByTagName("SPAN")
      let spansArray = [spans[0], spans[1], spans[2], spans[3], spans[4], spans[5], spans[6], spans[7], spans[8], spans[9]]

      fetch(`http://localhost:3000/pups`)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (e.target.textContent == "Filter good dogs: OFF") {

            e.target.textContent = "Filter good dogs: ON";

            data.forEach(function(dog) {

              if (dog.isGoodDog) {

                spansArray.forEach(function(element) {
                  if (element.textContent == dog.name) {
                    element.style.display = "flex"
                  }
                })

              } else {

                spansArray.forEach(function(element) {
                  if (element.textContent == dog.name) {
                    element.style.display = "none"
                  }
                })

              }
            })

          } else {

            e.target.textContent = "Filter good dogs: OFF";

            spansArray.forEach(function(dog) {
                dog.style.display = 'flex'
            })

          }

        })
    });


});

function createDogSpan(dog) {
  let dogSpan = document.createElement('span');
  dogSpan.textContent = dog.name;
  return dogSpan
};


function createDogInfo(dog, dogInfo) {
  goodDog = document.createElement('button')
  dogInfo.innerHTML = `
    <img src='${dog.image}'>
    <h2>${dog.name}</h2>
  `
  if (dog.isGoodDog) {
    goodDog.textContent = "Good Dog!"
    dogInfo.append(goodDog)
  } else {
    goodDog.textContent = "Bad Dog!"
    dogInfo.append(goodDog)
  }
};
