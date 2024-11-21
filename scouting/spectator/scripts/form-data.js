namespace("frc2181.scouting.spectator.FormDataService", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax"
}, ({ Ajax }) => {
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
  const load = function(path, update) {
    state.step = update;
    Ajax.get(path, {
      success: (respText) => {
        const config = JSON.parse(respText);
        config.sections.map(s => s.fields).flat().forEach(f => (f.value = f.defaultValue));
        state.formData = config;
        commit();
      }
    })
  }
  const stateHandler = (() => state.formData);
  stateHandler.commit = commit;
  stateHandler.reset = reset;
  stateHandler.load = loadRecord;
  stateHandler.getRecord = getRecord;
  return { state: stateHandler, load };
});