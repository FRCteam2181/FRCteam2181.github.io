namespace("frc2181.scouting.spectator.SpectatorForm", {
  "frc2181.scouting.spectator.CommitAndResetSection": "CommitAndResetSection",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Sections": "Sections"
}, ({ CommitAndResetSection, FormDataService, Sections }) => {
  const formData = FormDataService.state;
  return function(props){
    return (<>
        <form className="w-100" onSubmit={e => e.preventDefault()}>
          <Sections />
          <CommitAndResetSection onCommit={props.onCommit} onCancel={props.onCancel}/>
          { /* <ConfigSection /> */ }
        </form>
    </>);
  }
});