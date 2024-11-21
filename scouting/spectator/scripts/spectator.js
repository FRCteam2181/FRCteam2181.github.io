namespace("frc2181.scouting.spectator.Spectator", {
  "gizmo-atheneum.namespaces.Download": "Download",
  "gizmo-atheneum.namespaces.LoadFile": "LoadFile",
  "frc2181.scouting.spectator.DisplayTable": "DisplayTable",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Logo": "Logo",
  "frc2181.scouting.spectator.SpectatorForm": "SpectatorForm",
}, ({ Download, LoadFile, DisplayTable, FormDataService, Logo, SpectatorForm }) => {
  const defaultPath = "./config/crescendo-config.json"
  const getPathForGame = (game) => `./config/${game}-config.json`;
  const formData = FormDataService.state;
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        dataTable: [],
        selectedRecord: undefined,
        path: props.game?getPathForGame(props.game):defaultPath
      };
    }
    componentDidMount() {
      if (!this.state.now) {
        FormDataService.load(this.state.path, (newState) => { this.setState(newState) })
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
      formData.reset({ selectedRecord: -1 });
    }
    loadData() {
      LoadFile(false, "text", (fileContent, fileName) => {
        const newData = JSON.parse(fileContent);
        const badRecords = newData.filter(record => 
          this.state.dataTable.find(row => 
            formData().distinct.reduce((acc,field) => 
              acc && row[field] === record[field], true)));
        if (badRecords.length > 0) {
          console.log({ fileName, badRecords })
          throw { fileName, badRecords };
        }
        this.setState({ dataTable: this.state.dataTable.concat(newData) })
      }, (fileName, error) => {
        console.log({ fileName, error });
        throw error;
      });
    }
    saveData() {
      Download.triggerJSONDownload("spectator", "spectator", this.state.dataTable)
    }
    downloadTable() {
      const fields = formData().sections.map(s => s.fields.map(f => Object.assign(f, { sectionName: s.name }))).flat();
      fields.sort((f1,f2) => f1.columnOrder - f2.columnOrder);
      const csv = [fields.map(f => `${f.sectionName} - ${f.title}`)].concat(this.state.dataTable.map(row => fields.map(f => row[f.code])));
      Download.triggerCSVDownload("spectator", "spectator", "\t", file);
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
        <main className="px-4">
          { formData() && <h1 className="text-center text-gears-dark">{formData().page_title}</h1>}
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
        </main>
        <footer>
          <div className="d-flex flex-column justify-content-center">
            <Logo />
          </div>
        </footer>
      </>);
    }
  }
});