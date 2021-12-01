const server = require('./server/server');

module.exports = function (electronApp, menuState) {
  return [
    {
      label: "Configure plug-ins",
      accelerator: "CommandOrControl+1",
      enabled: function () {
        return true;
      },
      action: function () {
        server.initServer(electronApp);
        electronApp.mainWindow.webContents.send("plugin:store-plugin:open", { port: 1337 });
      },
    },
  ];
};
