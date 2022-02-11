const Glob = require("glob"), fs = require("fs"), local = process.env.localappdata

const toCheck = new Array(), toCheckJS = new Array()

fs.readdirSync(local).forEach(p => p.includes("cord") && toCheck.push(`${local}/${p}`))

toCheck.forEach(r => Glob.sync(r + '/app-*/modules/discord_desktop_core-*/discord_desktop_core/index.js').map(r => toCheckJS.push(r)))

toCheckJS.forEach(r => {
    var Discord = r.split("/")[5]
    if (fs.readFileSync(r).toString() !== "module.exports = require('./core.asar');") {
        console.log(`\x1b[31m${Discord} is currently infected by a grabber I'm trying to delete it...\x1b[0m`)
        fs.writeFileSync(r, "module.exports = require('./core.asar');")
        if (fs.readFileSync(r).toString() == "module.exports = require('./core.asar');") return console.log(`\x1b[32mSuccessfully Removed The Grabber From ${Discord} Please Restart ${Discord}`)
        else console.log(`\x1b[31mI Can't Delete The Grabber From ${Discord} Please Start Me In Administrator.`)
    } else console.log(`\x1b[32m${Discord} is safe !\x1b[0m`)
})
