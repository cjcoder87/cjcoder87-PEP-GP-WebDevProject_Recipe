/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

"http://localhost:8081"; // backend URL


/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
let addIngredientNameInput = document.getElementById("add-ingredient-name-input");
let deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
let ingredientListContainer = document.getElementById("ingredient-list");
// let searchInput = document.getElementById();
let deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
let addIngredientButton = document.getElementById("add-ingredient-submit-button");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */

window.onload = function () {
    getIngredients();
};
/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let ingredient = addIngredientNameInput.value.trim();
    if (ingredient === "") {
        alert("The ingredient is empty");
        return;
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        body: JSON.stringify({ name: ingredient })
    };

    // create request 
    const addIngredientRequest = new Request(`${BASE_URL}/ingredients`, requestOptions);

    // use request
    // let promise = fetch(addIngredientRequest);
    try {
        const response = await fetch(addIngredientRequest);

        // Check if the request was successful
        if (response.ok) {
            // If the response is successful (status code 200)
            addIngredientNameInput.value = "";
            getIngredients();
        } else {
            // If the response is not successful
            console.error('Error fetching data:', response.status, response.statusText);
            alert("Adding Ingredient Failed");
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert("Adding Ingredient Failed");
        return;
    }

}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    ingredients.length = 0;
    const requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    };

    const getIngredientRequest = new Request(`${BASE_URL}/ingredients`, requestOptions);

    try {
        const response = await fetch(getIngredientRequest);

        // Check if the request was successful
        if (response.ok) {
            let data = await response.json();
            ingredients.push(...data);
            refreshIngredientList();
        } else {
            // If the response is not successful
            console.error('Error fetching data:', response.status, response.statusText);
            alert("Getting Ingredient Failed");
            return;
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert("Getting Ingredient Failed");
        return;
    }
}



/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement add ingredient logic here
    let ingredient = deleteIngredientNameInput.value.trim();
    if (ingredient === "") {
        alert("The ingredient is empty");
        return;
    }

    const requestOptions = {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        }
    };

    let item = ingredients.find(i => i.name.toLowerCase() === ingredient.toLowerCase());
    console.log(item);
    if (!item?.id) {
        alert("There is no ingredient by that name");
        return;
    }

    let id = item.id;

    // create request 
    const deleteIngredientRequest = new Request(`${BASE_URL}/ingredients/${id}`, requestOptions);

    // use request
    // let promise = fetch(addIngredientRequest);
    try {
        const response = await fetch(deleteIngredientRequest);

        // Check if the request was successful
        if (response.ok) {
            // If the response is successful (status code 200)
            deleteIngredientNameInput.value = "";
            getIngredients();
        } else {
            // If the response is not successful
            console.error('Error fetching data:', response.status, response.statusText);
            alert("Deleting Ingredient Failed");
            return;
        }
    } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        alert("Deleting Ingredient Failed");
        return;
    }

}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";
    for (let index = 0; index < ingredients.length; index++) {
        const ingredient = ingredients[index].name;
        let li = document.createElement('li');
        let p = document.createElement('p');
        p.innerText = ingredient;
        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    }

}
