namespace("frc2181.scouting.spectator.CommitAndResetSection", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
}, ({ FormDataService }) => {
  const formData = FormDataService.state;
  const missingRequiredFieldsCount = (() => {
    const requireds = formData().sections.map(s => s.fields).flat().map(({ title, required, value }) => Object.assign({}, { title, required, value, missing: (required && (value === null || value === undefined || value === "")) }));
    console.log({ requireds });
    return requireds.filter(f => f.missing).length;
  });
  return function(props) {
    return (<div className="w-100 d-flex justify-content-around">
      <div className="frame-box d-flex justify-content-around p-1">
        <button
          className="btn btn-success m-2"
          type="button"
          onClick={props.onCommit}
          disabled={missingRequiredFieldsCount() > 0}
        >Commit</button>
        <button
          className="btn btn-warning m-2"
          type="button"
          onClick={props.onCancel}
        >Cancel</button>
        <button
          className="btn btn-danger m-2"
          type="button"
          onClick={() => formData.reset()}
        >Reset Form</button>
      </div>
    </div>);
  }
});
