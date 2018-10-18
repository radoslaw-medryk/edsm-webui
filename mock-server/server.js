const http = require("http");
const path = require("path");
const fs = require("fs");

// Usage: node server.js [port=8888]

const port = parseInt(process.argv[2 + 0], 10) || 8888;

// TODO [RM]: so far ugly prototype. Prettify, think of moving it into own npm package.

// TODO [RM]: think of implementing switchable scenarios,
// TODO [RM]: with focus on easy of use; e.g. unauthorized user, etc.

// TODO [RM]: allow granular config per endpoint (in separate config file?)
// TODO [RM]: allow config of return headers
// TODO [RM]: allow templating of response (with js code = module file?)

const error = (err, req, res) => {
    console.log(err);
    res.statusCode = 500;
    res.end();
}

const notFound = (req, res) => {
    res.statusCode = 404;
    res.end();
}

const corsReply = (req, res) => {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    });
    res.end();
}

const handle = (req, res) => {
    // TODO [RM]: handle Windows
    let url = path.posix.normalize(req.url);
    const method = req.method.toLowerCase();

    // TODO [RM]: more extensible configuration?
    if (method === "options") {
        corsReply(req, res);
        return;
    }

    // TODO [RM]: research security (dir traversal attacks)
    url = url.substring(1); // remove trailing '/'
    url = path.posix.join(__dirname, "root", url);

    fs.readdir(url, function (err, files) {
        if (err) {
            notFound(req, res);
            return;
        }

        const matches = files
            .map(q => path.posix.join(url, q))
            .map(q => path.posix.parse(q))
            .filter(q => q.name.startsWith(method));
        
        if (matches.length > 1) {
            error("Found more than single match.", req, res);
            return;
        }

        if (matches.length === 0) {
            notFound(req, res);
            return;
        }

        const match = matches[0];
        fs.readFile(path.posix.join(match.dir, match.base), (err, data) => {
            if (err) {
                error(err, req, res);
                return;
            }

            res.writeHead(200, {
                "Content-Type": "applcation/json",
                "Access-Control-Allow-Origin": "*",
            });
            res.write(data);
            res.end();
        });
    });
};

http.createServer(handle).listen(port);
