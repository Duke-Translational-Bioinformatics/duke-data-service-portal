import React from 'react';
import { observable, action, map } from 'mobx';
import mainStore from './mainStore';
import transportLayer from '../transportLayer';
import { Path } from '../util/urlEnum';
import { checkStatusAndConsistency } from '../util/fetchUtil';

export class DashboardStore {
    @observable ancestorStatus
    @observable downloadedItems
    @observable drawer
    @observable router
    @observable selectedItem

    constructor() {
        this.ancestorStatus = observable.map();
        this.downloadedItems = observable.map();
        this.drawer = observable.map({'toggleLable': 'Home'});
        this.router = null;
        this.selectedItem = null;
        this.transportLayer = transportLayer
    }
    
    pathFinder(kind) {
        let kinds = {
            'dds-project': Path.PROJECT,
            'dds-folder': Path.FOLDER
        }
        return (kinds[kind])
    }
    
    @action setRouter(router) {
        this.router = router
    }
    
    @action moveDownloadedItem(id, newParentId) {
        let item = this.downloadedItems.get(id)
        if (item && item.parentId) {
            this.removeDownloadedItem(id, item.parentId)
            this.addDownloadedItem(item, newParentId)
            this.selectItem(newParentId)
        }
    }

    @action removeDownloadedItem(id, parentId) {
        if (parentId) {
            let parent = this.downloadedItems.get(parentId)
            let ci = parent.childrenIds.indexOf(id)
            if(ci > -1) parent.childrenIds.splice(ci, 1)
            let fi = parent.folderIds.indexOf(id)
            if(fi > -1) parent.folderIds.splice(fi, 1)
            this.downloadedItems.delete(parentId)
            this.downloadedItems.set(parentId, parent)
        }

        let recursiveDelete = (itemId) => {
            let item = this.downloadedItems.get(itemId)
            if (item) {
                if (item.childrenIds && item.childrenIds.length > 0) {
                    item.childrenIds.map((childId) => {
                        recursiveDelete(childId)
                    })
                }
                this.downloadedItems.delete(itemId)
            }
        }
        recursiveDelete(id)
    }

    @action addDownloadedItem(item, parentId) {
        let parent = this.downloadedItems.get(parentId)
        parent.open = true
        if(parent.childrenIds) parent.childrenIds = [item.id, ...parent.childrenIds]
        if(parent.folderIds) parent.folderIds = [item.id, ...parent.folderIds]
        this.downloadedItems.delete(parentId)
        this.downloadedItems.set(parentId, parent)
        item.parentId = parentId
        item.reload = true
        this.downloadedItems.set(item.id, item)
    }

    @action setDownloadedItems(projects) {
        let projectIds = []
        projects.forEach((project) => {
            this.downloadedItems.set(project.id, project)
            projectIds.push(project.id)
        })
        mainStore.listItems = projects
        this.downloadedItems.set('projectIds', projectIds);
    }

    @action updateAncestorStatus(ancestors) {
        let ancestorsDownloaded = 0
        ancestors.forEach((ancestor) => {
            if(this.downloadedItems.has(ancestor.id)) ancestorsDownloaded++
        })
        if (ancestorsDownloaded === 1) {
            this.ancestorStatus.set('download', true)
        } else if (ancestorsDownloaded === ancestors.length) {
            this.ancestorStatus.set('downloadChildren', true)
        }
    }
    
    @action getAncestors(ancestors) {
        ancestors.forEach((ancestor) => {
            let {id, kind} = ancestor
            if(!this.downloadedItems.has(id) && kind !== 'dds-project') {
                this.getItem(id, this.pathFinder(kind))
            }
        })
        this.ancestorStatus.set('download', false)
    }
    
    @action getAncestorsChildren(ancestors) {
        ancestors.forEach((a) => {
            let {id, kind} = a
            let ancestor = this.downloadedItems.get(id)
            if(ancestor && !ancestor.childrenIds) {
                this.getTreeListChildren(ancestor)
            }
        })
        this.ancestorStatus.set('downloadComplete', true)
        this.ancestorStatus.set('downloadChildren', false)
    }

