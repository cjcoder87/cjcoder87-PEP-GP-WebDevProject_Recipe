/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    let adminLink = document.getElementById("admin-link");
    let recipeContainer = document.getElementById("recipe-list");

    let logoutButton = document.getElementById("logout-button");
    let deleteButton = document.getElementById("delete-recipe-submit-input");
    let updateButton = document.getElementById("update-recipe-submit-input");
    let searchButton = document.getElementById("search-button");
    let addButton = document.getElementById("add-recipe-submit-input");

    let recipeList = [];
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "inline";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "inline";
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addButton.onclick = addRecipe;
    updateButton.onclick = updateRecipe;
    deleteButton.onclick = deleteRecipe;
    searchButton.onclick = searchRecipes;
    logoutButton.onclick = processLogout;

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */

    window.onload = function () {
        getRecipes();
    };

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes(term) {
        // Implement search logic here
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };
        let endURL = `recipes?term=${encodeURIComponent(term)}`;
        const getRecipeRequest = new Request(`${BASE_URL}/${endURL}`, requestOptions);

        try {
            const response = await fetch(getRecipeRequest);

            // Check if the request was successful
            if (response.ok) {
                recipeList = [];
                recipeList = await response.json();
                refreshRecipeList();
            } else {
                // If the response is not successful
                console.error('Error fetching data:', response.status, response.statusText);
                alert("Error searching recipes");
                return;
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert("Error searching recipes");
            return;
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        return;
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        return;
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let name = document.getElementById("delete-recipe-name-input").value.trim();
        if (!name) {
            alert("Please enter a recipe name.");
            return;
        }

        let token = sessionStorage.getItem("auth-token");
        try {
            let recipesRes = await fetch(`${BASE_URL}/recipes`);
            let recipes = await recipesRes.json();
            let recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
            if (!recipe) {
                alert("Recipe not found!");
                return;
            }

            let res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.status === 200) {
                getRecipes();
            } else if (res.status === 403) {
                alert("You are not authorized!");
            } else {
                alert("Error deleting recipe.");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting recipe.");
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here

        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        const getRecipeRequest = new Request(`${BASE_URL}/recipes`, requestOptions);

        try {
            const response = await fetch(getRecipeRequest);

            // Check if the request was successful
            if (response.ok) {
                recipeList = await response.json();
                refreshRecipeList();
            } else {
                // If the response is not successful
                console.error('Error fetching data:', response.status, response.statusText);
                alert("Getting Recipes Failed");
                return;
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert("Getting Recipes Failed");
            return;
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeContainer.innerHTML = "";
        for (let index = 0; index < recipeList.length; index++) {
            const recipe = recipeList[index].name + recipeList[index].instructions;
            let li = document.createElement('li');
            li.innerText = recipe;
            recipeContainer.appendChild(li);
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here

        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        };

        const logoutRequest = new Request(`${BASE_URL}/logout`, requestOptions);

        try {
            const response = await fetch(logoutRequest);

            // Check if the request was successful
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                // If the response is not successful
                console.error('Error fetching data:', response.status, response.statusText);
                alert("LogOut Failed");
                return;
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert("LogOut Failed");
            return;
        }
    }

});
