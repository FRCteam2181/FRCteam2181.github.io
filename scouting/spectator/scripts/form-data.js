namespace("frc2181.scouting.spectator.FormDataService", {
  "gizmo-atheneum.namespaces.Ajax": "Ajax",
  "frc2181.scouting.spectator.Aggregate": "Aggregate"
}, ({ Ajax, Aggregate }) => {
  const inputTypeOf = {
    "text": "string",
    "number": "number",
    "boolean": "boolean",
    "range": "number",
    "counter": "number",
    "enum": "number",
    "enum-set": "number",
    "markdown": "string"
  }
  const state = {};
  const commit = ((update) => state.step(Object.assign({ now: (new Date()).getTime() }, update)));
  const getFields = () => state.formData.sections.map(s => s.fields).flat();
  const reset = ((updateOnCommit) => {
    getFields().forEach(f => {
      if (!f.preserveDataOnReset) {
        f.value = f.defaultValue;
      } else if ((f.type === 'number' || f.type === 'counter') && f.autoIncrementOnReset) {
        f.value = f.value + 1;
      }
    });
    commit(updateOnCommit);
  });
  const getRecord = (() => getFields().reduce((outval,f) => {
    outval[f.code] = f.value;
    return outval;
  }, {}));
  const loadRecord = ((record) => {
    getFields().forEach(f => {
      const value = record[f.code];
      if (value != undefined) {
        f.value = value;
      }
    });
  })
  const getFieldAggregators = function() {
    return state.formData.sections.map(s => s.fields.filter(f => f.aggregate).map(f => {
      return f.aggregate.map(a => {
        a.sectionTitle = s.title;
        a.fieldCode = f.code;
        return a;
      });
    }).flat()).flat();
  }
  const load = function(path, update) {
    state.step = update;
    Ajax.get(path, {
      success: (respText) => {
        const config = JSON.parse(respText);
        config.sections.forEach(s => s.fields.forEach(f => {
          f.value = f.defaultValue;
          f.sectionTitle = s.title;
        }));
        state.formData = config;
        state.aggregator = Aggregate.buildAggregator(config.aggregateBy, getFieldAggregators());
        commit();
      }
    })
  }
  const validateData = function(saveData, fileName) {
    const errors = saveData.reduce((acc, row, rowIndex) => {
      return getFields().reduce((outval, field) => {
        if(field.required && !(field.code in row)) {
          outval.push({
            code: field.code,
            row: rowIndex,
            error: "Required!"
          });
        }
        const value = row[field.code]
        const dataType = (typeof value);
        if(dataType !== inputTypeOf[field.type]) {
          outval.push({
            code: field.code,
            row: rowIndex,
            fieldType: field.type,
            fieldTypeOf: inputTypeOf[field.type],
            dataType,
            error: "Invalid Type!"
          });
        }
        if(field.required && dataType === "string" && value.length === 0) {
          outval.push({
            code: field.code,
            row: rowIndex,
            error: "Required Value Is Empty!"
          });
        }
        if(!isNaN(field.min) && value < field.min) {
          outval.push({
            code: field.code,
            row: rowIndex,
            min: field.min,
            value,
            error: "Value Out Of Range!"
          });
        }
        if(!isNaN(field.max) && value > field.max) {
          outval.push({
            code: field.code,
            row: rowIndex,
            max: field.max,
            value,
            error: "Value Out Of Range!"
          });
        }
        return outval;
      }, acc);
    }, []);
    if (errors.length > 0) {
      throw { errors, message: `"${fileName}" does not contain valid data for "${state.formData.page_title}"!` };
    }
  }
  const getAggregatorHeaders = function() {
    const { sectionTitle, title, code } = getFields().find(f => f.code === state.formData.aggregateBy)
    return [{ sectionTitle, title, code }].concat(getFieldAggregators().map(({ sectionTitle, title, code }) => Object.create({ sectionTitle, title, code })));
  }
  const stateHandler = (() => state.formData);
  stateHandler.commit = commit;
  stateHandler.reset = reset;
  stateHandler.load = loadRecord;
  stateHandler.getRecord = getRecord;
  stateHandler.getAggregatorHeaders = getAggregatorHeaders;
  stateHandler.validate = validateData
  stateHandler.aggregate = (dataTable) => state.aggregator(dataTable);
  return { state: stateHandler, load };
});