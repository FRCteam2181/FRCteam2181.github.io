namespace("2181robotics.scouting.logger.build-profile.BuildProfile", () => {
  const basicTypes = ["counter", "stat", "check"];
  const recordTypes = ["Pit", "Match"];
  const getTypes = function(enums) {
    return basicTypes.concat(enums.map(e => e.name));
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedTab: "Profile",
        enums: [],
        properties: [],
        properiesError: "cannot be empty"
      };
    }
    selectTab(e, selectedTab) {
      e.preventDefault();
      this.setState({ selectedTab });
    }
    toggleEditing(enumIndex) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].editing = !enums[enumIndex].editing;
      this.setState({ enums });
    }
    toggleAccordion(enumIndex) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].expanded = !enums[enumIndex].expanded;
      this.setState({ enums });
    }
    updateEnumName(enumIndex,newName) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].name = newName;
      if (newName.length === 0) {
        enums[enumIndex].errors.name = "cannot be blank"
      } else if (basicTypes.indexOf(newName) < 0) {
        enums[enumIndex].errors.name = `cannot be one of "${basicTypes.join("\", \"")}"`;
      } else {
        const names = enums.map(e => e.name);
        if (names.indexOf(newName) !== enumIndex) {
          enums[enumIndex].errors.name = "must be unique";
        } else {
          delete enums[enumIndex].errors.name;
        }
      }
      this.setState({ enums });
    }
    updateEnumLabel(enumIndex,valueIndex,newLabel) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].values = Array.from(enums[enumIndex].values);
      enums[enumIndex].values[valueIndex].label = newLabel;
      if (newLabel.length === 0) {
        enums[enumIndex].values[valueIndex].errors.name = "cannot be blank"
      } else {
        const labels = enums[enumIndex].values.map(e => e.label);
        if (labels.indexOf(newLabel) !== enumIndex) {
          enums[enumIndex].values[valueIndex].errors.name = "must be unique";
        } else {
          delete enums[enumIndex].values[valueIndex].errors.name;
        }
      }
      this.setState({ enums });
    }
    updateEnumValue(enumIndex,valueIndex,newValue) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].values = Array.from(enums[enumIndex].values);
      enums[enumIndex].values[valueIndex].value = newValue;
      if (newValue.length === 0) {
        enums[enumIndex].values[valueIndex].errors.value = "cannot be blank"
      } else {
        const values = enums[enumIndex].values.map(e => e.value);
        if (values.indexOf(newValue) !== enumIndex) {
          enums[enumIndex].values[valueIndex].errors.value = "must be unique";
        } else {
          delete enums[enumIndex].values[valueIndex].errors.value;
        }
      }
      this.setState({ enums });
    }
    addNewEnum() {
      const enums = this.state.enums.map(e => {
        delete e.expanded;
        delete e.editing;
        return e;
      });
      enums.push({
        expanded:true,
        editing:true,
        name: "",
        values: [],
        errors: {
          name: "cannot be blank",
          values: "cannot be empty"
        }
      });
      this.setState({ enums });
    }
    deleteEnum(enumIndex){
      const enums = Array.from(this.state.enums);
      enums.splice(enumIndex, 1);
      const typeNames = getTypes(enums);
      const properties = this.state.properties.map(p => {
        if (typeNames.indexOf(p.type) < 0) {
          p.type = "";
          p.errors.type = "cannot be empty"
        }
      });
      this.setState({ enums, properties });
    }
    addNewEnumValue(enumIndex) {
      const enums = Array.from(this.state.enums);
      enums[enumIndex].values = Array.from(enums[enumIndex].values);
      enums[enumIndex].values.push({
        label:"",
        value:"",
        errors: {
          label:"cannot be blank",
          value:"cannot be blank",
        }
      })
      this.setState({ enums });
    }
    deleteEnumValue(enumIndex,valueIndex){
      const enums = Array.from(this.state.enums);
      enums[enumIndex].values = Array.from(enums[enumIndex].values);
      enums[enumIndex].values.splice(valueIndex,1);
      if (enums[enumIndex].values.length === 0) {
        enums[enumIndex].errors.values = "cannot be empty"
      } else {
        delete enums[enumIndex].errors.values;
      }
      this.setState({ enums });
    }
    addNewProperty() {
      const properties = Array.from(this.state.properties);
      properties.push({
        name: "",
        type: "",
        recordType: "",
        errors: {
          name: "cannot be blank",
          type: "cannot be blank",
          recordType: "cannot be blank",
        }
      });
      this.setState({ properties });
    }
    updatePropertyName(propertyIndex, newName) {
      const properties = Array.from(this.state.properties);
      properties[propertyIndex].name = newName;
      if (newName.length === 0) {
        properties[propertyIndex].errors.name = "cannot be blank"
      } else {
        const names = properties.map(p => p.name);
        if (names.indexOf(newName) !== propertyIndex) {
          properties[propertyIndex].errors.name = "must be unique";
        } else {
          delete properties[propertyIndex].errors.name;
        }
      }
      this.setState({ properties });
    }
    updatePropertyType(propertyIndex, selectedIndex) {
      const types = getTypes(this.state.enums);
      const properties = Array.from(this.state.properties);
      properties[propertyIndex].type = types[selectedIndex];
      delete properties[propertyIndex].errors.type;
      this.setState({ properties });
    }
    updatePropertyRecordType(propertyIndex, selectedIndex) {
      const properties = Array.from(this.state.properties);
      properties[propertyIndex].recordType = recordTypes[selectedIndex];
      delete properties[propertyIndex].errors.recordType;
      this.setState({ properties });
    }
    deleteProperty(propertyIndex) {
      const properties = Array.from(this.state.properties);
      properties.splice(propertyIndex,1);
      let propertiesError = undefined;
      if (properties.length === 0) {
        propertiesError = "cannot be empty"
      }
      this.setState({ properties, propertiesError });
    }
    downloadProfile() {
      // todo
    }
    hasErrors() {
      // todo
    }
    render() {
      return (<>
        <h2 className="text-center">Build Scouting Profile</h2>
        <div className="card border-3">
          <div className="card-header pb-0 bg-secondary">
            <ul className="nav nav-tabs nav-fill m-0 border-bottom-0">
              <li className="nav-item">
                <a className={`nav-link ${this.state.selectedTab==="Profile"?"active bg-dark text-light border-dark":"text-light"}`} href="#" onClick={(e) => this.selectTab(e, "Profile")}>Profile</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${this.state.selectedTab==="Enums"?"active bg-dark text-light border-dark":"text-light"}`} href="#" onClick={(e) => this.selectTab(e, "Enums")}>Enums</a>
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
                      {e.expanded&&e.editing?<input value={e.name} onChange={(e) => this.updateEnumName(i,e.target.value)}/>:<h4 className="flex-grow-1">{e.name}</h4>}
                      <button className="btn btn-secondary" onClick={() => this.toggleEditing(i)}><i className="fa-solid fa-pencil"></i></button>
                      <button className="btn btn-secondary" onClick={() => this.toggleAccordion(i)}>
                        {e.expanded?<i className="fa-solid fa-angle-up"></i>:<i className="fa-solid fa-angle-down"></i>}
                      </button>
                      {e.expanded&&e.editing&&<>
                        <button className="btn btn-danger" onClick={() => this.deleteEnum(i)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </>}
                    </div>
                    {(e.errors.name||e.errors.values)&&<ul className="text-danger">
                      { e.errors.name && <li>{ e.errors.name }</li> }
                      { e.errors.values && <li>{ e.errors.values }</li> }
                    </ul>}
                  </div>
                  { e.expanded && <div className="card-body">
                    {e.editing?<>
                      <table>
                        <thead>
                          <tr>
                            <th>Label</th>
                            <th>Value</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.values.map(({ label, value, errors }, j) => {
                            return <tr>
                              <td>
                                <input className="form-control" value={label} onChange={(e) => this.updateEnumLabel(i,j,e.target.value)}/>
                                { errors.label && <ul className="text-danger">
                                  <li>{errors.label}</li>
                                </ul> }
                              </td>
                              <td>
                                <input className="form-control" type="number" value={value} onChange={(e) => this.updateEnumValue(i,j,e.target.value)}/>
                                { errors.value && <ul className="text-danger">
                                  <li>{errors.value}</li>
                                </ul> }
                              </td>
                              <td>
                                <button className="btn btn-danger" onClick={() => this.deleteEnumValue(i,j)}>
                                  <i className="fa-solid fa-xmark"></i>
                                </button>
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
                        {e.values.map(({ label, value, errors }, j) => {
                          return <tr>
                            <td>
                              <p>{label}</p>
                              { errors.label && <ul className="text-danger">
                                <li>{errors.label}</li>
                              </ul> }
                            </td>
                            <td>
                              <p>{value}</p>
                              { errors.value && <ul className="text-danger">
                                <li>{errors.value}</li>
                              </ul> }
                            </td>
                          </tr>;
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
              { this.state.propertyErrors&&<ul className="text-danger">
                <li>{this.state.propertyErrors}</li>
              </ul> }
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
                  {this.state.properties.map((property, i) => {
                    return <tr>
                      <td>
                        <input className="form-control" value={property.name} 
                          onChange={(e) => this.updatePropertyName(i,e.target.value)}/>
                        { property.errors.name && <ul className="text-danger">
                          <li>{property.errors.name}</li>
                        </ul> }
                      </td>
                      <td>
                        <input />
                        <select className="form-select" value={property.type} onChange={(e) => this.updatePropertyType(i,e.target.selectedIndex)}>
                          <option value="" disabled={property.type != ""}>Select one</option>
                          { basicTypes.map((type) => <option value={type}>{type}</option>) }
                          { this.state.enums.map((e) => <option value={e.name}>{e.name}</option>) }
                        </select>
                        { property.errors.type && <ul className="text-danger">
                          <li>{property.errors.type}</li>
                        </ul> }
                      </td>
                      <td>
                        <select className="form-select" value={property.recordType} onChange={(e) => this.updatePropertyRecordType(i,e.target.selectedIndex)}>
                          <option value="" disabled={property.recordType != ""}>Select one</option>
                          { recordTypes.map((type) => <option value={type}>{type}</option>) }
                        </select>
                        { property.errors.recordType && <ul className="text-danger">
                          <li>{property.errors.recordType}</li>
                        </ul> }
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={() => this.deleteProperty(i)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </td>
                    </tr>;
                  })}
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