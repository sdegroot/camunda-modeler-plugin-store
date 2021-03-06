# Camunda Modeler Plugin store

[![Compatible with Camunda Modeler version 2.2](https://img.shields.io/badge/Camunda%20Modeler-2.2+-blue.svg)](https://github.com/camunda/camunda-modeler)

This Camunda Modeler plugin provides a way to manage your plugins in your Camunda Modeler.
Note that this plug-in is not in any way affiliated with Camunda GmbH.

## Features

- 🚧 Listing and searching through all registered Camunda Modeler plugins
- 🚧 Version compatibility checks
- 🚧 (automatic) Upgrades (alerting + upgrading)
- 🚧 Plugin profiles - share a company profile so everyone installs the same plugins
- Future: upgrading the modeler itself

## Listing your plugin

Not available yet.

# Development

## Development Setup

```sh
yarn install
```

To make the Camunda Modeler aware of your plug-in you must link the plug-in to the [Camunda Modeler plug-in directory](https://github.com/camunda/camunda-modeler/tree/develop/docs/plugins#plugging-into-the-camunda-modeler) via a symbolic link.
Available utilities to do that are [`mklink /d`](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/mklink) on Windows and [`ln -s`](https://linux.die.net/man/1/ln) on MacOS / Linux.

Re-start the app in order to recognize the newly linked plug-in.

## Building the Plug-in

You may spawn the development setup to watch source files and re-build the client plug-in on changes:

```sh
yarn dev
```

Given you've setup and linked your plug-in [as explained above](#development-setup), you should be able to reload the modeler to pick up plug-in changes. To do so, open the app's built in development toos via `F12`. Then, within the development tools press the reload shortcuts `CTRL + R` or `CMD + R` to reload the app.

To prepare the plug-in for release, executing all necessary steps, run:

```sh
yarn all
```

## Debugging the Electron App

Simply start the Camunda Modeler with the `--inspect` flag and then follow this guide: https://nodejs.org/en/docs/guides/debugging-getting-started/.

### Mac

```
/Applications/Camunda\ Modeler.app/Contents/MacOS/Camunda\ Modeler --inspect
```
