import React from 'react';
import { observable, action, map } from 'mobx';
import mainStore from './mainStore';
import transportLayer from '../transportLayer';
import { Kind, Path } from '../util/urlEnum';
import { checkStatusAndConsistency } from '../util/fetchUtil';

export class NavigatorStore {
    @observable downloadedItems
    @observable drawer
    @observable listItems
    @observable selectedItem

    constructor() {
        this.downloadedItems = observable.map();
        this.drawer = observable.map({'open': true, 'width': 350});
        this.listItems = [];
        this.selectedItem = null;
        this.transportLayer = transportLayer;
    }

    pathFinder(kind) {
        let path
        switch (kind) {
        case Kind.DDS_PROJECT:
            path = Path.PROJECT;
            break;
        case Kind.DDS_FOLDER:
            path = Path.FOLDER;
            break;
        }
        return (path)
    }

    @action clearListItems() {
        navigatorStore.listItems = [];
    }

    @action getChildren(id, path, page) {
        if(this.listItems.length && page === null) this.listItems = [];
        this.loading = true;
        if (page == null) page = 1;
        this.transportLayer.getChildren(id, path, page)
            .then(this.checkResponse)
            .then((response) => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            })
            .then((json) => {
                let results = json[0].results;
                let headers = json[1].map;
                navigatorStore.addDownloadedItemChildren(results, id);
                this.responseHeaders = headers;
                this.nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
                this.totalItems = headers !== null && !!headers['x-total'] ? parseInt(headers['x-total'][0], 10) : null;
                this.loading = false;
            }).catch(ex =>this.handleErrors(ex))
    }

    @action moveDownloadedItem(id, newParentId) {
        let item = this.downloadedItems.get(id);
        if (item && item.parent && item.parent.id) {
            let oldParentId = item.parent.id;
            this.addDownloadedItem(item, newParentId);
            this.removeDownloadedItem(id, oldParentId);
            this.selectItem(newParentId, false, false, true);
        }
    }

    @action removeDownloadedItem(id, parentId) {
        this.listItems = this.listItems.filter(l => l.id !== id);
        if (parentId) {
            let parent = this.downloadedItems.get(parentId);
            let ci = parent.childrenIds.indexOf(id);
            if(ci > -1) parent.childrenIds.splice(ci, 1);
            let fi = parent.folderIds.indexOf(id);
            if(fi > -1) parent.folderIds.splice(fi, 1);
            this.downloadedItems.delete(parentId);
            this.downloadedItems.set(parentId, parent);
        }
        let recursiveDelete = (itemId) => {
            let item = this.downloadedItems.get(itemId);
            if (item) {
                if (item.childrenIds && item.childrenIds.length > 0) {
                    item.childrenIds.forEach((childId) => {
                        recursiveDelete(childId);
                    })
                }
                this.downloadedItems.delete(itemId);
            }
        }
        recursiveDelete(id);
    }

    @action addDownloadedItem(item, parentId) {
        let parent = this.downloadedItems.get(parentId);
        if (parent) {
            parent.open = true;
            if(parent.childrenIds) parent.childrenIds = [item.id, ...parent.childrenIds];
            if(parent.folderIds) parent.folderIds = [item.id, ...parent.folderIds];
            this.downloadedItems.set(parentId, parent);
            item.parentId = parentId;
            if(this.selectedItem && this.selectedItem.id === parentId) {
                this.listItems = [item, ...this.listItems];
            }
        }
        item.downloaded = true;
        this.downloadedItems.set(item.id, item);
    }
    
    @action updateDownloadedItem(item) {
        let downloadedItem = this.downloadedItems.get(item.id) || {};
        this.downloadedItems.set(item.id, {...downloadedItem, ...item});
        let updatedListItems = this.listItems.map((li) => {
            return item.id === li.id ? {...li, ...item} : li;
        })
        this.listItems = updatedListItems;
    }

    @action addDownloadedItemChildren(children, parentId) {
        let parent = this.downloadedItems.get(parentId) || {id: parentId};
        parent.open = true;
        parent.childrenDownloaded = true;
        parent.childrenIds = [];
        parent.folderIds = [];
        children.forEach((child) => {
            let childOld = this.downloadedItems.get(child.id) || {};
            parent.childrenIds.push(child.id);
            child.kind === Kind.DDS_FOLDER && parent.folderIds.push(child.id);
            child.downloaded = true;
            this.downloadedItems.set(child.id, {...childOld, ...child});
        });
        this.listItems = children;
        this.downloadedItems.set(parentId, parent);
    }

    @action addDownloadedItemAncestors(json) {
      if (json.ancestors && json.ancestors.length > 0) {
          json.ancestors.forEach((ancestor, index) => {
              let {id, kind} = ancestor
              let child = json.ancestors[index + 1] || json;
              let ancestorOld = this.downloadedItems.get(ancestor.id) || {};
              ancestor.childrenIds = [child.id];
              ancestor.folderIds = [child.id];
              ancestor.project = json.project;
              ancestor.ancestors = json.ancestors.slice(0, index);
              ancestor.open = true;
              ancestor.childrenDownloaded = false;
              ancestor.downloaded = false;
              this.downloadedItems.set(ancestor.id, {...ancestor, ...ancestorOld})
              if(!ancestorOld.downloaded) {
                  this.getItem(id, this.pathFinder(kind))
              }
          })
      }
    }

    @action toggleDrawer() {
        this.drawer.set('open', !this.drawer.get('open'));
    }

    @action closeDrawer() {
        this.drawer.set('open', false);
    }

    @action openDrawer() {
        this.drawer.set('open', true);
    }

    @action toggleTreeListItem(item) {
        item.open = !item.open;
        this.downloadedItems.set(item.id, item);
    }

    @action getItem(id, path, isSelected) {
        const that = navigatorStore;
        mainStore.loading = true;
        this.transportLayer.getEntity(id, path)
            .then(checkStatusAndConsistency)
            .then(response => response.json())
            .then((json) => {
                if(!json.error) {
                    let item = this.downloadedItems.get(id) || {};
                    json.downloaded = true;
                    this.downloadedItems.set(id, {...item, ...json})
                    if(isSelected) {
                        this.selectedItem = json;
                        mainStore.project = json.kind === Kind.DDS_PROJECT ? json : json.project;
                        this.addDownloadedItemAncestors(json);
                    }
                    mainStore.loading = false;
                } else {
                    const retryArgs = [id, path, isSelected];
                    const msg = "The item you're requesting is unavailable...";
                    json.code === 'resource_not_consistent' ? mainStore.tryAsyncAgain(that.getItem, retryArgs, id, msg, false) : mainStore.handleErrors(json);
                }
            }).catch(ex => mainStore.handleErrors(ex))
    }

    @action setSelectedItem(id, path) {
        if (id && path) {
            if (this.downloadedItems.has(id)) {
                this.selectedItem = this.downloadedItems.get(id);
                mainStore.project = this.selectedItem.kind === Kind.DDS_PROJECT ? this.selectedItem : this.selectedItem.project;
            } else {
                this.getItem(id, path, true);
            }
        } else {
            this.selectedItem = null;
        }
    }

    @action setEntityObject(item) {
        if(item.kind !== Kind.DDS_PROJECT) mainStore.entityObj = item;
    }
    
    @action setProjPermissions(currentProject) {
        let projPermissionsCoversion = {
            'Project Admin': 'prjCrud',
            'System Admin': 'prjCrud',
            'Project Viewer': 'viewOnly',
            'File Editor': 'flCrud',
            'File Uploader': 'flUpload',
            'File Downloader': 'flDownload'
        }
        mainStore.projPermissions = projPermissionsCoversion[mainStore.projectRoles.get(currentProject.id)]
    }

    @action selectItem(itemId, router, toggle, updateSelectedItem) {
        mainStore.filesChecked = [];
        mainStore.foldersChecked = [];
        mainStore.allItemsSelected = false;
        let item = this.downloadedItems.get(itemId);
        if (item) {
            toggle ? item.open = !item.open : null;
            if (updateSelectedItem || router && router.params && router.params.id !== item.id) {
                item.open = true;
                this.selectedItem = item;
                let childrenIds = item.childrenIds;
                if (!childrenIds || !item.downloaded) {
                    this.getChildren(item.id, this.pathFinder(item.kind));
                } else {
                    navigatorStore.listItems = childrenIds.map(id => this.downloadedItems.get(id));
                }
                this.downloadedItems.set(itemId, item)
                let currentProject
                if (item.kind === Kind.DDS_PROJECT) {
                    currentProject = item;
                } else {
                    currentProject = this.downloadedItems.get(item.project.id);
                    mainStore.entityObj = item;
                }
                mainStore.project = currentProject;
                this.setProjPermissions(currentProject);
                this.setEntityObject(item);
                if(router) router.push({pathname: ('/navigator/' + this.pathFinder(item.kind) + item.id)});
            }
        }
    }
  }

const navigatorStore = new NavigatorStore();

export default navigatorStore;