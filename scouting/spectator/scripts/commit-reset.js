namespace("frc2181.scouting.spectator.CommitAndResetSection", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
}, ({ FormDataService }) => {
  const formData = FormDataService.state;
  const missingRequiredFields = () => {
    return formData().sections.map(s => s.fields).flat().filter(f => {
      return f.required && (f.value === null || f.value === undefined || f.value === ``);
    });
  };
  return function(props) {
    return (<div className="w-100 d-flex justify-content-around">
      <div className="frame-box d-flex justify-content-around p-1">
        <button
          className="btn btn-success m-2"
          type="button"
          onClick={props.onCommit}
          disabled={missingRequiredFields.length > 0}
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
