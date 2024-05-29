const { combineStats, makeAuto, addAura } = require("../facilitators.js");
const { gunCalcNames, smshskl } = require("../constants.js");
const g = require("../gunvals.js");

var addTier3s = true;
var cosmeticBody = {
  ACCEL: 1.6,
  SPEED: 5,
  HEALTH: 65,
  DAMAGE: 10,
  RESIST: 1,
  PENETRATION: 2,
  SHIELD: 30,
  REGEN: 0.025,
  FOV: 1.15,
  DENSITY: 3,
};
var cosmeticSmasherBody = {
  ACCEL: 1.6,
  SPEED: 5 * 1.35,
  HEALTH: 65 * 1.2,
  DAMAGE: 10 * 1.15,
  RESIST: 1,
  PENETRATION: 2,
  SHIELD: 30 * 90,
  REGEN: 0.025,
  FOV: 1.15,
  DENSITY: 3,
};
var cosmeticBalanceSkill = {
  health: 0.45,
  damage: 1.2,
  penetration: 0.4,
  reload: 0.95,
};

/** TURRET(S) */

Class.autoCosmicGun = {
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
          g.autoTurret,
          { recoil: 0 },
          { reload: 2 },
          cosmeticBalanceSkill,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.megaTurret = {
  PARENT: ["autoTankGun"],
  LABEL: "Mega Turret",
  INDEPENDENT: true,
  GUNS: [
    {
      POSITION: [22, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.artillery,
          { recoil: 0 },
          { reload: 1.2 },
          cosmeticBalanceSkill,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.teraTurret = {
  PARENT: ["autoTankGun"],
  LABEL: "Tera Turret",
  INDEPENDENT: true,
  GUNS: [
    {
      POSITION: [22, 16, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.destroyer,
          g.artillery,
          { recoil: 0 },
          { reload: 1.2 },
          cosmeticBalanceSkill,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};

/** GENERIC __ STUFF */

Class.cosmicsWeapons = {
  LABEL: "Nebula",
  COLOR: "darkGrey",
  SHAPE: 5.5,
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
};
Class.cosmicsBody = {
  LABEL: "Galactic",
  COLOR: "darkGrey",
  SHAPE: 5.5,
  REROOT_UPGRADE_TREE: "cosmicsBody",
};
Class.genericCosmic = {
  PARENT: ["genericTank"],
  LABEL: "Cosmic",
  BODY: cosmeticBody,
  SIZE: 25,
  SHAPE: 5.5,
  SKILL_CAP: Array(10).fill(15),
  COLOR: "darkGrey",
};
Class.genericSmasherCosmic = {
  PARENT: ["genericTank"],
  LABEL: "Cosmic",
  BODY: cosmeticSmasherBody,
  SIZE: 25,
  SHAPE: 5.5,
  SKILL_CAP: Array(10).fill(15),
  COLOR: "darkGrey",
};
var smasherPart = [
  {
    POSITION: [22.5, 0, 0, 0, 72, 0],
    TYPE: ["genericCosmic", { MIRROR_MASTER_ANGLE: true, COLOR: "darkGrey" }],
  },
];
/** W_E_A_P_O_N ===== U_P_G_R_A_D_E_S */
// TIER 1
Class.planet = {
  PARENT: ["genericCosmic"],
  LABEL: "Planet",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [16, 5, 1, 0, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, cosmeticBalanceSkill]),
        TYPE: "bullet",
      },
    })),
};
Class.binary = {
  PARENT: ["genericCosmic"],
  LABEL: "Binary",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [7, 8, 1.4, 9, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, cosmeticBalanceSkill]),
        TYPE: "drone",
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        MAX_CHILDREN: 3,
      },
    })),
};
Class.asteroid = {
  PARENT: ["genericCosmic"],
  LABEL: "Asteroid",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [13.5, 5, 1, 0, 0, i * (360 / 5), 0],
        },
        {
          POSITION: [2.5, 5, 1.7, 13.5, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.trap,
              { reload: 1.19 },
              cosmeticBalanceSkill,
            ]),
            TYPE: "trap",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
      );
    }
    return output;
  })(),
};

// ----------- TIER 2 -----------

