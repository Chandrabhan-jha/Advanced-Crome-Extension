export const fetchRequirement = (token, userId, clientId) => {
  return new Promise((resolve, reject) => {
    const CLIENT_URL = `http://192.168.10.134:3000/api/v1/client/requirement/assign/find/requirement/${userId}/${clientId}`;

    fetch(CLIENT_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        flag: "N",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const fetchedData = data?.response?.map((req) => {
          return {
            label: req?.jobPosition,
            value: req?.jobPosition,
            jobPosition: req?.jobPosition,
            requirementId: req?.requirementId,
          };
        });
        fetchedData?.sort((a, b) => a.value.localeCompare(b.value));
        resolve(fetchedData);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
