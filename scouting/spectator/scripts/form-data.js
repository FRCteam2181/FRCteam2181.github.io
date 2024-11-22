namespace("frc2181.scouting.spectator.FormDataService", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax",
  "frc2181.scouting.spectator.Aggregate": "Aggregate"
}, ({ Ajax, Aggregate }) => {
  const state = {};
  const commit = ((update) => state.step(Object.assign({ now: (new Date()).getTime() }, update)));
  const reset = ((updateOnCommit) => {
    state.formData.sections.filter(s => !s.preserveDataOnReset).map(s => s.fields).flat().forEach(f => {
      if (!f.preserveDataOnReset) {
        f.value = f.defaultValue;
      } else if (
        (f.type === 'number' || f.type === 'counter') &&
        f.autoIncrementOnReset
      ) {
        f.value = f.value + 1;
      }
    });
    commit(updateOnCommit);
  });
  const getRecord = (() => state.formData.sections.map(s=> s.fields).flat().reduce((outval,f) => {
    outval[f.code] = f.value;
    return outval;
  }, {}));
  const loadRecord = ((record) => {
    state.formData.sections.map(s=> s.fields).flat().forEach(f => {
      const value = record[f.code];
      if (value != undefined) {
        f.value = value;
      }
    });
  })
  const getFieldAggregators = function() {
    return state.formData.sections.map(s => s.fields.filter(f => f.aggregate).map(f => {
      return f.aggregate.map(a => {
        a.sectionName = s.name;
        a.fieldCode = f.code;
        return a;
      }).flat();
    })).flat();
  }
  const load = function(path, update) {
    state.step = update;
    Ajax.get(path, {
      success: (respText) => {
        const config = JSON.parse(respText);
        config.sections.forEach(s => s.fields.forEach(f => {
          f.value = f.defaultValue;
          f.sectionName = s.name;
        }));
        state.formData = config;
        state.aggregator = Aggregate.buildAggregator(config.aggregateBy, getFieldAggregators());
        commit();
      }
    })
  }
  const getAggregatorHeaders = function() {
    const { sectionName, title, code } = state.formData.sections.map(s => s.fields).flat().find(f => f.code === state.formData.aggregateBy)
    return [{ sectionName, title, code }].concat(getFieldAggregators().map(({ sectionName, title, code }) => Object.create({ sectionName, title, code })));
  }
  const stateHandler = (() => state.formData);
  stateHandler.commit = commit;
  stateHandler.reset = reset;
  stateHandler.load = loadRecord;
  stateHandler.getRecord = getRecord;
  stateHandler.getAggregatorHeaders = getAggregatorHeaders;
  stateHandler.aggregate = (dataTable) => state.aggregator(dataTable);
  return { state: stateHandler, load };
});