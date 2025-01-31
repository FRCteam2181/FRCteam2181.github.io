function drawBoard() {
  const keys = {
    GH: ["solid.g", "solid.h"],
    EF: ["solid.e", "solid.f"],
    IJ: ["solid.i", "solid.j"],
    CD: ["solid.c", "solid.d"],
    KL: ["solid.k", "solid.l"],
    AB: ["solid.a", "solid.b"],
    "<": ["regular.circle-left"],
    ">": ["regular.circle-right"],
    L4: ["solid.l", "solid.4"],
    L3: ["solid.l", "solid.3"],
    CF: ["solid.c", "solid.f"],
    L2: ["solid.l", "solid.2"],
    L1: ["solid.l", "solid.1"],
    BG: ["solid.b", "solid.g"],
    A3: ["solid.a", "solid.3"],
    GD: ["solid.g", "solid.d"],
    A2: ["solid.a", "solid.2"],
    PC: ["solid.p", "solid.c"],
    T: ["solid.recycle"],
    S: ["solid.circle-stop"],
    GO: ["solid.g", "solid.o"],
    Ej: ["solid.eject"]
  }
  const offsets = {
    1: [-0.5],
    2: [-1, 0]
  }
  const defs = Object.entries(keys).map(([label, refs]) => {
    const offset = offsets[refs.length];
    return `<g id="${label}">
          ${refs.map((ref, i) => {
      const { width, height, path } = allRefs[ref];
      const y = -height / 2;
      const x = width * offset[i];
      return `<path d="${path}" transform="translate(${x},${y})"/>`;
    })}
        </g>`;
  });
  const widths = {
    1: 512,
    2: 800
  }
  const sections = {
    reef:{
      diameter: 27.1,
      aMult: 25,
      xOffset: 50,
      yOffset: 140,
      xMult: Math.sqrt(3),
      yMult: 1
    },
    elevator:{
      diameter: 27.1,
      aMult: 30,
      xOffset: 200,
      yOffset: 140,
      xMult: 1,
      yMult: 1
    },
    big:{
      diameter: 60,
      aMult: 80,
      xOffset: -30,
      yOffset: -20,
      xMult: 1,
      yMult: 1
    },
  }
  const rawData = [
    ["reef",1,0,"GH","green","white"],
    ["reef",0,1,"EF","yellow","black"],
    ["reef",2,1,"IJ","blue","white"],
    ["reef",0,3,"CD","yellow","black"],
    ["reef",2,3,"KL","blue","white"],
    ["reef",1,4,"AB","green","white"],
    ["reef",0,5,"<","white","black"],
    ["reef",2,5,">","white","black"],
    ["elevator",1,0,"L4","black","white"],
    ["elevator",0,1,"L3","black","white"],
    ["elevator",1,2,"CF","yellow","black"],
    ["elevator",0,3,"L2","black","white"],
    ["elevator",1,4,"L1","black","white"],
    ["elevator",2.5,0,"BG","red","white"],
    ["elevator",3.5,1,"A3","red","white"],
    ["elevator",2.5,2,"GD","yellow","black"],
    ["elevator",3.5,3,"A2","red","white"],
    ["elevator",2.5,4,"PC","red","white"],
    ["big",2,1,"S","white","red"],
    ["big",3,1,"GO","green","white"],
    ["big",1,1,"T","white","black"],
    ["big",4,1,"Ej","blue","white"],
  ];
  const buttons = rawData.map(([section, col, row, label, btnColor, labelColor]) => {
    const {diameter, aMult, xOffset, yOffset, xMult, yMult} = sections[section];
    const x = xOffset + aMult * xMult * col;
    const y = yOffset + aMult * yMult * row;
    return [diameter, x, y, label, btnColor, labelColor];
  });
  const width = 350;
  const height = 330;
  document.getElementById("page").innerHTML = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
    <defs>${defs}</defs>
    <rect width="${width}" height="${height}" fill="none" stroke-width="10" stroke="black" />
    ${buttons.map(([d, cx, cy, label, btnColor, labelColor]) => `<g>
        <circle r="${d / 2}" cx="${cx}" cy="${cy}" fill="${btnColor}" stroke="black" stroke-width="${d / 10}"/>
        <use href="#${label}" transform="translate(${cx},${cy}) scale(${d / widths[label.length]})" fill="${labelColor}"/>
      </g>`)}
    </svg>`;
  document.getElementById("page2").innerHTML = `<table>
    <thead>
      <tr>
        <th>Label</th>
        <th>Cx</th>
        <th>Cy</th>
        <th>Color</th>
        <th>Diameter</th>
      </tr>
    </thead>
    <tbody>
    ${buttons.map(([diameter, cx, cy, label, btnColor]) => {
      return `<tr>
        <td>${label}</td>
        <td>${cx}</td>
        <td>${cy}</td>
        <td>${btnColor}</td>
        <td>${diameter}</td>
      </tr>`
    })}
    </tbody>
  </table>`;
}
