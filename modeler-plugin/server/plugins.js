const { exec, fork } = require('child_process');
const fs = require('fs');
const fsPromises = require('fs/promises');
const pluginDir = __dirname + '/plugins';
const yarnCmd = __dirname + '/../node_modules/yarn/bin/yarn.js';
const fetch = require('node-fetch');

async function forkYarn(command) {
    return new Promise((resolve, reject) => {
        const child = fork(yarnCmd,
            ['--no-progress', '--json', ...command],
            { cwd: pluginDir, silent: true });

        let messages = [];
        child.stdout.on('data', stdoutData => {
            let data = stdoutData.toString('utf8').trim();
            const outputEntries = data.split('\n').map(output => JSON.parse(output));
            messages.push(...outputEntries);
        })

        child.on('exit', () => {
            console.log(messages);
            resolve(messages);
        })

        child.on('error', (err) => {
            reject(err);
        });
    });
}

async function readPackageJson(folder) {
    return new Promise((resolve, reject) => {
        fs.readFile(`${folder}/package.json`, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    }).then(JSON.parse)
}

async function listPlugins() {
    let packageJsonPromises = await readPackageJson(pluginDir)
        .then(data => {
            return Object.keys(data.dependencies)
                .map(dependency => {
                    return readPackageJson(`${pluginDir}/node_modules/${dependency}`)
                })
        });

    return Promise.allSettled(packageJsonPromises).then(results => {
        return results.map(promise => promise.value);
    });

}

async function getAvailablePlugins(from, limit) {
    const url = `https://api.npms.io/v2/search?q=keywords:camunda&size=${limit}&from=${from}`;
    const res = await fetch(url);

    if (res.status == 200) {
        return (await res.json()).results.filter(
            entry => entry.package.keywords.includes('plugin') && entry.package.keywords.includes('modeler')
        ).map(entry => entry.package);
    } else {
        throw new Error("Could not load plugins");
    }
}

// later on: introduce streams / observables
async function addPlugin(packageName) {
    const result = await forkYarn(['add', packageName]);

    const target = pluginDir + '/node_modules/' + packageName;
    // TODO: change this to a dynamnic property 
    const linkName = '/Users/sdegroot/Library/Application Support/camunda-modeler/plugins/' + packageName;

    await fsPromises.unlink(linkName);
    await fsPromises.symlink(target, linkName, 'dir')
    return result;
}

async function removePlugin(packageName) {
    return forkYarn(['remove', packageName]);
}


module.exports = {
    addPlugin, removePlugin, listPlugins
}

// addPlugin('ws').then(console.log);

getAvailablePlugins(0, 100).then(console.log);