const Eris = require("eris");
// ----------------------- (toedit) -----------------------------
const prefix = "$"; // prefix of the bot commands
const themeColor = 0x8abc3f; // put here the theme color of the bot (format: 0xABCDEF)
const logsChannel = "1229807698573398077"; // the channel ID of the dev logs
const chatChannel = "1229807311971680327"; // the channel ID of your ingame chat
const devRole = "1229811731094831231"; // the ID of the developer role
const ownerRole = "1145437727760842916"; // the ID of the server owner role
const memberRole = "1229809596013477920"; // the ID of the basic member role
const gameImage = "https://arras.io/favicon/128x128.png"; // put the url of your game's logo
const { closeArena } = require("../../gamemodes/closeArena");

const envKeys = [
  //this is to protect .env from eval, put your .env names here. DO NOT MAKE ANY TYPOS AS IT CAN FALSELY FLAG A COMMAND IF SO.
  "TOKEN_BOT",
  "TOKEN_DEVELOPER",
  "TOKEN_POL",
];
// --------------------------------------------------------------

global.bot = new Eris("MTIyOTgwMDcyMTM1Njk1MTYxMg.GF9oln.8kBV3nQZu9q09fow0ozKlL3t61NObSleSPSdPo"); // add the token of your application in .env and call it: BOT_TOKEN=yourbottokenhere
bot.on("ready", async () => {
  bot.createMessage(logsChannel, {
    embed: {
      title: "",
      description: "",
      color: 5763719,
      fields: [
        {
          name: `Server initialized`,
          value: `Bot is ready for use`,
        },
      ],
      thumbnail: {},
      footer: {},
    },
  });

  try {
    // interaction commands ( i made one so i keep the active dev badge )
    await bot.createCommand({
      name: "ping",
      type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
      description: "Pings the bot.",
    });
    console.log("Bot Ready!");
  } catch (err) {
    console.error(err);
  }
});
function updateStatus() {
  bot.editStatus("online", {
    name: `with ${sockets.clients.length} players!`,
    type: 0,
  });
}
bot.on("interactionCreate", (interaction) => {
  // ping command
  if (interaction instanceof Eris.CommandInteraction) {
    if (interaction.data.name == "ping") {
      return interaction.createMessage({
        embed: {
          title: "Ping Command",
          description: "",
          color: themeColor,
          fields: [
            {
              name: ``,
              value: `Pong!`,
            },
          ],
          thumbnail: {
            url: gameImage,
          },
        },
      });
    }
  }
});

// error handler
process.on("uncaughtException", function (err) {
  console.error(err);
  updateStatus();
  bot.connect();
});

