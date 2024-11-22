namespace("frc2181.scouting.spectator.AggregateTable", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
}, ({ FormDataService }) => {
  const formData = FormDataService.state;
  return function({ data }) {
    const headers = formData.getAggregatorHeaders();
    return (<div className="frame-box w-100 table-wrapper" style={{ height: `${Math.min(screen.availHeight, window.innerHeight) - 100}px` }}>
      <table className="text-light">
        <thead>
          <tr>
            { headers.map(header => <th>{header.sectionName}</th>)}
          </tr>
          <tr>
            { headers.map(header => <th>{header.title}</th>)}
          </tr>
        </thead>
        <tbody>
          { data.map(row => <tr>
            {headers.map(header => <td>{row[header.code]}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>);
  }
});