/** KEY COMMANDS **/

const { base } = require("../constants.js");

function selectedEntities(player, run) {
  entities.forEach((o) => {
    if (
      (o !== player.body) != null &&
      util.getDistance(o, {
        x: player.target.x + player.body.x,
        y: player.target.y + player.body.y,
      }) <
        o.size * 1.3
    ) {
      run(o);
    }
  });
}
function target(player) {
  return {
    x: player.body.x + player.target.x,
    y: player.body.y + player.target.y,
  };
}
const commands = [
  {
    name: "Help",
    description: "Shows this command list",
    keys: [
      [191, "?"],
      [112, "F1"],
    ],
    level: 1,
    run: ({ socket, level }) => {
      let lines = [
        "Help menu:",
        ...commands
          .filter((c) => level >= c.level && !c.hidden)
          .map(
            (c) =>
              `${c.name} (${c.keys.map((k) => k[1]).join(" / ")}) - ${
                c.description
              }`,
          ),
        "Warning: Avoid zooming all the way out to prevent lagging the server.",
      ];
      for (let line of lines.reverse()) {
        socket.talk("m", line);
      }
    },
  },
  {
    name: "Special Tank",
    description: "Defines you to your token's tank.",
    keys: [[50, "2"]],
    level: 1,
    hidden: true,
    run: ({ socket, player }) => {
      if (player.body.underControl)
        return socket.talk(
          "m",
          "You cannot change tank while controlling dominator.",
        );
      player.body.define({
        RESET_UPGRADES: true,
      });
      player.body.clear();
      player.body.define(socket.permissions?.class || c.SPAWN_CLASS);
      if (
        player.body.color.base == "-1" ||
        player.body.color.base == "mirror"
      ) {
        player.body.color.base = getTeamColor(
          c.GROUPS || (c.MODE == "ffa" && !c.TAG) ? TEAM_RED : player.body.team,
        );
      }
    },
  },
  {
    name: "Basic tank",
    description: "Defines back to basic tank.",
    keys: [[81, "q"]],
    level: 1,
    hidden: true,
    run: ({ socket, player }) => {
      if (player.body.underControl)
        return socket.talk(
          "m",
          "You cannot change tank while controlling dominator.",
        );
      player.body.define({
        RESET_UPGRADES: true,
        SKILL_CAP: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      });
      player.body.clear();
      player.body.define(Class.basic);
      if (
        player.body.color.base == "-1" ||
        player.body.color.base == "mirror"
      ) {
        player.body.color.base = getTeamColor(
          c.GROUPS || (c.MODE == "ffa" && !c.TAG) ? TEAM_RED : player.body.team,
        );
      }
    },
  },
  {
    name: "Clip Through Walls",
    description: "Enables/Disables collision with walls.",
    keys: [[67, "C"]],
    level: 1,
    run: ({ socket }) => {
      socket.player.body.ac = !socket.player.body.ac;
      socket.talk(
        "m",
        `Clip through walls ${socket.player.body.ac ? "enabled" : "disabled"}.`,
      );
    },
  },
  {
    name: "Zoom Out",
    description: "Zooms out.",
    keys: [[187, "-"]],
    level: 1,
    run: ({ player }) => {
      player.body.FOV *= 4 / 5;
    },
  },
  {
    name: "Zoom In",
    description: "Zooms in.",
    keys: [[189, "+"]],
    level: 1,
    run: ({ player }) => {
      player.body.FOV *= 5 / 4;
    },
  },
  {
    name: "Reset Zoom",
    description: "Resets your zoom to default.",
    keys: [[48, "0"]],
    level: 1,
    run: ({ socket }) => (socket.player.body.FOV = 1),
  },
  {
    name: "Invulnerability",
    description: "Makes you invulnerable to anything.",
    keys: [[73, "I"]],
    level: 1,
    run: ({ player }) => {
      if (!player.body.godmode) {
        if (arenaClosed)
          return player.body.sendMessage(
            "Invulnerability is disabled while arena closed.",
          );
        player.body.sendMessage("Activated Invulnerability.");
        player.body.godmode = true;
      } else if (player.body.godmode) {
        player.body.sendMessage("Deactivated Invulnerability.");
        player.body.godmode = false;
      }
      /*    socket.player.body.godmode = !socket.player.body.godmode;
      socket.talk(
        "m",
        `Invulnerability ${
          socket.player.body.godmode ? "enabled" : "disabled"
        }`,
      );
      */
      /*if (!player.body.godmode) {
        if (arenaClosed) {
          if (player.body == null) {
          } else {
            player.body.define({
              BODY: {
                HEALTH: 5,
                REGEN: 1,
                SHIELD: 6,
              },
              DRAW_HEALTH: true,
              DAMAGE_EFFECTS: true,
              IGNORED_BY_AI: false,
            });
          }
          player.body.sendMessage(
            "Invulnerability is disabled while arena closed.",
          );
        } else {
          player.body.sendMessage("Activated Invulnerability.");
          player.body.godmode = true;
        }
        let invul = setInterval(() => {
          if (player.body == null) {
            clearInterval(invul);
          } else if (arenaClosed) {
            player.body.godmode = false;
            player.body.define({
              BODY: {
                HEALTH: 5,
                REGEN: 1,
                SHIELD: 6,
              },
              DRAW_HEALTH: true,
              DAMAGE_EFFECTS: true,
              IGNORED_BY_AI: false,
            });
          } else {
            if (player.body.godmode) {
              player.body.define({
                BODY: {
                  HEALTH: 10000000000000000000,
                  REGEN: 10000000000000000000,
                  SHIELD: 10000000000000000000,
                },
                DRAW_HEALTH: false,
                DAMAGE_EFFECTS: false,
                IGNORED_BY_AI: true,
              });
            } else if (!player.body.godmode) {
              player.body.define({
                BODY: {
                  HEALTH: 7,
                  REGEN: 1,
                  SHIELD: 6,
                },
                DRAW_HEALTH: true,
                DAMAGE_EFFECTS: true,
                IGNORED_BY_AI: false,
              });
            }
          }
        }, 80);
      } else if (player.body.godmode) {
        player.body.godmode = false;
        player.body.sendMessage("Deactivated Invulnerability.");
      }
      */
    },
  },
  {
    name: "Drag",
    description: "Drags the selected entity.",
    keys: [[68, "D"]],
    level: 2,
    run: ({ socket, player }) => {
      if (!player.pickedUpInterval) {
        let tx = player.body.x + player.target.x;
        let ty = player.body.y + player.target.y;
        let pickedUp = [];
        entities.forEach((e) => {
          if (
            !(e.type === "mazeWall" && e.shape === 4) &&
            (e.x - tx) * (e.x - tx) + (e.y - ty) * (e.y - ty) <
              e.size * e.size * 1.5
          ) {
            pickedUp.push({ e, dx: e.x - tx, dy: e.y - ty });
          }
        });
        if (pickedUp.length === 0) {
          player.body.sendMessage("No entities found to pick up!");
        } else {
          player.pickedUpInterval = setInterval(() => {
            if (!player.body) {
              clearInterval(player.pickedUpInterval);
              player.pickedUpInterval = null;
              return;
            }
            let tx = player.body.x + player.target.x;
            let ty = player.body.y + player.target.y;
            for (let { e: entity, dx, dy } of pickedUp)
              if (!entity.isGhost) {
                if (entity.isPortal) {
                  clearInterval(player.pickedUpInterval);
                  player.pickedUpInterval = null;
                  socket.talk("m", "You can't pick up portals!");
                  return;
                }
                entity.x = dx + tx;
                entity.y = dy + ty;
              }
          }, 25);
        }
      } else {
        clearInterval(player.pickedUpInterval);
        player.pickedUpInterval = null;
      }
    },
  },
  {
    name: "Kill",
    description: "Kills the selected entities.",
    keys: [[75, "K"]],
    level: 2,
    run: ({ socket, player }) => {
      let killed = 0;
      selectedEntities(player, (o) => {
        o.kill();
        o.destroy();
        killed++;
      });
      if (killed) {
        socket.talk(
          "m",
          `You have killed ${killed} entit${killed === 1 ? "y" : "ies"}.`,
        );
      } else {
        socket.talk("m", "You haven't killed any entity!");
      }
    },
  },
  {
    name: "Change team",
    description: "Changes team at the selected entity.",
    keys: [[84, "T"]],
    level: 2,
    run: ({ player, socket }) => {
      selectedEntities(player, (o) => {
        player.body.team = o.team;
        if (o.team === -1) player.body.color.base = 10;
        if (o.team === -2) player.body.color.base = 11;
        if (o.team === -3) player.body.color.base = 12;
        if (o.team === -4) player.body.color.base = 13;
        if (!o.isTurret) socket.talk("m", "Changed team to " + o.team + ".");
        socket.talk("resetMinimap");
      });
    },
  },
  {
    name: "Invite team",
    description: "Invites the entity to your team.",
    keys: [[74, "J"]],
    level: 2,
    run: ({ player, socket }) => {
      selectedEntities(player, (o) => {
        o.team = player.body.team;
        if (player.body.team === -1) o.color.base = 10;
        if (player.body.team === -2) o.color.base = 11;
        if (player.body.team === -3) o.color.base = 12;
        if (player.body.team === -4) o.color.base = 13;
        if (!o.isTurret)
          socket.talk("m", "Changed the entity to " + player.body.team + ".");
        socket.talk("resetMinimap");
      });
    },
  },
  {
    name: "Heal",
    description: "Heals the selected entities.",
    keys: [[72, "H"]],
    level: 2,
    run: ({ socket, player }) => {
      selectedEntities(player, (o) => {
        o.health.amount = o.health.max;
        o.shield.amount = o.shield.max;
      });
    },
  },
  {
    name: "(Temp)-Ban",
    description: "Bans the selected entity.",
    level: 5,
    keys: [[79, "O"]],
    run: ({ socket, player }) => {
      let banned = [];
      let cannotBeBanned = false;
      selectedEntities(player, (o) => {
        if (o.isPlayer) {
          if (o.socket.permissions && o.socket.permissions.infiniteLevelUp) {
            cannotBeBanned = true;
          } else {
            o.socket.ban("Player temp-banned.");
            banned.push(`${o.name}'s ${o.label}`);
          }
        }
      });
      if (banned.length) {
        if (cannotBeBanned)
          socket.talk(
            "m",
            `You have banned ${banned.join(
              ", ",
            )}, but you couldn't ban some players.`,
          );
        else socket.talk("m", `You have banned ${banned.join(", ")}.`);
      } else {
        if (cannotBeBanned) socket.talk("m", "You cannot ban this player!");
        else socket.talk("m", "Player not found.");
      }
    },
  },
  {
    name: "Vanish",
    description: "Makes you invisible.",
    keys: [[86, "V"]],
    level: 2,
    run: ({ socket, player }) => {
      player.body.alpha = !player.body.alpha;
      player.body.invisible = [player.body.alpha, !player.body.alpha];
    },
  },
  {
    name: "Teleport",
    description: "Teleports you to your cursor",
    keys: [[69, "E"]],
    level: 2,
    run: ({ player }) => {
      player.body.x += player.target.x;
      player.body.y += player.target.y;
    },
  },
  {
    name: "Spectator",
    hidden: true,
    description: "",
    keys: [[49, "1"]],
    level: 2,
    run: ({ player }) => {
      player.body.define({
        RESET_UPGRADES: true,
      });
      player.body.clear();
      player.body.define(Class.spectator);
      if (
        player.body.color.base == "-1" ||
        player.body.color.base == "mirror"
      ) {
        player.body.color.base = getTeamColor(
          c.GROUPS || (c.MODE == "ffa" && !c.TAG) ? TEAM_RED : player.body.team,
        );
      }
    },
  },
  {
    name: "Stronger",
    description: "Maxes your stats.",
    keys: [[83, "S"]],
    level: 1,
    run: ({ socket, player }) => {
      let skills = [...Array(10).fill(14), 0];
      player.body.skill.setCaps(skills);
      player.body.skill.set(skills);
      socket.talk("m", "Maxed all stats.");
    },
  },
  {
    name: "Bigger",
    description: "Makes you bigger.",
    keys: [[190, "."]],
    level: 2,
    run: ({ socket, player }) => {
      if (socket.permissions && socket.permissions.infiniteLevelUp) {
        player.body.SIZE *= 5 / 4;
        return;
      } else {
        if (player.body.SIZE <= 100) {
          player.body.SIZE *= 5 / 4;
        }
      }
    },
  },
  {
    name: "Smaller",
    description: "Makes you Smaller.",
    keys: [[188, ","]],
    level: 2,
    run: ({ player }) => {
      if (player.body.SIZE > 4) {
        player.body.SIZE *= 4 / 5;
      }
    },
  },
  {
    name: "Infinite Lvl up",
    description: "Levels up infinitely.",
    keys: [[78, "N"]],
    level: 2,
    run: ({ socket, player }) => {
      if (
        player.body.skill.level < c.LEVEL_CHEAT_CAP ||
        (socket.permissions && socket.permissions.FullOPperms)
      ) {
        player.body.skill.score += player.body.skill.levelScore;
        player.body.skill.maintain();
        player.body.refreshBodyAttributes();
      }
    },
  },
  {
    name: "Change body",
    description: "Change body.",
    keys: [[52, "4"]],
    level: 2,
    run: ({ socket, player }) => {
      if (socket.permissions) {
        selectedEntities(player, (e) => {
          e.define({
            RESET_UPGRADES: true,
          });
          e.clear();
          e.define(
            player.body.defs.map(
              (d) => Object.keys(Class).find((k) => Class[k] === d) || d,
            ),
          );
          if (e.color.base == "-1" || e.color.base == "mirror") {
            e.color.base = getTeamColor(
              c.GROUPS || (c.MODE == "ffa" && !c.TAG) ? TEAM_RED : e.team,
            );
          }
        });
        socket.talk("m", "Changed body.");
      }
    },
  },
  {
    name: "Whirlpool",
    description: "Picks the nearest entity at you're cursor.",
    keys: [[87, "W"]],
    level: 2,
    run: ({ player }) => {
      let e = player.body.store.selectedWhirlpool;
      let t = target(player);
      if (!e) e = player.body.store.selectedWhirlpool = nearest(entities, t);
      e.x = t.x;
      e.y = t.y;
      delete player.body.store.selectedWhirlpool;
    },
  },
  {
    name: "Multibox",
    description: "The only way to legally multibox.",
    keys: [[70, "F"]],
    level: 3,
    run: ({ socket, player, level }) => {
      if (
        player?.body?.multiboxChildren?.length >=
        [0, 0, 10, 10, 20, Infinity][level]
      )
        return socket.talk("m", 4_000, "Too many clones!");
      let o = new Entity({
        x: player.body.x + player.target.x,
        y: player.body.y + player.target.y,
      });
      if (player.body.allDefs) {
        for (let def of player.body.allDefs) o.define(def);
      } else o.define(c.SPAWN_CLASS);
      o.name = player.body.name;
      o.nameColor = player.body.nameColor;
      o.color = player.body.color;
      o.team = player.body.team;
      o.isPlayer = true;
      o.skill.score = player.body.skill.score;
      o.skill.maintain();
      o.skill.setCaps(player.body.skill.caps);
      o.skill.set(player.body.skill.raw);
      o.socket = socket;
      o.controllers = [
        new ioTypes.listenToPlayer(o, { player, static: false }),
      ];

      function addEventListeners(p) {
        const bodyEvents = {
          define: (set) => {
            for (let o of p.body?.multiboxChildren || []) {
              o.upgrades = [];
              o.define(set);
            }
          },
          skillUp: (stat) => {
            for (let o of p.body?.multiboxChildren || []) o.skillUp(stat);
          },
          dead: () => {
            if (p.body?.multiboxChildren?.length) {
              for (let eventName of Object.keys(bodyEvents)) {
                p.body.off(eventName, bodyEvents[eventName]);
              }
              for (let eventName of Object.keys(globalEvents)) {
                events.off(eventName, globalEvents[eventName]);
              }
              let multiboxChildren = [...p.body.multiboxChildren];
              let theChosenOne = multiboxChildren.shift();
              let body = p.body;
              theChosenOne.controllers = [];
              p.body = theChosenOne;
              body.destroy();
              p.body.become(p);
              p.body.refreshBodyAttributes();
              p.body.multiboxChildren = multiboxChildren;
              p.gui = newgui(p);
              addEventListeners(player);
            } else {
              for (let o of p.body?.multiboxChildren || []) o.destroy();
            }
          },
        };
        const globalEvents = {
          levelUp: ({ socket, score }) => {
            if (socket?.player?.body?.id === p.body?.id) {
              for (let o of p.body?.multiboxChildren || []) {
                o.skill.score = score;
                o.skill.maintain();
                o.refreshBodyAttributes();
              }
            }
          },
          chatMessage: ({ socket, message }) => {
            if (message.startsWith("/")) return;
            if (socket?.player?.body?.id === p.body?.id) {
              for (let o of p.body?.multiboxChildren || []) o.say(message);
            }
          },
        };

        for (let eventName of Object.keys(bodyEvents)) {
          p.body.on(eventName, bodyEvents[eventName]);
        }
        for (let eventName of Object.keys(globalEvents)) {
          events.on(eventName, globalEvents[eventName]);
        }
      }

      if (player.body.multiboxChildren) {
        player.body.multiboxChildren.push(o);
      } else {
        player.body.multiboxChildren = [o];
        addEventListeners(player);
      }

      o.on("dead", () => {
        if (player?.body?.multiboxChildren)
          player.body.multiboxChildren.remove(
            player.body.multiboxChildren.indexOf(o),
          );
      });
    },
  },
  {
    name: "Blast",
    description: "Blasts nearest entities at you're cursor.",
    keys: [[66, "B"]],
    level: 2,
    run: ({ player }) => {
      /* const range = 130 ** 2,
          force = 0.2;
    for (let entity of entities) {
        let d = {
            x: player.body.x + player.target.x - entity.x,
            y: player.body.y + player.target.y - entity.y
        },
            dist = d.x ** 2 + d.y ** 2;
        if (dist < range) {
          if (entity.type !== "wall" || entity.type !== "isDominator" || entity.type !== "isArenaCloser" || entity.type !== "isSanctuary") {
            entity.velocity.x -= d.x * force;
            entity.velocity.y -= d.y * force;
          }
        }
    }
    */
      for (let entity of entities) {
        let diffX = player.body.x + player.target.x - entity.x,
          diffY = player.body.y + player.target.y - entity.y;
        (dist2 = diffX ** 2 + diffY ** 2),
          (number1 = 6),
          (number2 = 6),
          (number3 = 1 / 17), //1/7,
          (number4 = 2),
          (forceMulti = (((3 * 100) ** 2) ** number1 * number2) / dist2);
        if (dist2 <= ((player.body.size / 12) * 100) ** 2) {
          if (entity.type !== "wall") {
            entity.velocity.x -=
              util.clamp(player.body.x + player.target.x - entity.x, -90, 90) *
              entity.damp *
              (1 - 1 / (forceMulti ** number3 * number4) + 0.1); //0.05
            entity.velocity.y -=
              util.clamp(player.body.y + player.target.y - entity.y, -90, 90) *
              entity.damp *
              (1 - 1 / (forceMulti ** number3 * number4) + 0.1); //0.05
          }
        }
      }
    },
  },
];

global.runKeyCommand = (socket, keyCode) => {
  if (!socket?.player?.body) return 1;

  let permsLevel = socket.permissions?.level;
  if (!permsLevel) permsLevel = 0;
  if (!keyCode) keyCode = "default";

  let command = commands.find((c) => c.keys.map((k) => k[0]).includes(keyCode));
  if (command && permsLevel >= command.level) {
    try {
      command.run({ socket, player: socket.player, level: permsLevel });
      socket.player.body.refreshBodyAttributes();
    } catch (e) {
      console.error(`${command.name.toLowerCase()} key command error`, e);
    }
  }
};

module.exports = () => {};
