const option = {
    toggle: {
        steam: true,
        steamio: false,
    },
    timeout: 60000
};

function setSteam()
{
    Object.keys(option.toggle).forEach(k => Reflect.set(option.toggle, k, false));
    option.toggle.steam = true;
}

function setSteamIO()
{
    Object.keys(option.toggle).forEach(k => Reflect.set(option.toggle, k, false));
    option.toggle.steamio = true;
}

module.exports = {
    setSteam, setSteamIO, option
};
