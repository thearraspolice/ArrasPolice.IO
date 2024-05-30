const {
  combineStats,
  menu,
  addAura,
  makeDeco,
  LayeredBoss,
} = require("../facilitators.js");
const {
  base,
  gunCalcNames,
  basePolygonDamage,
  basePolygonHealth,
  dfltskl,
  statnames,
} = require("../constants.js");
const g = require("../gunvals.js");

// Menus
Class.developer = {
  PARENT: "genericTank",
  LABEL: "Developer",
  BODY: {
    SHIELD: 1000,
    REGEN: 10,
    HEALTH: 100,
    DAMAGE: 10,
    DENSITY: 20,
    FOV: 2,
  },
  SKILL_CAP: Array(10).fill(dfltskl),
  IGNORED_BY_AI: true,
  RESET_CHILDREN: true,
  ACCEPTS_SCORE: true,
  CAN_BE_ON_LEADERBOARD: true,
  CAN_GO_OUTSIDE_ROOM: false,
  DRAW_HEALTH: true,
  ARENA_CLOSER: false,
  INVISIBLE: [0, 0],
  ALPHA: [0, 1],
  HITS_OWN_TYPE: "hardOnlyTanks",
  SHAPE: [
    [-1, -0.8],
    [-0.8, -1],
    [0.8, -1],
    [1, -0.8],
    [0.2, 0],
    [1, 0.8],
    [0.8, 1],
    [-0.8, 1],
    [-1, 0.8],
  ],
  GUNS: [
    {
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op]),
        TYPE: "developerBullet",
      },
    },
  ],
};
Class.secret = {
  PARENT: "developer",
  LABEL: "Developer",
};
Class.spectator = {
  PARENT: "genericTank",
  LABEL: "Spectator",
  ALPHA: 0,
  IGNORED_BY_AI: true,
  CAN_BE_ON_LEADERBOARD: false,
  ACCEPTS_SCORE: false,
  DRAW_HEALTH: false,
  HITS_OWN_TYPE: "never",
  ARENA_CLOSER: true,
  SKILL_CAP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 255],
  BODY: {
    SPEED: 30,
    FOV: 2.5,
    DAMAGE: 0,
    HEALTH: 1e100,
    SHIELD: 1e100,
    REGEN: 1e100,
  },
};

Class.bosses = menu("Bosses");
Class.betatester = menu("Beta Tester");
Class.sentries = menu("Sentries", "pink", 3.5);
Class.sentries.PROPS = [
  {
    POSITION: [9, 0, 0, 0, 360, 1],
    TYPE: "genericEntity",
  },
];
Class.elites = menu("Elites", "pink", 3.5);
Class.mysticals = menu("Mysticals", "gold", 4);
Class.nesters = menu("Nesters", "purple", 5.5);
Class.rogues = menu("Rogues", "darkGrey", 6);
Class.rammers = menu("Rammers", "teal");
Class.rammers.PROPS = [
  {
    POSITION: [21.5, 0, 0, 360, -1],
    TYPE: "smasherBody",
  },
];
Class.terrestrials = menu("Terrestrials", "orange", 7);
Class.celestials = menu("Celestials", "lightGreen", 9);
Class.eternals = menu("Eternals", "veryLightGrey", 11);
Class.devBosses = menu("Developers", "lightGreen", 4);
Class.devBosses.UPGRADE_COLOR = "rainbow";

Class.tanks = menu("Tanks");
Class.unavailable = menu("Unavailable");
Class.dominators = menu("Dominators");
Class.dominators.PROPS = [
  {
    POSITION: [22, 0, 0, 360, 0],
    TYPE: "dominationBody",
  },
];
Class.sanctuaries = menu("Sanctuaries");
Class.sanctuaries.PROPS = [
  {
    POSITION: [22, 0, 0, 360, 0],
    TYPE: "dominationBody",
  },
  {
    POSITION: [13, 0, 0, 360, 1],
    TYPE: "healerSymbol",
  },
];

// Generators
function compileMatrix(matrix, matrix2Entrance) {
  let matrixWidth = matrix[0].length,
    matrixHeight = matrix.length;
  for (let x = 0; x < matrixWidth; x++)
    for (let y = 0; y < matrixHeight; y++) {
      let str = matrix[y][x],
        LABEL =
          str[0].toUpperCase() +
          str.slice(1).replace(/[A-Z]/g, (m) => " " + m) +
          " Generator",
        code = str + "Generator";
      Class[code] = matrix[y][x] = {
        PARENT: "spectator",
        LABEL,
        SKILL_CAP: [31, 0, 0, 0, 0, 0, 0, 0, 0, 31],
        TURRETS: [
          {
            POSITION: [5 + y * 2, 0, 0, 0, 0, 1],
            TYPE: str,
          },
        ],
        GUNS: [
          {
            POSITION: [14, 12, 1, 4, 0, 0, 0],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([g.basic, g.fake]),
              TYPE: "bullet",
            },
          },
          {
            POSITION: [12, 12, 1.4, 4, 0, 0, 0],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0 }]),
              INDEPENDENT_CHILDREN: true,
              TYPE: str,
            },
          },
        ],
      };
    }
}
function connectMatrix(matrix, matrix2Entrance) {
  let matrixWidth = matrix[0].length,
    matrixHeight = matrix.length;
  for (let x = 0; x < matrixWidth; x++)
    for (let y = 0; y < matrixHeight; y++) {
      let top = (y + matrixHeight - 1) % matrixHeight,
        bottom = (y + matrixHeight + 1) % matrixHeight,
        left = (x + matrixWidth - 1) % matrixWidth,
        right = (x + matrixWidth + 1) % matrixWidth,
        center = matrix[y][x];
      top = matrix[top][x];
      bottom = matrix[bottom][x];
      left = matrix[y][left];
      right = matrix[y][right];

      matrix[y][x].UPGRADES_TIER_0 = [
        "developer",
        top,
        "spectator",
        left,
        center,
        right,
        "basic",
        bottom,
        matrix2Entrance,
      ];
    }
}
let generatorMatrix = [
    ["egg", "gem", "jewel", "crasher", "sentry", "shinySentry", "EggRelic"],
    [
      "square",
      "shinySquare",
      "legendarySquare",
      "shadowSquare",
      "rainbowSquare",
      "transSquare",
      "SquareRelic",
    ],
    [
      "triangle",
      "shinyTriangle",
      "legendaryTriangle",
      "shadowTriangle",
      "rainbowTriangle",
      "transTriangle",
      "TriangleRelic",
    ],
    [
      "pentagon",
      "shinyPentagon",
      "legendaryPentagon",
      "shadowPentagon",
      "rainbowPentagon",
      "transPentagon",
      "PentagonRelic",
    ],
    [
      "betaPentagon",
      "shinyBetaPentagon",
      "legendaryBetaPentagon",
      "shadowBetaPentagon",
      "rainbowBetaPentagon",
      "transBetaPentagon",
      "BetaPentagonRelic",
    ],
    [
      "alphaPentagon",
      "shinyAlphaPentagon",
      "legendaryAlphaPentagon",
      "shadowAlphaPentagon",
      "rainbowAlphaPentagon",
      "transAlphaPentagon",
      "AlphaPentagonRelic",
    ],
    [
      "sphere",
      "cube",
      "tetrahedron",
      "octahedron",
      "dodecahedron",
      "icosahedron",
      "tesseract",
    ],
  ],
  gemRelicMatrix = [];
for (let tier of [
  "",
  "Egg",
  "Square",
  "Triangle",
  "Pentagon",
  "BetaPentagon",
  "AlphaPentagon",
]) {
  let row = [];
  for (let gem of ["Power", "Space", "Reality", "Soul", "Time", "Mind"]) {
    row.push(gem + (tier ? tier + "Relic" : "Gem"));
  }
  gemRelicMatrix.push(row);
}

compileMatrix(generatorMatrix);
compileMatrix(gemRelicMatrix);

// Tensor = N-Dimensional Array, BASICALLY
let labyTensor = [];
for (let tier = 0; tier < 6; tier++) {
  let row = [];
  for (let poly of ["Egg", "Square", "Triangle", "Pentagon", "Hexagon"]) {
    let column = [];
    for (let shiny of [
      "",
      "Shiny",
      "Legendary",
      "Shadow",
      "Rainbow",
      "Trans",
    ]) {
      let str = `laby${tier}${shiny}${poly}`,
        LABEL =
          str[0].toUpperCase() +
          str
            .slice(1)
            .replace(
              /\d/,
              (d) => ["", "Beta", "Alpha", "Omega", "Gamma", "Delta"][d],
            )
            .replace(/[A-Z]/g, (m) => " " + m) +
          " Generator",
        code = str + "Generator";
      column.push(
        (Class[code] = {
          PARENT: "spectator",
          LABEL,
          SKILL_CAP: [31, 0, 0, 0, 0, 0, 0, 0, 0, 31],
          TURRETS: [
            {
              POSITION: [5 + tier * 2, 0, 0, 0, 0, 1],
              TYPE: str,
            },
          ],
          GUNS: [
            {
              POSITION: [14, 12, 1, 4, 0, 0, 0],
              PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.fake]),
                TYPE: "bullet",
              },
            },
            {
              POSITION: [12, 12, 1.4, 4, 0, 0, 0],
              PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0 }]),
                INDEPENDENT_CHILDREN: true,
                TYPE: str,
              },
            },
          ],
        }),
      );
    }
    row.push(column);
  }
  labyTensor.push(row);
}

