export const fetchClient = (token, userId) => {
  return new Promise((resolve, reject) => {
    const CLIENT_URL = `http://192.168.10.134:3000/api/v1/client/requirement/assign/find/client/${userId}`;

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
        console.log(data, "client");
        const fetchedData = data?.response?.map((client) => {
          return {
            label: client?.clientName,
            value: client?.clientName,
            clientName: client?.clientName,
            clientId: client?.clientId,
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
