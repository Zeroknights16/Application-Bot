# Installation Guide

### Steps:
**1.** Please ensure you have [Node.js](https://nodejs.org/en/download/) installed.\
**2.** Download the latest release [Here](https://github.com/Zeroknights16/Application-Bot-Discord.js-)\
**3.** Fill in the config.json file. ([Available Permission types](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS))\
**4.** Run install.bat to install all the node_modules.\
**5.** Start the bot by running the start.bat file.

### Config:

```json5
{
  "bot": {
    "token": "", //Discord Bot Token
    "prefix": "", //Prefix of Commands
    "factionname": "" //Name of your Faction/Discord
  },
  "channels": {
  "pending": "", //Pending Channel ID; User will get access to this channel if he was accepted with Status "Pending"
  "requirementchannel": "", //Requirement Channel ID; Chat will be mentioned while executing [prefix]apply
  "applylog": "" //Application Log Channel ID; Logs all applications
  },
  "roles": {
    "factionrole": "", //Role ID, this role is getting applied when an user has been accepted
    "pendingrole": "" //Role ID, this role is getting applied when an user has been accepeted with status "Pending"
  },
  "permissions": { //Permissions for each command; Look above for a list of all available permission types.
    "accept": "BAN_MEMBERS",
    "deny": "BAN_MEMBERS",
    "dm": "BAN_MEMBERS",
    "pending": "BAN_MEMBERS",
    "restart": "BAN_MEMBERS"
  }
}
```
### Support:
* You can contact me on discord: `Zeroknights#9457`
