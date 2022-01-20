export default class OvhManagerPciProvider {
  constructor() {
    this.shellClient = null;
  }

  setShellClient(shellClient) {
    this.shellClient = shellClient;
  }

  getShellClient() {
    return this.shellClient;
  }

  $get() {
    return {
      getShellClient: this.getShellClient.bind(this),
    };
  }
}
