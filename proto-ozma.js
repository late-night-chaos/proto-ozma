const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_EMOJIS', 'GUILD_PRESENCES', 'GUILD_MEMBERS'] } });
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'database',
    connectionLimit: 5,
}); // REMOTE

const serverInfo = {
    channels: {
        log: 'log channel id',
        roles: 'role channel id',
        schedule: 'schedule channel id',
        partyLeader: 'party leader recruitment channel id',
        passcodePG: 'progression passcode channel id',
        passcodeOZ: 'ozma passcode channel id',
        passcodeRC: 'reclear passcode channel id',
        nextRunTime: 'next run time voice channel id',
        nextRunType: 'next run type voice channel id',
        nextRunPasscode: 'next run passcode time voice channel id',
    },
    embedColor: '#cc0000',
    emoji: {
        bunny: 'emoji to use for support id',
        roleApplied: '✔',
        roleRemoved: '❌',
        deafened: '🔇',
        hourglass: '⏳',
        nextRun: '⏭',
        passcode: '🔑',
    },
    id: 'server id',
    posts: {
        schedule: 'schedule post id',
    },
    roles: {
        flex: {
            noFlexRole: 'deafened role id',
            newAdventurer: 'newbie role id',
            ozmaProgression: 'ozma prog role id',
            ozmaKiller: 'ozma killer role id',
        },
        special: {
            ozmaChampion: 'ozma champion role id',
            raidLeader: 'raid leader role id',
        },
        trigger: {
            relicGrind: 'eureka pings role id',
            bozjaPings: 'bozja pings role id',
        },
    },
};

client.on('ready', () => {
    console.log('[' + getServerTime() + '] Connected to Discord');
    client.user.setActivity('in the Proto-Ozma Containment Unit');
});

//Functions
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
function getServerTime(targetTime) {
    let currentDate = new Date();
    if (typeof targetTime !== 'undefined') {
        currentDate.setTime(targetTime);
    }
    return addZero(currentDate.getUTCHours()) + ':' + addZero(currentDate.getUTCMinutes()) + ' ST';
}
function adminLog(String) {
    // client.channels.cache.get(serverInfo.channels.log).send(`[` + getServerTime() + `] ` + String);
    console.log(`[` + getServerTime() + `] ` + String);
}
function commandError(message, reply) {
    message.reply(reply).then((msg) => {
        msg.delete({ timeout: 10000 });
    });
    message.delete({ timeout: 10000, reason: reply });
}
function capitalLetter(str) {
    str = str.split(' ');
    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }
    return str.join(' ');
}
function getDayOfWeek(targetDate) {
    let targetDay = 'Sunday';
    if (targetDate.getUTCDay() == 1) {
        targetDay = 'Monday';
    } else if (targetDate.getUTCDay() == 2) {
        targetDay = 'Tuesday';
    } else if (targetDate.getUTCDay() == 3) {
        targetDay = 'Wednesday';
    } else if (targetDate.getUTCDay() == 4) {
        targetDay = 'Thursday';
    } else if (targetDate.getUTCDay() == 5) {
        targetDay = 'Friday';
    } else if (targetDate.getUTCDay() == 6) {
        targetDay = 'Saturday';
    }
    return targetDay;
}
function getDate(targetDate) {
    let dateString = addZero(String(targetDate.getUTCDate())) + '-';
    if (targetDate.getUTCMonth() == 0) {
        dateString += 'Jan';
    }
    if (targetDate.getUTCMonth() == 1) {
        dateString += 'Feb';
    }
    if (targetDate.getUTCMonth() == 2) {
        dateString += 'Mar';
    }
    if (targetDate.getUTCMonth() == 3) {
        dateString += 'Apr';
    }
    if (targetDate.getUTCMonth() == 4) {
        dateString += 'May';
    }
    if (targetDate.getUTCMonth() == 5) {
        dateString += 'Jun';
    }
    if (targetDate.getUTCMonth() == 6) {
        dateString += 'Jul';
    }
    if (targetDate.getUTCMonth() == 7) {
        dateString += 'Aug';
    }
    if (targetDate.getUTCMonth() == 8) {
        dateString += 'Sep';
    }
    if (targetDate.getUTCMonth() == 9) {
        dateString += 'Oct';
    }
    if (targetDate.getUTCMonth() == 10) {
        dateString += 'Nov';
    }
    if (targetDate.getUTCMonth() == 11) {
        dateString += 'Dec';
    }
    dateString += '-' + String(targetDate.getUTCFullYear()).slice(-2);
    return dateString;
}
function getMonth(month) {
    let targetMonth = month.toLowerCase();
    let result = null;
    if (targetMonth === 'jan') {
        result = 0;
    }
    if (targetMonth === 'feb') {
        result = 1;
    }
    if (targetMonth === 'mar') {
        result = 2;
    }
    if (targetMonth === 'apr') {
        result = 3;
    }
    if (targetMonth === 'may') {
        result = 4;
    }
    if (targetMonth === 'jun') {
        result = 5;
    }
    if (targetMonth === 'jul') {
        result = 6;
    }
    if (targetMonth === 'aug') {
        result = 7;
    }
    if (targetMonth === 'sep') {
        result = 8;
    }
    if (targetMonth === 'oct') {
        result = 9;
    }
    if (targetMonth === 'nov') {
        result = 10;
    }
    if (targetMonth === 'dec') {
        result = 11;
    }
    return result;
}
function getCountdownString(targetDate) {
    let timeString = '';
    let currentDate = new Date();
    let deltaTime = targetDate.getTime() - currentDate.getTime() + 60000;
    if (deltaTime > 86400000) {
        timeString = 'More than 24 hours.';
    } else {
        let hours = Math.floor(deltaTime / (1000 * 60 * 60));
        let minutes = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
            timeString += hours + ' hour';
            if (hours > 1) {
                timeString += 's';
            }
            if (minutes > 0) {
                timeString += '+.';
            }
        } else {
            timeString = minutes + ' minutes.';
        }
    }
    return timeString;
}
function getFineCountdownString(targetDate) {
    let timeString = '';
    let currentDate = new Date();
    let deltaTime = targetDate.getTime() - currentDate.getTime() + 60000;
    if (deltaTime > 86400000) {
        timeString = 'More than 24 hours.';
    } else {
        let hours = Math.floor(deltaTime / (1000 * 60 * 60));
        let minutes = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 0) {
            timeString += hours + 'h ';
            if (minutes > 0) {
                timeString += minutes + 'm';
            }
        } else {
            timeString = minutes + ' m';
        }
    }
    return timeString;
}
function pad(pad, str, padLeft) {
    if (typeof str === 'undefined') return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}
