namespace("2181robotics.beach-bash.proto.ControllerMap", ()=> {
  const sortLabels = function(list) {
    const labels = Array.from(list).filter(({ control }) => !isNaN(control));
    labels.sort((a,b) => a.control - b.control);
    return labels.map(l => `${l.label} (${l.control})`).join(", ");
  }
  return class extends React.Component {
    constructor(props) {
      super(props);
      const me = this;
      me.state = {
        gamepads:[]
      };
      window.addEventListener("initGamepad",({detail:{ gamepad }}) => {
        console.log({ gamepad })
        const gamepads = Array.from(me.state.gamepads);
        gamepads[gamepad.index] = {
          axis: Array(gamepad.axes.length).fill("").map(a => Object.create({})),
          button: Array(gamepad.buttons.length).fill("").map(a => Object.create({})),
          index: gamepad.index,
          label: gamepad.id
        };
        console.log({ gamepads });
        me.setState({ gamepads });
      });
      window.addEventListener("gamepaddisconnected", (e) => {
        const gamepads = Array.from(me.state.gamepads);
        gamepads[e.gamepad.index] = undefined;
        me.setState({ gamepads });
      });  
      window.addEventListener("gamepadtriggered", ({ detail: { gamepadIndex, inputType, index: controlIndex, label }}) => {
        console.log({ event: "triggered", gamepadIndex, inputType, controlIndex, label })
        if (me.state.target) {
          const { type, index } = me.state.target;
          if (type != inputType) {
            me.setState({ target: undefined });
            alert(`types do not match: ${type}, ${inputType}`);
          } else {
            const gamepads = Array.from(me.state.gamepads);
            console.log({ gamepads, gamepadIndex, type, index, controlIndex,  })
            gamepads[gamepadIndex][type][index].control = controlIndex;
            me.setState({ gamepads, target: undefined });
          }
        }
      });  
    }
    setValue(gamepadIndex, type, index, value) {
      const gamepads = Array.from(this.state.gamepads);
      gamepads[gamepadIndex][type][index].label = value;
      this.setState({ gamepads });
    }
    abandon() {
      this.setState({ target: undefined });
    }
    render() {
      console.log({ target: this.state.target });
      return (<>
        <div className="d-flex justify-content-center">
          <dl>
            { this.state.gamepads.filter(g => g).map(g => {
              console.log({ g });
              return <>
                <dt>{g.label}</dt>
                <dd>Axes: {sortLabels(g.axis)}</dd>
                <dd>Buttons: {sortLabels(g.button)}</dd>
              </>;
            }) }
          </dl>
        </div>
        <div className="d-flex justify-content-center">
          { this.state.gamepads.filter(g => g).map(g => {
            return (<div className="d-flex flex-column w-25" key={`gamepad${g.index}`}>
                <h4>Axes</h4>
                <div>
                  {this.state.target && this.state.target.type === "axis" && <button onClick={() => this.abandon()}>Abandon</button>}
                </div>
                <table className="table">
                  <tbody>
                    { g.axis.map((axis,i) => (<tr key={`axis${i}`}>
                      <th>
                        {(this.state.target)?<>
                          { axis.label?<label className="text-danger">{axis.label}</label>:<></> }
                        </>:<>
                          <input type="text" value={axis.label||""} onChange={(e) => this.setValue(g.index, "axis", i, e.target.value)}/>
                        </>}
                      </th>
                      <td>
                        {(this.state.target && this.state.target.type === "axis" && this.state.target.index === i)?<>
                          <label className="text-danger">Pending...</label>
                        </>:<>
                          <button onClick={() => this.setState({ target: { type: "axis", index: i }})}>{isNaN(axis.control)?"-":axis.control}</button>
                        </>}
                      </td>
                    </tr>)) }
                  </tbody>
                </table>
                <h4>Buttons</h4>
                <div>
                  {this.state.target && this.state.target.type === "button" && <button onClick={() => this.abandon()}>Abandon</button>}
                </div>
                <table className="table">
                  <tbody>
                    { g.button.map((button,i,buttons) => (<tr key={`button${i}`}>
                      <th>
                        {(this.state.target && button.label)?<>
                          <label className="text-danger">{button.label}</label>
                        </>:<>
                          <input type="text" value={button.label} onChange={(e) => this.setValue(g.index, "button", i, e.target.value)}/>
                        </>}
                      </th>
                      <td>
                        {(this.state.target && this.state.target.type === "button" && this.state.target.index === i)?<>
                          <label className="text-danger">Pending...</label>
                        </>:<>
                          <button onClick={() => this.setState({ target: { type: "button", index: i }})}>{isNaN(button.control)?"-":button.control}</button>
                        </>}
                      </td>
                    </tr>)) }
                  </tbody>
                </table>
              </div>);
          }) }
        </div>
      </>);
    }
  };
});