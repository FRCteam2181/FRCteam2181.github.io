(() => {
  const scouters = {
    red: "CBD,XYZ,FBI".split(","),
    blue: "TCB,MIB,SOS".split(",")
  }
  const autoGamePiecePathOptions = "12345678".split("");
  const endPositions = "01243".split("");
  const skillRatings = "123x".split("");
  const simpleField = (fieldName) => ((record, color) => record[fieldName][color])
  const deepField = (fieldName) => ((record, color, index) => record[fieldName][color][index])
  const randomFromArray = (myArray) => (() => myArray[Math.floor(Math.random() * myArray.length)]);
  const mapper = {
    scouter: (_, color, index) => scouters[color][index],
    matchNumber: simpleField("Match"),
    robot: (_, color, index) => `${color.charAt(0).toUpperCase()}${index + 1}`,
    teamNumber: deepField("Teams (1)"),
    startPosition: (_, __, index) => ["1","2","3"][index],
    isNoShow: () => false,
    hasMoved: deepField("Leave (2)"),
    autoSpeakerScoredCount: simpleField("Speaker Note Count (4)"),
    autoSpeakerMissedCount: () => 0,
    autoGamePiecePath: () => autoGamePiecePathOptions.filter(() => Math.random() >= 0.5).join(""),
    autoFoulCount: (record, color) => record["Fouls/Techs Committed (26)"][color][0],
    ampScoredCount: simpleField("Amp Note Count (10)"),
    speakerScoredCount: (record, color) => record["Speaker Note Un-amplified Count (11)"][color] + record["Speaker Note Amplified Count (12)"][color],
    feederShotsCount: () => 0,
    noteInTrapCount: deepField("Note In Trap (17)"),
    teleopFoulCount: (record, color) => record["Fouls/Techs Committed (26)"][color][1],
    endPosition: randomFromArray(endPositions),
    offenseSkillRating: randomFromArray(skillRatings),
    defenseSkillRating: randomFromArray(skillRatings),
    hasDiedOrTippedOver: () => (Math.random() > 0.95),
    yellowRedCard: (record) => record["Penalties (28)"]?"Yellow":"None",
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