const option = {
    steam: true,
    steamio: false,
    timeout: 60000
};

function setSteam()
{
    Object.keys(option).forEach(k => Reflect.set(option, k, false));
    option.steam = true;
}

function setSteamIO()
{
    Object.keys(option).forEach(k => Reflect.set(option, k, false));
    option.steamio = true;
}

module.exports = {
    setSteam, setSteamIO, option
};
