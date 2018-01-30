import Utils from './utils';

class ScaleCtrl {
  constructor() {
    this.scale = Utils.getColorScale();
    this.range = Utils.getSpeedRange();
  }
}

export default class ScaleComponent {
  constructor() {
    this.controller = new ScaleCtrl();
  }
  component() {
    return () => {
      return {
        template: `
          <div>
            <span>{{ctrl.range.min}} </span>
            <span ng-repeat="color in ctrl.scale"><div ng-style="{backgroundColor: color, height: '10px', width: '10px', display: 'inline-block'}"/></div></span>
            <span>{{ctrl.range.max}} </span>
          </div>
        `,
        controller: 'ScaleCtrl',
        controllerAs: 'ctrl'
      };
    }
  }
  ctrl() {
    return ScaleCtrl;
  }
}
