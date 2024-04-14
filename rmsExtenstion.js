import { fetchClient } from "./apis/fetchClient.js";
import { fetchLocation } from "./apis/fetchLocation.js";
import { fetchRequirement } from "./apis/fetchRequirement.js";
import { fetchLookup } from "./apis/lookup.js";
import { fetchStateCity } from "./apis/fetchStateCity.js";

const client = document.getElementById("client");
const requirement = document.getElementById("requirement");
const location = document.getElementById("location");
const source = document.getElementById("source");
const jobskill = document.getElementById("skill");
const country = document.getElementById("country");
const state = document.getElementById("state");
const city = document.getElementById("city");
const preferredLocation = document.getElementById("preferredLocation");
const logout = document.getElementById("logout");
const autofill = document.getElementById("autofill");
const searchSkill = document.getElementById("searchSkill");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const experience = document.getElementById("experience");
const searchPreferredLocation = document.getElementById(
  "searchPreferredLocation"
);
const selectPreferredLocationBtn = document.getElementById(
  "select-preferredLocation"
);
const selectBtn = document.getElementById("select-skill");
const selectClient = document.getElementById("client");
const selectRequirement = document.getElementById("requirement");
const selectCountry = document.getElementById("country");
const selectState = document.getElementById("state");
const selectCity = document.getElementById("city");

let jobSkillData = [];
let selectedSkillsData = [];
let preferredLocationData = [];
let selectedPreferredLocationData = [];
let selectedClient = {};
let selectedRequirement = {};
let selectedCountry = {};
let selectedState = {};
let selectedCity = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // first last name
  let candidateName = message.candidateName;
  if (candidateName !== null) {
    const nameParts = candidateName.split(" ");
    let firstName, lastName;

    if (nameParts.length === 1) {
      firstName = nameParts[0];
      lastName = "";
    } else {
      firstName = nameParts[0];
      lastName = nameParts[nameParts.length - 1];
    }
    firstname.value = firstName;
    lastname.value = lastName;
  }
  // email id
  let candidateEmail = message.candidateEmail;
  if (candidateEmail !== null) {
    email.value = candidateEmail;
  }
  // experience in years
  let candidateExperience = message.experienceInYears;
  if (candidateExperience !== null) {
    experience.value = candidateExperience;
  }
});

autofill.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapDataFromPage,
  });
});

logout.addEventListener("click", () => {
  chrome.storage.local.clear();
  window.location.replace("./rmsLogin.html");
});

chrome.storage.local.get(["token", "userId"], (result) => {
  const { token, userId } = result;
  if (token && userId) {
    fetchClient(token, userId)
      .then((clients) => {
        setClientOptions(clients);
      })
      .catch((error) => {
        console.error("Error fetching client:", error);
      });
    fetchLookup(token, "APP_SOURCE")
      .then((sourceData) => {
        setAppSourceOptions(sourceData);
      })
      .catch((error) => {
        console.error("Error fetching application source:", error);
      });
    fetchLookup(token, "JOB_SKILL")
      .then((skillsData) => {
        jobSkillData = skillsData;
        setJobSkillOptions(skillsData);
      })
      .catch((error) => {
        console.error("Error fetching job skills:", error);
      });
    fetchLookup(token, "COUNTRY")
      .then((countryData) => {
        setCountryOptions(countryData);
      })
      .catch((error) => {
        console.error("Error fetching country:", error);
      });
    fetchLookup(token, "STATE")
      .then((stateData) => {
        setStateOptions(stateData);
      })
      .catch((error) => {
        console.error("Error fetching state:", error);
      });
    fetchLookup(token, "CITY")
      .then((preferredLocData) => {
        preferredLocationData = preferredLocData;
        setPreferredLocationDataOptions(preferredLocData);
      })
      .catch((error) => {
        console.error("Error fetching preferred City:", error);
      });
  } else {
    console.error("Something went wrong while getting client.");
  }
});

function scrapDataFromPage() {
  let experienceInYears;
  let candidateNameElement = document.querySelector(".hlite-inherit");
  const candidateName = candidateNameElement?.textContent?.trim();

  let email = document.querySelector("._6o5qf");
  const candidateEmail = email?.getAttribute("title");

  let parentExperienceElement = document.querySelector(".UpKFt");
  if (parentExperienceElement) {
    let iconElement = parentExperienceElement.querySelector(
      'i[title="Experience"]'
    );
    let nestedSpanElement =
      parentExperienceElement.querySelector("span[title]");
    if (iconElement && nestedSpanElement) {
      let experienceTextContent = nestedSpanElement.textContent.trim();
      let numericalValues = experienceTextContent.match(/\d+/g);
      experienceInYears = numericalValues.join(".");
    }
  }

  chrome.runtime.sendMessage({
    candidateName,
    candidateEmail,
    experienceInYears,
  });
}

