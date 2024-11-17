namespace("frc2181.scouting.spectator.Sections", {
  "frc2181.scouting.spectator.FlagSet": "FlagSet",
  "frc2181.scouting.spectator.FormDataService": "FormDataService",
  "frc2181.scouting.spectator.Section": "Section"
}, ({ FlagSet, FormDataService, Section }) => {
  const formData = FormDataService.state;
  const fieldClasses = "mb-3 mx-2 field-style";
  const Label = function({ required, title, value }) {
    return (<label className="form-check-label text-uppercase fw-bolder" htmlFor={title}>
      <span className="text-info">{title}</span>
      { required && isNaN(value) && !value && 
        <span className="text-gears-danger">&nbsp;!!</span> }
    </label>)
  }
  const ToggleButton = function(props) {
    return <button key={props.toggleKey}
      className={`btn ${props.value?"gears-checked":"gears-unchecked"}`}
      onClick={() => props.onClick(!props.value)}>
      <Label {...props}/>
    </button>;
  }
  const Checkbox = function(data) {
    return (<div className={`text-center ${fieldClasses}`} key={data.code}>
      <ToggleButton {...data}/>
    </div>);
  }
  const CounterInput = function(data) {
    function handleChange(increment) {
      const newVal = data.value + increment;
      if (data.max !== undefined && newVal > data.max) {
        // Don't fire the event if the new value would be greater than the max
        return;
      }
      if (data.min !== undefined && newVal < data.min) {
        // Don't fire the event if the new value would be less than the min
        return;
      }
      data.onChange(newVal);
    }
    const buttonClasses = "btn btn-info";
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <div className="d-flex justify-content-center align-items-center">
        <div>
          <button
            className={buttonClasses}
            type="button"
            onClick={() => handleChange(-(data.step || 1))}
          ><i className="fas fa-minus"/></button>
        </div>
        <h2 className="px-3 mb-0 text-info">{data.value}</h2>
        <div>
          <button
            className={buttonClasses}
            type="button"
            onClick={() => handleChange(data.step || 1)}
          ><i className="fas fa-plus"/></button>
        </div>
      </div>
    </div>);
  }
  const NumberInput = function(data) {
    function handleChange(e) {
      e.preventDefault();
      data.onChange(Number(e.currentTarget.value));
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <input 
        type="number" 
        className="form-control" 
        id={data.code}
        min={data.min}
        max={data.max}
        value={data.value || data.defaultValue || ''}
        onChange={handleChange}
        />
    </div>);
  }
  const RangeInput = function(data) {
    function handleChange(e) {
      data.onChange(e.currentTarget.value);
      e.preventDefault();
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <input 
        type="range" 
        className="form-control" 
        id={data.code}
        min={data.min}
        max={data.max}
        defaultValue={data.defaultValue}
        value={data.value || data.defaultValue || ''}
        onChange={handleChange}
        />
    </div>);
  }
  const EnumInput = function(data) {
    function handleSelect(evt) {
      evt.preventDefault();
      data.onChange(evt.currentTarget.value);
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <select
        className="form-select"
        size={1}
        name={data.title}
        id={data.code}
        onChange={handleSelect}
        value={data.value}
      >
        {data.options.map((o,i) => {
          return (
            <option key={`select${data.code}-${i}`} value={i}>{o}</option>
          );
        })}
      </select>
    </div>);
  }
  const EnumSetInput = function(data) {
    const value = FlagSet.decode(data.options, data.value);
    const values = data.options.map((o) => value.indexOf(o) >= 0);
    console.log({ encoded: data.value, value });
    function handleSelect(index) {
      values[index] = !values[index];
      data.onChange(FlagSet.encode(data.options, data.options.filter((_,i) => values[i])));
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <div className="btn-group-vertical">
        { data.options.map((o,i) => <>
          <ToggleButton 
            toggleKey={`flag${data.code}-${i}`}
            required={false}
            title={o}
            value={values[i]}
            onClick={() => handleSelect(i)}
            />
        </>)}
      </div>
    </div>);
  }
  const StringInput = function(data) {
    const inputProps = {
      type: "text",
      className: "form-control",
      disabled: data.disabled,
      name: data.code,
      id: data.code,
      onChange: (e) => {
        e.preventDefault();
        data.onChange(e.currentTarget.value);
      },
      maxLength: data.max,
      minLength: data.min,
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      { data.value?<>
          <input
            {...inputProps}
            value={data.value}/>
        </>:<>
          <input
            {...inputProps}
            defaultValue={data.defaultValue}/>
        </>}
    </div>);
  }
  const MarkdownInput = function(data) {
    function handleChange(e) {
      e.preventDefault();
      data.onChange(e.currentTarget.value);
    }
    return (<div className={fieldClasses} key={data.title}>
      <Label {...data}/>
      <textarea
        className="form-control"
        disabled={data?.disabled}
        name={data.code}
        id={data.code}
        onChange={handleChange}
        defaultValue={!data?.value && data?.defaultValue}
        value={data?.value}
        maxLength={data.max}
        minLength={data.min}
      />
    </div>);
  }
  const inputSelector = (section, code) => {
    return formData().sections.find(s => s.name === section)?.fields.find(f => f.code === code);
  };
  const updateValue = function(sectionName, code, data) {
    let section = formData().sections.find(s => s.name === sectionName);
    if (section) {
      let field = section.fields.find(f => f.code === code);
      if (field) {
        field.value = data;
      }
    }
    formData.commit();
  }
  const ConfigurableInput = function(props) {
    const handleChange = function(data) {
      updateValue(props.section, props.code, data);
    }
    const input = inputSelector(props.section, props.code);
    if (!input) {
      return (
        <div key={input.title}>{`INPUT ${props.code} not found in section ${props.section}`} </div>
      );
    }
    switch (input.type) {
      case 'text':
        return (
          <StringInput
            key={input.title}
            {...input}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'markdown':
        return (
          <MarkdownInput
            key={input.title}
            {...input}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'enum':
        return (
          <EnumInput
            key={input.title}
            {...input}
            options={input.choices || { fail: 'no choices provided' }}
            defaultValue={input.defaultValue}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'enum-set':
        return (
          <EnumSetInput
            key={input.title}
            {...input}
            options={input.choices || { fail: 'no choices provided' }}
            defaultValue={input.defaultValue}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'number':
        return (
          <NumberInput
            key={input.title}
            {...input}
            onChange={handleChange}
            defaultValue={input.defaultValue}
            section={props.section}
          />
        );
      case 'boolean':
        return (
          <Checkbox
            key={input.title}
            {...input}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'counter':
        return (
          <CounterInput
            key={input.title}
            {...input}
            onChange={handleChange}
            section={props.section}
          />
        );
      case 'range':
        return (
          <RangeInput
            key={input.title}
            {...input}
            min={input.min}
            max={input.max}
            defaultValue={input.defaultValue}
            onChange={handleChange}
            section={props.section}
          />
        );
      default:
        return (
          <div className={fieldClasses} key={input.title}>
            <label
              htmlFor={input.title}
              className="form-label"
            >
              {input.title}
            </label>
            <div className="form-control" id={input.code}>
              <span className="text-danger">No Renderer for type: ${input.type}</span>
            </div>
          </div>
        );
    }
  }
  const FormSection = function(props) {
    const inputs = formData().sections.find(s => s.name === props.name)?.fields;
    return (
      <Section title={props.name}>
        <div className="d-flex flex-wrap justify-content-around">
          {inputs?.map((e) => (
            <ConfigurableInput key={e.title} section={props.name} code={e.code} />
          ))}
        </div>
      </Section>
    );
  }
  const Sections = function () {
    return (<div className="d-flex flex-wrap justify-content-around">
      {formData().sections.map(section => {
        return <FormSection key={section.name} name={section.name} />;
      })}
    </div>);
  }
  return Sections;
});