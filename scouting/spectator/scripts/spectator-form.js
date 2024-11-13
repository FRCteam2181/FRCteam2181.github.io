namespace("frc2181.scouting.spectator.SpectatorForm", {
  "frc2181.scouting.spectator.CommitAndResetSection": "CommitAndResetSection",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Logo": "Logo",
  "frc2181.scouting.spectator.Sections": "Sections"
}, ({ CommitAndResetSection, FormDataService, Logo, Sections }) => {
  const formData = FormDataService.state;
  return function(props){
    return (<>
      <main className="px-4">
        <h1 className="text-center text-gears-dark">{formData().page_title}</h1>
        <form className="w-100" onSubmit={e => e.preventDefault()}>
          <Sections />
          <CommitAndResetSection onCommit={props.onCommit} />
          { /* <ConfigSection /> */ }
        </form>
      </main>
      <footer>
        <div className="d-flex flex-column justify-content-center">
          <Logo />
        </div>
      </footer>
    </>);
  }
});