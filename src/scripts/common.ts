import {Extension} from "@terra-money/terra.js";

export const extension = new Extension();

export function checkExtensionAvailability() {
    let isAvailable = extension.isAvailable
    if (!isAvailable) {
        console.log("No station extension");
        showNoExtensionMessage();
        return false;
    }

    return isAvailable;
}

export function appendError(message) {
    let error = document.createElement("div");
    error.classList.add("notification", "is-danger", "has-text-centered")
    error.innerHTML = message
    document.querySelector("div.container").appendChild(error);
}


export function appendSuccess(message) {
    let error = document.createElement("div");
    error.classList.add("notification", "is-success", "has-text-centered")
    error.innerHTML = message
    document.querySelector("div.container").appendChild(error);
}


function showNoExtensionMessage() {
    const noExtension = document.getElementById("no-extension");
    noExtension.classList.remove("hide");
}

export function setIsLoading(isLoading) {
    const loader = document.getElementById("loader");
    if (isLoading) {
        loader.classList.remove("hide");
    } else {
        loader.classList.add("hide");
    }
}