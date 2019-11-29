import { createInputHandler } from '../utils/FileManager';

export default class WebWorker {
  constructor() {
    this._messages = [];
    this._errors = [];
    this.addEventListener = this.addEventListener.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  addEventListener(event, handler) {
    switch (event) {
      case 'message':
        this._messages.push(handler);
        break;
      case 'error':
        this._errors.push(handler);
        break;
      default:
    }
  }

  postMessage([data]) {
    this._messages.forEach(async postMessage => {
      const inputHandler = createInputHandler(data => postMessage({ data }));
      await inputHandler({ data: [data] });
    });
  }

  terminate() {}
}
