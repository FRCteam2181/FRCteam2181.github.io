namespace("frc2181.scouting.google-sheets-poc.GoogleSheetsPoc", {
  "frc2181.scouting.google-sheets-poc.GoogleSheetsService": "GoogleSheetsService"
}, ({ GoogleSheetsService }) => {
  return class extends React.Component {
    constructor({ userKey }) {
      const { apiKey, authToken, spreadsheetId } = JSON.parse(btoa(userKey));
      this.sheetService = new GoogleSheetsService(apiKey, authToken, spreadsheetId);
      this.state = {};
    }
    afterRender() {
      this.sheetService.getSpreadsheet((respText) => console.log(JSON.parse(respText)));
    }
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    render() {
      return (<div>

      </div>);
    }
  }
});