Class.system = {
  PARENT: ["genericCosmic"],
  LABEL: "System",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push({
          POSITION: [
            [14, 14, 16][k],
            5.5,
            1,
            0,
            [3.7, -3.7, 0][k],
            i * (360 / 5),
            [0.5, 0.5, 0][k],
          ],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.basic,
              g.twin,
              g.tripleShot,
              g.triplet,
              cosmeticBalanceSkill,
            ]),
            TYPE: "bullet",
          },
        });
      }
    }
    return output;
  })(),
};
Class.stellar = {
  PARENT: ["genericCosmic"],
  LABEL: "Stellar",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 2; k++) {
        output.push({
          POSITION: [
            [14, 16][k],
            [8, 6][k],
            1.8,
            0,
            0,
            i * (360 / 5),
            [0, 0.05][k],
          ],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.basic,
              g.machineGun,
              cosmeticBalanceSkill,
            ]),
            TYPE: "bullet",
          },
        });
      }
    }
    return output;
  })(),
};
Class.mega = {
  PARENT: ["genericCosmic"],
  LABEL: "Mega",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [16, 9, 1, 0, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.destroyer,
          cosmeticBalanceSkill,
        ]),
        TYPE: "bullet",
      },
    })),
};

Class.proton = {
  PARENT: ["genericCosmic"],
  LABEL: "Proton",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [13.5, 8, 1, 0, 0, i * (360 / 5), 0],
        },
        {
          POSITION: [2.5, 8, 1.7, 13.5, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.trap,
              g.setTrap,
              g.construct,
              cosmeticBalanceSkill,
              { reload: 2 },
              { range: 1.2 },
            ]),
            TYPE: "unsetTrap",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
      );
    }
    return output;
  })(),
};
Class.supernova = {
  PARENT: ["genericCosmic"],
  LABEL: "Supernova",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push(
          {
            POSITION: [
              [11.5, 11.5, 13.5][k],
              5,
              1,
              0,
              [4, -4, 0][k],
              i * (360 / 5),
              0,
            ],
          },
          {
            POSITION: [
              2.5,
              5,
              1.7,
              [11.5, 11.5, 13.5][k],
              [4, -4, 0][k],
              i * (360 / 5),
              [0.333, 0.667, 0][k],
            ],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.trap,
                { reload: 4.2 },
                cosmeticBalanceSkill,
              ]),
              TYPE: "trap",
              STAT_CALCULATOR: gunCalcNames.trap,
            },
          },
        );
      }
    }
    return output;
  })(),
};
Class.mechanic = {
  PARENT: ["genericCosmic"],
  LABEL: "Mechanic",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [13.5, 7, 1, 0, 0, i * (360 / 5), 0],
        },
        {
          POSITION: [2.5, 7, 1.6, 13.5, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.trap,
              { reload: 1.7 },
              cosmeticBalanceSkill,
            ]),
            TYPE: "turretedTrap",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
      );
    }
    return output;
  })(),
};

Class.trinary = {
  PARENT: ["genericCosmic"],
  LABEL: "Trinary",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [7, 8, 1.3, 9, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, cosmeticBalanceSkill]),
        TYPE: "minion",
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        MAX_CHILDREN: 2,
      },
    })),
};
Class.supergiant = {
  PARENT: ["genericCosmic"],
  LABEL: "Supergiant",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [7, 10, 1.4, 9, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.drone,
          g.pounder,
          cosmeticBalanceSkill,
        ]),
        TYPE: "drone",
        STAT_CALCULATOR: gunCalcNames.drone,
        AUTOFIRE: true,
        MAX_CHILDREN: 4,
      },
    })),
};
Class.cluster = {
  PARENT: ["genericCosmic"],
  LABEL: "Cluster",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: Array(5)
    .fill()
    .map((_, i) => ({
      POSITION: [7, 11, 0.6, 9, 0, i * (360 / 5), 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          cosmeticBalanceSkill,
          { reload: 0.5 },
        ]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    })),
};

// ------------------------- TIER 3 ------------------------

