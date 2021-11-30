/* eslint-disable no-unused-vars*/
import React, {
  Fragment,
  PureComponent,
} from "camunda-modeler-plugin-helpers/react";
import { Fill } from "camunda-modeler-plugin-helpers/components";

import PluginStoreModal from "./modal/PluginStoreModal";
import * as client from './client'

const defaultState = {
  enabled: false,
  interval: 5,
  configOpen: false,
};

export default class PluginStorePlugin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.handleConfigClosed = this.handleConfigClosed.bind(this);
  }

  componentDidMount() {
    /**
     * The component props include everything the Application offers plugins,
     * which includes:
     * - config: save and retrieve information to the local configuration
     * - subscribe: hook into application events, like <tab.saved>, <app.activeTabChanged> ...
     * - triggerAction: execute editor actions, like <save>, <open-diagram> ...
     * - log: log information into the Log panel
     * - displayNotification: show notifications inside the application
     */
    const { config, subscribe } = this.props;
    
    this.props.config.backend.on("plugin:store-plugin:open", (_, options) => {
      client.start(options);

      this.setState({
        configOpen: true,
      });
    });

    // retrieve plugin related information from the application configuration
    config
      .getForPlugin("pluginStore", "config")
      .then((config) => this.setState(config));
  }

  componentDidUpdate() {
    const { configOpen, enabled } = this.state;
  }

  save() {
    const { displayNotification, triggerAction } = this.props;

    // trigger a tab save operation
    // triggerAction("save").then((tab) => {
    //   if (!tab) {
    //     return displayNotification({ title: "Failed to save" });
    //   }
    // });
  }

  handleConfigClosed(newConfig) {
    this.setState({ configOpen: false });

    if (newConfig) {
      // via <config> it is also possible to save data into the application configuration
      this.props.config
        .setForPlugin("autoSave", "config", newConfig)
        .catch(console.error);

      this.setState(newConfig);
    }
  }

  render() {
    const { enabled, interval } = this.state;

    const initValues = {
      enabled,
      interval,
    };

    // we can use fills to hook React components into certain places of the UI
    return (
      <Fragment>
        {this.state.configOpen && (
          <PluginStoreModal
            onClose={this.handleConfigClosed}
            initValues={initValues}
          />
        )}
      </Fragment>
    );
  }
}
