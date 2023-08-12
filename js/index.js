let countryList;

async function fetchCountryData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    console.log(countries, "countries");
    return countries;
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

// Populate drop-down

// helper function

function getCountryPrefixByCode(country) {
  if (country.idd && country.cca2 && country.idd.suffixes) {
    // debugger;
    return country.idd.root + country.idd.suffixes[0];
  }
  // console.log('idd',country.idd);
  return country.idd;
}

// Test the function with Saudi Arabia's country code "SA"
//   const saudiArabiaPrefix = getCountryPrefixByCode("SA");
//   console.log(saudiArabiaPrefix); // Output: "+966"

const dropdownList = document.querySelector(".prefix-dropdown_list");

function populateDropdown(countries) {
  dropdownList.innerHTML = "";

  countries.forEach((country) => {
    // console.log(country,'country');
    const option = document.createElement("li");
    option.className = "prefix-dropdown_item w-inline-block";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.countryCode = country.cca2;
    option.dataset.countryNo = getCountryPrefixByCode(country);
    option.dataset.imgUrl = country.flags.svg;

    option.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} Flag" width="24" height="24">
      <span>${country.cca2}</span>
    `;

    dropdownList.appendChild(option);
  });
}

const dropdownToggle = document.querySelector(".w-dropdown-toggle");

function closeDropdown() {
  dropdownList.style.display = "none";
  dropdownToggle.setAttribute("aria-expanded", "false");
}

function toggleDropdown() {
  dropdownList.style.display = "block";
  dropdownToggle.setAttribute("aria-expanded", "true");
}

dropdownToggle.addEventListener("click", () => {
  dropdownToggle.setAttribute("aria-expanded", toggleDropdown());
});

const toggleEle = document.getElementById("dropdown");
toggleEle.addEventListener("click", () => {
  const data = fetchCountryData();
  data.then((res) => {
    // console.log("res", res);
    populateDropdown(res);
    // Get the div element with the data-element attribute
    const divElement = document.querySelector('[data-element="list"]');
    // console.log(divElement);

    // Get all the li elements within the div
    const liElements = divElement.querySelectorAll("li");

    // Define the function to be triggered on click
    function handleClick(event) {
      // Your code here
      // For example: console.log('Li item clicked:', event.target.textContent);
      const countryCode = event.target.dataset.countryCode;
      console.log(event, "-----");
      // document.getElementById()
     
      const newvalue = event.target.dataset.countryNo;
      const newImageUrl = event.target.dataset.imgUrl;
      console.log(newImageUrl, newvalue);
      // Get the img and value elements
      const imgElement = document.querySelector(".prefix-dropdown_flag");
      const valueElement = document.querySelector('[data-element="value"]');

      // Update the src attribute of the img element
      imgElement.src = newImageUrl;
      debugger;
      // Update the data-value attribute of the value element
      valueElement.textContent = newvalue
      //   const selectedCountry = event.target.textContent.trim();
      //   const selectedPrefix = event.target.querySelector("span").textContent;

      //   document.querySelector(".selected-country").textContent = selectedCountry;
      //   document.querySelector(".selected-prefix").textContent = selectedPrefix;
      //   document.querySelector("#selected-country-code").value = countryCode;

      closeDropdown();
    }

    // Attach click event listener to each li element
    liElements.forEach((li) => {
      li.addEventListener("click", handleClick);
    });
  });
});

// Toggle drop down

// Select option

// Keyboard navigation

document.addEventListener("keydown", (event) => {
  const isDropdownVisible =
    dropdownToggle.getAttribute("aria-expanded") === "true";

  if (isDropdownVisible) {
    const options = Array.from(document.querySelectorAll(".dropdown-option"));
    const currentIndex = options.findIndex(
      (option) => option.getAttribute("aria-selected") === "true"
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      options[currentIndex]?.setAttribute("aria-selected", "false");
      options[currentIndex + 1]?.setAttribute("aria-selected", "true");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      options[currentIndex]?.setAttribute("aria-selected", "false");
      options[currentIndex - 1]?.setAttribute("aria-selected", "true");
    } else if (event.key === "Enter" || event.key === "Space") {
      event.preventDefault();
      options[currentIndex]?.click();
    }
  }
});
