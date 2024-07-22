const fsPromises = require("node:fs").promises;
const path = require("node:path");

async function loadFiles (dir) {
    const files = [];

    for(const filename of await fsPromises.readdir(dir)) {
        if(!filename.endsWith(".js")) continue;
        const fpath = path.join(dir, filename)
        const file = require(fpath);
        files.push(file);
    }

    return files;
}

module.exports = {loadFiles};
