namespace("frc2181.scouting.spectator.Spectator", {
  "gizmo-atheneum.namespaces.Download": "Download",
  "gizmo-atheneum.namespaces.LoadFile": "LoadFile",
  "frc2181.scouting.spectator.AggregateTable": "AggregateTable",
  "frc2181.scouting.spectator.DisplayTable": "DisplayTable",
  "frc2181.scouting.spectator.EditMode": "EditMode",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.LoadingBar": "LoadingBar",
  "frc2181.scouting.spectator.Logo": "Logo",
  "frc2181.scouting.spectator.ReportTables": "ReportTables",
  "frc2181.scouting.spectator.SpectatorForm": "SpectatorForm",
}, ({ Download, LoadFile, AggregateTable, DisplayTable, EditMode, FormDataService, LoadingBar, Logo, ReportTables, SpectatorForm }) => {
  const defaultPath = "./config/beach-bash-config.json"
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
      EditMode.enable();
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
      formData.reset({ dataTable, selectedRecord: undefined, aggregate: undefined });
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
        const { dupRecords, newRecords } = newData.reduce(({ dupRecords, newRecords }, record) => {
          const dupe = this.state.dataTable.find(row => 
            formData().distinct.reduce((acc,field) => 
              acc && row[field] === record[field], true));
          if (dupe) {
            dupRecords.push(record);
          } else {
            newRecords.push(record);
          }
          return { dupRecords, newRecords };
        }, {
          dupRecords: [],
          newRecords: []
        });          
        if (newRecords.length <= 0) {
          console.log({ fileName, dupRecords });
          alert(`"${fileName} contains exclusively duplicate records. Did not load! View console for details."`);
          try {
            throw { fileName, badRecords: dupRecords };
          } finally {
            this.setState({ loading: undefined });
          }
        }
        try {
          formData.validate(newRecords, fileName);
          alert(`loading ${newRecords.length} new records${dupRecords.length > 0?`, found ${dupRecords.length} duplicate records`:""}`)
          this.setState({ dataTable: this.state.dataTable.concat(newRecords), aggregate: undefined })
        } catch(e) {
          alert(`${e.message} View console for details.`);
          throw e;
        } finally {
          this.setState({ loading: undefined });
        }
      }, (fileName, error) => {
        console.log({ fileName, error });
        try {
          throw error;
        } finally {
          this.setState({ loading: undefined });
        }
      });
      this.setState({ loading: true });
    }
    saveData() {
      let filename = "spectator";
      if (this.state.dataTable.length === 1) {
        let { scouter, matchNumber, teamNumber } = this.state.dataTable[0];
        filename = [scouter, matchNumber, teamNumber].join("-");
      } else if (this.state.dataTable.map(r => r.scouter).filter((r,i,a) => a.indexOf(r) === i).length === 1) {
        const first = this.state.dataTable[0];
        const last = this.state.dataTable[this.state.dataTable.length - 1];
        filename = `scouter-${first.scouter}-${first.matchNumber}-${last.matchNumber}`;
      }
      Download.triggerJSONDownload(filename, filename, this.state.dataTable)
    }
    downloadTable() {
      const headers = formData.getAggregatorHeaders();
      const csv = [headers.map(h => `${h.sectionTitle} - ${h.title}`)].concat(this.state.aggregate.map(row => headers.map(h => row[h.code])));
      Download.triggerCSVDownload("spectator-aggregate", "spectator-aggregate", ",", csv);
    }
    clearTable() {
      if(confirm("This will delete ALL DATA! Are you sure?")) {
        this.setState({ selectedRecord: undefined, dataTable: [] });
      }
    }
    rollupAggregate() {
      this.setState({ aggregate: formData.aggregate(this.state.dataTable) });
    }
    downloadTable() {
      const headers = formData.getAggregatorHeaders();
      const csv = [headers.map(h => `${h.sectionTitle} - ${h.title}`)].concat(this.state.aggregate.map(row => headers.map(h => row[h.code])));
      Download.triggerCSVDownload("spectator-aggregate", "spectator-aggregate", "\t", csv);
    }
    clearAggregate() {
      this.setState({ aggregate: undefined });
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
          { this.state.now && isNaN(this.state.selectedRecord) && !this.state.aggregate && <div className="d-flex flex-column justify-content-center">
            <div className="m-2 d-flex justify-content-between">
              <div className="m-2 d-flex justify-content-center">
                <button title="Load Data From File" className="btn btn-primary m-2" onClick={() => this.loadData()}>
                  <h2 className="text-center align-middle mb-0"><i className="fas fa-file-import"></i></h2>
                </button>
                <button title="Save Data" className="btn btn-primary m-2" onClick={() => this.saveData()}>
                  <h2 className="text-center align-middle mb-0"><i className="far fa-floppy-disk"></i></h2>
                </button>
              </div>
              <div className="m-2 d-flex justify-content-center">
                <button title="Add New Record" className="btn btn-success m-2 " onClick={() => this.add()}>
                  <h2 className="text-center align-middle mb-0"><i className="fas fa-file-circle-plus"></i></h2>
                </button>
                <button title="Rollup Aggregate Data" className="btn btn-success m-2" onClick={() => this.rollupAggregate()}>
                  <h2 className="text-center align-middle mb-0"><i className="fas fa-filter"></i></h2>
                </button>
              </div>
              <div className="m-2 d-flex justify-content-center">
                <button title="Clear Table" className="btn btn-danger m-2" onClick={() => this.clearTable()}>
                  <h2 className="text-center align-middle mb-0"><i className="far fa-file-excel"></i></h2>
                </button>
              </div>
            </div>
            { this.state.loading && <LoadingBar classes="text-gears-dark" label="Loading..."/>}
            { !this.state.loading && 
              <DisplayTable 
                data={this.state.dataTable}
                onEdit={(index) => this.edit(index)}
                onDelete={(index) => this.delete(index)}
                />}
          </div> }
          { this.state.aggregate && <div className="d-flex flex-column justify-content-center">
            <div className="m-2 d-flex justify-content-around">
              <button title="Back to Main" className="btn btn-warning m-2" onClick={() => this.clearAggregate()}>
                <h2 className="text-center align-middle mb-0"><i className="fas fa-arrow-left"></i></h2>
              </button>
              <button title="Download Aggregate Table" className="btn btn-primary m-2" onClick={() => this.downloadTable()}>
                <h2 className="text-center align-middle mb-0"><i className="fas fa-table-cells"></i></h2>
              </button>
            </div>
            <AggregateTable data={this.state.aggregate}/>
            <ReportTables allData={this.state.aggregate}/>
          </div> }
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