namespace("2181robotics.crescendo.CrescendoConstants", () => {
  const border = []
  const getDefs = function() {
    return `<g id="floor">
      <rect width="200" height="100" fill="grey" stroke="white" stroke-width="2"/>
      <rect x="2" y="2" width="196" height="96" fill="none" stroke="black" stroke-width="2"/>
      <line x1="2" y1="50" x2="198" y2="50" stroke="black" stroke-width="0.5"/>
      <line x1="100" y1="8" x2="100" y2="92" stroke="black" stroke-width="0.5"/>
      <line x1="51" y1="13" x2="51" y2="92" stroke="black"/>
      <line x1="149" y1="13" x2="149" y2="92" stroke="black"/>
      <line x1="82" y1="8" x2="82" y2="92" stroke="blue"/>
      <polygon fill="blue" points="30 45 40 40 40 30 30 25"/>
      <polygon fill="white" points="40 40 40 30 30 35"/>
      <polygon stroke="blue" fill="none" points="62 50 82 38 82 62"/>
      <line x1="118" y1="8" x2="118" y2="92" stroke="red"/>
      <polygon stroke="red" fill="none" points="138 50 118 38 118 62"/>
      <polygon fill="red" points="170 45 160 40 160 30 170 25"/>
      <polygon fill="white" points="160 40 160 30 170 35"/>
      <polyline stroke="red" fill="none" points="30 75 50 85 50 92"/>
      <polyline stroke="blue" fill="none" points="30 13 62 13 62 8"/>
      <polyline stroke="blue" fill="none" points="170 75 150 85 150 92"/>
      <polyline stroke="red" fill="none" points="138 8 138 13 170 13"/>
      <polygon stroke="black" fill="none" points="170 8 170 82 150 92 50 92 30 82 30 8"/>
    </g>
    <g id="ring">
      <circle cx="0" cy="0" r="1.5" fill="none" stroke="orange"/>
    </g>
    <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="yellow">
      </stop>
      <stop offset="100%" stop-color="green">
      </stop>
    </linearGradient>
    <pattern id="loading" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect y="0" width="6" height="6" fill="url(#gradient)">
        <animate 
          attributeName="y"
          begin="0s"
          dur="0.75s"
          from="6"
          to="0"
          repeatCount="indefinite"/>
      </rect>
      <rect y="-6" width="6" height="6" fill="url(#gradient)">
        <animate 
          attributeName="y"
          begin="0s"
          dur="0.75s"
          from="0"
          to="-6"
          repeatCount="indefinite"/>
      </rect>
    </pattern>`;
  };
  const intakeStates = {
    empty: "white",
    intakeOn: "yellow",
    loading: "url(#loading)",
    ready: "green"
  };
  const getIntakeStates = function() {
    return Object.keys(intakeStates);
  }
  const getIntakeStateColor = function(intakeState) {
    return intakeStates[intakeState];
  }
  const rings = [
    [60,20],
    [60,35],
    [60,50],
    [140,20],
    [140,35],
    [140,50],
    [100,20],
    [100,35],
    [100,50],
    [100,65],
    [100,80]
  ];
  const getInitRings = function() {
    return rings.map(xy => Array.from(xy));
  }
  const robots = [{
    id: 2181,
    color: "blue",
    x: 40,
    y: 55,
    r: 80,
    intakeState: "empty"
    /*
  }, {
    id: 2040,
    color: "blue",
    x: 40,
    y: 65,
    r: 80,
    intakeState: "intakeOn"
  }, {
    id: 4005,
    color: "blue",
    x: 40,
    y: 75,
    r: 80,
    intakeState: "ready"
  }, {
    id: 1234,
    color: "red",
    x: 160,
    y: 55,
    r: 280,
    intakeState: "loading"
  }, {
    id: 4321,
    color: "red",
    x: 160,
    y: 65,
    r: 280,
    intakeState: "empty"
  }, {
    id: 5678,
    color: "red",
    x: 160,
    y: 75,
    r: 280,
    intakeState: "ready"
    */
  }];
  const getInitRobots = function() {
    return robots.map(r => Object.assign({}, r));
  }
  return { getDefs, getIntakeStates, getIntakeStateColor, getInitRings, getInitRobots };
});