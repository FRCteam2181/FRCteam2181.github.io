namespace("frc2181.scouting.spectator.LoadingBar", {}, () => {
  return function({ classes, label }) {
    const chars = label.toUpperCase().split("");
    return <h1 className={`loading ${classes}`}>
      { chars.map((ch, i) => <span style={{animationDelay: `${i}s`}}>{ch}</span> )}
    </h1>;
  }
});