bot.on("messageCreate", (msg) => {
  // prefixed commands
  if (msg.member != null && msg.member.roles.includes(memberRole)) {
    if (msg.content === `${prefix}ping`) {
      bot.createMessage(msg.channel.id, "Pong!");
    } else if (msg.content.includes(bot.user.id)) {
      let phrases = [
        "I've been pinged again.",
        "Why the frequent pings?",
        "Another ping. Seriously, why are you bothering me?",
        "Received your ping. What's the deal? Can we end this constant interruption?",
        "What's with the repeated pings? This is getting annoying.",
        "You just pinged me. Why? This has to stop. No more pings.",
        "Yet another ping. What's the reason? Consider this a request to stop.",
        "Why am I being pinged again? Enough is enough. Please refrain from further pings.",
        "Once again, a ping. What's going on? Stop it.",
        "Another ping from you. What's the purpose? Let's put an end to this, okay?",
        "Ping me again and see what happens. Go ahead.",
        "Can you stop with the pings?",
        "Seriously ? Don't you have other things to do?",
        "Don't you have other things to do?",
        "You think this is funny to constantly ping me, huh?",
        "Okay I will make it clear:\nStop\nPinging\nME!\nOkay? Thanks",
        "Look, I do a barrel roll !\n`._.   :|    .-.    |:    ._.`\n\nCool right? Now STOP PINGING ME!",
      ];
      bot.createMessage(msg.channel.id, {
        content: phrases[Math.floor(Math.random() * phrases.length)],
        messageReference: { messageID: msg.id },
      });
    }
    // purge
    else if (msg.content === `${prefix}purge`) {
      if (msg.member.roles.includes(devRole)) {
        for (let e of entities)
          if (e.type !== "wall" && !e.godmode)
            (e.invuln = false), (e.protection = false), e.kill();
        setTimeout(() => {
          bot.createMessage(logsChannel, {
            embed: {
              title: "",
              description: "",
              color: 16776960,
              fields: [
                {
                  name: `Warning`,
                  value: `All entities have been killed.`,
                },
              ],
            },
          });
          bot.createMessage(msg.channel.id, {
            embed: {
              title: "Purge command",
              description: "",
              color: themeColor,
              fields: [
                {
                  name: `Warning`,
                  value: `All entities have been killed!`,
                },
              ],
              thumbnail: {
                url: gameImage,
              },
              footer: {
                text:
                  `Requested by ` +
                  msg.member.username +
                  " (" +
                  msg.member.id +
                  ")",
              },
            },
          });
        }, 60);
      } else {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Purge Command",
            description: "",
            color: 16711680,
            fields: [
              {
                name: `Warning`,
                value: `You are not permitted to perform this action.`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {},
          },
        });
      }
    }

    // clear
    else if (msg.content === `${prefix}clear`) {
      if (msg.member.roles.includes(devRole)) {
      for (let e of entities)
        if (
          e.type !== "wall" &&
          e.type !== "tank" &&
          !e.isPlayer &&
          !e.godmode
        ) {
          e.invuln = false;
          e.protection = false;
          e.kill();
        }
      setTimeout(() => {
        bot.createMessage(logsChannel, {
          embed: {
            title: "",
            description: "",
            color: 16776960,
            fields: [
              {
                name: `Warning`,
                value: `Some of the entities have been killed.`,
              },
            ],
          },
        });
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Clear command",
            description: "",
            color: themeColor,
            fields: [
              {
                name: `Warning`,
                value: `Some of the entities have been killed!`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {
              text:
                `Requested by ` +
                msg.member.username +
                " (" +
                msg.member.id +
                ")",
            },
          },
        });
      }, 60);
    } else {
      bot.createMessage(msg.channel.id, {
        embed: {
          title: "Clear command",
          description: "",
          color: 16711680,
          fields: [
            {
              name: `Warning`,
              value: `You are not permitted to perform this action.`,
            },
          ],
          thumbnail: {
            url: gameImage,
          },
          footer: {},
        },
      });
    }
    }

    // help command
    else if (msg.content === `${prefix}help`) {
      bot.createMessage(msg.channel.id, {
        embed: {
          title: "Availble Commands",
          description: "Here is a list of commands I Have:",
          color: themeColor,
          fields: [
            {
              name: `${prefix}ping`,
              value: `Pings the bot`,
            },
            {
              name: `${prefix}pl`,
              value: "Shows the list of connected players.",
            },
            {
              name: `${prefix}ahelp`,
              value: `Shows advanced help.`,
            },
          ],
          thumbnail: {
            url: gameImage,
          },
          footer: {
            text:
              `Requested by ` +
              msg.member.username +
              " (" +
              msg.member.id +
              ")",
          },
        },
      });
    }     else if (
      msg.content === `${prefix}ahelp`
    ) {
     if (msg.member.roles.includes(devRole)) {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Advanced Commands",
            description: "Heres what i can do:",
            color: themeColor,
            fields: [
              {
              name: `${prefix}clear`,
              value: `Kills most of entities to reduce lag.`,
              }, 
              {
                name: `${prefix}apl`,
                value: `Shows Connected players with IPS tokens etc.`,
              }, 
              {
                name: `${prefix}purge`,
                value: `Kills all entities.`,
              }, 
              {
                name: `${prefix}restart`,
                value: `Restarts the server.`,
              }, 
              {
                name: `${prefix}abr`,
                value: `Send anonymous ingame messages.`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {},
          },
        }
        );   
      } else {
       bot.createMessage(msg.channel.id, "You cannot use this command, You do not have permission.");
      }
    }

    // broadcast
    if (msg.content.startsWith(`${prefix}br `)) {
      if (msg.member.roles.includes(devRole)) {
        var message = msg.content.split(prefix + "br ").pop();
        if (
          !msg.member.roles.includes(devRole) &&
          c.SANITIZE_CHAT_MESSAGE_COLORS
        ) {
          message = message.replace(/§/g, "§§§§");
        }
        if (message.length > 100)
          return bot.createMessage(msg.channel.id, {
            embed: {
              title: "Broadcast command",
              description: "",
              color: 16776960,
              fields: [
                {
                  name: `Warning`,
                  value: `Overly-long message !`,
                },
              ],
              thumbnail: {
                url: gameImage,
              },
              footer: {},
            },
          });

        sockets.broadcast(`${msg.author.username} says on Discord: ${message}`);
        msg.addReaction("✅");
      }
    }

    // anonymous broadcast
    if (msg.content.startsWith(`${prefix}abr `)) {
      if (msg.member.roles.includes(devRole)) {
        var message = msg.content.split(prefix + "abr ").pop();
        sockets.broadcast(`${message}`);
        msg.addReaction("✅");
      } else {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Anonymous Broadcast command",
            description: "",
            color: 16711680,
            fields: [
              {
                name: `Warning`,
                value: `You are not permitted to perform this action.`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {},
          },
        });
      }
    }

    // restart
    else if (msg.content === `${prefix}restart`) {
      if (msg.member.roles.includes(devRole)) {
        closeArena();
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Restart command",
            description: "",
            color: themeColor,
            fields: [
              {
                name: `Warning`,
                value: `Server restart initialization !`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {
              text:
                `Requested by ` +
                msg.member.username +
                " (" +
                msg.member.id +
                ")",
            },
          },
        });
      } else {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Restart command",
            description: "",
            color: 16711680,
            fields: [
              {
                name: `Warning`,
                value: `You are not permitted to perform this action.`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {},
          },
        });
      }
    }
    // player list
    else if (msg.content === `${prefix}pl`) {
      if (
        msg.channel.id === chatChannel ||
        msg.member.roles.includes(devRole)
      ) {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Player List",
            description:
              sockets.clients.length +
              " players connected\n\n" +
              sockets.clients
                .map((c) => {
                  let Name =
                    c.player.body == null
                      ? "Dead Player"
                      : c.player.body.name === ""
                        ? "An unnamed player"
                        : c.player.body.name;
                  let playerID =
                    c.player.body == null ? "dead" : c.player.body.id;
                  return `**${Name}** - [${playerID}]`;
                })
                .join("\n\n"),
            color: themeColor,
            thumbnail: {
              url: gameImage,
            },
          },
        });
      }
    } else if (msg.content === `${prefix}apl`) {
      if (
        msg.member.roles.includes(devRole) &&
        msg.member.roles.includes(ownerRole) // this commands returns player ips and tokens, that's why i made it ownerOnly
      ) {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Advanced Player List",
            description:
              sockets.clients.length +
              " players connected\n\n" +
              sockets.clients
                .map((c) => {
                  let Name =
                    c.player.body == null
                      ? "Dead Player"
                      : c.player.body.name === ""
                        ? "An unnamed player"
                        : c.player.body.name;
                  if (Name.includes("§36§[YAN]§reset§\u200b")) {
                    Name = Name.replace("§36§[YAN]§reset§\u200b", "[YAN]");
                  }
                  let playerID =
                    c.player.body == null ? "dead" : c.player.body.id;
                  return `**${Name}**\nPlayerID: [${playerID}] | IP: [${c.ip}] | Token: [${c.key}]`;
                })
                .join("\n\n"),
            color: themeColor,
            thumbnail: {
              url: gameImage,
            },
          },
        });
      } else {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: "Advanced Player List",
            description: "",
            color: 16711680,
            fields: [
              {
                name: `Warning`,
                value: `You are not permitted to perform this action.`,
              },
            ],
            thumbnail: {
              url: gameImage,
            },
            footer: {},
          },
        });
      }
    }
  }
});
bot.editStatus("online", { name: `with 0 players!`, type: 0 });
bot.connect();
module.exports = ({ Events }) => {
  Events.on("chatMessage", ({ message, socket }) => {
    if (!socket.player.body || message.startsWith("/")) return;
    let playerName = socket.player.body.name
      ? socket.player.body.name
      : "Unnamed";
    bot.createMessage(chatChannel, {
      embed: {
        color: themeColor,
        fields: [
          {
            name: `${playerName + ":"}`,
            value: `${message}`,
          },
        ],
      },
    });
    updateStatus();
    bot.connect();
  });
};