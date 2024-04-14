chrome.storage.local.get(["userStatus"], (result) => {
  const { userStatus } = result;
  if (userStatus) {
    window.location.replace("./rmsExtension.html");
  }
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const userName = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  if (userName && password) {
    chrome.runtime.sendMessage(
      { message: "login", payload: { userName, password } },
      function (response) {
        if (response === "success")
          window.location.replace("./rmsExtension.html");
      }
    );
  } else {
    document.querySelector("#username").placeholder = "Enter an email.";
    document.querySelector("#password").placeholder = "Enter a password.";
    document.querySelector("#username").style.backgroundColor = "red";
    document.querySelector("#password").style.backgroundColor = "red";
    document.querySelector("#username").classList.add("white_placeholder");
    document.querySelector("#password").classList.add("white_placeholder");
  }
});
