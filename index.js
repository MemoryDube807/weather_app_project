function handlesearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  let searchCity = document.querySelector("#current-city");
  searchCity.innerHTML = searchInput.value;
}

let searchform = document.querySelector("#search-form");
searchform.addEventListener("submit", handlesearch);