function buildPartyLeaderEmbed(run) {
    let runDate = new Date();
    runDate.setTime(run[0].Start);
    let runDay = '';
    if (runDate.getUTCDay() === 0) {
        runDay = 'Sunday';
    } else if (runDate.getUTCDay() === 1) {
        runDay = 'Monday';
    } else if (runDate.getUTCDay() === 2) {
        runDay = 'Tuesday';
    } else if (runDate.getUTCDay() === 3) {
        runDay = 'Wednesday';
    } else if (runDate.getUTCDay() === 4) {
        runDay = 'Thursday';
    } else if (runDate.getUTCDay() === 5) {
        runDay = 'Friday';
    } else {
        runDay = 'Saturday';
    }
    let lateNight = client.guilds.cache.get(serverInfo.id);
    let runLeader = lateNight.members.cache.get(run[0].RL).displayName;
    let runPL1 = 'TBC';
    let runPL2 = 'TBC';
    let runPL3 = 'TBC';
    let runPL4 = 'TBC';
    let runPL5 = 'TBC';
    let runPL6 = 'TBC';
    let runPLS = 'TBC';
    if (run[0].PL1 !== '-') {
        runPL1 = lateNight.members.cache.get(run[0].PL1).displayName;
    }
    if (run[0].PL2 !== '-') {
        runPL2 = lateNight.members.cache.get(run[0].PL2).displayName;
    }
    if (run[0].PL3 !== '-') {
        runPL3 = lateNight.members.cache.get(run[0].PL3).displayName;
    }
    if (run[0].PL4 !== '-') {
        runPL4 = lateNight.members.cache.get(run[0].PL4).displayName;
    }
    if (run[0].PL5 !== '-') {
        runPL5 = lateNight.members.cache.get(run[0].PL5).displayName;
    }
    if (run[0].PL6 !== '-') {
        runPL6 = lateNight.members.cache.get(run[0].PL6).displayName;
    }
    if (run[0].PLS !== '-') {
        runPLS = lateNight.members.cache.get(run[0].PLS).displayName;
    }
    let runTime = String(addZero(runDate.getUTCHours())) + ':' + String(addZero(runDate.getUTCMinutes()));
    let embed = new Discord.MessageEmbed()
        .setColor(serverInfo.embedColor)
        .setTitle(`${getDayOfWeek(runDate)} ${getDate(runDate)} ${runTime} ST ${run[0].Type} Run\nParty Leader Recruitment`)
        .setDescription(
            `Raid Leader: ${runLeader},` +
                `\n1: ${runPL1},` +
                `\n2: ${runPL2},` +
                `\n3: ${runPL3},` +
                `\n4: ${runPL4},` +
                `\n5: ${runPL5},` +
                `\n6: ${runPL6},` +
                `\nS: ${runPLS}.` +
                `\n\n**React with appropriate number to host a party.` +
                `\nPlease note, your reaction may be removed at the Raid Leader's discretion.**` +
                `\n_Run ID: ${run[0].ID}_`
        );
    return embed;
}

