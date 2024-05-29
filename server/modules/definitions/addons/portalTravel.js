/*const { combineStats } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// Portal Class Definition

Class.portalAura = {
    PARENT: "bullet",
    MOTION_TYPE: "withMaster",
    CLEAR_ON_MASTER_UPGRADE: true,
    ALPHA: 0,
    ACCEPS_SCORE: false,
    BODY:{
        HEALTH: 100000,
        DAMAGE: 0,
        DENSITY: 0,
        SPEED: 0,
        PUSHABILITY: 0,
    },
    ON: [{
        event: 'tick',
        handler: ({body}) => {
                body.SIZE -= 1
                if (body.alpha < 1) body.alpha += 0.02;
                if (body.SIZE < 3) body.kill();
        }
    },
  ],
  TURRETS: [
    {
        POSITION: [20, 0, 0, 0, 0, 1],
        TYPE: ["egg",{COLOR: "#ffffff"}],
    },
],
  }

Class.serverPortal = {
    PARENT: ["genericTank"],
    // TYPE: "portal",
    LABEL: "Travel Portal",
    UPGRADE_LABEL: "Portal",
    NAME: "Portal",
    COLOR: "#000000",
    BODY: {
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
        PUSHABILITY: 0,
        DENSITY: 0,
    },
    FACING_TYPE: "autospin",
    ITS_OWN_TYPE: "never",
    ARENA_CLOSER: true,
    IGNORED_BY_AI: true,
    CAN_BE_ON_LEADERBOARD: false,
    GIVE_KILL_MESSAGE: false,
    ACCEPTS_SCORE: false,
    DISPLAY_NAME: true,
    SIZE: 30,
    GUNS: [
        {
        POSITION: [2, 14, 1, 2.5, 0, 0, 0],
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.basic,{damage: 0, speed: 0, maxSpeed: 0, reload: 0.4, recoil: 0, size: 3}]),
          TYPE: [Class.portalAura],
          SYNCS_SKILLS: true,
          AUTOFIRE: true,
        },
      },
    ],
    ON: [
        {
         event: "tick",
         handler: ({ body }) => {
           for (let instance of entities) {
                 let diffX = instance.x - body.x,
                     diffY = instance.y - body.y,
                     dist2 = diffX ** 2 + diffY ** 2,
                     number1 = 1,
                     number2 = 1,
                     number3 = 1/20, //1/7,
                     number4 = 1,
                     forceMulti = (((((3)*100) ** 2)** number1) * number2) / dist2;
                 if (dist2 <= ((body.size / 12)*100) ** 2) {
                    if (instance.isPlayer && instance.skill.level >= 90) {
                     instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.001);//0.05
                     instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.001);//0.05
             } else if (body.name == "Labyrinth" || body.name == "2TDM") {
              if (instance.isPlayer) {
                instance.velocity.x += util.clamp(body.x - instance.x, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.001);//0.05
                instance.velocity.y += util.clamp(body.y - instance.y, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.001);//0.05
              }
            } else if (
                !instance.isDominator && 
                !instance.isArenaCloser && 
                !instance.godmode && 
                !instance.invuln && 
                instance.id != body.id && 
                instance.type !== "wall" &&
                instance.team != body.team && 
                ((instance.id === instance.master.id && instance.type !== "miniboss") || 
                    instance.type === "bullet" || 
                    instance.type === "drone" || 
                    instance.type === "trap" || 
                    instance.type === "minion")) {
                instance.accel.x -= util.clamp(body.x - instance.x, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.3);//0.05
                instance.accel.y -= util.clamp(body.y - instance.y, -90, 90) * instance.damp * ((1 - (1/((forceMulti ** number3)* number4)))+ 0.3);//0.05
                if (instance.isPlayer && !instance.isAlerted) {
                  if (body.name == "Labyrinth" || body.name == "2TDM") return;
                  instance.isAlerted = true;
                  setTimeout(() => {
                    instance.isAlerted = false;
                  }, 10000)
                  instance.socket.talk("m", "You need to be level 90 to enter this portal!")
                }
             }
         }
         }
         }
     },
      ],
};

for (let i = 0; i < 30; i++) {
  Class.serverPortal.GUNS.push({
    POSITION: [2, 8, 1, -50, 0, (360 / i) * 30, Math.random()],
    PROPERTIES: {
      SHOOT_SETTINGS: combineStats([
        g.basic,
        { shudder: 0, spray: 0, reload: 5, recoil: 0, range: 0.2 },
      ]),
      SYNCS_SKILLS: true,
      AUTOFIRE: true,
      ALPHA: 0,
      TYPE: [
        Class.bullet,
        {
          ALPHA: 0.2,
          TURRETS: [
            {
              POSITION: [20, 0, 0, 0, 0, 1],
              TYPE: ["egg", { COLOR: "#ffffff" }],
            },
          ],
        },
      ],
    },
  });
}

// Server chooser

const serverData = "https://h5s8j2-26301.csb.app/travelData";
function chooseServer() {
    return fetch(serverData).then(r => r.json()).then(async (servers) => {
        try {
            let availableServers = [];
            for (let server of servers) {
                if (server.ip === c.host || server.gameMode.trim() === "Unknown") continue;
                if (await (fetch(`https://${server.ip}/isOnline`).then(r => r.json()).catch(() => false))) availableServers.push(server);
            }
            if (availableServers.length < 1) return false;
            let server = availableServers[Math.floor(Math.random() * availableServers.length)];
            return { name: server.gameMode.trim(), destination: "https://" + server.ip };
        } catch (e) {
            console.log(e);
        }
    }).catch(e => console.log(e));
}


// Portal spawner class

global.Portal = class {
    static active = [];
    static async spawnRandom() {
        let server = await chooseServer();
        if (server) {
            let portal = new global.Portal(server.name, server.destination);
            let loc = {};
            let tries = 50;
            do {
                loc = room.random();
            } while (tries-- && dirtyCheck(loc, 50))
            portal.spawn(room.random(), 60000);
            return portal;
        }
        setTimeout(() => Portal.spawnRandom(), 1000);
    }
    constructor(name, destination) {
        this.name = name;
        this.destination = destination;
        this.body = null;
        this.ticksLeft = 0;
    }
    spawn(loc, duration) {
        this.body = new Entity(loc);
        this.body.define("serverPortal");
        this.body.godmode = true;
        this.body.team = -101;
        this.body.isPortal = true;
        this.body.name = this.name;
        this.body.settings.destination = this.destination;
        this.body.allowedOnMinimap = true;
        this.body.alwaysShowOnMinimap = true;
        setTimeout(() => {
            this.body.destroy();
            let index = Portal.active.indexOf(this);
            if (index !== -1) Portal.active.remove(index);
        }, duration);
        Portal.active.push(this);
    }
}

// Portal spawn loop

function spawnPortalLoop() {
    setTimeout(() => {
        Portal.spawnRandom();
        Portal.spawnRandom();
        spawnPortalLoop();
    }, 60000);
  //  }, 10000 )
}

module.exports = () => spawnPortalLoop();
*/