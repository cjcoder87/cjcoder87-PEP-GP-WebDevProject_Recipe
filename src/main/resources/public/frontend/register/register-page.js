/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */
import { BASE_URL } from "../config/config.js";
// const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput = document.getElementById("username-input");
let emailInput = document.getElementById("email-input");
let passwordInput = document.getElementById("password-input");
let repeatPasswordInput = document.getElementById("repeat-password-input");
let registerButton = document.getElementById("register-button");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;

/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here
    let username = usernameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value;
    let repeatedPassword = repeatPasswordInput.value;

    if (repeatedPassword !== password) {
        alert("Passwords dont match.");
        return;
    }

    if (!username || !email || !password || !repeatedPassword) {
        alert("Please fill in all fields.");
        return;
    }

    // Example placeholder:
    const registerBody = { username, email, password };
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    try {

        const registerRequest = new Request(`${BASE_URL}/register`, requestOptions);
        const registerResponse = await fetch(registerRequest);
        if (registerResponse.status === 201) {
            window.location.href = "../login/login-page.html";
        }

        else if (registerResponse.status === 409) {
            alert("user/email already exists");
        }
        else {

            alert("registration error!");
        }
    } catch (error) {

        console.log(error);
        alert("registration error!");
    }
}
