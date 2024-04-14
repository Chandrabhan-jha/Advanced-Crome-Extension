export const flip_user_status = (signIn, user_info) => {
  if (signIn) {
    return fetch("http://192.168.10.134:3000/api/v1/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flag: "N",
        username: user_info?.userName.trim(),
        password: user_info?.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        return new Promise((resolve) => {
          if (data?.response?.token) {
            chrome.storage.local.set(
              {
                userStatus: signIn,
                token: data?.response?.token,
                userId: data?.response?.userId,
              },
              function () {
                if (chrome.runtime.lastError) resolve("fail");
                resolve("success");
              }
            );
          } else {
            resolve("fail");
          }
        });
      })
      .catch((err) => console.log(err));
  }
};
