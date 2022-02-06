const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealList = document.getElementById("mealList");
const resultHeading = document.getElementById("resultHeading");
const mealDetails = document.getElementById("mealDetails");

let fetchMeal = (e) => {
    e.preventDefault();
    const query = search.value.trim();
    mealDetails.innerHTML = "";
    const baseURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    if (query.length > 0) {
        const reqURL = baseURL + query;
        fetch(reqURL)
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if (result.meals === null || result.meals === undefined) {
                    resultHeading.innerHTML =
                        "<p>Sorry! Could find anything. Try something different!</p>";
                } else {
                    resultHeading.innerHTML = `<h2>Found results for '${query}':</h2>`;
                    mealList.innerHTML = result.meals
                        .map(
                            (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="mealInfo" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
                        )
                        .join("");
                }
            });
        search.innerHTML = "";
    } else {
        alert("Please enter a valid meal/ingredient");
    }
};

let fetchRandomMeal = () => {
    const reqURL = "https://www.themealdb.com/api/json/v1/1/random.php";
    mealList.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(reqURL)
        .then((res) => res.json())
        .then((result) => {
            const meal = result.meals[0];
            addMealToDOM(meal);
        });
};

function getMealById(mealID) {
    mealList.innerHTML = "";
    resultHeading.innerHTML = "";
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((result) => {
            // console.log({ result });
            const meal = result.meals[0];
            // console.log(meal);
            addMealToDOM(meal);
        });
}

function getRandomMeal() {
    // Clear meals and heading
    mealList.innerHTML = "";
    resultHeading.innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    mealDetails.innerHTML = `
      <div class="mealDetails">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="mealDetails-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
          ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
          <p>${meal.strInstructions}</p>
          <h2>Ingredients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>
      </div>
    `;
}

// Event listeners
submit.addEventListener("submit", fetchMeal);
random.addEventListener("click", fetchRandomMeal);

mealList.addEventListener("click", (e) => {
    const mealInfo = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains("mealInfo");
        } else {
            return false;
        }
    });

    if (mealInfo) {
        console.log("here");
        const mealID = mealInfo.getAttribute("data-mealid");
        // console.log(mealID);
        getMealById(mealID);
    }
});