const setClientOptions = (clients) => {
  client.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select Client";
  client.appendChild(defaultOption);

  clients?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.value;
    optionElement.id = element.clientId;
    optionElement.innerHTML = element.label;
    client.appendChild(optionElement);
  });
};

const setRequirementOptions = (requirements) => {
  requirement.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select Requirement";
  requirement.appendChild(defaultOption);

  requirements?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.value;
    optionElement.id = element.requirementId;
    optionElement.innerHTML = element.label;
    requirement.appendChild(optionElement);
  });
};

const setLocationOptions = (locations) => {
  location.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select location";
  location.appendChild(defaultOption);

  locations?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.value;
    optionElement.innerHTML = element.label;
    location.appendChild(optionElement);
  });
};

const setAppSourceOptions = (appSourceData) => {
  source.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select Application Source";
  source.appendChild(defaultOption);

  appSourceData?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.typeCode;
    optionElement.id = element.id;
    optionElement.innerHTML = element.value;
    source.appendChild(optionElement);
  });
};

const setJobSkillOptions = (jobSkillData) => {
  jobskill.innerHTML = "";

  jobSkillData?.forEach((element) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    const checkboxSpan = document.createElement("span");
    checkboxSpan.classList.add("checkbox");

    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check", "check-icon");
    checkboxSpan.appendChild(checkIcon);

    const itemTextSpan = document.createElement("span");
    itemTextSpan.classList.add("item-text");
    itemTextSpan.textContent = element.value;

    if (selectedSkillsData.includes(element.value)) {
      listItem.classList.add("checked");
    }

    listItem.appendChild(checkboxSpan);
    listItem.appendChild(itemTextSpan);

    jobskill.appendChild(listItem);
  });
};

const setCountryOptions = (countryData) => {
  country.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select Country";
  country.appendChild(defaultOption);

  countryData?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.valueCode;
    optionElement.id = element.id;
    optionElement.textContent = element.value;
    optionElement.typeCode = element.typeCode;
    optionElement.valueCode = element.value;
    optionElement.innerHTML = element.value;
    country.appendChild(optionElement);
  });
};

const setStateOptions = (stateData) => {
  state.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select State";
  state.appendChild(defaultOption);

  stateData?.forEach((element) => {
    let optionElement = document.createElement("option");

    optionElement.value = element.valueCode;
    optionElement.id = element.id;
    optionElement.textContent = element.value;
    optionElement.typeCode = element.typeCode;
    optionElement.valueCode = element.value;
    optionElement.innerHTML = element.value;
    state.appendChild(optionElement);
  });
};

const setCityOptions = (cityData) => {
  city.innerHTML = "";

  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = "Select State";
  city.appendChild(defaultOption);

  cityData?.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.value = element.valueCode;
    optionElement.id = element.id;
    optionElement.textContent = element.value;
    optionElement.typeCode = element.typeCode;
    optionElement.valueCode = element.valueCode;
    optionElement.innerHTML = element.value;
    city.appendChild(optionElement);
  });
};

const setPreferredLocationDataOptions = (preferredLocationData) => {
  preferredLocation.innerHTML = "";

  preferredLocationData?.forEach((element) => {
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    const checkboxSpan = document.createElement("span");
    checkboxSpan.classList.add("checkbox");

    const checkIcon = document.createElement("i");
    checkIcon.classList.add("fa-solid", "fa-check", "check-icon");
    checkboxSpan.appendChild(checkIcon);

    const itemTextSpan = document.createElement("span");
    itemTextSpan.classList.add("item-text");
    itemTextSpan.textContent = element.value;

    if (selectedPreferredLocationData.includes(element.value)) {
      listItem.classList.add("checked");
    }

    listItem.appendChild(checkboxSpan);
    listItem.appendChild(itemTextSpan);

    preferredLocation.appendChild(listItem);
  });
};

selectBtn.addEventListener("click", () => {
  selectBtn.classList.toggle("open");
});

jobskill.addEventListener("click", (event) => {
  if (event.target.classList.contains("item")) {
    event.target.classList.toggle("checked");

    let checkedItems = document.querySelectorAll("#skill .item.checked"),
      btnText = document.getElementById("skill-btn-text");

    if (event.target.classList.contains("checked")) {
      selectedSkillsData.push(event.target.textContent);
    } else {
      selectedSkillsData = selectedSkillsData.filter(
        (selectedSkill) => selectedSkill !== event.target.textContent
      );
    }

    if (selectedSkillsData?.length > 0) {
      btnText.innerText = `${selectedSkillsData.length} Selected`;
    } else {
      btnText.innerText = "Select Skills";
    }
  }
});

