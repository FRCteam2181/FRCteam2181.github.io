(() => {
  localStorage.setItem("scraper.data","[]");
  navigation.navigate(`https://frc-events.firstinspires.org/2024/MNDU/qualifications/1`);
})()

(() => {
  const baseUrl = "https://frc-events.firstinspires.org/2024/MNDU/qualifications/";
  const parseIntOrText = (i => {
    const text = i.textContent;
    const intVal = parseInt(text);
    return isNaN(intVal)?text:intVal;
  });
  const booleanFromIcon = ((icon) => {
    return !icon.getAttribute("class").includes("fa-times");
  });
  const getIconGroup = (cell => Array.from(cell.querySelectorAll("i")).map(booleanFromIcon));
  const fieldFunctions = {
    "Teams": cell => Array.from(cell.querySelectorAll("div.col-sm-4")).map(parseIntOrText),
    "Leave": getIconGroup,
    "Spotlit": getIconGroup,
    "Note In Trap": getIconGroup,
    "Coop Button Pressed": (cell => booleanFromIcon(cell.querySelectorAll("i")[0])),
    "Fouls/Techs Committed": cell => Array.from(cell.querySelectorAll("span")).map(parseIntOrText),
    "Ranking Points": cell => {
      const [melody, ensemble, ...wonMatch] = Array.from(cell.querySelectorAll("div.col-md-3")).map(div => div.querySelector("i")?true:false);
      return { melody, ensemble, wonMatch: wonMatch.filter(i => i).length };
    },
    "Coopertition Bonus": (cell => booleanFromIcon(Array.from(cell.querySelectorAll("i"))[0])),
  };
  const matchNumber = parseInt(document.location.pathname.split("/").reverse()[0]);
  const record = Array.from(document.querySelectorAll("tbody tr")).reduce((outval, row, rowIndex) => {
    const [header, blue, red] = row.querySelectorAll("td");
    const rowName = header.textContent;
    if (rowName.length > 0) {
      const func = fieldFunctions[rowName] || parseIntOrText;
      const key = `${rowName} (${rowIndex + 1})`;
      outval[key] = { blue: func(blue), red: func(red) };
    }
    return outval;
  }, { Match: matchNumber });
  const data = JSON.parse(localStorage.getItem("scraper.data"));
  data.push(record);
  localStorage.setItem("scraper.data",JSON.stringify(data));
  navigation.navigate(`${baseUrl}${matchNumber + 1}`);
})();