connectMatrix(generatorMatrix, "PowerGemGenerator");
connectMatrix(gemRelicMatrix, "laby0EggGenerator");

let tensorLength = labyTensor[0][0].length,
  tensorWidth = labyTensor[0].length,
  tensorHeight = labyTensor.length;
for (let x = 0; x < tensorWidth; x++)
  for (let y = 0; y < tensorHeight; y++)
    for (let z = 0; z < tensorLength; z++) {
      let top = (y + tensorHeight - 1) % tensorHeight,
        bottom = (y + tensorHeight + 1) % tensorHeight,
        left = (x + tensorWidth - 1) % tensorWidth,
        right = (x + tensorWidth + 1) % tensorWidth,
        front = (z + tensorLength - 1) % tensorLength,
        back = (z + tensorLength + 1) % tensorLength,
        center = labyTensor[y][x][z];
      top = labyTensor[top][x][z];
      bottom = labyTensor[bottom][x][z];
      left = labyTensor[y][left][z];
      right = labyTensor[y][right][z];
      front = labyTensor[y][x][front];
      back = labyTensor[y][x][back];

      labyTensor[y][x][z].UPGRADES_TIER_0 = [
        "developer",
        top,
        "spectator",
        left,
        center,
        right,
        "basic",
        bottom,
        "eggGenerator",
        front,
        "PowerGemGenerator",
        back,
      ];
    }

// Testing tanks
Class.diamondShape = {
  PARENT: "basic",
  LABEL: "Rotated Body",
  SHAPE: 4.5,
};

Class.mummyHat = {
  SHAPE: 4.5,
  COLOR: -1,
};
Class.mummy = {
  PARENT: "drone",
  SHAPE: 4,
  NECRO: [4],
  TURRETS: [
    {
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 360, 1],
      TYPE: ["mummyHat"],
    },
  ],
};
Class.mummifier = {
  PARENT: "genericTank",
  LABEL: "Mummifier",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    SPEED: 0.8 * base.SPEED,
  },
  SHAPE: 4,
  MAX_CHILDREN: 10,
  GUNS: [
    {
      POSITION: [5.5, 13, 1.1, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "mummy",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
    {
      POSITION: [5.5, 13, 1.1, 8, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "mummy",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
      },
    },
  ],
  TURRETS: [
    {
      POSITION: [20 * Math.SQRT1_2, 0, 0, 180, 360, 1],
      TYPE: ["mummyHat"],
    },
  ],
};
Class.miscTestHelper2 = {
  PARENT: "genericTank",
  LABEL: "Turret Reload 3",
  MIRROR_MASTER_ANGLE: true,
  COLOR: -1,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
        TYPE: "bullet",
        COLOR: -1,
      },
    },
  ],
};
Class.miscTestHelper = {
  PARENT: "genericTank",
  LABEL: "Turret Reload 2",
  //MIRROR_MASTER_ANGLE: true,
  COLOR: {
    BASE: -1,
    BRIGHTNESS_SHIFT: 15,
  },
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
        TYPE: "bullet",
        COLOR: -1,
      },
    },
  ],
  TURRETS: [
    {
      POSITION: [20, 0, 20, 30, 0, 1],
      TYPE: "miscTestHelper2",
    },
  ],
};
Class.miscTest = {
  PARENT: "genericTank",
  LABEL: "Turret Reload",
  COLOR: "teal",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.noSpread]),
        TYPE: "bullet",
      },
    },
  ],
  TURRETS: [
    {
      POSITION: [20, 0, 20, 30, 0, 1],
      TYPE: "miscTestHelper",
    },
  ],
};
Class.mmaTest2 = {
  PARENT: "genericTank",
  MIRROR_MASTER_ANGLE: true,
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [40, 4, 1, -20, 0, 0, 0],
    },
  ],
};
Class.mmaTest1 = {
  PARENT: "genericTank",
  COLOR: -1,
  // Somehow, removing the gun below causes a crash when the tank is chosen ??????
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
    },
  ],
  TURRETS: [
    {
      POSITION: [10, 0, 0, 0, 360, 1],
      TYPE: "mmaTest2",
    },
  ],
};
Class.mmaTest = {
  PARENT: "genericTank",
  LABEL: "Mirror Master Angle",
  TURRETS: [
    {
      POSITION: [10, 0, 0, 0, 360, 1],
      TYPE: "mmaTest2",
    },
    {
      POSITION: [20, 0, 20, 0, 360, 1],
      TYPE: "mmaTest1",
    },
  ],
};

Class.vulnturrettest_turret = {
  PARENT: "genericTank",
  COLOR: "grey",
  HITS_OWN_TYPE: "hard",
  LABEL: "Shield",
  COLOR: "teal",
};