Class.hypercluster = {
  PARENT: ["genericCosmic"],
  LABEL: "Hypercluster",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push(
          {
            POSITION: [
              [5, 5, 7][k],
              6,
              0.6,
              9,
              [2.6, -2.6, 0][k],
              i * (360 / 5),
              [0.5, 0.5, 0][k],
            ],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([g.swarm, cosmeticBalanceSkill]),
              TYPE: "swarm",
              STAT_CALCULATOR: gunCalcNames.swarm,
            },
          },
          {
            POSITION: [
              [5, 5, 7][k],
              6,
              0.001,
              9,
              [2.6, -2.6, 0][k],
              i * (360 / 5),
              [0.5, 0.5, 0][k],
            ],
            PROPERTIES: {
              COLOR: "darkGrey",
            },
          },
        );
      }
    }
    return output;
  })(),
};
Class.hypergiant = {
  PARENT: ["genericCosmic"],
  LABEL: "Hypergiant",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [9, 13, 1.4, 9, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.drone,
              g.pounder,
              g.destroyer,
              cosmeticBalanceSkill,
            ]),
            TYPE: "drone",
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
          },
        },
        {
          POSITION: [5, 13.1, 0.01, 9, 0, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        },
        {
          POSITION: [11, 8, 0.01, 9, 0, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "red",
          },
        },
      );
    }
    return output;
  })(),
};
Class.novae = {
  PARENT: ["genericCosmic"],
  LABEL: "Novae",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 10; i++) {
      output.push(
        {
          POSITION: [8, 4, 1.8, 9, i > 4 ? -3.4 : 3.4, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.factory,
              g.pounder,
              cosmeticBalanceSkill,
            ]),
            TYPE: "minion",
            STAT_CALCULATOR: gunCalcNames.drone,
            AUTOFIRE: true,
            MAX_CHILDREN: 2,
          },
        },
        {
          POSITION: [17, 8, 0.01, 0, i > 4 ? -3.4 : 3.4, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        },
      );
    }
    return output;
  })(),
};

Class.hypernova = {
  PARENT: ["genericCosmic"],
  LABEL: "Hypernova",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push(
          {
            POSITION: [
              [13.5, 13.5, 15.5][k],
              5,
              1,
              0,
              [4, -4, 0][k],
              i * (360 / 5),
              0,
            ],
          },
          {
            POSITION: [
              2.5,
              5,
              1.7,
              [13.5, 13.5, 15.5][k],
              [4, -4, 0][k],
              i * (360 / 5),
              [0.333, 0.667, 0][k],
            ],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.trap,
                { reload: 5 },
                cosmeticBalanceSkill,
              ]),
              TYPE: "trap",
              STAT_CALCULATOR: gunCalcNames.trap,
            },
          },
          {
            POSITION: [
              2.5,
              5,
              1.7,
              [11.5, 11.5, 13.5][k],
              [4, -4, 0][k],
              i * (360 / 5),
              [1, 1.333, 1.667][k],
            ],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.trap,
                { reload: 5 },
                cosmeticBalanceSkill,
              ]),
              TYPE: "trap",
              STAT_CALCULATOR: gunCalcNames.trap,
            },
          },
        );
      }
    }
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push({
          POSITION: [
            [15.5, 15.5, 17.5][k],
            5,
            0.001,
            0,
            [4, -4, 0][k],
            i * (360 / 5),
            0,
          ],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        });
      }
    }
    return output;
  })(),
};
Class.interstellar = {
  PARENT: ["genericCosmic"],
  LABEL: "Interstellar",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [13.5, 13, 1, 0, 0, i * (360 / 5), 0],
        },
        {
          POSITION: [2.5, 13, 1.6, 13.5, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.trap,
              g.pounder,
              g.destroyer,
              { reload: 1.19 },
              cosmeticBalanceSkill,
            ]),
            TYPE: "turretedTrap",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
        {
          POSITION: [15.5, 13, 0.001, 0, 0, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        },
      );
    }
    return output;
  })(),
};
Class.borealis = {
  PARENT: ["genericCosmic"],
  LABEL: "Borealis",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [13.5, 12, 1, 0, 0, i * (360 / 5), 0],
        },
        {
          POSITION: [2.5, 12, 1.7, 13.5, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.trap,
              g.setTrap,
              g.construct,
              g.pounder,
              cosmeticBalanceSkill,
              { reload: 2 },
              { range: 1.2 },
            ]),
            TYPE: "unsetTrap",
            STAT_CALCULATOR: gunCalcNames.trap,
          },
        },
        {
          POSITION: [13.5, 8, 0.001, 0, 0, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        },
      );
    }
    return output;
  })(),
};

