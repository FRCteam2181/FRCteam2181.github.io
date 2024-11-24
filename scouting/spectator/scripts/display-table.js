namespace("frc2181.scouting.spectator.DisplayTable", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
}, ({ FormDataService }) => {
  const formData = FormDataService.state;
  return function({ data, onEdit, onDelete }) {
    const fields = formData().sections.map(s => s.fields.map(f => Object.assign(f, { sectionTitle: s.title }))).flat();
    fields.sort((f1,f2) => f1.columnOrder - f2.columnOrder);
    return (<div className="frame-box w-100 table-wrapper" style={{ height: `${Math.min(screen.availHeight, window.innerHeight) - 100}px` }}>
      <table className="text-light">
        <thead>
          <tr>
            <th></th>
            <th></th>
            {fields.map(f => <th key={f.code} className="text-center">
              {f.sectionTitle}
            </th>)}
          </tr>
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
    </div>);
  }
});