Class.vulnturrettest = {
  PARENT: "genericTank",
  LABEL: "Vulnerable Turrets",
  TOOLTIP:
    "[DEV NOTE] Vulnerable turrets are still being worked on and may not function as intended!",
  BODY: {
    FOV: 2,
  },
  DANGER: 6,
  GUNS: [
    {
      POSITION: {},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
  TURRETS: (() => {
    let output = [];
    for (let i = 0; i < 10; i++) {
      output.push({
        POSITION: { SIZE: 20, X: 40, ANGLE: (360 / 10) * i },
        TYPE: "vulnturrettest_turret",
        VULNERABLE: true,
      });
    }
    return output;
  })(),
};

Class.turretLayerTesting = {
  PARENT: "genericTank",
  LABEL: "Turret Layer Testing",
  TURRETS: [
    {
      POSITION: [20, 10, 10, 0, 0, 2],
      TYPE: ["basic", { COLOR: "lightGrey", MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [20, 15, 5, 0, 0, 2],
      TYPE: ["basic", { COLOR: "grey", MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [20, 10, -5, 0, 0, 1],
      TYPE: ["basic", { COLOR: "darkGrey", MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [20, -10, -5, 0, 0, -2],
      TYPE: ["basic", { COLOR: "darkGrey", MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [20, -10, 5, 0, 0, -1],
      TYPE: ["basic", { COLOR: "grey", MIRROR_MASTER_ANGLE: true }],
    },
  ],
};

Class.alphaGunTest = {
  PARENT: "basic",
  LABEL: "Translucent Guns",
  GUNS: [
    {
      POSITION: {},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        ALPHA: 0.5,
      },
    },
  ],
};

// unfinished
Class.strokeWidthTest = {
  PARENT: "basic",
  LABEL: "Stroke Width Test",
  STROKE_WIDTH: 2,
  GUNS: [
    {
      POSITION: {},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        STROKE_WIDTH: 0.5,
      },
    },
  ],
};

Class.onTest = {
  PARENT: "genericTank",
  LABEL: "'ON' property",
  TOOLTIP: [
    "Refer to Class.onTest to know more ",
    "On collide is a bit buggy right now, please use other methods until its fixed",
  ],
  ON: [
    {
      event: "fire",
      handler: ({ body, gun }) => {
        switch (gun.identifier) {
          case "mainGun":
            body.sendMessage("fired main gun");
            break;
          case "secondaryGun":
            body.sendMessage("fired secondary gun");
            break;
        }
      },
    },
    {
      event: "altFire",
      handler: ({ body, gun }) => {
        body.sendMessage("fired alt gun");
      },
    },
    {
      event: "death",
      handler: ({ body, killers, killTools }) => {
        body.sendMessage("you died");
      },
    },
    {
      event: "collide",
      handler: ({ instance, other }) => {
        instance.sendMessage("collide!");
      },
    },
    {
      event: "damage",
      handler: ({ body, damageInflictor, damageTool }) => {
        body.SIZE += damageInflictor[0].SIZE / 2;
        damageInflictor[0].kill();
      },
    },
  ],
  GUNS: [
    {
      POSITION: {},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        IDENTIFIER: "mainGun",
      },
    },
    {
      POSITION: { ANGLE: 90 },
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        ALT_FIRE: true,
      },
    },
    {
      POSITION: { ANGLE: 180, DELAY: 0.5 },
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        IDENTIFIER: "secondaryGun",
      },
    },
  ],
};

Class.auraBasicGen = addAura();
Class.auraBasic = {
  PARENT: "genericTank",
  LABEL: "Aura Basic",
  TURRETS: [
    {
      POSITION: [14, 0, 0, 0, 0, 1],
      TYPE: "auraBasicGen",
    },
  ],
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.auraHealerGen = addAura(-1);
Class.auraHealer = {
  PARENT: "genericTank",
  LABEL: "Aura Healer",
  TURRETS: [
    {
      POSITION: [14, 0, 0, 0, 0, 1],
      TYPE: "auraHealerGen",
    },
  ],
  GUNS: [
    {
      POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
        TYPE: "healerBullet",
      },
    },
  ],
};

Class.ghoster_ghosted = {
  PARENT: "genericTank",
  TOOLTIP:
    "You are now hidden, roam around and find your next target. You will be visible again in 5 seconds",
  LABEL: "Ghoster",
  BODY: {
    SPEED: 20,
    ACCELERATION: 10,
    FOV: base.FOV + 1,
  },
  GUNS: [
    {
      POSITION: { WIDTH: 20, LENGTH: 20 },
    },
  ],
  ALPHA: 0.6,
};

Class.ghoster = {
  PARENT: "genericTank",
  LABEL: "Ghoster",
  TOOLTIP: "Shooting will hide you for 5 seconds",
  BODY: {
    SPEED: base.SPEED,
    ACCELERATION: base.ACCEL,
  },
  ON: [
    {
      event: "fire",
      handler: ({ body }) => {
        body.define(Class.ghoster_ghosted);
        setTimeout(() => {
          body.SPEED = 1e-99;
          body.ACCEL = 1e-99;
          body.FOV *= 2;
          body.alpha = 1;
        }, 2000);
        setTimeout(() => {
          body.SPEED = base.SPEED;
          body.define(Class.ghoster);
        }, 2500);
      },
    },
  ],
  GUNS: [
    {
      POSITION: { WIDTH: 20, LENGTH: 20 },
      PROPERTIES: {
        TYPE: "bullet",
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.destroyer,
          g.annihilator,
        ]),
      },
    },
  ],
  ALPHA: 1,
};

Class.switcheroo = {
  PARENT: "basic",
  LABEL: "Switcheroo",
  UPGRADES_TIER_0: [],
  RESET_UPGRADE_MENU: true,
  ON: [
    {
      event: "fire",
      handler: ({ body, globalMasterStore: store, gun }) => {
        if (gun.identifier != "switcherooGun") return;
        store.switcheroo_i ??= 0;
        store.switcheroo_i++;
        store.switcheroo_i %= 6;
        body.define(Class.basic.UPGRADES_TIER_1[store.switcheroo_i]);
        setTimeout(() => body.define("switcheroo"), 6000);
      },
    },
  ],
  GUNS: [
    {
      POSITION: {},
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        IDENTIFIER: "switcherooGun",
      },
    },
  ],
};

Class.vanquisher = {
  PARENT: "genericTank",
  DANGER: 8,
  LABEL: "Vanquisher",
  STAT_NAMES: statnames.generic,
  BODY: {
    SPEED: 0.8 * base.SPEED,
  },
  //destroyer
  GUNS: [
    {
      POSITION: [21, 14, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
        TYPE: "bullet",
      },

      //builder
    },
    {
      POSITION: [18, 12, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 12, 1.1, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
        TYPE: "setTrap",
        STAT_CALCULATOR: gunCalcNames.block,
      },

      //launcher
    },
    {
      POSITION: [10, 9, 1, 9, 0, 90, 0],
    },
    {
      POSITION: [17, 13, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.artillery,
          g.artillery,
        ]),
        TYPE: "minimissile",
        STAT_CALCULATOR: gunCalcNames.sustained,
      },

      //shotgun
    },
    {
      POSITION: [4, 3, 1, 11, -3, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [4, 3, 1, 11, 3, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [4, 4, 1, 13, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [1, 4, 1, 12, -1, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [1, 4, 1, 11, 1, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [1, 3, 1, 13, -1, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [1, 3, 1, 13, 1, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [1, 2, 1, 13, 2, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [1, 2, 1, 13, -2, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [15, 14, 1, 6, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.machineGun,
          g.shotgun,
          g.fake,
        ]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [8, 14, -1.3, 4, 0, 270, 0],
    },
  ],
};
Class.armyOfOneBullet = {
  PARENT: "bullet",
  LABEL: "Unstoppable",
  TURRETS: [
    {
      POSITION: [18.5, 0, 0, 0, 360, 0],
      TYPE: ["spikeBody", { COLOR: null }],
    },
    {
      POSITION: [18.5, 0, 0, 180, 360, 0],
      TYPE: ["spikeBody", { COLOR: null }],
    },
  ],
};
Class.armyOfOne = {
  PARENT: "genericTank",
  LABEL: "Army Of One",
  DANGER: 9,
  SKILL_CAP: [31, 31, 31, 31, 31, 31, 31, 31, 31, 31],
  BODY: {
    SPEED: 0.5 * base.SPEED,
    FOV: 1.8 * base.FOV,
  },
  GUNS: [
    {
      POSITION: [21, 19, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.destroyer,
          g.destroyer,
          g.destroyer,
          g.destroyer,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          { reload: 0.5 },
          { reload: 0.5 },
          { reload: 0.5 },
          { reload: 0.5 },
        ]),
        TYPE: "armyOfOneBullet",
      },
    },
    {
      POSITION: [21, 11, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.destroyer,
          g.destroyer,
          g.destroyer,
          g.destroyer,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          g.sniper,
          { reload: 0.5 },
          { reload: 0.5 },
          { reload: 0.5 },
          { reload: 0.5 },
          g.fake,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.weirdAutoBasic = {
  PARENT: "genericTank",
  LABEL: "Weirdly defined Auto-Basic",
  GUNS: [
    {
      POSITION: {
        LENGTH: 20,
        WIDTH: 10,
      },
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          [0.8, 0.8, 1.5, 1, 0.8, 0.8, 0.9, 1, 1, 1, 1, 2, 1],
        ]),
        TYPE: "bullet",
      },
    },
  ],
  TURRETS: [
    {
      POSITION: {
        ANGLE: 180,
        LAYER: 1,
      },
      TYPE: [
        "autoTurret",
        {
          CONTROLLERS: ["nearestDifferentMaster"],
          INDEPENDENT: true,
        },
      ],
    },
  ],
};

Class.tooltipTank = {
  PARENT: "genericTank",
  LABEL: "Tooltips",
  UPGRADE_TOOLTIP: "Allan please add details",
};

Class.bulletSpawnTest = {
  PARENT: "genericTank",
  LABEL: "Bullet Spawn Position",
  GUNS: [
    {
      POSITION: [20, 10, 1, 0, -5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          { speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0 },
        ]),
        TYPE: ["bullet", { BORDERLESS: true }],
        BORDERLESS: true,
      },
    },
    {
      POSITION: [50, 10, 1, 0, 5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          { speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0 },
        ]),
        TYPE: ["bullet", { BORDERLESS: true }],
        BORDERLESS: true,
      },
    },
  ],
};

Class.propTestProp = {
  PARENT: "genericTank",
  SHAPE: 6,
  COLOR: 0,
  GUNS: [
    {
      POSITION: [20, 10, 1, 0, 0, 45, 0],
      PROPERTIES: { COLOR: 13 },
    },
    {
      POSITION: [20, 10, 1, 0, 0, -45, 0],
      PROPERTIES: { COLOR: 13 },
    },
  ],
};
Class.propTest = {
  PARENT: "genericTank",
  LABEL: "Deco Prop Test",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
  PROPS: [
    {
      POSITION: [10, 0, 0, 0, 1],
      TYPE: "propTestProp",
    },
  ],
};

Class.levels = menu("Levels");
Class.levels.UPGRADES_TIER_0 = [];
for (let i = 0; i < 12; i++) {
  let LEVEL = i * c.TIER_MULTIPLIER;
  Class["level" + LEVEL] = {
    PARENT: "levels",
    LEVEL,
    LABEL: "Level " + LEVEL,
  };
  Class.levels.UPGRADES_TIER_0.push("level" + LEVEL);
}

Class.teams = menu("Teams");
Class.teams.UPGRADES_TIER_0 = [];
for (let i = 1; i <= 8; i++) {
  let TEAM = i;
  Class["Team" + TEAM] = {
    PARENT: "teams",
    TEAM: -TEAM,
    COLOR: getTeamColor(-TEAM),
    LABEL: "Team " + TEAM,
  };
  Class.teams.UPGRADES_TIER_0.push("Team" + TEAM);
}
Class["Team" + TEAM_ROOM] = {
  PARENT: "teams",
  TEAM: TEAM_ROOM,
  COLOR: "yellow",
  LABEL: "Room Team",
};
Class["Team" + TEAM_ENEMIES] = {
  PARENT: "teams",
  TEAM: TEAM_ENEMIES,
  COLOR: "yellow",
  LABEL: "Enemies Team",
};
Class.teams.UPGRADES_TIER_0.push("Team" + TEAM_ROOM, "Team" + TEAM_ENEMIES);

Class.testing = menu("Testing");

Class.addons = menu("Addon Entities");
Class.addons.UPGRADES_TIER_0 = [];

Class.whirlwindDeco = makeDeco(6);
Class.whirlwindDeco.CONTROLLERS = [
  ["spin", { independent: true, speed: 0.128 }],
];
Class.whirlwind = {
  PARENT: "genericTank",
  LABEL: "Whirlwind",
  ANGLE: 60,
  CONTROLLERS: ["whirlwind"],
  HAS_NO_RECOIL: true,
  STAT_NAMES: statnames.whirlwind,
  TURRETS: [
    {
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "whirlwindDeco",
    },
  ],
  AI: {
    SPEED: 2,
  },
  GUNS: (() => {
    let output = [];
    for (let i = 0; i < 6; i++) {
      output.push({
        POSITION: { WIDTH: 8, LENGTH: 1, DELAY: i * 0.25 },
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.satellite]),
          TYPE: ["satellite", { ANGLE: i * 60 }],
          MAX_CHILDREN: 1,
          AUTOFIRE: true,
          SYNCS_SKILLS: false,
          WAIT_TO_CYCLE: true,
        },
      });
    }
    return output;
  })(),
};
let testLayeredBoss = new LayeredBoss(
  "testLayeredBoss",
  "Test Layered Boss",
  "terrestrial",
  7,
  3,
  "terrestrialTrapTurret",
  5,
  7,
  { SPEED: 10 },
);
testLayeredBoss.addLayer(
  {
    gun: {
      POSITION: [3.6, 7, -1.4, 8, 0, null, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.5 }]),
        TYPE: ["minion", { INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
      },
    },
  },
  true,
  null,
  16,
);
testLayeredBoss.addLayer(
  {
    turret: {
      POSITION: [10, 7.5, 0, null, 160, 0],
      TYPE: "crowbarTurret",
    },
  },
  true,
);

