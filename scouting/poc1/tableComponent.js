namespace("2181robotics.scouting.TableComponent", () => {
  const TableComponent = function({ headers, records }) {
    console.log({ headers, records })
    return <table>
      <thead>
        <tr>
          { Object.values(headers).map( (header,i) => <th key={`header${i}`}>{header}</th> ) }
        </tr>
      </thead>
      <tbody>
        { records.map((record,r) => {
          return <tr key={`row${r}`}>
            { Object.keys(headers).map((header,c) => {
              return <td  key={`cell${r}x${c}`}>{record[header]}</td>;
            }) }
          </tr>;
        }) }
      </tbody>
    </table>
  }
  TableComponent.parseDataFromCSV = function(csvData) {
    const headers = csvData.shift().reduce((outval,headerLabel) => {
      const key = headerLabel.substr(0,1).toLowerCase() + headerLabel.substr(1).replaceAll(" ","");
      outval[key] = headerLabel;
      return outval;
    }, {});
    const records = csvData.map((row) => Object.keys(headers).reduce((outval,header,i) => {
      outval[header] = row[i];
      return outval;
    }, {}));
    return { headers, records };
  }
  return TableComponent;
});