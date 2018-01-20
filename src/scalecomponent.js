
class ScaleCtrl {
  constructor() {
    this.scale = 'scale goes here';
  }
}

export default class ScaleComponent {
  constructor() {
    this.controller = new ScaleCtrl();
  }
  component() {
    return () => {
      return {
        template: `<span>{{app.scale}}</span>`,
        controller: 'ScaleCtrl',
        controllerAs: 'app'
      };
    }
  }
  ctrl() {
    return ScaleCtrl;
  }
}
