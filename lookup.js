export const fetchLookup = (token, typecode) => {
  return new Promise((resolve, reject) => {
    const LOOKUP_URL = "http://192.168.10.134:3000/api/v1/lookup/get/all";

    fetch(LOOKUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        flag: "N",
      },
      body: JSON.stringify({
        typeCode: [typecode],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let sortedData;
        if (typecode === "APP_SOURCE") {
          sortedData = data?.APP_SOURCE?.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
        } else if (typecode === "JOB_SKILL") {
          sortedData = data?.JOB_SKILL?.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
        } else if (typecode === "COUNTRY") {
          sortedData = data?.COUNTRY?.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
        } else if (typecode === "CITY") {
          sortedData = data?.CITY?.sort((a, b) =>
            a.value.localeCompare(b.value)
          );
        }

        if (sortedData) {
          resolve(sortedData);
        } else {
          reject(`Something went wrong while getting ${typecode} data.`);
        }
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
