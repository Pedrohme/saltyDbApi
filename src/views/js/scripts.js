const form = document.querySelector("#search");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchbox = document.querySelector("#searchbox");
    const newUrl = `${window.location.origin}/fighter/search/?name=${searchbox.value}`;
    window.location = newUrl;
})