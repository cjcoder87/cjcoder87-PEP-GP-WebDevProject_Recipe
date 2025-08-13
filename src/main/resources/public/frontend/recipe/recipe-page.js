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
    if (sessionStorage.getItem("is-admin")) {
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
        try {
            const token = sessionStorage.getItem("auth-token");
            const response = await fetch(`/recipes?name=${encodeURIComponent(term)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Search failed: ${response.status}`);

            recipeList = await response.json();
            refreshRecipeList();
        } catch (err) {
            alert("Error searching recipes: " + err.message);
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
        const name = document.getElementById("add-recipe-name").value.trim();
        const instructions = document.getElementById("add-recipe-instructions").value.trim();

        if (!name || !instructions) {
            alert("Please enter both a recipe name and instructions.");
            return;
        }

        try {
            const token = sessionStorage.getItem("auth-token");
            const response = await fetch("/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, instructions })
            });

            if (!response.ok) throw new Error(`Add failed: ${response.status}`);

            document.getElementById("add-recipe-name").value = "";
            document.getElementById("add-recipe-instructions").value = "";

            await getRecipes();
        } catch (err) {
            alert("Error adding recipe: " + err.message);
        }
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
         const name = document.getElementById("update-recipe-name").value.trim();
    const instructions = document.getElementById("update-recipe-instructions").value.trim();

    if (!name || !instructions) {
        alert("Please enter both a recipe name and updated instructions.");
        return;
    }

    try {
        const token = sessionStorage.getItem("auth-token");

        // Find the recipe by name
        const existing = recipeList.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!existing) {
            alert("Recipe not found.");
            return;
        }

        const response = await fetch(`/recipes/${existing.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, instructions })
        });

        if (!response.ok) throw new Error(`Update failed: ${response.status}`);

        document.getElementById("update-recipe-name").value = "";
        document.getElementById("update-recipe-instructions").value = "";

        await getRecipes();
    } catch (err) {
        alert("Error updating recipe: " + err.message);
    }
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
         const name = document.getElementById("delete-recipe-name").value.trim();
    if (!name) {
        alert("Please enter a recipe name to delete.");
        return;
    }

    try {
        const token = sessionStorage.getItem("auth-token");

        // Find the recipe by name
        const existing = recipeList.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!existing) {
            alert("Recipe not found.");
            return;
        }

        const response = await fetch(`/recipes/${existing.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

        document.getElementById("delete-recipe-name").value = "";
        await getRecipes();
    } catch (err) {
        alert("Error deleting recipe: " + err.message);
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
           try {
        const token = sessionStorage.getItem("auth-token");
        const response = await fetch("/recipes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Get recipes failed: ${response.status}`);

        recipeList = await response.json();
        refreshRecipeList();
    } catch (err) {
        alert("Error fetching recipes: " + err.message);
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
            li.innerHTML = recipe;
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
        try {
        const token = sessionStorage.getItem("auth-token");
        const response = await fetch("/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Logout failed: ${response.status}`);

        sessionStorage.clear();
        window.location.href = "../login/login.html";
    } catch (err) {
        alert("Error logging out: " + err.message);
    }
    }

});
