/** INGAME COMMANDS (WIP) **/

/** CONSTANTS **/
const prefix = "$";
const separator = " ";

const _message = {
  unknown: "Unknown command.",
  denied: "You cannot run this command!",
  error:
    "There was an error while running the command.\nPlease report this to the developers.",
  error2: "Failed to run the command.",
};
function sendPlayer(socket, server) {
    console.log("Developer is trying to travel through a command...")
    let id = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
    console.log("Sending developer to server", server);
    console.log("ID:", id);
    fetch(`${server}/api/sendPlayer`, {
        method: "POST",
        body: JSON.stringify({
            key: process.env.API_KEY,
            id: id,
            name: socket.player.body.name,
            definition: socket.player.body.allDefs.map(def => def.map(d => Object.keys(Class).find(k => Class[k] === d) || d)),
            score: socket.player.body.skill.score,
            skillcap: socket.player.body.skill.caps,
            skill: socket.player.body.skill.raw,
            points: socket.player.body.skill.points,
            becomeDednut: !socket.player.body.isDreadnought ? true : false,
            checkDednut: socket.player.body.isDreadnought ? true : false,
        }),
    }).then(async (r) => {
        if (r.status === 200) {
            console.log("Sucessfully contacted the other server.");
            socket.talk("t", server.replace("http://", "").replace("https://", ""), id);
            socket.player.body.destroy();
        } else {
            socket.talk("m", "Failed to contact the other server.")
            console.log("Failed to contact the other server.", r.statusText, await r.text());
        }
    }).catch(console.log);
}
/** COMMANDS **/
let commands = [
  {
    name: ["help"],
    description: "Shows this command list.",
    level: 1,
    run: ({ socket, level }) => {
      let lines = [
        "Command help menu:",
        ...commands
          .filter((c) => level >= c.level && !c.hidden)
          .map((c) => `$${c.name} - ${c.description}`),
      ];
      for (let line of lines.reverse()) {
        socket.talk("m", line);
      }
    },
  },
  {
    name: ["restart"],
    description: "Closes the arena and resets the server.",
    level: 2,
    run: ({ socket }) => {
      sockets.broadcast(
        `An restart has been requested by: ${socket.player.body.name}.`,
      );
      closeArena();
    },
  },
  {
    name: ["disablebots"],
    level: 2,
    description: "Disables bots.",
    run: ({ socket }) => {
      c.BOTS = 0;
      sockets.broadcast("BOTS: OFF");
      for (let i = 0; i < entities.length; i++) {
        if (entities[i].isBot) {
          entities[i].kill();
        }
      }
    },
  },
  {
    name: ["enablebots"],
    description: "Enables bots.",
    level: 2,
    run: ({ socket }) => {
      c.BOTS = 10;
      sockets.broadcast("BOTS: ON");
    },
  },
  {
    name: ["color"],
    level: 2,
    description: "Changes your body color.",
    run: ({ socket, args }) => {
      if (args.length == 0) {
        return socket.talk(
          "m",
          `Current color: ${socket.player.body.color.base}`,
        );
      }
      if (args.length < 0 || args.length > 44) return fail();
      if (args.length == 1) {
        const color = Number(args[0]);
        if (Number.isNaN(color) || color < 0 || color > 41) {
          return socket.talk("m", "Max color is 41.");
        } else {
          socket.player.body.color.base = color;
        }
      }
    },
  },
  {
    name: ["dim"],
    level: 2,
    description: "Sends you to a different dimension.",
    run: ({ socket, player, args }) => {
        if (args[0] && args[0].toLowerCase() === "help") {
            socket.talk("m", "`forge` = Sends you to forge.")
            socket.talk("m", "`laby` = Sends you to labyrinth.");
            socket.talk("m", "`normal` = Sends you to the public server.");
             socket.talk("m", "Dimension help menu:")
        } else if (args[0] && args[0].toLowerCase() === "forge") { // forge
           socket.talk("m", "Sending you to forge...");
           sendPlayer(socket, "https://h5s8j2-53051.csb.app");
        } else if (args[0] && args[0].toLowerCase() === "laby") { // labyrinth
            socket.talk("m", "Sending you to labyrinth...");
            sendPlayer(socket, "https://h5s8j2-36381.csb.app");
         } else if (args[0] && args[0].toLowerCase() === "normal") { // normal (public)
            socket.talk("m", "Sending you to the public server...");
            sendPlayer(socket, "https://h5s8j2-26301.csb.app");
         } else {
            socket.talk("m", "Invalid ID provided!")
         }
    }
  },
  {
    name: ["team"],
    level: 2,
    description: "Changes your team.",
    run: ({ socket, args }) => {
      // /team [TEAM]
      if (args.length == 0) {
        return socket.talk(
          "m",
          5_000,
          `Current team: ${socket.player.body.team}`,
        );
      }
      if (args.length != 1) return talk(socket, _message.error2);
      socket.player.body.team = Number(args[0]);
      socket.talk("m", `Changed team to: ${socket.player.body.team}.`);
      socket.talk("resetMinimap");
    },
  },
  {
    name: ["broadcast"],
    level: 2,
    description: "Broadcasts to everyone.",
    run: ({ socket, args }) => {
      if (args.length == 0) return socket.talk("m", "No message provided.");
      sockets.broadcast(args.join(" "));
    },
  },
];

/** COMMANDS RUN FUNCTION **/
function runCommand(socket, message) {
  if (!message.startsWith(prefix) || !socket?.player?.body) return;

  let args = message.slice(prefix.length).split(separator);
  let commandName = args.shift();

  let command = commands.find((command) => command.name.includes(commandName));
  if (command) {
    let permissionsLevel = socket.permissions?.level ?? 0;
    let level = command.level;

    if (permissionsLevel >= level) {
      try {
        command.run({ socket, message, args, level: permissionsLevel });
      } catch (e) {
        talk(socket, _message.error);
        console.error("Error while running ", commandName);
        console.error(e);
      }
    } else talk(socket, _message.denied);
  } else talk(socket, _message.unknown);

  return true;
}

/** UTIL FUNCTIONS **/
function talk(socket, message) {
  for (let line of message.split("\n").reverse()) {
    socket.talk("m", line);
  }
}

/** CHAT MESSAGE EVENT **/
module.exports = ({ Events }) => {
  Events.on("chatMessage", ({ socket, message, preventDefault }) => {
    if (runCommand(socket, message)) preventDefault();
  });
};