//Hash Function
Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0,
            i,
            chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
});

//Timed Functions
function clockFunctions() {
    let currentDate = new Date();
    if (client.ws.status === 0) {
        let lateNight = client.guilds.cache.get(serverInfo.id);
        let channelNextRunType = client.channels.cache.get(serverInfo.channels.nextRunType);
        let channelNextRunTime = client.channels.cache.get(serverInfo.channels.nextRunTime);
        let channelNextRunPasscode = client.channels.cache.get(serverInfo.channels.nextRunPasscode);
        let channelSchedule = client.channels.cache.get(serverInfo.channels.schedule);
        pool.query('SELECT `Type`, `Start`, `RL` FROM `Runs` WHERE `Start` > ? AND `Cancelled` = 0 ORDER BY `Start` ASC', [currentDate.getTime()])
            .then((row) => {
                let embedDescription = '';
                let previousDate = '';
                row.forEach((run) => {
                    let runTime = new Date();
                    runTime.setTime(run.Start);
                    let runDate = getDate(runTime);
                    let raidLeader = lateNight.members.cache.get(run.RL).displayName;
                    if (runDate !== previousDate) {
                        embedDescription += `__${getDayOfWeek(runTime)} ${runDate}__\n`;
                        previousDate = runDate;
                    }
                    embedDescription += `${getServerTime(runTime)}: ${run.Type} Run (Raid Leader: ${raidLeader})\n`;
                });
                if (embedDescription === '') {
                    embedDescription = 'There are currently no scheduled runs.\nPlease check back here shortly for further information.';
                }
                let embedHash = embedDescription.hashCode();
                channelSchedule.messages.fetch(serverInfo.posts.schedule).then((msg) => {
                    if (!msg.embeds[0].description.includes(embedHash)) {
                        embedDescription += '\n\nPost Hash: ' + embedHash;
                        let embedSchedule = new Discord.MessageEmbed()
                            .setColor(serverInfo.embedColor)
                            .setTitle('Upcoming Runs')
                            .setDescription(embedDescription)
                            .setThumbnail('https://rosaworks.uk/img/ozma.png')
                            .addField(
                                'Run Eligibility',
                                'Each run type listed below shows the roles able to take part in this run.\nOpen: New Adventurer, Ozma Progression, Ozma Killer,' +
                                    '\nOZ: Ozma Progression, Ozma Killer,\nRC: Ozma Killer.'
                            );
                        msg.edit(embedSchedule);
                    }
                });
            })
            .catch((error) => console.log(error));
        pool.query('SELECT * FROM `Runs` WHERE `Start` > ? AND `Cancelled` = 0 ORDER BY `Start` ASC LIMIT 1', [currentDate.getTime()])
            .then((row) => {
                if (typeof row[0] !== 'undefined') {
                    let targetDate = new Date();
                    targetDate.setTime(row[0].Start);
                    let deltaTime = targetDate.getTime() - currentDate.getTime();
                    client.user.setActivity('in ' + getFineCountdownString(targetDate));
                    let timeString = getCountdownString(targetDate);
                    let nextRunType = serverInfo.emoji.nextRun + ' Next Run: "' + row[0].Type + '"';
                    let nextRunTime = serverInfo.emoji.hourglass + ' ' + getDayOfWeek(targetDate) + ' ' + getServerTime(targetDate.getTime());
                    if (channelNextRunType.name !== nextRunType) {
                        adminLog('Updating "Next Run Type" channel name to: ' + nextRunType);
                        channelNextRunType.setName(nextRunType);
                    }
                    if (getDate(currentDate) === getDate(targetDate)) {
                        nextRunTime = serverInfo.emoji.hourglass + ' Today ' + getServerTime(targetDate.getTime());
                    }
                    if (channelNextRunTime.name !== nextRunTime) {
                        adminLog('Updating "Next Run Time" channel name to: ' + nextRunTime);
                        channelNextRunTime.setName(nextRunTime);
                    }
                    if (timeString === '1 hour') {
                        let passcodeDate = targetDate.getTime();
                        passcodeDate = passcodeDate - 1800000;
                        channelNextRunPasscode.setName(serverInfo.emoji.passcode + ' Passcode at ' + getServerTime(passcodeDate));
                        channelNextRunPasscode.updateOverwrite(lateNight.roles.everyone, { VIEW_CHANNEL: true });
                    }
                    if (timeString === '55 minutes.' && row[0].PasscodeMain > 0) {
                        client.users.cache
                            .get(row[0].RL)
                            .send(
                                'Raid Leader Notification:\nPasscode for Main Parties will be ' +
                                    row[0].PasscodeMain +
                                    '\nThis message has been sent to Party Leaders 1-6.' +
                                    '\nPasscode for Support will be ' +
                                    row[0].PasscodeSupport +
                                    '\nThis message has been sent to the Support Party Leader.\nThe passwords will be posted automatically 30 minutes before the run.'
                            );
                        for (let i = 1; i < 8; i++) {
                            if (i < 7) {
                                if (row[0]['PL' + i] !== '-') {
                                    client.users.cache
                                        .get(row[0]['PL' + i])
                                        .send('Party Finder Information:\nLate Night BA - ' + row[0].Type + ' Run, Party ' + i + '\nPasscode will be ' + row[0].PasscodeMain);
                                }
                            } else {
                                if (row[0].PLS !== '-') {
                                    client.users.cache
                                        .get(row[0].PLS)
                                        .send(
                                            'Party Finder Information:\nLate Night BA - ' +
                                                row[0].Type +
                                                ' Run, Support Party\nThe support passcode will be ' +
                                                row[0].PasscodeSupport +
                                                ', _please note this passcode is uniquely generated for the Support Party only_.'
                                        );
                                }
                            }
                        }
                    }
                    if (timeString === '30 minutes.') {
                        channelNextRunPasscode.setName(serverInfo.emoji.passcode + ' PF Open');
                        if (row[0].PasscodeMain > 0) {
                            let runPings =
                                '<@&' + serverInfo.roles.flex.newAdventurer + '> <@&' + serverInfo.roles.flex.ozmaProgression + '> <@&' + serverInfo.roles.flex.ozmaKiller + '>';
                            let passcodeChannel = serverInfo.channels.passcodePG;
                            if (row[0].Type === 'OZ') {
                                runPings = '<@&' + serverInfo.roles.flex.ozmaProgression + '> <@&' + serverInfo.roles.flex.ozmaKiller + '>';
                                passcodeChannel = serverInfo.channels.passcodeOZ;
                            } else if (row[0].Type === 'RC') {
                                runPings = '<@&' + serverInfo.roles.flex.ozmaKiller + '>';
                                passcodeChannel = serverInfo.channels.passcodeRC;
                            }
                            let supportText = '';
                            if (row[0].PLS !== '-') {
                                supportText = '\n_To join support, send a DM to ' + lateNight.members.cache.get(row[0].PLS).displayName + ' for the support passcode._';
                            }
                            let post =
                                'Raid Leader: ' +
                                lateNight.members.cache.get(row[0].RL).displayName +
                                ',' +
                                `\n\n**The passcode for all Parties 1-6 is ${row[0].PasscodeMain}.**` +
                                supportText +
                                `\n\nReminder:\n1: Please bring proper logograms. If you do not bring and use _Spirit of the Remembered_ we will not revive you.` +
                                `\n2: We can not revive players normally in BA, so please bear this in mind and do mechanics properly.` +
                                `\n3: If you die on trash mobs, this will usually result in you not being revived. ` +
                                `There is no reason to die on them, so please wait 5s for the tank to establish aggro.`;
                            let embedPasscode = new Discord.MessageEmbed()
                                .setColor(serverInfo.embedColor)
                                .setTitle(`${getDayOfWeek(targetDate)} ${getDate(targetDate)} ${getServerTime(targetDate.getTime())} ${row[0].Type} Run\nPasscode`)
                                .setDescription(post);
                            client.channels.cache.get(passcodeChannel).send(embedPasscode);
                            client.channels.cache.get(passcodeChannel).send(runPings);
                        }
                    }
                    if (timeString === '1 minutes.') {
                        channelNextRunPasscode.updateOverwrite(lateNight.roles.everyone, { VIEW_CHANNEL: false });
                    }
                } else {
                    let nextRunType = serverInfo.emoji.nextRun + ' Next Run: "TBC"';
                    let nextRunTime = serverInfo.emoji.hourglass + ' See Schedule';
                    if (channelNextRunType.name !== nextRunType) {
                        adminLog('Updating "Next Run Type" channel name to: ' + nextRunType);
                        channelNextRunType.setName(nextRunType);
                    }
                    if (channelNextRunTime.name !== nextRunTime) {
                        adminLog('Updating "Next Run Time" channel name to: ' + nextRunTime);
                        channelNextRunTime.setName(nextRunTime);
                    }
                }
            })
            .catch((error) => console.log(error));
    }
    var Interval = (60 - currentDate.getUTCSeconds()) * 1000 + 5;
    setTimeout(clockFunctions, Interval);
}
clockFunctions();

