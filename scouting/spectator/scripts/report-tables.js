namespace("frc2181.scouting.spectator.ReportTables", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
}, ({ FormDataService }) => {
  const directions = {
    "asc": 1,
    "desc": -1
  }
  const buildSorter = function(report) {
    return function(a,b) {
      return report.orderBy.reduce((acc, { field, direction }) => {
        if(acc !== 0) {
          return acc;
        }
        return directions[direction] * (a[field] - b[field]);
      }, 0);
    }
  }
  const formData = FormDataService.state;
  return function({ allData }) {
    const aggBy = formData().aggregateBy;
    const allHeaders = formData.getAggregatorHeaders().reduce((acc, header) => {
      acc[header.code] = header;
      return acc;
    }, {});
    return (<>
      { formData().reports.map(report => {
        const headers = [allHeaders[aggBy]].concat(report.orderBy.map(({ field }) => allHeaders[field]));
        const data = allData.map(row => {
          const init = {};
          init[aggBy] = row[aggBy];
          return report.orderBy.reduce((acc,{ field }) => {
            acc[field] = row[field];
            return acc;
          }, init)});
        data.sort(buildSorter(report));
        return <div className="card m-2 rounded rounded-3">
          <div className="card-header text-center">
            <h2 className="card-title text-gears-dark">{report.reportTitle}</h2>
          </div>
          <div className="card-body m-0 p-0">
            <div className="frame-box w-100 table-wrapper mb-0" style={{ height: `${Math.min(screen.availHeight, window.innerHeight) - 100}px` }}>
              <table className="text-light">
                <thead>
                  <tr>
                    { headers.map(header => <th>{header.sectionTitle}</th>)}
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
            </div>
          </div>
        </div>;
      })}
    </>);
  }
})
