namespace("2181robotics.scouting.logger.build-profile.BuildProfile", () => {
  const basicTypes = ["counter", "stat", "check"];
  const recordTypes = ["Pit", "Match"];
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedTab: "Profile",
        expanded: {},
        editing: {},
        enums: [],
        enumErrors: {},
        properties: [],
        propertyErrors: {}
      };
    }
    selectTab(e, selectedTab) {
      e.preventDefault();
      this.setState({ selectedTab });
    }
    updateEnumName(enumIndex,newName) {

    }
    updateEnumLabel(enumIndex,valueIndex,newLabel) {
      
    }
    updateEnumValue(enumIndex,valueIndex,newValue) {
      
    }
    addNewEnum() {

    }
    addNewEnumValue(enumIndex) {

    }
    addNewProperty() {

    }
    updatePropertyName(propertyIndex, selectedIndex) {

    }
    updatePropertyType(propertyIndex, selectedIndex) {

    }
    updatePropertyRecordType(propertyIndex, selectedIndex) {

    }
    downloadProfile() {

    }
    hasErrors() {

    }
    render() {
      return (<>
        <h2 className="text-center">Build Scouting Profile</h2>
        <div className="card border-3">
          <div className="card-header pb-0 bg-secondary">
            <ul className="nav nav-tabs nav-fill m-0 border-bottom-0">
            <li className="nav-item">
                <a className={`nav-link ${this.state.selectedTab==="Enums"?"active bg-dark text-light border-dark":"text-light"}`} href="#" onClick={(e) => this.selectTab(e, "Enums")}>Enums</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${this.state.selectedTab==="Profile"?"active bg-dark text-light border-dark":"text-light"}`} href="#" onClick={(e) => this.selectTab(e, "Profile")}>Profile</a>
              </li>
            </ul>
          </div>
          <div className="card-body bg-dark">
            {this.state.selectedTab==="Enums" && <>
              <h3>Enums</h3>
              {this.state.enums.map((e,i) => {
                return (<div className="card">
                  <div className="card-header">
                    <div className="d-flex">
                      {this.state.expanded[i]&&this.state.editing[i]?<input value={e.name} onChange={(e) => this.updateEnumName(i,e.target.value)}/>:<h4 className="flex-grow-1">{e.name}</h4>}
                      <button className="btn btn-secondary"></button>
                      <button className="btn btn-secondary">
                        {this.state.expanded[i]?<></>:<></>}
                      </button>
                      {this.state.expanded[i]&&this.state.editing[i]&&<button className="btn btn-danger"></button>}
                    </div>
                  </div>
                  { this.state.expanded[i] && <div className="card-body">
                    {this.state.editing[i]?<>
                      <table>
                        <thead>
                          <tr>
                            <th>Label</th>
                            <th>Value</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.values.map(({label,value},j) => {
                            return <tr>
                              <td>
                                <input value={label} onChange={(e) => this.updateEnumLabel(i,j,e.target.value)}/>
                              </td>
                              <td>
                                <input value={value} onChange={(e) => this.updateEnumValue(i,j,e.target.value)}/>
                              </td>
                              <td>
                                <button className="btn btn-danger"><></></button>
                              </td>
                            </tr>
                          })}
                        </tbody>
                      </table>
                      <div className="text-center">
                        <button className="btn btn-success" onClick={() => this.addNewEnumValue(i)}>Add New Enum Value</button>
                      </div>
                    </>:<table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Label</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {e.values.map(({label,value},j) => {
                          return <tr>
                            <td>{label}</td>
                            <td>{value}</td>
                          </tr>
                        })}
                      </tbody>
                    </table>}
                  </div>}
                </div>);
              })}
              <div className="text-center">
                <button className="btn btn-success" onClick={() => this.addNewEnum()}>Add New Enum</button>
              </div>
            </>}
            {this.state.selectedTab==="Profile" && <>
              <h3>Profile</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Record Type</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.properties.map((property,i) => <tr>
                    <td>
                      <input className="form-control" value={property.name} 
                        onChange={(e) => this.updatePropertyName(i,e.target.value)}/>
                    </td>
                    <td>
                      <select className="form-select" onChange={(e) => this.updatePropertyType(i,e.target.selectedIndex)}>
                        {basicTypes.map((type) => <option value={type} selected={property.type === type}>{type}</option>)}
                        {this.state.enums.map((e) => <option value={e.name} selected={property.type === e.name}>{e.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="form-select" onChange={(e) => this.updatePropertyRecordType(i,e.target.selectedIndex)}>
                        {recordTypes.map((type) => <option value={type} selected={property.recordType === type}>{type}</option>)}
                      </select>
                    </td>
                    <td>
                      
                    </td>
                  </tr>)}
                </tbody>
              </table>
              <div className="text-center">
                <button className="btn btn-success" onClick={() => this.addNewProperty()}>Add New Property</button>
              </div>
              { !this.hasErrors()&&<div className="text-center">
                <button className="btn btn-success" onClick={() => this.downloadProfile()}>Download Profile</button>
              </div> }
            </>}
          </div>
        </div>
      </>);
    }
  }
});