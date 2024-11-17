namespace("frc2181.scouting.spectator.DisplayTable", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Section": "Section",
}, ({ FormDataService, Section }) => {
  const formData = FormDataService.state;
  return function({ data, onAdd, onEdit, onDelete }) {
    const fields = formData().sections.map(s => s.fields).flat();
    return (<div className="d-flex flex-column justify-content-center">
      <div className="m-2 d-flex justify-content-center">
        <button title="Add New Record" className="btn btn-primary m-2 " onClick={onAdd}>
          <h2 className="text-center align-middle mb-0"><i className="fas fa-file-circle-plus"></i></h2>
        </button>
        <button title="Load Data From File" className="btn btn-primary m-2" onClick={() => {}}>
          <h2 className="text-center align-middle mb-0"><i className="fas fa-file-import"></i></h2>
        </button>
        <button title="Save Data" className="btn btn-primary m-2" onClick={() => {}}>
          <h2 className="text-center align-middle mb-0"><i className="far fa-floppy-disk"></i></h2>
        </button>
        <button title="Download Table" className="btn btn-primary m-2" onClick={() => {}}>
          <h2 className="text-center align-middle mb-0"><i className="fas fa-table-cells"></i></h2>
        </button>
        <button title="Clear Table" className="btn btn-danger m-2" onClick={() => {}}>
          <h2 className="text-center align-middle mb-0"><i className="far fa-file-excel"></i></h2>
        </button>
      </div>
      <div className="frame-box w-100 table-wrapper" style={{ height: `${Math.min(screen.availHeight, window.innerHeight) - 100}px` }}>
        <table className="text-light">
          <thead>
            <tr>
              <th></th>
              <th></th>
              {fields.map(f => <th key={f.code} className="text-center">
                {f.title}
              </th>)}
            </tr>
          </thead>
          <tbody style={{}}>
            { data.map((row, i) => <tr key={`row${i}`}>
              <td className="text-center align-middle">
                <button title="Edit Record" className="btn btn-secondary" onClick={() => onEdit(i)}>
                  <i className="fas fa-pencil"></i>
                </button>
              </td>
              <td className="text-center align-middle">
                <button title="Delete Record" className="btn btn-danger" onClick={() => onDelete(i)}>
                  <i className="fas fa-xmark"></i>
                </button>
              </td>
              {fields.map(f => {
                const value = row[f.code];
                const dispVal = (typeof value === "boolean")?(value?"Yes":"No"):value;
                return <td key={`cell${i}-${f.code}`} className="text-center align-middle text-nowrap" title={f.title}>
                  {dispVal}
                </td>
              })}
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
  }
});