Class.blackhole = {
  PARENT: ["genericCosmic"],
  LABEL: "Black Hole",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push(
        {
          POSITION: [16, 13, 1, 0, 0, i * (360 / 5), 0],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.basic,
              g.pounder,
              g.destroyer,
              g.annihilator,
              cosmeticBalanceSkill,
            ]),
            TYPE: "bullet",
          },
        },
        {
          POSITION: [18, 6, 0.001, 0, 0, i * (360 / 5), 0],
          PROPERTIES: {
            COLOR: "darkGrey",
          },
        },
      );
    }
    return output;
  })(),
};
Class.magnetar = {
  PARENT: ["genericCosmic"],
  LABEL: "Magnetar",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push({
          POSITION: [
            [12, 14, 16][k],
            [8, 6, 4][k],
            1.8,
            0,
            0,
            i * (360 / 5),
            [0, 0.05, 0.1][k],
          ],
          PROPERTIES: {
            SHOOT_SETTINGS: combineStats([
              g.basic,
              g.machineGun,
              cosmeticBalanceSkill,
            ]),
            TYPE: "bullet",
          },
        });
      }
      output.push({
        POSITION: [17, 6, 0.01, 0, 0, i * (360 / 5), 0],
        PROPERTIES: {
          COLOR: "darkGrey",
        },
      });
    }
    return output;
  })(),
};
Class.pulsar = {
  PARENT: ["genericCosmic"],
  LABEL: "Pulsar",
  REROOT_UPGRADE_TREE: "cosmicsWeapons",
  GUNS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      for (let k = 0; k < 3; k++) {
        output.push(
          {
            POSITION: [
              [14, 14, 16][k],
              4,
              1.8,
              0,
              [3.5, -3.5, 0][k],
              i * (360 / 5),
              [0.5, 0.5, 0][k],
            ],
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.basic,
                g.twin,
                g.tripleShot,
                g.triplet,
                g.machineGun,
                cosmeticBalanceSkill,
              ]),
              TYPE: "bullet",
            },
          },
          {
            POSITION: [
              [15, 15, 17][k],
              5,
              0.0001,
              0,
              [3.5, -3.5, 0][k],
              i * (360 / 5),
              0,
            ],
            PROPERTIES: {
              COLOR: "darkGrey",
            },
          },
        );
      }
    }
    return output;
  })(),
};
/** B_O_D_Y ===== U_P_G_R_A_D_E_S */
Class.kuiperAura = addAura(1.2, 1.2, 0.3);
Class.normalAura = addAura(1.4, 1.4, 0.3);
Class.exabyteAura = addAura(1.8, 1.5, 0.3);

Class.kilobyte = {
  PARENT: ["genericCosmic"],
  LABEL: "Kilobyte",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: ["autoCosmicGun", { INDEPENDENT: true }],
      });
    }
    output.push({
      POSITION: [10, 0, 0, 0, 360, 1],
      TYPE: "megaTurret",
    });
    return output;
  })(),
};

Class.kuiper = {
  PARENT: ["genericCosmic"],
  LABEL: "Kuiper",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push({
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: "megaTurret",
    });
    return output;
  })(),
};

Class.pluto = {
  PARENT: ["genericCosmic"],
  LABEL: "Pluto",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push({
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "normalAura",
    });
    return output;
  })(),
};

