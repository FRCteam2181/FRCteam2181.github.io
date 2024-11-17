namespace("frc2181.scouting.spectator.Spectator", {
  "frc2181.scouting.spectator.DisplayTable": "DisplayTable",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.SpectatorForm": "SpectatorForm",
  "frc2181.scouting.spectator.TestData": "TestData",
}, ({ DisplayTable, FormDataService, SpectatorForm, TestData }) => {
  const formData = FormDataService.state;
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dataTable: TestData,
        selectedRecord: undefined
      };
    }
    componentDidMount() {
      if (!this.state.now) {
        FormDataService.load((newState) => { this.setState(newState) })
      }
    }
    add() {
      this.setState({ selectedRecord: -1 });
    }
    edit(index) {
      formData.load(this.state.dataTable[index]);
      this.setState({ selectedRecord: index });

    }
    delete(index) {
      const dataTable = this.state.dataTable.map(row => Object.assign({}, row));
      dataTable.splice(index,1);
      this.setState({ dataTable });
    }
    commit() {
      const dataTable = this.state.dataTable.map(row => Object.assign({}, row));
      const record = formData.getRecord();
      if (this.state.selectedRecord < 0) {
        dataTable.push(record);
      } else {
        dataTable[this.state.selectedRecord] = record;
      }
      formData.reset({ dataTable, selectedRecord: undefined });
    }
    cancel() {
      formData.reset({ selectedRecord: undefined });
    }
    render() {
      return (<>
        { this.state.now && !isNaN(this.state.selectedRecord) && 
          <SpectatorForm onCommit={ () => this.commit() } onCancel={ () => this.cancel() }/>}
        { this.state.now && isNaN(this.state.selectedRecord) && 
          <DisplayTable 
            data={this.state.dataTable}
            onAdd={() => this.add()}
            onEdit={(index) => this.edit(index)}
            onDelete={(index) => this.delete(index)}
            />}
      </>);
    }
  }
});