client.on('guildMemberAdd', (member) => {
    adminLog("New member '" + member.displayName + "' joined.");
});

client.on('message', (msg) => {
    if (msg.author.bot) return;
    const args = msg.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let currentDate = new Date();
    if (command === 'schedule' && msg.member.roles.cache.has(serverInfo.roles.special.raidLeader)) {
        if (args[0] === 'add') {
            let postFormat =
                'Format: _!schedule add <type> <dd-mmm-yy> <hh:mm> (optional: nopasscode)_\n' +
                'i.e. _!schedule add open 16-jun-20 19:00_\n' +
                'i.e. _!schedule add open 16-jun-20 19:00 nopasscode_';
            if (args.length < 4) {
                commandError(msg, 'Insufficient information provided.\n' + postFormat);
                return;
            }
            if (args.length > 5) {
                commandError(msg, 'Too many arguments provided.\n' + postFormat);
                return;
            }
            let runType = '';
            let runDate = new Date();
            let runTime = '';
            let regExp = /([0-9]*)-([A-Za-z]{3})-([0-9]*)\w+/;
            if (args[1] === 'OZ' || args[1] === 'PG' || args[1] === 'RC' || args[1] === 'Open') {
                runType = args[1];
                if (regExp.test(args[2])) {
                    let arrayDate = args[2].split('-');
                    let year = '20' + arrayDate[2].toString();
                    runDate.setUTCDate(arrayDate[0]);
                    runDate.setUTCMonth(getMonth(arrayDate[1]));
                    runDate.setUTCFullYear('20' + arrayDate[2]);
                    regExp = /([0-9]{2}):([0-9]{2})/g;
                    let passcodeMain = 0;
                    let passcodeSupport = 0;
                    if (args.length === 4) {
                        passcodeMain = pad('0000', Math.floor(Math.random() * 10000), true);
                        passcodeSupport = pad('0000', Math.floor(Math.random() * 10000), true);
                        while (passcodeSupport === passcodeMain) {
                            passcodeSupport = pad('0000', Math.floor(Math.random() * 10000), true);
                        }
                    }
                    if (regExp.test(args[3])) {
                        let arrayTime = args[3].split(':');
                        runDate.setUTCHours(arrayTime[0], arrayTime[1], 0, 0);
                        runTime = runDate.getTime();
                        if (runTime < currentDate.getTime()) {
                            commandError(msg, 'The date and time specified has already occured, the run must be in the future.');
                            return;
                        } else {
                            pool.query(
                                'INSERT INTO `Runs` (`Type`, `Start`, `PasscodeMain`, `PasscodeSupport`, `RL`, `PL1`, `PL2`, `PL3`, `PL4`, `PL5`, `PL6`, `PLS`)' +
                                    " VALUES (?, ?, ?, ?, ?, '-', '-', '-', '-', '-', '-', '-')",
                                [runType, runTime, passcodeMain, passcodeSupport, msg.member.id]
                            )
                                .then((row) => {
                                    let runID = row.insertId;
                                    msg.channel.send(`${runType} Run added on ${args[2]} at ${args[3]}.`);
                                    pool.query('SELECT * FROM `Runs` WHERE `ID` = ?', [runID])
                                        .then((run) => {
                                            if (run[0].PasscodeMain > 0) {
                                                let embedPartyLeader = buildPartyLeaderEmbed(run);
                                                client.channels.cache
                                                    .get(serverInfo.channels.partyLeader)
                                                    .send(embedPartyLeader)
                                                    .then(async (sentEmbed) => {
                                                        await sentEmbed.react('1⃣');
                                                        await sentEmbed.react('2⃣');
                                                        await sentEmbed.react('3⃣');
                                                        await sentEmbed.react('4⃣');
                                                        await sentEmbed.react('5⃣');
                                                        await sentEmbed.react('6⃣');
                                                        await sentEmbed.react(serverInfo.emoji.bunny);
                                                    });
                                            }
                                        })
                                        .catch((error) => console.log(error));
                                })
                                .catch((error) => console.log(error));
                        }
                    } else {
                        commandError(msg, 'Invalid time specified.\nFormat: <hh:mm> in ST, i.e. 22:32.');
                        return;
                    }
                } else {
                    commandError(msg, 'Invalid date specified.\nFormat: <dd-mmm-yy>, i.e. 23-Sep-19.');
                    return;
                }
            } else {
                commandError(msg, 'Invalid run type specified.\nOptions: Open, OZ, RC');
                return;
            }
        }
        if (args[0] === 'cancel') {
        }
    }
    if (command === 'waymark' || command === 'waymarks') {
        let boss = args[0].toLowerCase();
        let bossName = '';
        if (boss.includes('av')) {
            bossName = 'Absolute Virtue';
        } else if (boss.includes('ozma')) {
            bossName = 'Proto-Ozma';
        } else if (boss.includes('elements')) {
            bossName = 'Elemental Rooms';
        } else if (boss.includes('raiden')) {
            bossName = 'Raiden';
        }
        if (bossName) {
            let post = 'Waymark Placement for ' + bossName;
            if (boss.includes('ozma')) {
                post += ' (Substitute B with A, B, or C as appropriate to your platform).';
            }
            msg.channel.send(post, {
                files: ['https://cdn.rosaworks.uk/proto-ozma/boss-' + boss + '.png'],
            });
            if (boss.includes('ozma')) {
                msg.channel.send('**Acceleration Bomb!**', {
                    files: ['https://cdn.discordapp.com/attachments/562248073166848027/568801915014610954/Clipboard_20190325_040024.png'],
                });
            }
        }
    }
    if (command === 'element' || command === 'elements' || command === 'rooms') {
        let post = 'Elemental Room Assignments';
        msg.channel.send(post, {
            files: ['https://cdn.rosaworks.uk/proto-ozma/boss-elements.png'],
        });
    }
    if (command === 'portals') {
        let post =
            '/macrolock\n' +
            '/p Portal 1: <1>\n' +
            '/p Portal 2: <2>\n' +
            '/p Portal 3: <3>\n' +
            '/p Portal 4: <4>\n' +
            '/p Portal 5: <5>\n' +
            '/p Portal 6: <6>\n' +
            '/p Portal 7: <7>\n' +
            '/p Portal 8: <8>\n';
        msg.channel.send(post, {
            files: ['https://cdn.discordapp.com/attachments/551795843259301899/553759110580011008/Map_v1.8.3.png'],
        });
    }

    if (msg.channel.id === serverInfo.channels.roles) {
        if (command === 'nickname') {
            if (args.length !== 3) {
                commandError(msg, 'Not enough information provided._\nCorrect syntax is !nickname Server Character Name,\ne.g. !nickname Moogle Rosalind Dex._');
            } else {
                nicknameMessage = msg.content;
                nicknameMessage = nicknameMessage.replace('!nickname ', '');
                nicknameMessage = nicknameMessage.replace('!Nickname ', '');
                newNickname = '';
                if (args.includes('Cerberus') || args.includes('cerberus')) {
                    nicknameMessage = nicknameMessage.replace('Cerberus', '');
                    nicknameMessage = nicknameMessage.replace('cerberus', '');
                    newNickname = '[C]';
                }
                if (args.includes('Louisoix') || args.includes('louisoix')) {
                    nicknameMessage = nicknameMessage.replace('Louisoix', '');
                    nicknameMessage = nicknameMessage.replace('louisoix', '');
                    newNickname = '[L]';
                }
                if (args.includes('Moogle') || args.includes('moogle')) {
                    nicknameMessage = nicknameMessage.replace('Moogle', '');
                    nicknameMessage = nicknameMessage.replace('moogle', '');
                    newNickname = '[M]';
                }
                if (args.includes('Omega') || args.includes('omega')) {
                    nicknameMessage = nicknameMessage.replace('Omega', '');
                    nicknameMessage = nicknameMessage.replace('omega', '');
                    newNickname = '[O]';
                }
                if (args.includes('Ragnarok') || args.includes('ragnarok')) {
                    nicknameMessage = nicknameMessage.replace('Ragnarok', '');
                    nicknameMessage = nicknameMessage.replace('ragnarok', '');
                    newNickname = '[R]';
                }
                if (args.includes('Spriggan') || args.includes('spriggan')) {
                    nicknameMessage = nicknameMessage.replace('Spriggan', '');
                    nicknameMessage = nicknameMessage.replace('spriggan', '');
                    newNickname = '[S]';
                }
                if (newNickname.length === 3) {
                    nicknameMessage = nicknameMessage.replace('  ', ' ');
                    newNickname = capitalLetter(nicknameMessage.trim()) + ' ' + newNickname;
                    msg.member.setNickname(newNickname);
                    msg.react(serverInfo.emoji.roleApplied);
                    adminLog(`Changed ${msg.member.user.username}'s nickname to ${newNickname}.`);
                } else {
                    commandError(msg, 'Server name provided is not on the Chaos Datacenter!');
                }
            }
        } else {
            let currentRoles = msg.member._roles;
            let roleString = msg.content.toLowerCase();
            if (roleString.includes('deafen')) {
                if (msg.member.roles.cache.has(serverInfo.roles.special.ozmaChampion)) {
                    msg.member.roles.set([serverInfo.roles.flex.noFlexRole, serverInfo.roles.special.ozmaChampion]);
                } else {
                    msg.member.roles.set([serverInfo.roles.flex.noFlexRole]);
                }
                msg.react(serverInfo.emoji.deafened);
                adminLog(`Removed all pingable roles from ${msg.member.displayName}.`);
                return;
            } else if (roleString.includes('newbie') || roleString.includes('ozma prog') || roleString.includes('ozma kill')) {
                let roleIndex = '';
                let newRole = '';
                let roleApplied = '';
                if (roleString.includes('newbie')) {
                    newRole = serverInfo.roles.flex.newAdventurer;
                    roleApplied = 'New Adventurer';
                }
                if (roleString.includes('ozma prog')) {
                    newRole = serverInfo.roles.flex.ozmaProgression;
                    roleApplied = 'Ozma Progression';
                }
                if (roleString.includes('ozma kill')) {
                    newRole = serverInfo.roles.flex.ozmaKiller;
                    roleApplied = 'Ozma Killer';
                }
                if (currentRoles.includes(serverInfo.roles.flex.noFlexRole)) {
                    roleIndex = currentRoles.indexOf(serverInfo.roles.flex.noFlexRole);
                }
                if (currentRoles.includes(serverInfo.roles.flex.newAdventurer)) {
                    roleIndex = currentRoles.indexOf(serverInfo.roles.flex.newAdventurer);
                }
                if (currentRoles.includes(serverInfo.roles.flex.ozmaProgression)) {
                    roleIndex = currentRoles.indexOf(serverInfo.roles.flex.ozmaProgression);
                }
                if (currentRoles.includes(serverInfo.roles.flex.ozmaKiller)) {
                    roleIndex = currentRoles.indexOf(serverInfo.roles.flex.ozmaKiller);
                }
                if (currentRoles.length === 0) {
                    msg.member.roles.add(newRole);
                    msg.react(serverInfo.emoji.roleApplied);
                    adminLog(`Changed Progression Role for ${msg.member.displayName} to ${roleApplied}`);
                    return;
                } else if (roleIndex !== '' && roleIndex !== currentRoles.indexOf(newRole)) {
                    currentRoles[roleIndex] = newRole;
                    msg.member.roles
                        .set(currentRoles)
                        .then((addRole) => {
                            msg.react(serverInfo.emoji.roleApplied);
                            adminLog(`Changed Progression Role for ${msg.member.displayName} to ${roleApplied}`);
                            return;
                        })
                        .catch((error) => {
                            msg.react(serverInfo.emoji.hourglass);
                            adminLog(error);
                        });
                }
            } else if (roleString.includes('eureka pings')) {
                if (currentRoles.includes(serverInfo.roles.trigger.relicGrind)) {
                    msg.member.roles.remove(serverInfo.roles.trigger.relicGrind);
                    msg.react(serverInfo.emoji.roleRemoved);
                    adminLog(`Removed the Eureka Pingable role from ${msg.member.displayName}`);
                    return;
                } else {
                    msg.member.roles.add(serverInfo.roles.trigger.relicGrind);
                    msg.react(serverInfo.emoji.roleApplied);
                    adminLog(`Added the Eureka Pingable role to ${msg.member.displayName}`);
                    return;
                }
            } else if (roleString.includes('bozja pings')) {
                if (currentRoles.includes(serverInfo.roles.trigger.bozjaPings)) {
                    msg.member.roles.remove(serverInfo.roles.trigger.bozjaPings);
                    msg.react(serverInfo.emoji.roleRemoved);
                    adminLog(`Removed the Bozja Pingable role from ${msg.member.displayName}`);
                    return;
                } else {
                    msg.member.roles.add(serverInfo.roles.trigger.bozjaPings);
                    msg.react(serverInfo.emoji.roleApplied);
                    adminLog(`Added the Bozja Pingable role to ${msg.member.displayName}`);
                    return;
                }
            }
        }
    }
});

