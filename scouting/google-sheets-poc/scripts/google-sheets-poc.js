namespace("frc2181.scouting.google-sheets-poc.GoogleSheetsPoc", {
  "frc2181.scouting.google-sheets-poc.GoogleSheetsService": "GoogleSheetsService"
}, ({ GoogleSheetsService }) => {
  return class extends React.Component {
    constructor({ userKey }) {
      this.state = { userKey };
    }
    afterRender() {
      if (!this.state.sheetService) {
        GoogleSheetsService.buildService(this.state.userKey, (sheetService) => this.setState({ sheetService }));
      } else {
        this.state.sheetService.getSpreadsheet(({ body, headers}) => console.log({ body, headers }))
      }
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