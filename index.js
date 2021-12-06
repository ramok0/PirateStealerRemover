const Glob = require("glob")
const fs = require("fs")
const Gradient = require("gradient-string")
const local = process.env.LOCALAPPDATA
const installedDiscord = []
const toCheck = []

var content = fs.readdirSync(local)
content.forEach(dirContent => {
    if (dirContent.includes("iscord")) installedDiscord.push(`${local}\\${dirContent}`)
})

installedDiscord.forEach(r => {
    Glob.sync(`${r}/app-*/modules/discord_desktop_core-*/discord_desktop_core/index.js`).map(f => toCheck.push(f))
})

toCheck.forEach(r => {
    var fileContent = fs.readFileSync(r, 'utf-8')
    if (fileContent.includes("session")) {
        console.log(Gradient.instagram(`You've Been Grabbed In \n${r.split("/")[5]}\nI'm removing The Grabber...`))
        fs.writeFileSync(r, "module.exports = require('./core.asar')")
        fs.readFile(r, 'utf-8', (err, data) => {
            if (data.toString() == "module.exports = require('./core.asar')") console.log(Gradient.retro(`Grabber SuccessFully Removed From \n${r.split("/")[5]}\nPlease Change Your Password`))
            else console.log(Gradient.fruit(`I Can't Delete The Grabber Please Re-installe ${r.split("/")[5]}`))
        })
    } else console.log(Gradient.instagram(`${r.split("/")[5]} is Safe`))
})
