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
    add() {
      this.setState({ selectedRecord: -1 });
    }
    loadData() {
      // todo
    }
    saveData() {
      // todo
    }
    downloadTable() {
      // todo
    }
    clearTable() {
      if(confirm("This will delete ALL DATA! Are you sure?")) {
        this.setState({ selectedRecord: undefined, dataTable: [] });
      }
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
    render() {
      return (<>
        { this.state.now && !isNaN(this.state.selectedRecord) && 
          <SpectatorForm onCommit={ () => this.commit() } onCancel={ () => this.cancel() }/>}
        { this.state.now && isNaN(this.state.selectedRecord) && <div className="d-flex flex-column justify-content-center">
          <div className="m-2 d-flex justify-content-center">
            <button title="Add New Record" className="btn btn-primary m-2 " onClick={() => this.add()}>
              <h2 className="text-center align-middle mb-0"><i className="fas fa-file-circle-plus"></i></h2>
            </button>
            <button title="Load Data From File" className="btn btn-primary m-2" onClick={() => this.loadData()}>
              <h2 className="text-center align-middle mb-0"><i className="fas fa-file-import"></i></h2>
            </button>
            <button title="Save Data" className="btn btn-primary m-2" onClick={() => this.saveData()}>
              <h2 className="text-center align-middle mb-0"><i className="far fa-floppy-disk"></i></h2>
            </button>
            <button title="Download Table" className="btn btn-primary m-2" onClick={() => this.downloadTable()}>
              <h2 className="text-center align-middle mb-0"><i className="fas fa-table-cells"></i></h2>
            </button>
            <button title="Clear Table" className="btn btn-danger m-2" onClick={() => this.clearTable()}>
              <h2 className="text-center align-middle mb-0"><i className="far fa-file-excel"></i></h2>
            </button>
          </div>
          <DisplayTable 
            data={this.state.dataTable}
            onEdit={(index) => this.edit(index)}
            onDelete={(index) => this.delete(index)}
            />
        </div>}
      </>);
    }
  }
});