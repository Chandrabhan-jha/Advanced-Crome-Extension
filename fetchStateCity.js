export const fetchStateCity = (token, typeCode, ValueCode) => {
  return new Promise((resolve, reject) => {
    const STATE_URL = `http://192.168.10.134:3000/api/v1/lookup/find/child_value/${typeCode}/${ValueCode}`;

    fetch(STATE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        flag: "N",
      },
    })
      .then((response) => response.json())

      .then((data) => {
        const elementData = data?.response?.map((element) => {
          return {
            label: element?.value,
            value: element?.valueCode,
            valueCode: element?.value,
            typeCode: element?.typeCode,

            id: element?.id,
          };
        });
        elementData?.sort((a, b) => a.value.localeCompare(b.value));
        resolve(elementData);
      })
      .catch((error) => {
        console.error("Fetch state error:", error.message);
        reject(error);
      });
  });
};
