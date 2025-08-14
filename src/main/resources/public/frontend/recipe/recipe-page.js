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
  let recipeList = document.getElementById("recipe-list");
  let searchButton = document.getElementById("search-button");

  let logoutButton = document.getElementById("logout-button");
  let deleteButton = document.getElementById("delete-recipe-submit-input");
  let updateButton = document.getElementById("update-recipe-submit-input");
  let addButton = document.getElementById("add-recipe-submit-input");

  let deleteInput = document.getElementById("delete-recipe-name-input");
  let updateInput = document.getElementById("update-recipe-name-input");
  let updateInstructions = document.getElementById(
    "update-recipe-instructions-input"
  );
  let addInput = document.getElementById("add-recipe-name-input");
  let addInstructions = document.getElementById(
    "add-recipe-instructions-input"
  );
  let searchInput = document.getElementById("search-input");

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
   *
   *
   */

  async function searchRecipes() {
    // Implement search logic here
    const term = document.getElementById("search-input").value.trim();
    recipes.length = 0;

    if (!term) {
      alert("Please enter a search term.");
      return;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("auth-token"),
      },
    };
    const endURL = `recipes?name=${encodeURIComponent(term)}`;
    const getRecipeRequest = new Request(
      `${BASE_URL}/${endURL}`,
      requestOptions
    );

    try {
      const response = await fetch(getRecipeRequest);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        recipes.push(...data);
        refreshRecipeList();
        searchInput.innerHTML = "";
      } else {
        console.error(
          "Error fetching data:",
          response.status,
          response.statusText
        );
        alert("Error searching recipes");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error searching recipes");
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

    const name = addInput.value.trim();
    const instructions = addInstructions
      .value.trim();

    if (!name || !instructions) {
      alert("Please enter both a recipe name and instructions.");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ name, instructions }),
    };

    // create request
    const addRecipeRequest = new Request(`${BASE_URL}/recipes`, requestOptions);

    // use request
    // let promise = fetch(addIngredientRequest);
    try {
      const response = await fetch(addRecipeRequest);

      // Check if the request was successful
      if (response.ok) {
        // If the response is successful (status code 200)
        addInput.innerHTML = "";
        addInstructions.innerHTML = "";
        await getRecipes();
      } else {
        // If the response is not successful
        console.error(
          "Error fetching data:",
          response.status,
          response.statusText
        );
        alert("Adding Recipes Failed");
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
      alert("Adding Recipes Failed");
      return;
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
    let name = updateInput.value.trim();
    let instructions = updateInstructions.value.trim();
    if (!name || !instructions) {
      alert("Please enter both name and instructions.");
      return;
    }

    let token = sessionStorage.getItem("auth-token");

    // Fetch current recipes to get the recipe ID
    let recipesRes = await fetch(`${BASE_URL}/recipes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let recipesData = await recipesRes.json();
    let recipe = recipesData.find(
      (r) => r.name.toLowerCase() === name.toLowerCase()
    );

    if (!recipe) {
      alert("Recipe not found!");
      return;
    }

    // Send PUT request
    let response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, instructions }),
    });

    if (response.ok) {
      updateInput.innerHTML = "";
      updateInstructions.innerHTML = ""
      // Update the recipes array with latest from backend
      let updatedRes = await fetch(`${BASE_URL}/recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      recipes = await updatedRes.json();
      refreshRecipeList();
    } else {
      alert("Failed to update recipe.");
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
    let name = deleteInput.value.trim();
    if (!name) {
      alert("Please enter a recipe name.");
      return;
    }

    let token = sessionStorage.getItem("auth-token");
    try {
      let recipesRes = await fetch(`${BASE_URL}/recipes`);
      let recipes = await recipesRes.json();
      let recipe = recipes.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      if (!recipe) {
        alert("Recipe not found!");
        return;
      }

      let res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {

        getRecipes();
      } else if (res.status === 401) {
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

    recipes.length = 0;

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("auth-token"),
      },
    };

    const getRecipeRequest = new Request(`${BASE_URL}/recipes`, requestOptions);

    try {
      const response = await fetch(getRecipeRequest);

      // Check if the request was successful
      if (response.ok) {
        recipes = await response.json();
        refreshRecipeList();
      } else {
        // If the response is not successful
        console.error(
          "Error fetching data:",
          response.status,
          response.statusText
        );
        alert("Getting Recipes Failed");
        return;
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
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
    // Clear DOM
    recipeList.innerHTML = "";

    // Loop through the recipes array
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      let li = document.createElement("li");
      li.innerText = `${recipe.name} ${recipe.instructions}`;
      recipeList.appendChild(li);
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
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("auth-token"),
      },
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
        console.error(
          "Error fetching data:",
          response.status,
          response.statusText
        );
        alert("LogOut Failed");
        return;
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error:", error);
      alert("LogOut Failed");
      return;
    }
  }
});
