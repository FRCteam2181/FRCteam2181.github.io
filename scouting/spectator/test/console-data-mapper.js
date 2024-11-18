(() => {
  const scouters = {
    red: "CBD,XYZ,FBI".split(","),
    blue: "TCB,MIB,SOS".split(",")
  }
  const robots = [
    "Red 1",
    "Red 2",
    "Red 3",
    "Blue 1",
    "Blue 2",
    "Blue 3"
  ];
  const simpleField = (fieldName) => ((record) => record[fieldName])
  const simpleColorField = (fieldName) => ((record, color) => record[fieldName][color])
  const deepField = (fieldName) => ((record, color, index) => record[fieldName][color][index])
  const randomFromCount = (count) => (() => Math.floor(Math.random() * count));
  const randomFromBitCount = (bitCount) => (() => Math.floor(Math.random() * Math.pow(2, bitCount)));
  const mapper = {
    scouter: (_, color, index) => scouters[color][index],
    matchNumber: simpleField("Match"),
    robot: (_, color, index) => robots.indexOf(`${color.charAt(0).toUpperCase()}${color.slice(1)} ${index + 1}`),
    teamNumber: deepField("Teams (1)"),
    startPosition: (_, __, index) => index,
    isNoShow: () => false,
    hasMoved: deepField("Leave (2)"),
    autoSpeakerScoredCount: simpleColorField("Speaker Note Count (4)"),
    autoSpeakerMissedCount: () => 0,
    autoGamePiecePath: randomFromBitCount(8),
    autoFoulCount: (record, color) => record["Fouls/Techs Committed (26)"][color][0],
    ampScoredCount: simpleColorField("Amp Note Count (10)"),
    speakerScoredCount: (record, color) => record["Speaker Note Un-amplified Count (11)"][color] + record["Speaker Note Amplified Count (12)"][color],
    feederShotsCount: () => 0,
    noteInTrapCount: deepField("Note In Trap (17)"),
    teleopFoulCount: (record, color) => record["Fouls/Techs Committed (26)"][color][1],
    endPosition: randomFromCount(5),
    offenseSkillRating: randomFromCount(4),
    defenseSkillRating: randomFromCount(4),
    hasDiedOrTippedOver: () => (Math.random() > 0.95),
    yellowRedCard: (record) => record["Penalties (28)"]?1:0,
    comments: (record, color, index) => `Hi There! ${scouters[color][index]} - match (${record["Match"]})`,
  }
  const mappedData = JSON.parse(localStorage.getItem("scraper.data")).reduce((reports, matchRecord) => {
    ["red","blue"].forEach(color => {
      [0, 1, 2].forEach(index => {
        reports.push(Object.entries(mapper).reduce((outval, [key,func]) => {
          outval[key] = func(matchRecord, color, index);
          return outval;
        }, {}));
      });
    });
    return reports;
  }, []);
  console.log({ mappedData });
  localStorage.setItem("mapped.data", JSON.stringify(mappedData));
})();