selectPreferredLocationBtn.addEventListener("click", () => {
  selectPreferredLocationBtn.classList.toggle("open");
});

preferredLocation.addEventListener("click", (event) => {
  if (event.target.classList.contains("item")) {
    event.target.classList.toggle("checked");

    let checkedItems = document.querySelectorAll(
        "#preferredLocation .item.checked"
      ),
      btnText = document.getElementById("preferredLocation-btn-text");

    if (event.target.classList.contains("checked")) {
      selectedPreferredLocationData.push(event.target.textContent);
    } else {
      selectedPreferredLocationData = selectedPreferredLocationData.filter(
        (selectedLoc) => selectedLoc !== event.target.textContent
      );
    }

    if (selectedPreferredLocationData?.length > 0) {
      btnText.innerText = `${selectedPreferredLocationData.length} Selected`;
    } else {
      btnText.innerText = "Select preferred location";
    }
  }
});

searchSkill.addEventListener("keyup", () => {
  let skillsArr = [];
  let searchWord = searchSkill.value.toLowerCase();
  skillsArr = jobSkillData?.filter((data) => {
    return data?.value?.toLowerCase().includes(searchWord);
  });
  setJobSkillOptions(skillsArr);
});

searchPreferredLocation.addEventListener("keyup", () => {
  let preferredLocationArr = [];
  let searchWord = searchPreferredLocation.value.toLowerCase();
  preferredLocationArr = preferredLocationData?.filter((data) => {
    return data?.value?.toLowerCase().includes(searchWord);
  });
  setPreferredLocationDataOptions(preferredLocationArr);
});

selectClient.addEventListener("change", () => {
  const selectedOption = selectClient?.options[selectClient.selectedIndex];
  selectedClient = {
    clientName: selectedOption?.value,
    clientId: selectedOption?.id,
  };
  chrome.storage.local.get(["token", "userId"], (result) => {
    const { token, userId } = result;
    if (token && userId && selectedOption) {
      fetchRequirement(token, userId, selectedOption?.id)
        .then((requirement) => {
          setRequirementOptions(requirement);
        })
        .catch((error) => {
          console.error("Error fetching requirement:", error);
        });
    } else {
      console.error("Something went wrong while getting requirement.");
    }
  });
});

selectRequirement.addEventListener("change", () => {
  const selectedOption =
    selectRequirement?.options[selectRequirement.selectedIndex];
  selectedRequirement = {
    jobPosition: selectedOption?.value,
    requirementId: selectedOption?.id,
  };
  chrome.storage.local.get(["token", "userId"], (result) => {
    const { token, userId } = result;
    if (token && userId && selectedOption) {
      fetchLocation(token, userId, selectedOption?.id)
        .then((location) => {
          setLocationOptions(location);
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
        });
    } else {
      console.error("Something went wrong while getting location.");
    }
  });
});

country.addEventListener("change", () => {
  const selectedOption = country?.options[country.selectedIndex];

  if (selectedOption) {
    const selectedCountry = {
      countryName: selectedOption.textContent,
      countryId: selectedOption.id,
      countryValueCode: selectedOption.value,
      countryTypeCode: selectedOption.typeCode,
    };

    chrome.storage.local.get(["token"], (result) => {
      const { token } = result;

      if (token && selectedCountry.countryTypeCode) {
        fetchStateCity(token, selectedCountry.countryTypeCode)
          .then((stateData) => {
            setStateOptions(stateData);
          })
          .catch((error) => {
            console.error("Error fetching states:", error);
          });
      } else {
        console.error("Token or countryTypeCode is missing.");
      }
    });
  } else {
    console.error("No country option selected.");
  }
});

state.addEventListener("change", () => {
  // Listening to the 'state' dropdown change
  const selectedOption = state?.options[state.selectedIndex];
  selectedState = {
    stateName: selectedOption?.textContent,
    stateId: selectedOption?.id,
    stateValue: selectedOption?.valueCode,
    stateTypeCode: selectedOption?.typeCode,
  };
  chrome.storage.local.get(["token"], (result) => {
    const { token } = result;
    if (token && selectedOption) {
      fetchStateCity(
        token,
        selectedState.stateTypeCode,
        selectedState.stateValueCode
      )
        .then((val) => {
          setCityOptions(val);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error); // Updated error message
        });
    } else {
      console.error("Something went wrong while getting cities."); // Updated error message
    }
  });
});
