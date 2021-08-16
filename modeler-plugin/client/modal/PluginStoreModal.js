/* eslint-disable no-unused-vars */
import React, { useState } from "camunda-modeler-plugin-helpers/react";
import { Modal } from "camunda-modeler-plugin-helpers/components";

// polyfill upcoming structural components
const Title = Modal.Title || (({ children }) => <h2>{children}</h2>);
const Body = Modal.Body || (({ children }) => <div>{children}</div>);
const Footer = Modal.Footer || (({ children }) => <div>{children}</div>);

// we can even use hooks to render into the application
export default function PluginStoreModal({ initValues, onClose }) {
  const [enabled, setEnabled] = useState(initValues.enabled);
  const [interval, setAutoSaveInterval] = useState(initValues.interval);

  const [searchValue, setSearchValue] = useState("");

  const onSubmit = () => onClose({ enabled, interval });

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
              <tr>
                <td>
                  <a href="www.google.com">Plugin Store</a>
                </td>
                <td>Installed</td>
                <td>
                  <button onClick={() => onClose()} class="btn btn-secondary">
                    Uninstall
                  </button>
                </td>
              </tr>
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
    </Modal>
  );
}