    @action getTreeListChildren(parent) {
        mainStore.loading = true;
        let parentId = parent.id
        let path = this.pathFinder(parent.kind)
        let page = 1
        this.transportLayer.getChildren(parentId, path, page)
            .then(this.checkResponse)
            .then((response) => {
                const results = response.json();
                const headers = response.headers;
                return Promise.all([results, headers]);
            })
            .then((json) => {
                let results = json[0].results;
                let headers = json[1].map;
                let childrenIds = []
                let folderIds = []
                let parentsChildren = results.map((child) => {
                    childrenIds.push(child.id)
                    if (child.kind === 'dds-folder') {
                        folderIds.push(child.id)
                        child.open = true
                    }
                    child.parentId = parentId
                    if(!this.downloadedItems.has(child.id)) this.downloadedItems.set(child.id, child)
                    return ( child );
                });
                let downloadedParent = this.downloadedItems.get(parentId)
                if (downloadedParent) {
                    downloadedParent.open = true
                    downloadedParent.childrenIds = childrenIds
                    downloadedParent.folderIds = folderIds
                    this.downloadedItems.delete(parentId)
                    this.downloadedItems.set(parentId, downloadedParent)
                }
                mainStore.listItems = parentsChildren
                this.responseHeaders = headers;
                mainStore.loading = false;
            }).catch(ex =>this.handleErrors(ex))
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
    
    @action toggleCollapseTree(router) {
        if (this.drawer.get('collapsed')) {
            this.downloadedItems.forEach((item) => {
                item.open = true
            })
            this.drawer.set('collapsed', false);
            this.drawer.set('toggleLable', 'Home');
        } else {
            mainStore.listItems = mainStore.projects
            this.selectedItem = null
            this.downloadedItems.forEach((item) => {
                item.open = false
            })
            router.push({pathname: ("/dashboard")})
            this.drawer.set('collapsed', true);
            this.drawer.set('toggleLable', 'Expand');
        }
    }
    
    @action toggleTreeListItem(id) {
        this.selectedItem = id;
        let item = this.downloadedItems.get(id)
        item.open = !item.open
        this.downloadedItems.delete(id)
        this.downloadedItems.set(id, item)
    }

    @action getItem(id, path, isSelected) {
        mainStore.loading = true;
        this.transportLayer.getEntity(id, path)
            .then(checkStatusAndConsistency)
            .then(response => response.json())
            .then((json) => {
                if(!json.error) {
                    let item = this.downloadedItems.get(id)
                    if(item) {
                        json.open = true
                        json.childrenIds = item.childrenIds
                        json.folderIds = item.folderIds
                        this.downloadedItems.delete(id)
                    }
                    this.downloadedItems.set(id, json)
                    if(isSelected) this.selectedItem = id
                    mainStore.loading = false;
                } else {
                    json.code === 'resource_not_consistent' ? mainStore.tryAsyncAgain(getItem, [id, path, isSelected]) : mainStore.handleErrors(json);
                }
            }).catch(ex => mainStore.handleErrors(ex))
    }

    @action setSelectedItem() {
        let {id, path} = this.router.params
        if (id && path) {
            if (this.downloadedItems.has(id)) {
                this.selectedItem = id
            } else {
                this.getItem(id, `${path}/`, true)
            }
        }
    }

    @action selectItem(itemId) {
        this.drawer.set('toggleLable', 'Home');
        mainStore.filesChecked = []
        mainStore.foldersChecked = []
        mainStore.allItemsSelected = false
        let item = this.downloadedItems.get(itemId);
        if (item) {
            let childrenIds = item.childrenIds
            this.selectedItem = item.id;
            if (!childrenIds) {
                this.getTreeListChildren(item)
                item.reload = false
            } else if (childrenIds.length > 0){
                let newListItems = childrenIds.map((id) => {return(this.downloadedItems.get(id))})
                mainStore.listItems = newListItems
                item.open = true
            } else {
                mainStore.listItems = []
            }
            this.downloadedItems.delete(itemId)
            this.downloadedItems.set(itemId, item)

            if (item.kind === 'dds-project') {
                mainStore.project = item
            } else {
                mainStore.project = this.downloadedItems.get(item.project.id)
                mainStore.entityObj = item
            }
            let projPermissionsCoversion = {
                'Project Admin': 'prjCrud',
                'System Admin': 'prjCrud',
                'Project Viewer': 'viewOnly',
                'File Editor': 'flCrud',
                'File Uploader': 'flUpload',
                'File Downloader': 'flDownload'
            }
            mainStore.projPermissions = projPermissionsCoversion[mainStore.projectRoles.get(mainStore.project.id)]

            if (this.router) {
                this.router.push({pathname: ('/dashboard/' + this.pathFinder(item.kind) + item.id)})
            }
        }
    }
  }

const dashboardStore = new DashboardStore();

export default dashboardStore;