const { exec, fork } = require('child_process');
const fs = require('fs');
const pluginDir = __dirname + '/plugins';
const yarnCmd = __dirname + '/../node_modules/yarn/bin/yarn.js';

async function forkYarn(command) {
    return new Promise((resolve, reject) => {
        const child = fork(yarnCmd, [`--no-progress`, `--cwd ${pluginDir}`, `--json`, ...command], { cwd: pluginDir, silent: true });

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

// later on: introduce streams / observables
async function addPlugin(packageName) {
    return forkYarn(['add', packageName]);
}

async function removePlugin(packageName) {
    return forkYarn(['remove', packageName]);
}


module.exports = {
    addPlugin, removePlugin, listPlugins
}

// addPlugin('ws').then(console.log);