namespace("frc2181.scouting.google-sheets-poc.GoogleSheetsService", {
  "frc2181.scouting.google-sheets-poc.HttpClient": "HttpClient",
  "frc2181.scouting.google-sheets-poc.GoogleAPIOAuth2": "OAuth2"
}, ({ HttpClient, OAuth2 }) => {
  const redirectURI = "";
  const responseType = "";
  const GoogleSheetsService = function({ apiKey, spreadsheetId, oauth2Client }) {
    const allHeaders = {};
    const buildPath = ((path) => `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path || ""}?key=${apiKey}`);
    const wrapOnSuccess = ((onSuccess) => {
      return ({ responseText, headers }) => {
        // todo - refresh headers to allHeaders
        onSuccess({ body: JSON.parse(responseText), headers: allHeaders });
      };
    });
    this.getSpreadsheet = ((onSuccess) => HttpClient.get({ path: buildPath(), onSuccess }));
    this.getValues = ((range, onSuccess) => HttpClient.get({ path: buildPath(`/values/${range}`), onSuccess }))
    this.clear = ((range, onSuccess) => HttpClient.post({ 
      path: buildPath(`/values/${range}:clear`), 
      headers: allHeaders,
      onSuccess: wrapOnSuccess(onSuccess)
    }));
    this.append = ((range, values, onSuccess) => HttpClient.post({
      path: buildPath(`/values/${range}:append`),
      payload: { range, values },
      headers: allHeaders,
      onSuccess: wrapOnSuccess(onSuccess)
    }));
    this.update = ((range, values, onSuccess) => HttpClient.put({
      path: buildPath(`/values/${range}`),
      payload: { range, values },
      headers: allHeaders,
      onSuccess: wrapOnSuccess(onSuccess)
    }));
  }
  return {
    buildService: ({ apiKey, spreadsheetId, clientId, clientSecret }, onBuild ) => {
      OAuth2.buildClient({
        clientId, 
        clientSecret,
        redirectURI,
        responseType,
        scope,
        onBuild: (oauth2Client) => {
          onBuild(new GoogleSheetsService({ apiKey, spreadsheetId, oauth2Client }))
        }
      });
    }
  };
});