/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "camunda-modeler-plugin-helpers/react";
import { Modal } from "camunda-modeler-plugin-helpers/components";

import { listPlugins, removePlugin } from "../client";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

function PluginEntries({ plugins, uninstall }) {

  if (plugins && plugins.plugins) {
    return <>
      {plugins.plugins.map((plugin, index) => {
        return (
          <tr>
            <td>
              <a href={plugin.homepage}>{plugin.name}@{plugin.version}</a>
            </td>
            <td>Installed</td>
            <td>
              <button onClick={() => uninstall(plugin.name)} class="btn btn-secondary">
                Uninstall
              </button>
            </td>
          </tr>
        );
      })}
    </>
  }

  return <></>;
}

// we can even use hooks to render into the application
export default function PluginStoreModal({ initValues, onClose }) {
  const [enabled, setEnabled] = useState(initValues.enabled);
  const [interval, setAutoSaveInterval] = useState(initValues.interval);

  const [searchValue, setSearchValue] = useState("");
  const [plugins, setPlugins] = useState({});

  useEffect(() => {
    listPlugins().then(setPlugins);
  }, [])


  const onSubmit = () => onClose({ enabled, interval });

  const uninstall = async (pluginName) => {
    await removePlugin(pluginName);
    await listPlugins().then(setPlugins);
  }

  return (
    <Modal onClose={onClose}>
      <Title>Plugin Store</Title>

      <Body>
        <div class="plugin-store-modal">
          <label>
            Search for plugins
            <input type="text" name="searchQuery" value={searchValue} />
          </label>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <PluginEntries plugins={plugins} uninstall={uninstall}></PluginEntries>
            </tbody>
          </table>
        </div>
      </Body>

      <Footer>
        <div>
          <button
            type="button"
            class="btn btn-secondary"
            onClick={() => onClose()}
          >
            Close
          </button>
        </div>
      </Footer>
    </Modal >
  );
}
