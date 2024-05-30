let pickFromChanceSet = (set) => {
  while (Array.isArray(set)) {
    set = set[ran.chooseChance(...set.map((e) => e[0]))][1];
  }
  return set;
},
maxDreadFoodSpawn = 0,
launchForce = 1250,
gravity = 13500,
minibossPush = 30000,
// spawnAscendPortal = (loc) => {
//   let o = new Entity(loc);
//   o.define("portal");
//   o.team = TEAM_ROOM;
//   o.colorUnboxed.base = getTeamColor(TEAM_CYAN);
//   o.compressColor();
// },
// spawnRealPortal = (loc) => {
//   let o = new Entity(loc);
//   o.define("ascendPortal");
//   o.team = TEAM_ROOM;
//   o.colorUnboxed.base = getTeamColor(TEAM_BROWN);
//   o.compressColor();
// },
// ascendPortal = new Tile({
//   color: "white",
//   init: (tile) => spawnRealPortal(tile.loc),
// }),
spawnNatural = (tile, layeredSet, kind) => {
  let o = new Entity(tile.randomInside());
  o.define(pickFromChanceSet(pickFromChanceSet(layeredSet)));
  o.facing = ran.randomAngle();
  o.team = TEAM_ENEMIES;
  o.on("dead", () => tile.data[kind + "Count"]--);
  tile.data[kind + "Count"]++;
  return o;
},
normal = new Tile({
  color: "white",
  data: {
    allowMazeWallSpawn: true,
    foodSpawnCooldown: 0,
    foodCount: 0,
  },
  init: (tile) => room.spawnableDefault.push(tile),
  tick: (tile) => {
    if (++tile.data.foodSpawnCooldown > c.MAZE_FOOD_SPAWN_COOLDOWN) {
      tile.data.foodSpawnCooldown = 0;
      if (
        tile.data.foodCount < c.FOOD_CAP &&
        Math.random() < c.FOOD_SPAWN_CHANCE
      ) {
     //   spawnNatural(tile, c.FOOD_TYPES, "food");
      }
    }
  },
}),
normalNoFood = new Tile({
  color: "white",
  data: {
    allowMazeWallSpawn: false,
    foodSpawnCooldown: 0,
    foodCount: 0,
  },
  init: (tile) => room.spawnableDefault.push(tile),
}),
labyNoWalls = new Tile({
  color: "white",
  data: {
    allowMazeWallSpawn: false,
    foodSpawnCooldown: 0,
    foodCount: 0,
  },
  init: (tile) => room.spawnableDefault.push(tile),
  tick: (tile) => {
    if (++tile.data.foodSpawnCooldown > c.FOOD_SPAWN_COOLDOWN) {
      tile.data.foodSpawnCooldown = 0;
      if (
        tile.data.foodCount < c.FOOD_CAP &&
        Math.random() < c.FOOD_SPAWN_CHANCE
      ) {
       // spawnNatural(tile, c.LABY_FOOD_TYPES_RARE, "food");
      }
    }
  },
}),
normalNoWalls = new Tile({
  color: "white",
  data: {
    allowMazeWallSpawn: false,
    foodSpawnCooldown: 0,
    foodCount: 0,
  },
  init: (tile) => room.spawnableDefault.push(tile),
  tick: (tile) => {
    if (++tile.data.foodSpawnCooldown > c.FOOD_SPAWN_COOLDOWN) {
      tile.data.foodSpawnCooldown = 0;
      if (
        tile.data.foodCount < c.FOOD_CAP &&
        Math.random() < c.FOOD_SPAWN_CHANCE
      ) {
        spawnNatural(tile, c.FOOD_TYPES, "food");
      }
    }
  },
}),
nestTick = (tile) => {
  if (++tile.data.enemySpawnCooldown > c.ENEMY_SPAWN_COOLDOWN_NEST) {
    tile.data.enemySpawnCooldown = 0;
    if (
      tile.data.enemyCount < c.ENEMY_CAP_NEST &&
      Math.random() < c.ENEMY_SPAWN_CHANCE_NEST
    ) {
    //  if (!c.USE_OLDDREADNOUGHT_AS_NEST_FOOD)
     //   spawnNatural(tile, c.ENEMY_TYPES_NEST, "enemy");
    }
  }

  if (++tile.data.foodSpawnCooldown > c.FOOD_SPAWN_COOLDOWN_NEST) {
    tile.data.foodSpawnCooldown = 0;
    if (
      tile.data.foodCount < c.FOOD_CAP_NEST &&
      Math.random() < c.FOOD_SPAWN_CHANCE_NEST
    ) {
     // if (!c.USE_OLDDREADNOUGHT_AS_NEST_FOOD)
      //  spawnNatural(tile, c.FOOD_TYPES_NEST, "food");
    }
  }
},
nest = new Tile({
  color: "purple",
  data: {
    allowMazeWallSpawn: true,
    foodSpawnCooldown: 0,
    foodCount: 0,
    enemySpawnCooldown: 0,
    enemyCount: 0,
  },
  init: (tile) => {
    if (!room.spawnable[TEAM_ENEMIES]) room.spawnable[TEAM_ENEMIES] = [];
    room.spawnable[TEAM_ENEMIES].push(tile);
    room.spawnableOldDreadFood.push(tile);
  },
  tick: nestTick,
}),
nestNoBoss = new Tile({
  color: "purple",
  data: {
    allowMazeWallSpawn: true,
    foodSpawnCooldown: 0,
    foodCount: 0,
    enemySpawnCooldown: 0,
    enemyCount: 0,
  },
  tick: nestTick,
}),
wall = new Tile({
  color: "white",
  data: {
    allowMazeWallSpawn: false,
    foodSpawnCooldown: 0,
    foodCount: 0,
  },
  init: (tile) => {
    let o = new Entity(tile.loc);
    o.define("wall");
    o.team = TEAM_ROOM;
    o.SIZE = room.tileWidth / 2;
    o.protect();
    o.life();
  },
}),
cosmicRoom = new Tile({
  color: "gold",
  init: (tile) => {
    room.cosmicRoom.push(tile);
  },
}),
normalLaby = new Tile({
  color: "white",
  init: (tile) => {
      room.labyNormal.push(tile);
  }
}),
cosmicRoomCenter = new Tile({
  color: "gold",
  init: (tile) => {
    room.cosmicRoomCenter.push(tile);
  },
})
voidLeft = new Tile({
  color: "black",
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

      //push away 
      entity.accel.x += (1300 * dx * force) / dist2;
      entity.accel.y += (1300 * dy * force) / dist2;
    }
  }
}),
voidRight = new Tile({
  color: "black",
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

      //push away 
      entity.accel.x += (1300 * dx * force) / dist2;
      entity.accel.y += (1300 * dy * force) / dist2;
    }
  }
}),
voidMiddle = new Tile({
  color: "black",
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

      //push away 
      entity.accel.x += (1300 * dx * force) / dist2;
      entity.accel.y += (1300 * dy * force) / dist2;
    }
  }
})
module.exports = {
normal,
nest,
wall,
cosmicRoom,
cosmicRoomCenter,
nestNoBoss,
normalNoWalls,
labyNoWalls,
normalNoFood,
voidLeft,
voidRight,
voidMiddle,
normalLaby,
};