//Reaction Handling
const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async (event) => {
    if (!events.hasOwnProperty(event.t)) return;
    const { d: data } = event;
    if (data.user_id === client.user.id) return;
    if (data.channel_id === serverInfo.channels.partyLeader) {
        const user = client.users.cache.get(data.user_id);
        const channel = client.channels.cache.get(data.channel_id);
        channel.messages.fetch(data.message_id).then((message) => {
            const member = message.guild.members.cache.get(user.id);
            const emoji = message.guild.emojis.cache.get(data.emoji);
            let reaction = new Discord.MessageReaction(client, data, message);
            let reactionCount = '';
            let embedContent = message.embeds[0].description;
            let runID = embedContent.split('Run ID: ').pop();
            runID = runID.substring(0, runID.length - 1);

            message.channel.messages.fetch(message.id).then((msg) => {
                let selectedReaction = msg.reactions.cache.filter((rx) => rx.emoji.name == data.emoji.name);
                reactionCount = selectedReaction.first().count;

                let partyNumber = 0;
                if (data.emoji.name == '1⃣') {
                    partyNumber = 'PL1';
                } else if (data.emoji.name == '2⃣') {
                    partyNumber = 'PL2';
                } else if (data.emoji.name == '3⃣') {
                    partyNumber = 'PL3';
                } else if (data.emoji.name == '4⃣') {
                    partyNumber = 'PL4';
                } else if (data.emoji.name == '5⃣') {
                    partyNumber = 'PL5';
                } else if (data.emoji.name == '6⃣') {
                    partyNumber = 'PL6';
                } else if (data.emoji.name == 'bunny') {
                    partyNumber = 'PLS';
                }

                if (partyNumber !== 0) {
                    if (event.t === 'MESSAGE_REACTION_ADD') {
                        if (reactionCount == 2) {
                            pool.query('UPDATE `Runs` SET `' + partyNumber + "` = '" + member.id + "' WHERE `ID` = ?", runID)
                                .then((row) => {
                                    pool.query('SELECT * FROM `Runs` WHERE `ID` = ?', [runID])
                                        .then((run) => {
                                            let embedPartyLeader = buildPartyLeaderEmbed(run);
                                            reaction.message.edit(embedPartyLeader);
                                        })
                                        .catch((error) => console.log(error));
                                })
                                .catch((error) => console.log(error));
                        } else if (reactionCount > 2) {
                            reaction.users.remove(member.id);
                        }
                    }
                    if (event.t === 'MESSAGE_REACTION_REMOVE') {
                        pool.query('SELECT `' + partyNumber + '` AS `partyLeaderID` FROM `Runs` WHERE `ID` = ?', [runID])
                            .then((row) => {
                                if (user.id === row[0].partyLeaderID) {
                                    pool.query('UPDATE `Runs` SET `' + partyNumber + '` = ? WHERE `ID` = ?', ['-', runID])
                                        .then((update) => {
                                            pool.query('SELECT * FROM `Runs` WHERE `ID` = ?', [runID])
                                                .then((run) => {
                                                    let embedPartyLeader = buildPartyLeaderEmbed(run);
                                                    reaction.message.edit(embedPartyLeader);
                                                })
                                                .catch((error) => console.log(error));
                                        })
                                        .catch((error) => console.log(error));
                                }
                            })
                            .catch((error) => console.log(error));
                    }
                }
            });
        });
    }
});

//Proto-Ozma
client.login('TOKEN GOES HERE');
