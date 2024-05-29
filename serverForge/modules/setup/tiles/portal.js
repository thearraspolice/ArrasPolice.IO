let launchForce = 1250,
  gravity = 13500,
  minibossPush = 30000,
  portals = [],
  portalsAscend = [],
  portal = new Tile({
    color: 19,
    init: (tile) => portals.push(tile),
    tick: (tile) => {
      for (let entity of tile.entities) {
        if (
          entity.passive ||
          entity.settings.goThruObstacle ||
          entity.facingType[0] === "bound"
        )
          continue;
        let dx = entity.x - tile.loc.x,
          dy = entity.y - tile.loc.y,
          dist2 = dx ** 2 + dy ** 2,
          force = c.ROOM_BOUND_FORCE;

        //push away big boys
        if (entity.type === "miniboss" || entity.isMothership) {
          entity.accel.x += (minibossPush * dx * force) / dist2;
          entity.accel.y += (minibossPush * dy * force) / dist2;
          continue;
        }

        //kill anything not a tank
        if (entity.type !== "tank") {
          entity.kill();
          continue;
        }

        //that tank is not close enough, suck them in!
        let eventHorizon = Math.min(room.tileWidth, room.tileHeight) / 5;
        if (dist2 > eventHorizon ** 2) {
          force *= gravity / dist2;
          entity.velocity.x -= dx * force;
          entity.velocity.y -= dy * force;
          continue;
        }

        //calc stuff for teleporting and launching them
        force *= launchForce;
        let angle = Math.random() * Math.PI * 2,
          ax = Math.cos(angle),
          ay = Math.sin(angle),
          exitport = ran.choose(
            portals.filter((p) => p !== tile) || room.random(),
          );

        //launch that idiot from the outportal
        entity.velocity.x = ax * force;
        entity.velocity.y = ay * force;
        entity.x = exitport.loc.x + ax * room.tileWidth;
        entity.y = exitport.loc.y + ay * room.tileHeight;
        entity.protect();

        //also don't forget to bring her kids along the ride
        for (let o of entities) {
          if (
            o.id !== entity.id &&
            o.master.master.id === entity.id &&
            (o.type === "drone" ||
              o.type === "minion" ||
              o.type === "satellite")
          ) {
            o.velocity.x += entity.velocity.x;
            o.velocity.y += entity.velocity.y;
            o.x = entity.x;
            o.y = entity.y;
          }
        }
      }
    },
  }),
  gate = new Tile({
    color: "blue",
    init: (tile) => portals.push(tile),
    tick: (tile) => {
      for (let entity of tile.entities) {
        if (
          entity.passive ||
          entity.settings.goThruObstacle ||
          entity.facingType[0] === "bound"
        )
          continue;
        let dx = entity.x - tile.loc.x,
          dy = entity.y - tile.loc.y,
          dist2 = dx ** 2 + dy ** 2,
          force = c.ROOM_BOUND_FORCE;

        //push away every tank below 90 level
        if (!(entity.type == "tank" && entity.skill.level >= 90)) {
          entity.accel.x +=
            ((minibossPush / (entity.type == "tank" ? 10 : 1)) * dx * force) /
            dist2;
          entity.accel.y +=
            ((minibossPush / (entity.type == "tank" ? 10 : 1)) * dy * force) /
            dist2;
          continue;
        }

        //that tank is not close enough, suck them in!
        // let eventHorizon = Math.min(room.tileWidth, room.tileHeight) / 5;
        // if (dist2 > eventHorizon ** 2) {
        //   force *= gravity / dist2;
        //   entity.velocity.x -= dx * force;
        //   entity.velocity.y -= dy * force;
        //   continue;
        // }

        //calc stuff for teleporting and launching them
        force *= launchForce;
        // let angle = Math.random() * Math.PI * 2,
        //   ax = Math.cos(angle),
        //   ay = Math.sin(angle),
        //   exitport = ran.choose(
        //     portals.filter((p) => p !== tile) || room.random(),
        //   );

        //launch that idiot from the outportal
        // entity.velocity.x = ax * force;
        // entity.velocity.y = ay * force;
        // entity.x = exitport.loc.x + ax * room.tileWidth;
        // entity.y = exitport.loc.y + ay * room.tileHeight;
        // entity.protect();

        //also don't forget to bring her kids along the ride
        // for (let o of entities) {
        //   if (
        //     o.id !== entity.id &&
        //     o.master.master.id === entity.id &&
        //     (o.type === "drone" ||
        //       o.type === "minion" ||
        //       o.type === "satellite")
        //   ) {
        //     o.velocity.x += entity.velocity.x;
        //     o.velocity.y += entity.velocity.y;
        //     o.x = entity.x;
        //     o.y = entity.y;
        //   }
        // }
      }
    },
  }),
  portalAscend = new Tile({
    color: "hexagon",
    init: (tile) => portalsAscend.push(tile),
    tick: (tile) => {
      for (let entity of tile.entities) {
        if (
          entity.passive ||
          entity.settings.goThruObstacle ||
          entity.facingType[0] === "bound"
        )
          continue;
        let dx = entity.x - tile.loc.x,
          dy = entity.y - tile.loc.y,
          dist2 = dx ** 2 + dy ** 2,
          force = 0.1;

          if (entity.isPlayer && entity.skill.level >= 90 && !entity.hasAcended) {

        //kill anything not a tank
        if (entity.type !== "tank") {
          entity.kill();
          continue;
        }

        //that tank is not close enough, suck them in!
      

        let eventHorizon = Math.min(room.tileWidth, room.tileHeight) / 5;
        if (dist2 > eventHorizon ** 2) {
          force *= gravity / dist2;
          entity.velocity.x -= dx * force;
          entity.velocity.y -= dy * force;
          continue;
        }
        

        //calc stuff for teleporting and launching them
        force *= launchForce;
        let angle = Math.random() * Math.PI * 5,
          ax = Math.cos(angle),
          ay = Math.sin(angle);
        //exitport = ran.choose(portals.filter(p => p !== tile) || room.random());

        //launch that idiot from the outportal
        entity.velocity.x = 0.1;//ax * force;
        entity.velocity.y = 0.1; //ay * force;
        entity.x = room.width / 2;
        entity.y = room.height / 2;
        entity.hasAcended = true;
        entity.alwaysHasInvuln = true;
        entity.invuln = true;
        entity.socket.talk("m", "You have been transformed to a new cosmic body..");
        entity.socket.talk("m", "You will be now invulnerable until you shoot, or wait 10 seconds.");
        setTimeout(() => {
           entity.alwaysHasInvuln = false;
        }, 10000)
        entity.define({
          RESET_UPGRADES: true,
        })
        //entity.define({ RESET_STATS: true });
        entity.define([Class.cosmic]);
        entity.protect();
        entity.team = TEAM_BLACK;
          } else {
         //push away the fuckers
          entity.accel.x += (10000 * dx * force) / dist2;
          entity.accel.y += (10000 * dy * force) / dist2;
          if (entity.isPlayer) entity.socket.talk("m", "You need to be level 90 to enter this portal!")
        }
          }

        //also don't forget to bring her kids along the ride
        /* for (let o of entities) {
                if (o.id !== entity.id && o.master.master.id === entity.id && (o.type === "drone" || o.type === "minion" || o.type === "satellite")) {
                    o.velocity.x += entity.velocity.x;
                    o.velocity.y += entity.velocity.y;
                    o.x = entity.x;
                    o.y = entity.y;
                }
            }*/
      }
  }),
  portalMaze = new Tile({
    color: 12,
    init: (tile) => portals.push(tile),
    tick: (tile) => {
      for (let entity of tile.entities) {
        if (
          entity.passive ||
          entity.settings.goThruObstacle ||
          entity.facingType[0] === "bound"
        )
          continue;
          let dx = entity.x - tile.loc.x,
          dy = entity.y - tile.loc.y,
          dist2 = dx ** 2 + dy ** 2,
          force = c.ROOM_BOUND_FORCE;

        //push away big boys
        if (entity.type === "miniboss" || entity.isMothership) {
          entity.accel.x += (minibossPush * dx * force) / dist2;
          entity.accel.y += (minibossPush * dy * force) / dist2;
          continue;
        }

        //kill anything not a tank
        if (entity.type !== "tank") {
          entity.kill();
          continue;
        }

        //that tank is not close enough, suck them in!
        let eventHorizon = Math.min(room.tileWidth, room.tileHeight) / 5;
        if (dist2 > eventHorizon ** 2) {
          force *= gravity / dist2;
          entity.velocity.x -= dx * force;
          entity.velocity.y -= dy * force;
          continue;
        }

        //calc stuff for teleporting and launching them
        force *= launchForce;
        let angle = Math.random() * Math.PI * 2,
          ax = Math.cos(angle),
          ay = Math.sin(angle);
        //exitport = ran.choose(portals.filter(p => p !== tile) || room.random());

        //launch that idiot from the outportal
        entity.velocity.x = 0;
        entity.velocity.y = 0;

        entity.x = ran.randomRange(6500, 8500);
        entity.y = ran.randomRange(6500, 8500);
        entity.protect();

        //also don't forget to bring her kids along the ride
        /* for (let o of entities) {
                if (o.id !== entity.id && o.master.master.id === entity.id && (o.type === "drone" || o.type === "minion" || o.type === "satellite")) {
                    o.velocity.x += entity.velocity.x;
                    o.velocity.y += entity.velocity.y;
                    o.x = entity.x;
                    o.y = entity.y;
                }
            }*/
      }
    },
  }),
  portalOpen = new Tile({
    color: 12,
    init: (tile) => portals.push(tile),
    tick: (tile) => {
      for (let entity of tile.entities) {
        if (
          entity.passive ||
          entity.settings.goThruObstacle ||
          entity.facingType[0] === "bound"
        )
          continue;
        let dx = entity.x - tile.loc.x,
          dy = entity.y - tile.loc.y,
          dist2 = dx ** 2 + dy ** 2,
          force = c.ROOM_BOUND_FORCE;

        //push away big boys
        if (entity.type === "miniboss" || entity.isMothership) {
          entity.accel.x += (minibossPush * dx * force) / dist2;
          entity.accel.y += (minibossPush * dy * force) / dist2;
          continue;
        }

        //kill anything not a tank
        if (entity.type !== "tank") {
          entity.kill();
          continue;
        }

        //that tank is not close enough, suck them in!
        let eventHorizon = Math.min(room.tileWidth, room.tileHeight) / 5;
        if (dist2 > eventHorizon ** 2) {
          force *= gravity / dist2;
          entity.velocity.x -= dx * force;
          entity.velocity.y -= dy * force;
          continue;
        }

        //calc stuff for teleporting and launching them
        force *= launchForce;
        let angle = Math.random() * Math.PI * 2,
          ax = Math.cos(angle),
          ay = Math.sin(angle);
        //exitport = ran.choose(portals.filter(p => p !== tile) || room.random());

        //launch that idiot from the outportal
        entity.velocity.x = 0;
        entity.velocity.y = 0;

        entity.x = ran.randomRange(11000, 14000);
        entity.y = ran.randomRange(1000, 14000);
        entity.protect();

        //also don't forget to bring her kids along the ride
        /* for (let o of entities) {
                if (o.id !== entity.id && o.master.master.id === entity.id && (o.type === "drone" || o.type === "minion" || o.type === "satellite")) {
                    o.velocity.x += entity.velocity.x;
                    o.velocity.y += entity.velocity.y;
                    o.x = entity.x;
                    o.y = entity.y;
                }
            }*/
      }
    },
  });

module.exports = { portal, portalAscend, portalMaze, gate };
