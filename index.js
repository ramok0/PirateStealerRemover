const Glob = require("glob"),
{join} = require("path"),
{format} = require("util"),
fs = require("fs"), 
local = process.env.localappdata,
crypto = require("crypto");
 

const ORIGINALTEXT = `module.exports = require('./core.asar');`;
const ORIGINALHASH = generateHashOfBuffer(ORIGINALTEXT);

//TEXTS
const RequireMorePerms = `\x1b[31mI was unable to delete a grabber, please restart me with administrator perms.`;
const SuccessVariant = `\x1b[32mSuccessfully removed a variant of injected grabber in %s`;
const Found = `\x1b[31m%s is currently infected by a grabber, trying to remove it...\x1b[0m`;
const Safe = `\x1b[32m%s is safe !\x1b[0m`;
const Success = `\x1b[32mSuccessfully removed the grabber from %s, please restart any instance to apply the patch`

const toCheck = new Array(), toCheckJS = new Array()

fs.readdirSync(local).filter(p => p.includes("cord")).forEach(p => toCheck.push(`${local}/${p}`))

toCheck.forEach(r => Glob.sync(r + '/app-*/modules/discord_desktop_core-*/discord_desktop_core').forEach(r => toCheckJS.push(r)))

toCheckJS.forEach(r => {
    var Discord = r.split("/")[5];
    const index = join(r, "index.js");
    const package = join(r, "package.json");
    let safedetection = 0;
    if(fs.existsSync(index)) {
        if (getHashOfFile(index) !== ORIGINALHASH) {
            console.log(format(Found, Discord));
            replaceFile(index, ORIGINALTEXT).then(() => {
                console.log(format(Success, Discord));
            })
            .catch((error) => {
                return console.log(error);
            })
        } else {
            safedetection++;
        }
    } else {
        replaceFile(index, ORIGINALTEXT).then(() => {
            console.log(format(Success, Discord));
        })
        .catch((error) => {
            return console.log(error);
        })
    }

    if(fs.existsSync(package)) {
        const file = fs.readFileSync(package);
        const json = JSON.parse(file);
        if(json.hasOwnProperty("main") && json["main"] !== "index.js") {
            if(fs.existsSync(json["main"])) {
                fs.unlink(json["main"], (err) => {
                    if(err) return console.log(RequireMorePerms);
                });
            }

            json["main"] = "index.js";
            replaceFile(package, JSON.stringify(json, null, 4))
            .then(() => {
                console.log(format(SuccessVariant, Discord));
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            safedetection++;
        }
    } else {
        const payload = {
            name: "discord_desktop_core",
            version: "0.0.0",
            private: true,
            main: "index.js"
        }

        replaceFile(package, JSON.stringify(payload, null, 4))
        .then(() => {
            safedetection++
        })
        .catch((err) => console.log(err))
    }

    setTimeout(() => {
        if(safedetection >= 2) {
            console.log(format(Safe, Discord));
        }
    }, 250);
});

function replaceFile(filePath, buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, buffer, (err) => {
            if(err) reject(RequireMorePerms);
            resolve();
        });
    })
}


function generateHashOfBuffer(buffer) {
    return crypto.createHash("md5").update(buffer).digest("hex").toString();
}

function getHashOfFile(filePath) {
    if(!fs.existsSync(filePath)) return null;
    const buffer = fs.readFileSync(filePath);
    return generateHashOfBuffer(buffer);
}
