namespace("frc2181.scouting.spectator.Section", {}, () => {
  return function(props) {
    return (<div className="mb-4 bg-gears-dark border border-light border-3 rounded-3 section-style" key={props.title}>
      { props.title && <h2 className="text-center text-info">{props.title}</h2> }
      <div className="py-2 m-3">
        {props.children}
      </div>
    </div>);
  }  
});