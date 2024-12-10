namespace("frc2181.scouting.google-sheets-poc.GoogleSheetsService", {
  "frc2181.scouting.google-sheets-poc.HttpClient": "HttpClient"
}, ({ HttpClient }) => {
  return function(apiKey, authToken, spreadsheetId) {
    const headers = { Authorization: `Basic ${authToken}` };
    const buildPath = ((path) => `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path || ""}?key=${apiKey}`);
    this.getSpreadsheet = ((onSuccess) => HttpClient.get({ path: buildPath(), onSuccess }));
    this.getValues = ((range, onSuccess) => HttpClient.get({ path: buildPath(`/values/${range}`), onSuccess }))
    this.clear = ((range, onSuccess) => HttpClient.post({ path: buildPath(`/values/${range}:clear`), onSuccess }));
    this.append = ((range, values, onSuccess) => HttpClient.post({
      path: buildPath(`/values/${range}:append`),
      payload: { range, values },
      onSuccess
    }));
    this.update = ((range, values, onSuccess) => HttpClient.put({
      path: buildPath(`/values/${range}`),
      payload: { range, values },
      onSuccess
    }));
  }
});