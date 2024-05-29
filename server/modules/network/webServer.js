let fs = require("fs"),
  path = require("path"),
  publicRoot = path.join(__dirname, "../../../public"),
  mimeSet = {
    js: "application/javascript",
    json: "application/json",
    css: "text/css",
    html: "text/html",
    md: "text/markdown",
    //"png": "image/png",
  },
  http = require("http");

class App {
  constructor() {
    this.middlewareStack = [];
  }

  use(middleware) {
    this.middlewareStack.push(middleware);
  }

  handleRequest(req, res) {
    let index = 0;

    const next = () => {
      if (index < this.middlewareStack.length) {
        const middleware = this.middlewareStack[index++];
        middleware(req, res, next);
      }
    };

    next();
  }

  start(server, port) {
    let _server = http.createServer(this.handleRequest.bind(this));
    _server.on("upgrade", (req, socket, head) =>
      server.handleUpgrade(req, socket, head, (ws) => sockets.connect(ws, req)),
    );
    _server.listen(port, () =>
      console.log(
        "Æ🚫Sports's Mod initialized + Server listening on port",
        port,
      ),
    );
    return _server;
  }
}
let travelServers = [
  {
      gameMode: "Forge",
      players: 6,
      name: "Forge",
      ip: "h5s8j2-53051.csb.app"
  },
  {
      gameMode: "2TDM",
      players: 3,
      name: "2TDM",
      ip: "h5s8j2-26301.csb.app"
  },
  {
    gameMode: "Labyrinth",
    players: 3,
    name: "Labyrinth",
    ip: "h5s8j2-36381.csb.app"
}

]
function logMiddleware(req, res, next) {
  let resStr = "";
  switch (req.url) {
    case "/lib/json/mockups.json":
      resStr = mockupJsonData;
      break;
    case "/lib/json/gamemodeData.json":
      resStr = JSON.stringify({
        gameMode: c.gameModeName,
        players: views.length,
      });
      break;
    case "/serverData.json":
      resStr = JSON.stringify({ ip: c.host });
      break;
      case "/api/sendPlayer":
            ok = false;
            let body = "";
            req.on("data", c => body += c);
            req.on("end", () => {
                let json = null;
                try {
                    json = JSON.parse(body);
                } catch { }
                console.log(json);
                if (json) {
                    if (json.key === process.env.API_KEY) {
                        let { id, name, definition, score, skillcap, skill, points, checkDednut } = json;
                        sockets.playersReceived.push({ id, name, definition, score, skillcap, skill, points, checkDednut });
            //            res.writeHead(200);
                        res.end("OK");
                        console.log("Successfully received a player.");
                    } else {
                        res.writeHead(403);
                        res.end("Access Denied");
                        console.log("Failed API KEY check!");
                    }
                } else {
                    res.writeHead(400);
                    res.end("Invalid JSON body");
                }
            });
            break;
            case "/isOnline":
            resStr = (!this.arenaClosed).toString();
            break;
            case "/travelData":
              resStr = JSON.stringify(travelServers);
              break;
    default:
      let fileToGet = path.join(publicRoot, req.url);

      //if this FILE does not exist, return the default;
      try {
        if (!fs.lstatSync(fileToGet).isFile()) {
          throw fileToGet;
        }
      } catch (err) {
        fileToGet = path.join(publicRoot, c.DEFAULT_FILE);
      }

      //return the file
      res.writeHead(200, {
        "Content-Type": mimeSet[fileToGet.split(".").pop()] || "text/html",
      });
      return fs.createReadStream(fileToGet).pipe(res);
  }
  res.writeHead(200);
  res.end(resStr);

  next();
}
function corsMiddleware(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  next();
}

let _temp = new App(),
  _ws = new (require("ws").WebSocketServer)({ noServer: true });
_temp.use(corsMiddleware);
_temp.use(logMiddleware);

let server = _temp.start(_ws, c.port);
module.exports = { server };