// TIER 2 BODIES
Class.charon = {
  PARENT: ["genericCosmic"],
  LABEL: "Charon",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 50, 0, i * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push({
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "normalAura",
    });
    return output;
  })(),
};
Class.laniakea = {
  PARENT: ["genericCosmic"],
  LABEL: "Laniakea",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: ["autoCosmicGun", { INDEPENDENT: true }],
      });
    }
    output.push(
      {
        POSITION: [10, 0, 0, 0, 360, 1],
        TYPE: "megaTurret",
      },
      ...smasherPart,
    );
    return output;
  })(),
};
Class.nova = {
  PARENT: ["genericSmasherCosmic"],
  LABEL: "Nova",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push(
      {
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: "megaTurret",
      },
      ...smasherPart,
    );
    return output;
  })(),
};
Class.galaxy = {
  PARENT: ["genericSmasherCosmic"],
  LABEL: "Galaxy",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push(
      {
        POSITION: [8, 0, 0, 0, 360, 1],
        TYPE: "normalAura",
      },
      ...smasherPart,
    );
    return output;
  })(),
};
Class.orion = {
  PARENT: ["genericCosmic"],
  LABEL: "Orion",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: "kuiperAura",
      });
    }
    output.push({
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: "teraTurret",
    });
    return output;
  })(),
};
Class.exabyte = {
  PARENT: ["genericCosmic"],
  LABEL: "Exabyte",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: ["autoCosmicGun", { INDEPENDENT: true }],
      });
    }
    output.push({
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: "exabyteAura",
    });
    return output;
  })(),
};
Class.storage = {
  PARENT: ["genericCosmic"],
  LABEL: "Storage",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [3, 8.5, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: ["autoCosmicGun", { INDEPENDENT: true }],
      });
    }
    output.push({
      POSITION: [11.25, 0, 0, 0, 360, 1],
      TYPE: "teraTurret",
    });
    return output;
  })(),
};

Class.superclusterAura = addAura(-1, 1.8, 0.3, "green");
Class.supercluster = {
  PARENT: ["genericCosmic"],
  LABEL: "Supercluster",
  REROOT_UPGRADE_TREE: "cosmicsBody",
  TURRETS: ((output = []) => {
    for (let i = 0; i < 5; i++) {
      output.push({
        POSITION: [4, 8, 0, (i + 0.5) * (360 / 5), 360, 1],
        TYPE: ["autoCosmicGun", { INDEPENDENT: true }],
      });
    }
    output.push({
      POSITION: [9, 0, 0, 0, 360, 1],
      TYPE: "superclusterAura",
    });
    return output;
  })(),
};

/** MAIN COSMIC */
Class.cosmic = {
  PARENT: ["genericCosmic"],
};
Class.cosmic.UPGRADES_TIER_6 = [[Class.cosmicsWeapons, Class.cosmicsBody]];

// WEAPONS FIRST UPGRADES

Class.cosmicsWeapons.UPGRADES_TIER_6 = [
  Class.planet,
  Class.binary,
  Class.asteroid,
];

// BODY FIRST UPGRADES

Class.cosmicsBody.UPGRADES_TIER_8 = [Class.kilobyte, Class.kuiper, Class.pluto];

// WEAPONS UPGRADES

Class.planet.UPGRADES_TIER_8 = [Class.system, Class.stellar, Class.mega];
Class.binary.UPGRADES_TIER_8 = [Class.trinary, Class.cluster, Class.supergiant];
Class.asteroid.UPGRADES_TIER_8 = [
  //Class.mechanic,
  Class.supernova,
  Class.proton,
];

// BODY  UPGRADES

Class.kilobyte.UPGRADES_TIER_10 = [
  Class.exabyte,
  Class.storage,
  Class.laniakea,
];
Class.kuiper.UPGRADES_TIER_10 = [Class.orion, Class.nova];
Class.pluto.UPGRADES_TIER_10 = [
  Class.exabyte,
  Class.galaxy,
  Class.orion,
  Class.charon,
  Class.supercluster,
];

Class.addons.UPGRADES_TIER_0.push(Class.cosmic);

if (addTier3s) {
  Class.supernova.UPGRADES_TIER_1 = [Class.hypernova];
  Class.proton.UPGRADES_TIER_1 = [Class.borealis];
  Class.mechanic.UPGRADES_TIER_1 = [Class.interstellar];
  Class.system.UPGRADES_TIER_12 = [Class.pulsar];
  Class.stellar.UPGRADES_TIER_12 = [Class.magnetar];
  Class.mega.UPGRADES_TIER_12 = [Class.blackhole];
  Class.cluster.UPGRADES_TIER_12 = [Class.hypercluster];
  Class.trinary.UPGRADES_TIER_12 = [Class.novae];
  Class.supergiant.UPGRADES_TIER_12 = [Class.hypergiant];
  console.log("[cosmics.js]: Cosmics Weapon Tier 3 added");
}

return console.log("[cosmics.js]: Cosmics added.");
