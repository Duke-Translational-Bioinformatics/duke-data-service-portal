import React from 'react';
import { observable, action, map } from 'mobx';
import mainStore from './mainStore';
// import { computed, extendObservable } from 'mobx';
// import cookie from 'react-cookie';
// import authStore from '../stores/authStore';
// import transportLayer from '../transportLayer';
// import BaseUtils from '../util/baseUtils.js';
// import { StatusEnum, ChunkSize } from '../enum';
// import { Kind, Path } from '../util/urlEnum';
// import { checkStatus, checkStatusAndConsistency } from '../util/fetchUtil';

export class DashboardStore {  
  @observable drawer

  constructor() {
      this.drawer = observable.map();
  }

  @action toggleCollapseTree(router) {
      if (this.drawer.get('collapsed')) {
          mainStore.downloadedItems.forEach((item) => {
              item.open = true
          })
          this.drawer.set('collapsed', false);
      } else {
          mainStore.listItems = mainStore.projects
          mainStore.selectedItem = ''
          mainStore.downloadedItems.forEach((item) => {
              item.open = false
          })
          router.push({pathname: ("/dashboard")})
          this.drawer.set('collapsed', true);
      }
  }

  @action toggleDrawer() {
      let drawerPosition = !this.drawer.get('open')
      let contentStyle = { transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
      drawerPosition ? contentStyle.marginLeft = this.drawer.get('width') : null
      this.drawer.set('open', drawerPosition)
      this.drawer.set('contentStyle', contentStyle)
  }
  
  @action setDrawer() {
      let width = 350;
      let contentStyle = { transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
      contentStyle.marginLeft = width;
      this.drawer.set('open', true);
      this.drawer.set('width', width);
      this.drawer.set('contentStyle', contentStyle);
  }
}

const dashboardStore = new DashboardStore();

export default dashboardStore;