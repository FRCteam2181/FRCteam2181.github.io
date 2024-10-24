namespace("2181robotics.scouting.Analyze", () => {
  const calcTotalsWinsLosses = function({ records }) {
    const matchTeamFinals = records.reduce((outval, { match, red1, red2, red3, redFinal, blue1, blue2, blue3, blueFinal }) => {
      match = parseInt(match.replace("Qualification ",""));
      const redWins = redFinal > blueFinal;
      return outval.concat([
        { match, team: red1, final: parseInt(redFinal), won: redWins },
        { match, team: red2, final: parseInt(redFinal), won: redWins },
        { match, team: red3, final: parseInt(redFinal), won: redWins },
        { match, team: blue1, final: parseInt(blueFinal), won: !redWins },
        { match, team: blue2, final: parseInt(blueFinal), won: !redWins },
        { match, team: blue3, final: parseInt(blueFinal), won: !redWins },
      ]);
    }, []);
    const byTeam = matchTeamFinals.reduce((outval, { match, team, final, won }) => {
      outval[team] = outval[team] || [];
      outval[team].push({ match, final, won })
      return outval;
    }, {});
    console.log({ records, matchTeamFinals, byTeam });
    const newRecords = Object.entries(byTeam).map(([team, matches]) => {
      const [ match1, match2, match3, match4, match5, match6 ] = matches.map(({ match, final, won }) => `${match}: ${final} (${won?"W":"L"})`);
      const wins = matches.filter(match => match.won).length;
      const total = matches.reduce((sum, { final }) => sum + final, 0);
      return { team, match1, match2, match3, match4, match5, match6, wins, losses: 6 - wins, total };
    });
    return {
      records: newRecords,
      headers: { 
        rank: "Rank",
        team: "Team", 
        total: "Total",
        wins: "Wins",
        losses: "Losses",
        match1: "Match 1", 
        match2: "Match 2", 
        match3: "Match 3", 
        match4: "Match 4", 
        match5: "Match 5", 
        match6: "Match 6", 
      }
    };
  }
  const rankBy = function(records, predicate) {
    records = records.map(r => Object.assign({}, r));
    records.sort(predicate);
    records.forEach((record, i) => {
      record.rank = i + 1;
    });
    return records;
  }
  const rankTotals = function(records) {
    return rankBy(records, (a,b) => b.total - a.total);
  }
  const rankWinsThenTotals = function(records) {
    return rankBy(records, (a,b) => {
      if (a.wins === b.wins) {
        return b.total - a.total;
      }
      return b.wins - a.wins;
    });
  }
  return { calcTotalsWinsLosses, rankTotals, rankWinsThenTotals };
});