// FLAIL!!!
Class.flailBallSpike = {
  PARENT: "genericTank",
  COLOR: "black",
  SHAPE: 6,
  INDEPENDENT: true,
};
Class.flailBall = {
  PARENT: "genericTank",
  COLOR: "grey",
  HITS_OWN_TYPE: "hard",
  TURRETS: [
    {
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "flailBallSpike",
    },
  ],
};
Class.flailBolt1 = {
  PARENT: "genericTank",
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [40, 5, 1, 8, 0, 0, 0],
    },
  ],
  TURRETS: [
    {
      POSITION: [48, 56, 0, 0, 360, 1],
      TYPE: [
        "flailBall",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};
Class.flailBolt2 = {
  PARENT: "genericTank",
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [30, 5, 1, 8, 0, 0, 0],
    },
  ],
  TURRETS: [
    {
      POSITION: [20, 36, 0, 0, 360, 1],
      TYPE: [
        "flailBolt1",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};
Class.flailBolt3 = {
  PARENT: "genericTank",
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [30, 5, 1, 8, 0, 0, 0],
    },
  ],
  TURRETS: [
    {
      POSITION: [18, 36, 0, 0, 360, 1],
      TYPE: [
        "flailBolt2",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};
Class.genericFlail = {
  PARENT: "genericTank",
  STAT_NAMES: statnames.flail,
  TOOLTIP:
    "[DEV NOTE] The Flail is not finished yet. This tank is currently just a mockup.",
  SKILL_CAP: [
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    0,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
  ],
};
Class.flail = {
  PARENT: "genericFlail",
  LABEL: "Flail",
  TURRETS: [
    {
      POSITION: [6, 10, 0, 0, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};
Class.doubleFlail = {
  PARENT: "genericFlail",
  LABEL: "Double Flail",
  DANGER: 6,
  TURRETS: [
    {
      POSITION: [6, 10, 0, 0, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
    {
      POSITION: [6, 10, 0, 180, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};
Class.tripleFlail = {
  PARENT: "genericFlail",
  LABEL: "Triple Flail",
  DANGER: 7,
  TURRETS: [
    {
      POSITION: [6, 10, 0, 0, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
    {
      POSITION: [6, 10, 0, 120, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
    {
      POSITION: [6, 10, 0, 240, 190, 0],
      TYPE: [
        "flailBolt3",
        {
          INDEPENDENT: true,
        },
      ],
    },
  ],
};

Class.spaceship = {
  PARENT: "genericTank",
  LABEL: "Spaceship",
  DANGER: 7,
  BODY: {
    ACCELERATION: base.ACCEL * 1,
    SPEED: base.SPEED * 3.2,
    HEALTH: base.HEALTH * 1,
    DAMAGE: base.DAMAGE * 1,
    PENETRATION: base.PENETRATION * 1,
    SHIELD: base.SHIELD * 1,
    REGEN: base.REGEN * 1,
    FOV: base.FOV * 1.5,
    DENSITY: base.DENSITY * 1,
    PUSHABILITY: 1,
    HETERO: 3,
  },
  VALUE: 26321,
  SIZE: 16,
  SHAPE: [
    [-1, -1],
    [0.6, -1.6],
    [1, -0.6],
    [1, 0.6],
    [0.6, 1.6],
    [-1, 1],
    [-0.4, 0],
  ],
};

Class.keeper = {
  PARENT: "spaceship",
  LABEL: "Keeper",
  GUNS: [
    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.conquest = {
  PARENT: "spaceship",
  LABEL: "Conquest",
  BODY: {
    FOV: 1.6,
  },
  GUNS: [
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.battleship,
          { damage: 0.9 },
          { recoil: 0 },
          { reload: 1.6 },
          { speed: 1.6 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                  WAIT_TO_CYCLE: false,
                  AUTOFIRE: false,
                  SYNCS_SKILLS: false,
                  MAX_CHILDREN: 0,
                  ALT_FIRE: false,
                  */
      },
    },
  ],
};

Class.hunterShip = {
  PARENT: "spaceship",
  LABEL: "Hunter",
  BODY: {
    FOV: 2,
  },
  GUNS: [
    {
      POSITION: [28, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.battleship,
          g.assassin,
          { recoil: 0 },
          { reload: 1 },
          { speed: 1.8 },
          { damage: 0.8 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                    WAIT_TO_CYCLE: false,
                    AUTOFIRE: false,
                    SYNCS_SKILLS: false,
                    MAX_CHILDREN: 0,
                    ALT_FIRE: false,
                    */
      },
    },
  ],
};

Class.compound = {
  PARENT: "spaceship",
  LABEL: "Compound",
  BODY: {
    FOV: 1.6,
  },
  GUNS: [
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.battleship,
          { recoil: 0 },
          { reload: 1.6 },
          { speed: 1.6 },
          { damage: 0.5 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                    WAIT_TO_CYCLE: false,
                    AUTOFIRE: false,
                    SYNCS_SKILLS: false,
                    MAX_CHILDREN: 0,
                    ALT_FIRE: false,
                    */
      },
    },

    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.demolisher = {
  PARENT: "spaceship",
  LABEL: "Demolisher",
  GUNS: [
    {
      POSITION: [20, 14, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.battleship,
          g.destroyer,
          { speed: 1.5 },
          { recoil: 0 },
          { reload: 4 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.ignition = {
  PARENT: "spaceship",
  LABEL: "Ignition",
  GUNS: [
    {
      POSITION: [19, 2, 1, 0, -2.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.pyroclast = {
  PARENT: "spaceship",
  LABEL: "Pyroclast",
  GUNS: [
    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.plasmoid = {
  PARENT: "spaceship",
  LABEL: "Plasmoid",
  GUNS: [
    {
      POSITION: [13, 7, -1.4, 0, 0, 0, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 0.75 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

Class.spaceTurretBox = {
  PARENT: "setTrap",
  LABEL: "Pillbox",
  SHAPE: 4,
  SIZE: 20,
  CONTROLLERS: ["nearestDifferentMaster"],
  INDEPENDENT: true,
  //DIE_AT_RANGE: true,
  TURRETS: [
    {
      POSITION: [11, 0, 0, 0, 360, 1],
      TYPE: "pillboxTurret",
    },
  ],
};

Class.sentinelShip = {
  PARENT: "spaceship",
  LABEL: "Sentinel",
  GUNS: [
    {
      POSITION: [16, 15, -1.4, 0, 0, 0, 0],
    },
    {
      POSITION: [2.5, 15, 1.6, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          g.power,
          g.power,
          g.annihilator,
          g.pounder,
          { reload: 1.3 },
          { recoil: 0 },
          g.battleship,
          g.annihilator,
        ]),
        TYPE: ["unsetTrap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

Class.stalwart = {
  PARENT: "spaceship",
  LABEL: "Stalwart",
  GUNS: [
    {
      POSITION: [16, 8, 1, 0, -10, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Stalwart Twin Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
    {
      POSITION: [16, 8, 1, 0, 10, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Stalwart Twin Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.titan = {
  PARENT: "spaceship",
  LABEL: "Titan",
  GUNS: [
    {
      POSITION: [19, 2, 1, 0, -2.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.starflare = {
  PARENT: "spaceship",
  LABEL: "Starflare",
  GUNS: [
    {
      POSITION: [13, 7, -1.4, 0, 0, 0, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 1.2 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },

    {
      POSITION: [13, 7, -1.4, 0, 0, 180, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 1.2 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

Class.baseSpaceship = {
  PARENT: "genericTank",
  LABEL: "Base",
  DANGER: 7,
  VALUE: 26301,
  SIZE: 1,
  SHAPE: [
    [-1, -1],
    [0.6, -1.6],
    [1, -0.6],
    [1, 0.6],
    [0.6, 1.6],
    [-1, 1],
    [-0.4, 0],
  ],
};

Class.auraShip = {
  PARENT: "baseSpaceship",
  LABEL: "Ember",
  TURRETS: [
    {
      POSITION: [15, 0, 0, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
  ],
};
Class.auraShipGen = addAura(-4, 1.8);
Class.auraShipGenBig = addAura(-6, 2.3);

Class.auraShipGenDamage = addAura(2, 0.8);
Class.auraShipGenDamageUP = addAura(3, 1.2);
Class.auraShipHeal = {
  PARENT: "baseSpaceship",
  LABEL: "Andromeda",
  TURRETS: [
    {
      POSITION: [9.5, 2, 0, 0, 360, 1],
      TYPE: "auraShipGen",
    },
  ],
};

Class.auraShipHealSmash = {
  PARENT: "baseSpaceship",
  LABEL: "Cepheus",
  BODY: {
    HEALTH: base.HEALTH * 1.2,
  },

  TURRETS: [
    {
      POSITION: [9.5, 2, 0, 0, 360, 1],
      TYPE: "auraShipGen",
    },
    {
      POSITION: [27, -2, 0, 0, 360, 0],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },
  ],
};

Class.auraShipHealGuns = {
  PARENT: "baseSpaceship",
  LABEL: "Centaurus",
  TURRETS: [
    {
      POSITION: [9.5, 2, 0, 0, 360, 1],
      TYPE: "auraShipGen",
    },

    {
      POSITION: [5, -3, -10, 0, 360, 1],
      TYPE: ["smallSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
    {
      POSITION: [5, -3, 10, 0, 360, 1],
      TYPE: ["smallSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ],
};

Class.auraShipHealBig = {
  PARENT: "baseSpaceship",
  LABEL: "Apus",
  TURRETS: [
    {
      POSITION: [14, 2, 0, 0, 360, 1],
      TYPE: "auraShipGenBig",
    },
  ],
};

Class.auraShipTri = {
  PARENT: "baseSpaceship",
  LABEL: "Blaze",
  TURRETS: [
    {
      POSITION: [7, 3, 0, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
    {
      POSITION: [7, -1, -10, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
    {
      POSITION: [7, -1, 10, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
  ],
};

Class.spaceGun = {
  PARENT: "auto4gun",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.power,
          { reload: 0.8 },
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.spaceDroneGun = {
  PARENT: "auto4gun",
  FOV: 0.5,
  GUNS: [
    {
      POSITION: [18, 8, 1.5, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.power,
          { reload: 1.8 },
        ]),
        TYPE: "drone",
        MAX_CHILDREN: 4,
      },
    },
  ],
};

Class.spaceMinionReg = {
  PARENT: "genericTank",
  LABEL: "Minion",
  TYPE: "minion",
  DAMAGE_CLASS: 0,
  HITS_OWN_TYPE: "hardWithBuffer",
  FACING_TYPE: "smoothToTarget",
  HAS_NO_RECOIL: true, // just give them speed.
  BODY: {
    FOV: 0.5,
    SPEED: 1.9,
    SPEED: 1.3, // fling speed imao
    ACCELERATION: 1.2,
    HEALTH: 5,
    SHIELD: 0,
    DAMAGE: 1.2,
    RESIST: 1,
    PENETRATION: 1,
    DENSITY: 0.4,
  },
  AI: {
    BLIND: true,
  },
  DRAW_HEALTH: true,
  CLEAR_ON_MASTER_UPGRADE: true,
  GIVE_KILL_MESSAGE: false,
  CONTROLLERS: [
    "nearestDifferentMaster",
    "mapAltToFire",
    "minion",
    "canRepel",
    "hangOutNearMaster",
  ],
  GUNS: [
    {
      POSITION: [17, 9, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minionGun]),
        WAIT_TO_CYCLE: true,
        TYPE: "bullet",
      },
    },
  ],
};

Class.spaceMinionGun = {
  PARENT: "genericTank",
  CONTROLLERS: [
    "canRepel",
    "alwaysFire",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: "grey",
  FOV: 0.5,
  GUNS: [
    {
      POSITION: [18, 15, 1.5, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.factory, { size: 2.2 }]),
        TYPE: "spaceMinionReg",
        AUTOFIRE: true,
        MAX_CHILDREN: 3,
      },
    },
  ],
};

Class.spaceDroneGunWeak = {
  PARENT: "auto4gun",
  FOV: 0.5,
  GUNS: [
    {
      POSITION: [18, 8, 1.5, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.battleship,
          { reload: 1.6 },
          { speed: 1.4 },
        ]),
        TYPE: "drone",
        MAX_CHILDREN: 4,
      },
    },
  ],
};

Class.spaceDroneGunUp = {
  PARENT: "auto4gun",
  FOV: 0.5,
  GUNS: [
    {
      POSITION: [18, 8, 1.5, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.power,
          g.pounder,
          { reload: 1.3 },
          { speed: 1.1 },
          { size: 2 },
        ]),
        TYPE: "drone",
        MAX_CHILDREN: 6,
      },
    },
  ],
};

Class.bigSpaceGun = {
  PARENT: "auto4gun",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          g.power,
          { reload: 2.7 },
          g.annihilator,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.smallSpaceGun = {
  PARENT: "auto4gun",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.twin,
          g.twin,
          { reload: 1.4 },
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.auraShipCombo = {
  PARENT: "baseSpaceship",
  LABEL: "Scorcher",
  TURRETS: [
    {
      POSITION: [8, 3, 0, 0, 360, 1],
      TYPE: ["spaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },

    {
      POSITION: [7, -1, -10, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
    {
      POSITION: [7, -1, 10, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
  ],
};

Class.upAuraShip = {
  PARENT: "baseSpaceship",
  LABEL: "Sunfire",
  TURRETS: [
    {
      POSITION: [22, 0, 0, 0, 0, 1],
      TYPE: "auraShipGenDamageUP",
    },
  ],
};

Class.bulletShip = {
  PARENT: "baseSpaceship",
  LABEL: "Cannon",
  TURRETS: [
    {
      POSITION: [8, 3, 0, 0, 360, 1],
      TYPE: ["spaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ], //
};

Class.droneShip = {
  PARENT: "baseSpaceship",
  LABEL: "Controller",
  TURRETS: [
    {
      POSITION: [8, 3, 1.3, 0, 360, 1],
      TYPE: ["spaceDroneGun", { COLOR: -1 }],
      MAX_CHILDREN: 4,
    },
  ], //
};

/*Class.minionShip = {
  PARENT: "baseSpaceship",
  LABEL: "Invader",
  TURRETS: [
    {
      POSITION: [8, 3, 1.3, 0, 360, 1],
      TYPE: ["spaceMinionReg", { COLOR: -1 }],
    },
  ], //
};*/

Class.droneShipUp = {
  PARENT: "baseSpaceship",
  LABEL: "Master",
  TURRETS: [
    {
      POSITION: [8, 3, 1.3, 0, 360, 1],
      TYPE: ["spaceDroneGunUp", { COLOR: -1 }],
      MAX_CHILDREN: 6,
    },
  ], //
};

Class.droneShipTri = {
  PARENT: "baseSpaceship",
  LABEL: "Mothership",
  TURRETS: [
    {
      POSITION: [5, 3, 0, 0, 360, 1],
      TYPE: ["spaceDroneGunWeak", { COLOR: -1 }],
      MAX_CHILDREN: 4,
    },

    {
      POSITION: [5, 3, 10, 0, 360, 1],
      TYPE: ["spaceDroneGunWeak", { COLOR: -1 }],
      MAX_CHILDREN: 4,
    },

    {
      POSITION: [5, 3, -10, 0, 360, 1],
      TYPE: ["spaceDroneGunWeak", { COLOR: -1 }],
      MAX_CHILDREN: 4,
    },
  ], //
};

Class.bulletShipTri = {
  PARENT: "baseSpaceship",
  LABEL: "Apparatus",
  TURRETS: [
    {
      POSITION: [5, 3, 0, 0, 360, 1],
      TYPE: ["smallSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
    {
      POSITION: [5, -3, -10, 0, 360, 1],
      TYPE: ["smallSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
    {
      POSITION: [5, -3, 10, 0, 360, 1],
      TYPE: ["smallSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ], //
};

Class.upBulletShip = {
  PARENT: "baseSpaceship",
  LABEL: "Howitzer",
  TURRETS: [
    {
      POSITION: [14, 3, 0, 0, 360, 1],
      TYPE: ["bigSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ], //
};

Class.smasherBaseShip = {
  PARENT: "genericTank",
  SHAPE: [
    [-1, -1],
    [0.6, -1.6],
    [1, -0.6],
    [1, 0.6],
    [0.6, 1.6],
    [-1, 1],
    [-0.4, 0],
  ],
};

Class.smasherShip = {
  PARENT: "baseSpaceship",
  LABEL: "Barrier",
  BODY: {
    HEALTH: base.HEALTH * 1.2,
  },
  TURRETS: [
    {
      POSITION: [27, -2, 0, 0, 360, 0],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },
  ], ////
};

Class.smasherShipGun = {
  PARENT: "baseSpaceship",
  LABEL: "Meld",
  BODY: {
    HEALTH: base.HEALTH * 1.2,
  },
  TURRETS: [
    {
      POSITION: [27, -2, 0, 0, 360, 0],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [8, 3, 0, 0, 360, 1],
      TYPE: ["spaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ], ////
};

Class.smasherShipAura = {
  PARENT: "baseSpaceship",
  LABEL: "Alloy",
  BODY: {
    HEALTH: base.HEALTH * 1.2,
  },
  TURRETS: [
    {
      POSITION: [27, -2, 0, 0, 360, 0],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },
    {
      POSITION: [15, 0, 0, 0, 0, 1],
      TYPE: "auraShipGenDamage",
    },
  ], ////
};

Class.smasherShipUp = {
  PARENT: "baseSpaceship",
  LABEL: "Palisade",
  BODY: {
    HEALTH: base.HEALTH * 1.35,
  },
  TURRETS: [
    {
      POSITION: [27, -2, 0, 0, 360, 0],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },

    {
      POSITION: [12, 1.5, 0, 0, 360, 1],
      TYPE: ["smasherBaseShip", { COLOR: 9, MIRROR_MASTER_ANGLE: true }],
    },
  ], ////
};

Class.spaceMinion = {
  PARENT: "genericTank",
  LABEL: "Minion",
  TYPE: "minion",
  SHAPE: [
    [-1, -1],
    [0.6, -1.6],
    [1, -0.6],
    [1, 0.6],
    [0.6, 1.6],
    [-1, 1],
    [-0.4, 0],
  ],
  DAMAGE_CLASS: 0,
  HITS_OWN_TYPE: "hard",
  FACING_TYPE: "smoothToTarget",
  BODY: {
    FOV: 0.5,
    SPEED: 1,
    ACCELERATION: 0.4,
    HEALTH: 10,
    SHIELD: 0,
    DAMAGE: 1.2,
    RESIST: 1,
    PENETRATION: 1,
    DENSITY: 0.4,
  },
  AI: {
    BLIND: true,
  },
  DRAW_HEALTH: true,
  CLEAR_ON_MASTER_UPGRADE: true,
  GIVE_KILL_MESSAGE: false,
  CONTROLLERS: [
    "nearestDifferentMaster",
    "mapAltToFire",
    "minion",
    "canRepel",
    "hangOutNearMaster",
  ],
  GUNS: [
    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                  WAIT_TO_CYCLE: false,
                  AUTOFIRE: false,
                  SYNCS_SKILLS: false,
                  MAX_CHILDREN: 0,
                  ALT_FIRE: false,
                  */
      },
    },
  ],

  TURRETS: [
    {
      POSITION: [8, 3, 0, 0, 360, 1],
      TYPE: ["spaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ], //
};

Class.spaceBoss = {
  PARENT: ["miniboss"],
  LABEL: "Maurader Ship",
  COLOR: "red",
  FACING_TYPE: "toTarget",
  SHAPE: [
    [-1, -1],
    [0.5, -1],
    [1, -0.5],
    [1, 0.5],
    [0.5, 1],
    [-1, 1],
  ],
  SIZE: 50,
  VARIES_IN_SIZE: true,
  VALUE: 15e4,
  BODY: {
    FOV: 1.75,
    SPEED: 0.3 * base.SPEED,
    HEALTH: 6.5 * base.HEALTH,
    DAMAGE: 2.5 * base.DAMAGE,
  },

  GUNS: [
    {
      POSITION: [12, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.8 },
          g.pounder,
          { reload: 0.75 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["bullet", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.bullet,
      },
    },

    {
      POSITION: [12, 8, 1, 0, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.8 },
          g.pounder,
          { reload: 0.75 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["bullet", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.bullet,
      },
    },

    {
      POSITION: [12, 8, 1, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.8 },
          g.pounder,
          { reload: 0.75 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["bullet", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.bullet,
      },
    },

    {
      POSITION: [3, 8, 1, 12, 0, 90, 0],
    },

    {
      POSITION: [12, 11, 1, 0, 0, 90, 0],
    },

    {
      POSITION: [3, 11, 1, 15, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          { speed: 1.8 },
          g.pounder,
          { reload: 2 },

          g.battleship,
        ]),
        TYPE: ["spaceMinion", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.bullet,
        MAX_CHILDREN: 1,
      },
    },

    {
      POSITION: [3, 8, 1, 12, 0, -90, 0],
    },

    {
      POSITION: [12, 11, 1, 0, 0, -90, 0],
    },

    {
      POSITION: [3, 11, 1, 15, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          { speed: 1.8 },
          g.pounder,
          { reload: 2 },

          g.battleship,
        ]),
        TYPE: ["spaceMinion", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.bullet,
        MAX_CHILDREN: 1,
      },
    },
  ],

  TURRETS: [
    {
      POSITION: [15, 0, 0, 0, 360, 1],
      TYPE: ["bigSpaceGun", { INDEPENDENT: true, COLOR: -1 }],
    },
  ],
};

/*Class.damageShip = {
  PARENT: ["genericTank"],
  LABEL: "Damage Ship",
  COLOR: "red",
  FACING_TYPE: ["spin", { speed: 0.02 }],
  SHAPE: 4,
  SIZE: 10,
  VARIES_IN_SIZE: false,
  VALUE: 50000,
  BODY: {
    FOV: 1.75,
    SPEED: 0,
    ACCEL: 0,
    HEALTH: 1.5 * base.HEALTH,
    DAMAGE: 2.5 * base.DAMAGE,
  },

  GUNS: [
    {
      POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.power,
          { damage: 2 },
          { penetration: 2 },
          { health: 2 },
          { reload: 0.1 },
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, 90, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.power,
          { damage: 2 },
          { penetration: 2 },
          { health: 2 },
          { reload: 0.1 },
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, 180, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.power,
          { damage: 2 },
          { penetration: 2 },
          { health: 2 },
          { reload: 0.1 },
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, -90, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.power,
          { damage: 2 },
          { penetration: 2 },
          { health: 2 },
          { reload: 0.1 },
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
  ],
};*/

Class.healShip = {
  PARENT: ["genericTank"],
  LABEL: "Healing Ship",
  TEAM: 1,
  COLOR: "blue",
  FACING_TYPE: ["spin", { speed: 0.02 }],
  SHAPE: 4,
  SIZE: 10,
  VARIES_IN_SIZE: false,
  STAT_NAMES: statnames.heal,
  VALUE: 50000,
  BODY: {
    FOV: 1.75,
    SPEED: 0,
    ACCEL: 0,
    HEALTH: 1.5 * base.HEALTH,
    DAMAGE: 2.5 * base.DAMAGE,
  },

  GUNS: [
    {
      POSITION: [8, 9, -0.5, 12.5, 0, 0, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
        TYPE: "healerBullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, 90, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
        TYPE: "healerBullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, 180, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
        TYPE: "healerBullet",
        AUTOFIRE: true,
      },
    },

    {
      POSITION: [8, 9, -0.5, 12.5, 0, -90, 0],
    },
    {
      POSITION: [18, 10, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
        TYPE: "healerBullet",
        AUTOFIRE: true,
      },
    },
  ],
};

Class.spaceAutoGun = {
  PARENT: "genericTank",
  LABEL: "",
  BODY: {
    FOV: 3,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [22, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.power,
          { speed: 1.2 },
          { damage: 0.6 },
          { recoil: 0 },
          { reload: 2 },
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.systemShip = {
  PARENT: "spaceship",
  LABEL: "System",
  TURRETS: [
    {
      POSITION: [11, 8, -8, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 8, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
  ],
};

Class.systemShipUP = {
  PARENT: "spaceship",
  LABEL: "Contraption",
  TURRETS: [
    {
      POSITION: [11, 8, -10, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 10, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
  ],
};

Class.systemShipFlank = {
  PARENT: "spaceship",
  LABEL: "Flank Defender",
  TURRETS: [
    {
      POSITION: [11, 12, -2, -90, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 12, 2, 90, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
  ],
};

//tier 3 spaceships

Class.preserver = {
  PARENT: "spaceship",
  LABEL: "Preserver",
  GUNS: [
    {
      POSITION: [16, 8, 1, 0, -10, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
              WAIT_TO_CYCLE: false,
              AUTOFIRE: false,
              SYNCS_SKILLS: false,
              MAX_CHILDREN: 0,
              ALT_FIRE: false,
              */
      },
    },
    {
      POSITION: [16, 8, 1, 0, 10, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
              WAIT_TO_CYCLE: false,
              AUTOFIRE: false,
              SYNCS_SKILLS: false,
              MAX_CHILDREN: 0,
              ALT_FIRE: false,
              */
      },
    },

    {
      POSITION: [16, 8, 1, 4, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
              WAIT_TO_CYCLE: false,
              AUTOFIRE: false,
              SYNCS_SKILLS: false,
              MAX_CHILDREN: 0,
              ALT_FIRE: false,
              */
      },
    },
  ],
};

Class.volcanic = {
  PARENT: "spaceship",
  LABEL: "Volcanic",
  GUNS: [
    {
      POSITION: [16, 2, 1, -1.5, 10, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -10, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -4.5, -14, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -4.5, 14, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.exterminator = {
  PARENT: "spaceship",
  LABEL: "Exterminator",
  GUNS: [
    {
      POSITION: [20, 19, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.battleship,
          g.annihilator,
          g.annihilator,
          g.destroyer,
          { speed: 1.5 },
          { recoil: 0 },
          { reload: 4 },
        ]),
        TYPE: "bullet",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.ignimbritic = {
  PARENT: "spaceship",
  LABEL: "Ignimbritic",
  GUNS: [
    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, -6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, 6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.battleship, { recoil: 0 }]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                WAIT_TO_CYCLE: false,
                AUTOFIRE: false,
                SYNCS_SKILLS: false,
                MAX_CHILDREN: 0,
                ALT_FIRE: false,
                */
      },
    },
  ],
};

Class.cyclopean = {
  PARENT: "spaceship",
  LABEL: "Cyclopean",
  GUNS: [
    {
      POSITION: [19, 2, 1, 0, -2.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 2, 1, 0, 2.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, -6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, 6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.composite = {
  PARENT: "spaceship",
  LABEL: "Composite",
  GUNS: [
    {
      POSITION: [16, 2, 1, -1.5, 12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 2, 1, -1.5, -12, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, -6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [16, 2, 1, -1, 6, 0, 1.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pelleter,
          g.power,
          g.twin,
          { recoil: 4 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: "bullet",
      },
    },

    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.battleship,
          { recoil: 0 },
          { reload: 1.6 },
          { speed: 1.6 },
          { damage: 0.5 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                    WAIT_TO_CYCLE: false,
                    AUTOFIRE: false,
                    SYNCS_SKILLS: false,
                    MAX_CHILDREN: 0,
                    ALT_FIRE: false,
                    */
      },
    },
  ],
};

Class.starburst = {
  PARENT: "spaceship",
  LABEL: "Starburst",
  GUNS: [
    {
      POSITION: [13, 7, -1.4, 0, 8, 0, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, 8, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 1.2 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },

    {
      POSITION: [13, 7, -1.4, 0, -8, 0, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, -8, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 1.2 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },

    {
      POSITION: [13, 7, -1.4, 0, 0, 180, 0],
    },
    {
      POSITION: [2.5, 7, 1.6, 13, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          { speed: 1.2 },
          g.pounder,
          { reload: 1.2 },
          { range: 3 },
          { recoil: 0 },
          g.battleship,
        ]),
        TYPE: ["trap", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

Class.sentryShip = {
  PARENT: "spaceship",
  LABEL: "Sentry",
  GUNS: [
    {
      POSITION: [16, 12, -1.4, 0, 0, 0, 0],
    },

    {
      POSITION: [10, 4, -1.4, 12, 0, 0, 0],
    },

    {
      POSITION: [2.5, 15, 1.6, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.hexaTrapper,
          g.power,
          g.power,
          g.annihilator,
          g.pounder,
          { reload: 1.3 },
          { recoil: 0 },
          g.battleship,
          g.annihilator,
        ]),
        TYPE: ["pillbox", { HITS_OWN_TYPE: "never" }],
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

Class.chasseurShip = {
  PARENT: "spaceship",
  LABEL: "Chasseur",
  BODY: {
    FOV: 2.5,
  },
  GUNS: [
    {
      POSITION: [36, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.battleship,
          g.assassin,
          { recoil: 0 },
          { reload: 1.2 },
          { speed: 2 },
          { damage: 1 },
        ]),
        TYPE: "bullet",
        LABEL: "Spaceship Basic Gun",
        COLOR: "grey",

        /*STAT_CALCULATOR: 0,
                    WAIT_TO_CYCLE: false,
                    AUTOFIRE: false,
                    SYNCS_SKILLS: false,
                    MAX_CHILDREN: 0,
                    ALT_FIRE: false,
                    */
      },
    },
  ],
};

Class.systemShipUPUP = {
  PARENT: "spaceship",
  LABEL: "Gadget",
  TURRETS: [
    {
      POSITION: [11, 8, -10, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 10, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: "spaceAutoGun",
    },

    {
      POSITION: [11, 12, 2, 90, 170, 0],
      TYPE: "spaceAutoGun",
    },

    {
      POSITION: [11, -12, 2, 90, 170, 0],
      TYPE: "spaceAutoGun",
    },
  ],
};

Class.systemShipFlankUP = {
  PARENT: "spaceship",
  LABEL: "Flank Defender",
  TURRETS: [
    {
      POSITION: [11, 12, -2, -90, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 12, 2, 90, 170, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 8, 0, 0, 170, 0],
      TYPE: "spaceAutoGun",
    },

    {
      POSITION: [11, 12, -8, -180, 190, 0],
      TYPE: "spaceAutoGun",
    },
    {
      POSITION: [11, 12, 8, -180, 190, 0],
      TYPE: "spaceAutoGun",
    },
  ],
};

Class.portalDeco = makeDeco(5);
Class.portal = {
  PARENT: "genericTank",
  TYPE: "portal",
  NAME: "",
  DAMAGE_CLASS: 0,
  DANGER: 0,
  IGNORED_BY_AI: true,
  HAS_NO_RECOIL: true,
  ACCEPTS_SCORE: false,
  CAN_BE_ON_LEADERBOARD: false,
  DRAW_HEALTH: false,
  DISPLAY_NAME: false,
  SIZE: 60,
  FACING_TYPE: ["spin", { speed: 0.04 /* Speed of spinning */ }],
  BODY: { PUSHABILITY: 0 },
  TURRETS: [
    {
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "portalDeco",
      COLOR: "black",
    },
  ],
  ON: [
    {
      event: "collide",
      handler: ({ instance, other }) => {
        instance._send ??= [];
        if (
          (!instance._send[other.id] || instance._send[other.id] == "empty") &&
          other.type == "tank" &&
          other.skill.level >= 90
        ) {
          instance.sendMessage("Sending!");
          instance._send[other.id] = "sending";
          setTimeout(() => {
            let limit = 20,
              loc;

            other.define({ RESET_STATS: true });

            other.define(Class.cosmic);
            other.skill.points = 75;

            do loc = getSpawnableArea(other.team);
            while (limit-- && dirtyCheck(loc, 50));

            other.x = 17500;
            other.y = 7500;
            other.invuln = true;
            other.team = TEAM_BLACK;
            instance._send[other.id] = "empty";
          }, 20);
        }
      },
    },
  ],
};

Class.ascendPortalDeco = makeDeco(10);
function playerlvl90(tank) {
  return tank.skill.level >= 90;
}
(Class.ascendPortal = {
  PARENT: "genericTank",
  TYPE: "portal",
  NAME: "",
  DAMAGE_CLASS: 0,
  DANGER: 0,
  SHAPE: 3,
  IGNORED_BY_AI: true,
  HAS_NO_RECOIL: true,
  ACCEPTS_SCORE: false,
  CAN_BE_ON_LEADERBOARD: false,
  DRAW_HEALTH: false,
  DISPLAY_NAME: false,
  SIZE: 200,
  FACING_TYPE: ["spin", { speed: 0.04 /* Speed of spinning */ }],
  BODY: { PUSHABILITY: 0 },
  TURRETS: [
    {
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "portalDeco",
      COLOR: "black",
    },
  ],
  ON: [
    {
      event: "collide",
      handler: ({ instance, other }) => {
        instance._send ??= [];
        if (
          (!instance._send[other.id] || instance._send[other.id] == "empty") &&
          other.type == "tank" &&
          playerlvl90(other)
        ) {
          instance.sendMessage("Sending!");
          instance._send[other.id] = "sending";

          setTimeout(() => {
            let limit = 20,
              loc;

            other.define({ RESET_STATS: true });

            other.define(Class.dreadOfficialV2);
            other.skill.points = 60;

            do loc = getSpawnableArea(other.team);
            while (limit-- && dirtyCheck(loc, 50));

            other.x = 17500;
            other.y = 7500;
            other.invuln = true;
            other.team = TEAM_BLACK;
            instance._send[other.id] = "empty";
          }, 20);
        }
      },
    },
  ],
}), //oh goddamnit
  (Class.plasmaRay = {
    // lol
    // the most basic error ever
    PARENT: "genericTank",
    LABEL: "Plasma Ray (trollface)",
    SIZE: 12,
    SHAPE: 0,
    GUNS: [
      {
        POSITION: [55.385, 8, 1, 0, 0, 330, 0],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [55.385, 8, 1, 0, 0, 30, 0],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [55.385, 8, 1, -55.385, -55.385, 75, 0],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [55.385, 8, 1, -55.385, 55.385, 285, 0],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [13.846, 9.6, 1, 0, 8.308, 0, 30],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            [2, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1],
          ]),
          TYPE: "bullet",
          COLOR: 16,
        },
      },
      {
        POSITION: [13.846, 9.6, 1, 0, 0, 0, 30],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            [2, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1],
          ]),
          TYPE: "bullet",
          COLOR: 16,
        },
      },
      {
        POSITION: [13.846, 9.6, 1, 0, -8.308, 0, 30],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([
            [2, 0, 0.001, 1, 1, 0.75, 1, 4.5, 1, 3, 1, 0.00001, 1],
          ]),
          TYPE: exports.bullet,
          COLOR: 16,
        },
      },
      {
        POSITION: [8.308, 8, 1, 6.923, 0, 270, 30],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [8.308, 8, 1, 6.923, 0, 90, 30],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [13.846, 32, 1, 0, 0, 180, 30],
        PROPERTIES: {
          COLOR: 16,
        },
      },
      {
        POSITION: [13.846, 32, 1, 0, 0, 0, 30],
        PROPERTIES: {
          COLOR: 16,
        },
      },
    ],
  }); //im having trouble with the plasma ray

Class.imageShapeTest = {
  PARENT: "genericTank",
  LABEL: "Image Shape Test",
  SHAPE: "round.png",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.spaceshipTank = {
  PARENT: ["genericTank"],
  LABEL: "Space Station",
  DANGER: 8,
  SHAPE: 4,
  CAN_BE_ON_LEADERBOARD: true,
  ON_MINIMAP: true,
  CONTROLLERS: ["nearestDifferentMaster", "minion", "canRepel"],
  AI: { NO_LEAD: true },
  COLOR: "gold",
  UPGRADE_COLOR: "gold",
  SIZE: 26,
  VALUE: 3e5,
  BODY: {
    FOV: 1,
    SPEED: 0.6 * base.SPEED,
    HEALTH: 2 * base.HEALTH,
    DAMAGE: 2.6 * base.DAMAGE,
  },
  GUNS: Array(4)
    .fill()
    .map((_, i) => ({
      POSITION: [3.5, 8.65, 1.2, 8, 0, i * 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.summoner,
          g.pounder,
          g.power,
          { size: 1 },
          { reload: 0.4 },
        ]),
        TYPE: ["sunchip"],
        AUTOFIRE: true,
        MAX_CHILDREN: 8,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.necro,
        WAIT_TO_CYCLE: true,
      },
    })),
};

//goddamn codeasndbox keeps formatting on save
// I think that can be turned off...
// is there problem with it? ye, it keeps adding stuff lemme try now
//tier 3 spaceships
Class.secret.UPGRADES_TIER_0 = ["developer", "betatester"];
Class.developer.UPGRADES_TIER_0 = [
  "tanks",
  "bosses",
  "spectator",
  "levels",
  "teams",
  "eggGenerator",
  "testing",
  "addons",
  ["volcanic", "baseSpaceship"],
  ["ignimbritic", "baseSpaceship"],
  ["spaceship", "auraShipHeal"],
  ["spaceship", "auraShipHealBig"],
  ["spaceship", "auraShipHealGuns"],
  ["spaceship", "auraShipHealSmash"],
  "spaceBoss",
  "cosmic",
  "portal",
  "ascendPortal",
  "plasmaRay",
  "portal1",
  "portal2",
  "portal3",
];
Class.betatester.UPGRADES_TIER_0 = [
  ["spaceship", "baseSpaceship"],
  ["spaceship", "auraShipHeal"],
  ["spaceship", "auraShipHealBig"],
  ["spaceship", "auraShipHealGuns"],
  ["spaceship", "auraShipHealSmash"],
  "plasmaRay",
  "bosses",
  "spectator",
  "teams",
  "eggGenerator",
  "spaceBoss",
  "testing",
  "tanks",
  ["spaceship", "auraShipHeal"],
  "cosmic",
  "levels",
];
Class.spaceship.UPGRADES_TIER_0 = [
  "keeper",
  "ignition",
  "plasmoid",
  "conquest",
  "systemShip",
];
Class.keeper.UPGRADES_TIER_0 = ["stalwart", "pyroclast", "demolisher"];
Class.stalwart.UPGRADES_TIER_0 = ["preserver"];
Class.pyroclast.UPGRADES_TIER_0 = ["ignimbritic"];
Class.demolisher.UPGRADES_TIER_0 = ["exterminator"];
Class.ignition.UPGRADES_TIER_0 = ["titan", "pyroclast", "compound"];
Class.titan.UPGRADES_TIER_0 = ["cyclopean"];
Class.pyroclast.UPGRADES_TIER_0 = ["ignimbritic"];
Class.compound.UPGRADES_TIER_0 = ["composite"];
Class.systemShip.UPGRADES_TIER_0 = ["systemShipUP", "systemShipFlank"];
Class.systemShipUP.UPGRADES_TIER_0 = ["systemShipUPUP"];
Class.systemShipFlank.UPGRADES_TIER_0 = ["systemShipFlankUP"];
Class.plasmoid.UPGRADES_TIER_0 = ["starflare", "sentinelShip"];
Class.starflare.UPGRADES_TIER_0 = ["starburst"];
Class.sentinelShip.UPGRADES_TIER_0 = ["sentryShip"];
Class.conquest.UPGRADES_TIER_0 = ["compound", "hunterShip"];
Class.compound.UPGRADES_TIER_0 = ["composite"];
Class.hunterShip.UPGRADES_TIER_0 = ["chasseurShip"];
Class.baseSpaceship.UPGRADES_TIER_0 = [
  "auraShip",
  "bulletShip",
  "smasherShip",
  "droneShip",
  "auraShipHeal",
];
Class.auraShipHeal.UPGRADES_TIER_0 = [
  "auraShipHealBig",
  "auraShipHealGuns",
  "auraShipHealSmash",
];
Class.auraShip.UPGRADES_TIER_0 = [
  "upAuraShip",
  "auraShipTri",
  "auraShipCombo",
  "smasherShipAura",
];
Class.bulletShip.UPGRADES_TIER_0 = [
  "upBulletShip",
  "auraShipCombo",
  "bulletShipTri",
  "smasherShipGun",
  "auraShipHealGuns",
];
Class.smasherShip.UPGRADES_TIER_0 = [
  "smasherShipGun",
  "smasherShipAura",
  "smasherShipUp",
  "auraShipHealSmash",
];

Class.droneShip.UPGRADES_TIER_0 = ["droneShipUp", "droneShipTri"];
Class.tanks.UPGRADES_TIER_0 = [
  "basic",
  "unavailable",
  "arenaCloser",
  "dominators",
  "sanctuaries",
  "mothership",
  "baseProtector",
  "antiTankMachineGun",
];
Class.unavailable.UPGRADES_TIER_0 = ["flail", "healer", "whirlwind"];
Class.flail.UPGRADES_TIER_2 = ["doubleFlail"];
Class.doubleFlail.UPGRADES_TIER_3 = ["tripleFlail"];
Class.dominators.UPGRADES_TIER_0 = [
  "destroyerDominator",
  "gunnerDominator",
  "trapperDominator",
];
Class.sanctuaries.UPGRADES_TIER_0 = [
  "sanctuaryTier1",
  "sanctuaryTier2",
  "sanctuaryTier3",
  "sanctuaryTier4",
  "sanctuaryTier5",
  "sanctuaryTier6",
];

Class.bosses.UPGRADES_TIER_0 = [
  "sentries",
  "elites",
  "mysticals",
  "nesters",
  "rogues",
  "rammers",
  "terrestrials",
  "celestials",
  "eternals",
  "devBosses",
];
Class.sentries.UPGRADES_TIER_0 = [
  "sentrySwarm",
  "sentryGun",
  "sentryTrap",
  "shinySentrySwarm",
  "shinySentryGun",
  "shinySentryTrap",
  "sentinelMinigun",
  "sentinelLauncher",
  "sentinelCrossbow",
];
Class.elites.UPGRADES_TIER_0 = [
  "eliteDestroyer",
  "eliteGunner",
  "eliteSprayer",
  "eliteBattleship",
  "eliteSpawner",
  "eliteTrapGuard",
  "eliteSpinner",
  "eliteSkimmer",
  "legionaryCrasher",
  "guardian",
  "defender",
  "sprayerLegion",
];
Class.mysticals.UPGRADES_TIER_0 = [
  "sorcerer",
  "summoner",
  "enchantress",
  "exorcistor",
  "shaman",
];
Class.nesters.UPGRADES_TIER_0 = ["nestKeeper", "nestWarden", "nestGuardian"];
Class.rogues.UPGRADES_TIER_0 = [
  "roguePalisade",
  "rogueArmada",
  "julius",
  "genghis",
  "napoleon",
];
Class.rammers.UPGRADES_TIER_0 = ["bob", "nemesis"];
Class.terrestrials.UPGRADES_TIER_0 = [
  "ares",
  "gersemi",
  "ezekiel",
  "eris",
  "selene",
];
Class.celestials.UPGRADES_TIER_0 = [
  "paladin",
  "freyja",
  "zaphkiel",
  "nyx",
  "theia",
  "atlas",
  "rhea",
  "julius",
  "genghis",
  "napoleon",
];
Class.eternals.UPGRADES_TIER_0 = ["odin", "kronos"];
Class.devBosses.UPGRADES_TIER_0 = [
  "taureonBoss",
  "zephiBoss",
  "dogeiscutBoss",
  "trplnrBoss",
  "frostBoss",
];

Class.testing.UPGRADES_TIER_0 = [
  "diamondShape",
  "miscTest",
  "mmaTest",
  "vulnturrettest",
  "onTest",
  "alphaGunTest",
  "strokeWidthTest",
  "testLayeredBoss",
  "tooltipTank",
  "turretLayerTesting",
  "bulletSpawnTest",
  "propTest",
  "imageShapeTest",
  "auraBasic",
  "auraHealer",
  "weirdAutoBasic",
  "ghoster",
  "switcheroo",
  ["developer", "developer"],
  "armyOfOne",
  "vanquisher",
  "mummifier",
];
