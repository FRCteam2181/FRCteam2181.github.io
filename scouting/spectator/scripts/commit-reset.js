namespace("frc2181.scouting.spectator.CommitAndResetSection", {
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Section": "Section",
}, ({ FormDataService, Section }) => {
  const formData = FormDataService.state;
  const missingRequiredFields = () => {
    return formData().sections.map(s => s.fields).flat().filter(f => {
      return f.required && (f.value === null || f.value === undefined || f.value === ``);
    });
  };
  return function(props) {
    return (<div className="w-100 d-flex justify-content-around">
      <Section>
        <div className="w-100 d-flex justify-content-around">
          <div>
            <button
              className="btn-success mb-2"
              type="button"
              onClick={props.onCommit}
              disabled={missingRequiredFields.length > 0}
            >Commit</button>
          </div>
          <div>
            <button
              className="btn-danger"
              type="button"
              onClick={() => formData.reset()}
            >Reset Form</button>
          </div>
        </div>
      </Section>
    </div>);
  }
});
