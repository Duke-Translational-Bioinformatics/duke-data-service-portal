import Reflux from 'reflux';
import ProjectActions from '../actions/projectActions';
import MainActions from '../actions/mainActions';
import MainStore from '../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { StatusEnum, Path } from '../enum';
import {graphOptions, graphColors} from '../graphConfig';


var ProjectStore = Reflux.createStore({

    init() {
        this.listenToMany(ProjectActions);
        this.activities = [];
        this.addEdgeMode = false;
        this.agents = [];
        this.agentKey = {};
        this.agentApiToken = {};
        this.autoCompleteLoading = false;
        this.audit = {};
        this.batchFiles = [];
        this.batchFolders = [];
        this.children = [];
        this.childrenLoading = false;
        this.currentUser = {};
        this.destination = null;
        this.destinationKind = null;
        this.device = {};
        this.dltRelationsBtn = false;
        this.entityObj = null;
        this.error = {};
        this.errorModals = [];
        this.failedUploads = [];
        this.filesChecked = [];
        this.fileHashes = [];
        this.foldersChecked = [];
        this.fileVersions = [];
        this.drawerLoading = false;
        this.itemsSelected = null;
        this.metaDataTemplate = null;
        this.metaTemplates = [];
        this.modal = false;
        this.moveModal = false;
        this.moveToObj = {};
        this.moveErrorModal = false;
        this.objectTags = [];
        this.openMetadataManager = false;
        this.openTagManager = false;
        this.openUploadManager = false;
        this.parent = {};
        this.position = null;
        this.projects = [];
        this.project = {};
        this.projPermissions = null;
        this.projectMembers = [];
        this.provEditorModal = {open: false, id: null};
        this.provFileVersions = [];
        this.provEdges = [];
        this.provNodes = [];
        this.relFrom = null;
        this.relTo = null;
        this.relMsg = null;
        this.removeFileFromProvBtn = false;
        this.scale = null;
        this.searchFilesList = [];
        this.selectedNode = {};
        this.selectedEdge = null;
        this.searchText = '';
        this.showPropertyCreator = false;
        this.showProvAlert = false;
        this.showProvCtrlBtns = false;
        this.showProvDetails = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = false;
        this.screenSize = {};
        this.showBatchOps = false;
        this.tagLabels = [];
        this.templateProperties = [];
        this.toggleModal = {open: false, id: null};
        this.toggleProv = false;
        this.toggleProvEdit = false;
        this.updatedGraphItem = [];
        this.uploadCount = [];
        this.uploads = {};
        this.users = [];
        this.userKey = {};
        this.versionModal = false;
    },

    getObjectMetadataSuccess(results) {
        this.objectMetadata = results;
        this.trigger({
            objectMetadata: this.objectMetadata
        })
    },

    createMetadataObject() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    createMetadataObjectSuccess() {
        this.drawerLoading = false;
        this.showBatchOps = false;
        this.showTemplateDetails = false;
        this.trigger({
            drawerLoading: this.drawerLoading,
            showBatchOps: this.showBatchOps,
            showTemplateDetails: this.showTemplateDetails
        })
    },

    showMetadataTemplateList() {
        this.showTemplateDetails = false;
        this.trigger({
            showTemplateDetails: this.showTemplateDetails
        })
    },

    deleteMetadataPropertySuccess(id) {
        this.templateProperties = BaseUtils.removeObjByKey(this.templateProperties, {key: 'id', value: id});
        this.trigger({
            templateProperties: this.templateProperties
        })
    },

    getMetadataTemplateProperties() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    getMetadataTemplatePropertiesSuccess(properties) {
        this.drawerLoading = false;
        this.templateProperties = properties;
        this.trigger({
            drawerLoading: this.drawerLoading,
            templateProperties: this.templateProperties
        })
    },

    createMetadataProperty() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    createMetadataPropertySuccess(property) {
        this.drawerLoading = false;
        this.templateProperties.push(property);
        this.trigger({
            drawerLoading: this.drawerLoading,
            templateProperties: this.templateProperties
        })
    },

    showMetaDataTemplateDetails() {
        this.showPropertyCreator = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = true;
        this.trigger({
            showPropertyCreator: this.showPropertyCreator,
            showTemplateCreator: this.showTemplateCreator,
            showTemplateDetails: this.showTemplateDetails
        })
    },

    showTemplatePropManager() {
        this.showPropertyCreator = true;
        this.showTemplateCreator = false;
        this.showTemplateDetails = false;
        this.trigger({
            showPropertyCreator: this.showPropertyCreator,
            showTemplateCreator: this.showTemplateCreator,
            showTemplateDetails: this.showTemplateDetails
        })
    },

    deleteTemplateSuccess() {
        ProjectActions.toggleMetadataManager();
        ProjectActions.loadMetadataTemplates();
    },

    updateMetadataTemplate() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    createMetadataTemplate() {
        this.drawerLoading = true;
        this.templateProperties = [];
        this.trigger({
            drawerLoading: this.drawerLoading,
            templateProperties: this.templateProperties
        })
    },

    createMetadataTemplateSuccess(template) {
        this.drawerLoading = false;
        this.metaTemplates.unshift(template);
        this.trigger({
            drawerLoading: this.drawerLoading,
            metaTemplates: this.metaTemplates
        })
    },

    toggleMetadataManager() {
        this.openMetadataManager = !this.openMetadataManager;
        this.showPropertyCreator = false;
        this.showTemplateCreator = false;
        this.showTemplateDetails = true;
        this.trigger({
            openMetadataManager: this.openMetadataManager,
            showPropertyCreator: this.showPropertyCreator,
            showTemplateCreator: this.showTemplateCreator,
            showTemplateDetails: this.showTemplateDetails
        })
    },

    getMetadataTemplateDetails() {
        this.drawerLoading = true;
        this.openMetadataManager = !this.openMetadataManager;
        this.trigger({
            drawerLoading: this.drawerLoading,
            openMetadataManager: this.openMetadataManager
        })
    },

    getMetadataTemplateDetailsSuccess(template) {
        this.drawerLoading = false;
        this.metaDataTemplate = template;
        this.showTemplateCreator = false;
        this.showTemplateDetails = true;
        this.trigger({
            drawerLoading: this.drawerLoading,
            metadataTemplate: this.metaDataTemplate,
            showTemplateCreator: this.showTemplateCreator,
            showTemplateDetails: this.showTemplateDetails
        })
    },

    loadMetadataTemplates() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    loadMetadataTemplatesSuccess(templates) {
        this.drawerLoading = false;
        this.metaTemplates = templates.sort(function(a, b) {
            a = new Date(a.audit.created_on);
            b = new Date(b.audit.created_on);
            return a>b ? -1 : a<b ? 1 : 0;
        });
        this.trigger({
            drawerLoading: this.drawerLoading,
            metaTemplates: this.metaTemplates
        })
    },

    saveGraphZoomState(scale, position) {
        this.scale = scale;
        this.position = position;
        this.trigger({
            scale: this.scale,
            position: this.position
        });
    },

    openProvEditorModal(id) {
        this.trigger({
            provEditorModal: {open: true, id: id}
        });
    },

    closeProvEditorModal(id) {
        this.trigger({
            provEditorModal: {open: false, id: id}
        });
    },

    switchRelationFromTo(from, to){
        this.openConfirmRel = true;
        this.relFrom = to;
        this.relTo = from;
        this.trigger({
            relFrom: this.relFrom,
            relTo: this.relTo,
            openConfirmRel: this.openConfirmRel
        });
    },

    confirmDerivedFromRel(from, to) {
        this.relFrom = from;
        this.relTo = to;
        this.trigger({
            relFrom: this.relFrom,
            relTo: this.relTo,
            provEditorModal: {open: true, id: 'confirmRel'}
        });
    },

    startAddRelation(kind, from, to) {
        ProjectActions.buildRelationBody(kind, from, to);
        this.trigger({
            provEditorModal: {open: false, id: 'confirmRel'}
        });
    },

    getFromAndToNodes(data, relationKind, nodes) {
        let from = null;
        let to = null;
        let node1 = null;
        let node2 = null;
        nodes.forEach((node) => {
            if (data.from === node.id) {
                node1 = node;
            }
            if (data.to === node.id) {
                node2 = node;
            }
        });
        if (!node1.properties.hasOwnProperty('kind') || !node2.properties.hasOwnProperty('kind')) {
            this.trigger({
                provEditorModal: {open: true, id: 'relWarning'},
                relMsg: 'invalidRelMsg'
            });
        }
        if (relationKind !== 'was_derived_from') {
            if (node1.properties.kind === 'dds-activity' && node1.properties.audit.created_by.id !== MainStore.currentUser.id) {
                this.trigger({
                    provEditorModal: {open: true, id: 'relWarning'},
                    relMsg: 'permissionError'
                });
            } else if (node2.properties.kind === 'dds-activity' && node2.properties.audit.created_by.id !== MainStore.currentUser.id){
                this.trigger({
                    provEditorModal: {open: true, id: 'relWarning'},
                    relMsg: 'permissionError'
                });
            } else {
                if (node1.properties.kind === 'dds-file-version' && node2.properties.kind === 'dds-file-version') {
                    this.trigger({
                        provEditorModal: {open: true, id: 'relWarning'},
                        relMsg: 'wasDerivedFrom'
                    });
                }
                if (node1.properties.kind === 'dds-activity' && node2.properties.kind === 'dds-activity') {
                    this.trigger({
                        provEditorModal: {open: true, id: 'relWarning'},
                        relMsg: 'actToActMsg'
                    });
                }
                if (node1.properties.kind !== node2.properties.kind) {
                    if (relationKind === 'used') {
                        from = node1.properties.kind === 'dds-activity' ? node1 : node2;
                        to = node1.properties.kind === 'dds-activity' ? node2 : node1;
                    }
                    if (relationKind === 'was_generated_by') {
                        from = node1.properties.kind === 'dds-activity' ? node2 : node1;
                        to = node1.properties.kind === 'dds-activity' ? node1 : node2;
                    }
                    if (node1.properties.hasOwnProperty('kind') && node2.properties.hasOwnProperty('kind')){
                        ProjectActions.startAddRelation(relationKind, from, to);
                    }
                }
            }
        } else {
            if (node1.properties.kind === 'dds-activity' || node2.properties.kind === 'dds-activity') {
                // Send error modal to user explaining rules of was_derived_from relations
                this.trigger({
                    provEditorModal: {open: true, id: 'relWarning'},
                    relMsg: 'notFileToFile'
                });
            } else {
                from = node1;
                to = node2;
                ProjectStore.confirmDerivedFromRel(from, to);
            }
        }
    },

    buildRelationBody(kind, from, to) {
        let body = {};
        if (kind === 'used') {
            body = {
                'activity': {
                    'id': from.id
                },
                'entity': {
                    'kind': 'dds-file-version',
                    'id': to.id
                }
            };
        }
        if (kind === 'was_generated_by') {
            body = {
                'entity': {
                    'kind': 'dds-file-version',
                    'id': from.id
                },
                'activity': {
                    'id': to.id
                }
            };
        }
        if (kind === 'was_derived_from') {
            body = {
                'generated_entity': {
                    'kind': 'dds-file-version',
                    'id': from.id
                },
                'used_entity': {
                    'kind': 'dds-file-version',
                    'id': to.id
                }
            };
        }
        ProjectActions.addProvRelation(kind, body);
    },

    addProvRelationSuccess(data) { //Update dataset with new relation
        let rel = [];
        rel.push(data);
        this.updatedGraphItem = rel.map((edge) => {//Update dataset in client
            let color = edge.kind === 'dds-used_prov_relation' ? graphColors.edges.used : graphColors.edges.generated;
            return {
                id: edge.id,
                from: edge.from.id,
                to: edge.to.id,
                type: edge.kind,
                color: color,
                arrows: 'to',
                properties: {
                    audit: edge.audit
                },
                title: '<div style="color: #616161"><span>'
                + edge.kind + '</span></div>'
            };
        });
        let edges = this.provEdges;
        edges.push(this.updatedGraphItem[0]);
        this.trigger({
            updatedGraphItem: this.updatedGraphItem,
            provEdges: edges
        })
    },

    addFileToGraph(node) {
        let n = [];
        n.push(node);
        this.updatedGraphItem = n.map((node) => {//Update dataset in client
            if(node.current_version) {
                node.kind = 'dds-file-version';
                let label = node.current_version.label !== null ? node.current_version.label : "";
                return {
                    id: node.current_version.id,
                    label: node.name + '\nVersion: ' + node.current_version.version,
                    labels: node.current_version.label,
                    properties: node,
                    color: graphColors.fileVersion,
                    title: '<div style="margin: 10px; color: #616161"><span>'
                    + node.name + '</span><br/><span>Version: '
                    + node.current_version.version + '</span><br/><span>'
                    + label + '</span></div>'
                };
            }else{
                return {
                    id: node.id,
                    label: node.file.name + '\nVersion: ' + node.version,
                    labels: 'FileVersion',
                    properties: node,
                    color: graphColors.fileVersion,
                    title: '<div style="margin: 10px; color: #616161"><span>'
                    + node.file.name + '</span><br/><span>Version: '
                    + node.version + '</span><br/><span>'
                    + 'FileVersion' + '</span></div>'
                };
            }
        });
        let nodes = this.provNodes;
        nodes.push(this.updatedGraphItem[0]);
        this.trigger({
            updatedGraphItem: this.updatedGraphItem,
            provNodes: nodes
        })

    },

    addProvActivitySuccess(node) {
        let act = [];
        act.push(node);
        this.updatedGraphItem = act.map((node) => {//Update dataset in client
            return {
                id: node.id,
                label: 'Activity: \n'+node.name,
                shape: 'box',
                color: graphColors.activity,
                properties: node,
                title: '<div style="margin: 10px; color: #616161"><span>'
                +'Name: '+node.name + '</span><br/>' +
                '<span>'+'Created By: '+node.audit.created_by.full_name+'</span><br/>' +
                '<span>'+'Started On: '+node.started_on+'</span></div>'
            };
        });
        let nodes = this.provNodes;
        nodes.push(this.updatedGraphItem[0]);
        this.trigger({
            updatedGraphItem: this.updatedGraphItem,
            provNodes: nodes
        })
    },

    editProvActivitySuccess(node) {
        let act = [];
        let nodes = this.provNodes;
        nodes = BaseUtils.removeObjByKey(nodes, {key: 'id', value: node.id});
        act.push(node);
        this.updatedGraphItem = act.map((node) => {//Update dataset in client
            return {
                id: node.id,
                label: 'Activity: \n'+node.name,
                shape: 'box',
                color: graphColors.activity,
                properties: node,
                title: '<div style="margin: 10px; color: #616161"><span>'
                +'Name: '+node.name + '</span><br/>' +
                '<span>'+'Created By: '+node.audit.created_by.full_name+'</span><br/>' +
                '<span>'+'Started On: '+node.started_on+'</span></div>'
            };
        });
        nodes.push(this.updatedGraphItem[0]);
        this.provNodes = nodes;
        this.showProvCtrlBtns = false;
        this.trigger({
            updatedGraphItem: this.updatedGraphItem,
            provNodes: this.provNodes,
            showProvCtrlBtns: this.showProvCtrlBtns
        })
    },

    getActivitiesSuccess(activities) {
        this.activities = activities;
        this.trigger({
            activities: this.activities
        })
    },

    deleteProvItemSuccess(data) {
        let item = [];
        item.push(data);
        let edges = this.provEdges;
        let nodes = this.provNodes;
        this.showProvCtrlBtns = false;
        if(data.hasOwnProperty('from')){
            edges = BaseUtils.removeObjByKey(edges, {key: 'id', value: data.id});
        } else {
            nodes = BaseUtils.removeObjByKey(nodes, {key: 'id', value: data.id});
            ProjectActions.getActivities();
        }
        this.trigger({
            updatedGraphItem: item,
            provEdges: edges,
            provNodes: nodes,
            showProvCtrlBtns: this.showProvCtrlBtns
        })

    },

    toggleAddEdgeMode(value) {
        if (value == null) {
            this.addEdgeMode = false;
        } else {
            this.addEdgeMode = true;
        }
        this.trigger({
            addEdgeMode: this.addEdgeMode
        })
    },

    toggleProvView() {
        this.toggleProv = !this.toggleProv;
        if(this.toggleProv !== true) { //clear old graph on close of provenance view
            this.provEdges = [];
            this.provNodes = [];
        }
        this.trigger({
            toggleProv: this.toggleProv,
            provEdges: this.provEdges,
            provNodes: this.provNodes
        })
    },

    toggleProvEditor() {
        this.toggleProvEdit = !this.toggleProvEdit;
        this.trigger({
            toggleProvEdit: this.toggleProvEdit
        })
    },

    toggleProvNodeDetails() {
        this.showProvDetails = !this.showProvDetails;
        this.trigger({
            showProvDetails: this.showProvDetails
        })
    },

    toggleGraphLoading() {
        this.drawerLoading = false;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    getWasGeneratedByNode() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    getProvenance() {
        this.drawerLoading = true;
        this.trigger({
            drawerLoading: this.drawerLoading
        })
    },

    getProvenanceSuccess(prov, prevGraph) {
        let edges = prov.relationships.filter((edge) => {
            if (edge.properties.audit.deleted_on === null && edge.type !== 'WasAttributedTo') {
                return edge;
            }
        });
        let nodes = prov.nodes.filter((node) => {
            if (!node.properties.is_deleted && node.properties.hasOwnProperty('kind')) {
                return node;
            }
        });
        this.provEdges = edges.map((edge) => {
            if (edge.properties.audit.deleted_by === null) {
                let color = edge.type === 'Used' ? graphColors.edges.used : graphColors.edges.generated;
                return {
                    id: edge.id,
                    to: edge.end_node,
                    from: edge.start_node,
                    type: edge.type,
                    properties: edge.properties,
                    color: color,
                    arrows: 'to',
                    title: '<div style="color: #616161"><span>'
                    + edge.type + '</span></div>'
                };
            }
        });
        this.provNodes = nodes.map((node) => {
            if(node.properties.hasOwnProperty('audit')) {
                if (node.properties.kind === 'dds-activity') {
                    return {
                        id: node.id,
                        label: 'Activity: \n' + node.properties.name,
                        labels: node.labels.toString(),
                        properties: node.properties,
                        shape: 'box',
                        color: graphColors.activity,
                        title: '<div style="margin: 10px; color: #616161"><span>'
                        + 'Name: ' + node.properties.name + '</span><br/>' +
                        '<span>' + 'Created By: ' + node.properties.audit.created_by.full_name + '</span><br/>' +
                        '<span>' + 'Started On: ' + node.properties.started_on + '</span></div>'
                    }
                }
                if (node.properties.kind === 'dds-file-version') {
                    let label = node.properties.label !== null ? node.properties.label : "";
                    return {
                        id: node.id,
                        label: node.properties.file.name + '\nVersion: ' + node.properties.version,
                        labels: node.labels.toString(),
                        properties: node.properties,
                        color: graphColors.fileVersion,
                        title: '<div style="margin: 10px; color: #616161"><span>'
                        + node.properties.file.name + '</span><br/><span>Version: '
                        + node.properties.version + '</span><br/><span>'
                        + label + '</span></div>'
                    }
                }
            } else {
                return {
                    id: node.id,
                    label: node.properties.kind,
                    labels: node.labels.toString(),
                    properties: node.properties,
                    color: graphColors.noPermissions,
                    title: '<div style="margin: 10px; color: #616161"><span>'
                    + 'You do not have permission to view this file.' + '</span></div>'
                }
            }
        });
        if(prevGraph !== null && typeof prevGraph === 'object') {
            let prevNodes = prevGraph.nodes;
            let prevEdges = prevGraph.edges;
            for(let i=0; i<prevNodes.length; i++) {
                this.provNodes.push(prevNodes[i]);
            }
            for(let i=0; i<prevEdges.length; i++) {
                this.provEdges.push(prevEdges[i]);
            }
            this.provNodes = this.provNodes.filter((node, index, self) => self.findIndex((t) => {return t.id === node.id}) === index);
            this.provEdges = this.provEdges.filter((edge, index, self) => self.findIndex((t) => {return t.id === edge.id}) === index);
        }
        this.trigger({
            provEdges: this.provEdges,
            provNodes: this.provNodes,
            showProvCtrlBtns: false,
            showProvDetails: false,
            dltRelationsBtn: false
        })
    },

    getScreenSize(height, width) {
        this.screenSize.height = height;
        this.screenSize.width = width;
        this.trigger({
            screenSize: this.screenSize
        })
    },

    toggleUploadManager() {
        this.openUploadManager = !this.openUploadManager;
        this.trigger({
            openUploadManager: this.openUploadManager
        })
    },

    toggleTagManager() {
        this.openTagManager = !this.openTagManager;
        this.trigger({
            openTagManager: this.openTagManager
        })
    },

    addNewTagSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
    },

    appendTagsSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
        this.showBatchOps = false;
        this.trigger({
            showBatchOps: this.showBatchOps
        })
    },

    deleteTagSuccess(fileId) {
        ProjectActions.getTags(fileId, 'dds-file');
    },

    getTagAutoCompleteListSuccess(list) {
        this.tagAutoCompleteList = list.map((item) => {return item.label});
        this.trigger({
            tagAutoCompleteList: this.tagAutoCompleteList
        })
    },

    getTagLabelsSuccess(labels) {
        this.tagLabels = labels;
        this.trigger({
            tagLabels: this.tagLabels
        })
    },

    getTagsSuccess(tags) {
        this.objectTags = tags;
        this.trigger({
            objectTags: this.objectTags
        })
    },

    getDeviceType(device) {
        this.device = device;
        this.trigger({
            device: this.device
        })
    },

    setSearchText(text) {
        if(!text.indexOf(' ') <= 0) this.searchText = text;
        this.showBatchOps = false;
        this.itemsSelected = null;
        this.trigger({
            searchText: this.searchText,
            itemsSelected: this.itemsSelected,
            showBatchOps: this.showBatchOps
        })
    },

    search() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    searchFiles() {
        this.autoCompleteLoading = true;
        this.trigger({
            autoCompleteLoading: this.autoCompleteLoading
        })
    },

    searchFilesSuccess(results) {
        this.autoCompleteLoading = false;
        this.searchFilesList = results.filter((file)=>{
            if(file.kind === 'dds-file') return file.name;
        });
        this.trigger({
            searchFilesList: this.searchFilesList,
            autoCompleteLoading: this.autoCompleteLoading
        })
    },

    clearSearchFilesData() {
        this.searchFilesList = [];
        this.trigger({
            searchFilesList: this.searchFilesList
        })
    },

    showRemoveFileFromProvBtn() { //To remove unused files from graph (not currently in use)
        this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
        if(this.showProvCtrlBtns) this.showProvCtrlBtns = !this.showProvCtrlBtns;
        if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
        this.trigger({
            dltRelationsBtn: this.dltRelationsBtn,
            removeFileFromProvBtn: this.removeFileFromProvBtn,
            showProvCtrlBtns: this.showProvCtrlBtns
        })
    },

    showProvControlBtns() {
        this.showProvCtrlBtns = !this.showProvCtrlBtns;
        if(this.removeFileFromProvBtn) this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
        if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
        this.trigger({
            dltRelationsBtn: this.dltRelationsBtn,
            removeFileFromProvBtn: this.removeFileFromProvBtn,
            showProvCtrlBtns: this.showProvCtrlBtns
        })
    },

    showDeleteRelationsBtn(edges, nodes) {
        if (edges !== null && this.dltRelationsBtn && nodes !== null) {
            this.dltRelationsBtn = !this.dltRelationsBtn;
        } else {
            if (edges !== null && this.dltRelationsBtn) {
                this.dltRelationsBtn = true;
            } else {
                this.dltRelationsBtn = !this.dltRelationsBtn;
            }
            if (this.showProvCtrlBtns && this.dltRelationsBtn) {
                this.dltRelationsBtn = !this.dltRelationsBtn;
            }
        }
        this.trigger({
            dltRelationsBtn: this.dltRelationsBtn
        })
    },

    selectNodesAndEdges(edgeData, nodeData) {
        this.selectedEdge = edgeData[0];
        this.selectedNode = nodeData;
        this.trigger({
            selectedNode: this.selectedNode,
            selectedEdge: this.selectedEdge
        })
    },

    hideProvAlert() {
        this.showProvAlert = false;
        this.trigger({
            showProvAlert: this.showProvAlert
        })
    },

    getFileVersions(id, prov) {
        if(!prov) {
            this.loading = true;
            this.trigger({
                loading: this.loading
            })
        }
    },

    getFileVersionsSuccess(results, prov) {
        this.loading = false;
        if(prov) {
            this.provFileVersions = results
        } else {
            this.fileVersions = results;
        }
        this.trigger({
            fileVersions: this.fileVersions,
            provFileVersions: this.provFileVersions,
            loading: this.loading
        })
    },

    clearProvFileVersions() {
        if(this.provFileVersions.length) {
            this.provFileVersions = [];
            this.trigger({
                provFileVersions: this.provFileVersions
            })
        }
    },

    addFileVersionSuccess(id, uploadId) {
        this.showProvAlert = true;
        let kind = 'files/';
        ProjectActions.getEntity(id, kind);
        ProjectActions.getFileVersions(id);
        if (this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.trigger({
            showProvAlert: this.showProvAlert,
            uploads: this.uploads
        })
    },

    deleteVersion() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    deleteVersionSuccess() {
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    editVersion() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editVersionSuccess(id) {
        this.loading = false;
        let kind = 'file_versions';
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: this.loading
        })
    },

    openModal() {
        this.modal = true;
        this.trigger({
            modal: this.modal
        })
    },

    closeModal() {
        this.modal = false;
        this.trigger({
            modal: this.modal
        })
    },

    openVersionModal() {
        this.versionModal = true;
        this.trigger({
            versionModal: this.versionModal
        })
    },

    closeVersionModal() {
        this.versionModal = false;
        this.trigger({
            versionModal: this.versionModal
        })
    },

    loadAgents () {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    loadAgentsSuccess (results) {
        this.agents = results;
        this.loading = false;
        this.trigger({
            agents: this.agents,
            loading: this.loading
        })
    },

    addAgent () {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    addAgentSuccess () {
        this.loading = false;
        ProjectActions.loadAgents();
        this.trigger({
            loading: this.loading
        })
    },

    editAgent(id) {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editAgentSuccess(id) {
        let kind = 'software_agents';
        this.loading = false;
        ProjectActions.getEntity(id, kind);
        this.trigger({
            loading: this.loading
        })
    },

    deleteAgent() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    deleteAgentSuccess() {
        this.loading = false;
        ProjectActions.loadAgents();
        this.trigger({
            loading: this.loading
        })
    },

    createAgentKey() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    createAgentKeySuccess(json) {
        this.agentKey = json;
        this.loading = false;
        this.trigger({
            agentKey: this.agentKey,
            loading: this.loading
        })
    },

    getAgentKey() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getAgentKeySuccess(json) {
        this.agentKey = json;
        this.loading = false;
        this.trigger({
            agentKey: this.agentKey,
            loading: this.loading
        })
    },

    getAgentApiToken() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getAgentApiTokenSuccess(json) {
        this.agentApiToken = json;
        this.loading = false;
        ProjectActions.openModal();
        this.trigger({
            agentApiToken: this.agentApiToken,
            loading: this.loading
        })

    },

    clearApiToken() {
        this.agentApiToken = {};
        this.trigger({
            agentApiToken: this.agentApiToken
        })
    },

    openMoveModal (open) {
        this.moveModal = open;
        this.trigger({
            moveModal: this.moveModal
        })
    },

    selectMoveLocation (id, kind){
        this.destination = id;
        this.destinationKind = kind;
        this.trigger({
            destination: this.destination,
            destinationKind: this.destinationKind
        })
    },

    moveItemWarning (error) {
        this.moveErrorModal = error;
        this.trigger({
            moveErrorModal: this.moveErrorModal
        })
    },

    showBatchOptions () {
        this.showBatchOps = false;
        this.trigger({
            showBatchOps: this.showBatchOps
        })
    },

    setBatchItems(batchDeleteFiles, batchDeleteFolders) {
        this.batchFiles = batchDeleteFiles;
        this.batchFolders = batchDeleteFolders;
        this.trigger({
            batchFiles: this.batchFiles,
            batchFolders: this.batchFolders
        })
    },

    batchDeleteItems(parentId, parentKind) {
        let files = this.batchFiles;
        let folders = this.batchFolders;
        for (let i = 0; i < files.length; i++) {
            ProjectActions.deleteFile(files[i], parentId, parentKind);
        }
        for (let i = 0; i < folders.length; i++) {
            ProjectActions.deleteFolder(folders[i], parentId, parentKind);
        }
    },

    handleBatch (files, folders) {
        this.filesChecked = files;
        this.foldersChecked = folders;
        this.itemsSelected = files.length + folders.length;
        this.showBatchOps = true;
        this.trigger({
            filesChecked: this.filesChecked,
            foldersChecked: this.foldersChecked,
            itemsSelected: this.itemsSelected,
            showBatchOps: this.showBatchOps
        })
    },

    clearSelectedItems() {
        this.filesChecked = [];
        this.foldersChecked = [];
        this.trigger({
            filesChecked: this.filesChecked,
            foldersChecked: this.foldersChecked
        })
    },

    handleErrors (error) {
        let err = error && error.message ? {msg: error.message, response: error.response.status} : null;
        if(error && error.response.status !== 404) {
            this.errorModals.push({
                msg: error.response.status === 403 ? error.message + ': You don\'t have permissions to view or change' +
                ' this resource' : error.message,
                response: error.response.status,
                ref: 'modal' + Math.floor(Math.random() * 10000)
            });
        }
        this.error = err;
        this.loading = false;
        this.drawerLoading = false;
        this.trigger({
            drawerLoading: this.drawerLoading,
            error: this.error,
            errorModals: this.errorModals,
            loading: this.loading
        })
    },

    removeErrorModal(refId) {
        for (let i = 0; i < this.errorModals.length; i++) {
            if (this.errorModals[i].ref === refId) {
                this.errorModals.splice(i, 1);
                break;
            }
        }
        this.error = {};
        this.trigger({
            error: this.error,
            errorModals: this.errorModals
        })
    },

    getUserSuccess (json, id) {
        this.currentUser = json;
        ProjectActions.getPermissions(id, json.id);
        this.trigger({
            currentUser: this.currentUser
        });
    },

    getPermissionsSuccess (json) {
        let id = json.auth_role.id;
        if (id === 'project_viewer') this.projPermissions = 'viewOnly';
        if (id === 'project_admin' || id === 'system_admin') this.projPermissions = 'prjCrud';
        if (id === 'file_editor') this.projPermissions = 'flCrud';
        if (id === 'file_uploader') this.projPermissions = 'flUpload';
        if (id === 'file_downloader') this.projPermissions = 'flDownload';
        this.trigger({
            projPermissions: this.projPermissions
        });
    },

    getUserKeySuccess (json) {
        this.userKey = json;
        this.trigger({
            userKey: this.userKey
        });
    },

    createUserKeySuccess (json) {
        this.userKey = json;
        this.trigger({
            userKey: this.userKey
        });
    },

    deleteUserKeySuccess () {
        this.userKey = {};
        this.trigger({
            userKey: this.userKey
        });
    },

    loadProjects() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    loadProjectsSuccess(results) {
        this.loading = false;
        this.projects = results;
        this.trigger({
            projects: this.projects,
            loading: this.loading
        })
    },

    showDetails() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    showDetailsSuccess(json) {
        this.project = json;
        this.loading = false;
        this.trigger({
            project: this.project,
            loading: this.loading
        })
    },

    deleteItemSuccess(id, parentKind) {
        this.batchFolders.splice(0, 1);
        this.batchFiles.splice(0, 1);
        if(this.batchFolders.length || this.batchFiles.length) {
            return
        } else {
            if (parentKind === 'dds-project') {
                ProjectActions.getChildren(id, 'projects/');
            } else {
                ProjectActions.getChildren(id, 'folders/');
            }
        }
        this.loading = false;
        this.showBatchOps = false;
        this.trigger({
            batchFiles: this.batchFiles,
            batchFolders: this.batchFolders,
            loading: this.loading,
            showBatchOps: this.showBatchOps
        })
    },

    addProject() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    addProjectSuccess() {
        ProjectActions.loadProjects();
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    deleteProject() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    deleteProjectSuccess() {
        ProjectActions.loadProjects();
        ProjectActions.getUsageDetails();
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    editProject(id) {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editProjectSuccess(id) {
        ProjectActions.showDetails(id);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    getChildren() {
        this.childrenLoading = true;
        this.loading = true;
        this.trigger({
            loading: this.loading,
            childrenLoading: this.childrenLoading
        })
    },

    getChildrenSuccess(results) {
        this.children = results;
        this.childrenLoading = false;
        this.loading = false;
        this.trigger({
            children: this.children,
            childrenLoading: this.childrenLoading,
            loading: this.loading
        })
    },

    addFolder() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    addFolderSuccess(id, parentKind) {
        if (parentKind === 'dds-project') {
            ProjectActions.getChildren(id, 'projects/');
        } else {
            ProjectActions.getChildren(id, 'folders/');
        }
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    deleteFolder() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editFolder() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editFolderSuccess(id) {
        let kind = 'folders/';
        ProjectActions.getChildren(id, 'folders/');
        ProjectActions.getEntity(id, kind);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    moveFolder() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    moveFolderSuccess() {
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    addFile() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    addFileSuccess(parentId, parentKind, uploadId, fileId) {
        if (this.uploads[uploadId].tags.length) {
            ProjectActions.appendTags(fileId, 'dds-file', this.uploads[uploadId].tags);
        }
        if(Object.keys(this.uploads).length === 1) {
            if (parentKind === 'dds-project') {
                ProjectActions.getChildren(parentId, 'projects/');
            } else {
                ProjectActions.getChildren(parentId, 'folders/');
            }
        }
        if(this.uploads.hasOwnProperty(uploadId)) {
            delete this.uploads[uploadId];
        }
        this.loading = false;
        this.trigger({
            loading: this.loading,
            uploads: this.uploads
        })
    },


    deleteFile() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editFile() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    editFileSuccess(id) {
        let kind = 'files/';
        ProjectActions.getEntity(id, kind);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    moveFile() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    moveFileSuccess() {
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    getEntitySuccess(json, requester) {
        if (requester === undefined) this.entityObj = json;
        if (requester === 'optionsMenu') {
            this.parent = json.parent;
            this.moveToObj = json;
        }
        if (requester === 'moveItemModal') {
            this.moveToObj = json;
        }
        this.loading = false;
        this.trigger({
            entityObj: this.entityObj,
            moveToObj: this.moveToObj,
            parent: this.parent,
            loading: this.loading
        })
    },

    getProjectMembers() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getProjectMembersSuccess(results) {
        this.loading = false;
        this.projectMembers = results;
        this.trigger({
            projectMembers: this.projectMembers,
            loading: this.loading
        })
    },

    getUserNameSuccess(results) {
        this.users = results.map((users) => {return users.full_name});
        this.trigger({
            users: this.users
        });
    },

    getUserId() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getUserIdSuccess(results, id, role) {
        let userInfo = results.map((result) => {
            return result.id
        });
        let getName = results.map((result) => {
            return result.full_name
        });
        let userId = userInfo.toString();
        let name = getName.toString();
        ProjectActions.addProjectMember(id, userId, role, name);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    addProjectMember() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    addProjectMemberSuccess(id) {
        ProjectActions.getProjectMembers(id);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    deleteProjectMember() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    deleteProjectMemberSuccess(id) {
        ProjectActions.getProjectMembers(id);
        this.loading = false;
        this.trigger({
            loading: this.loading
        })
    },

    getDownloadUrl() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getDownloadUrlSuccess(json) {
        if (this.itemsSelected) this.itemsSelected = this.itemsSelected - 1;
        !this.itemsSelected || !this.itemsSelected.length ? this.showBatchOps = false : this.showBatchOps;
        let host = json.host;
        let url = json.url;
        var win = window.open(host + url, '_blank');
        if (win) {
            win.focus();
        } else { // if browser blocks popups use location.href instead
            window.location.href = host + url;
        }
        this.loading = false;
        this.trigger({
            loading: this.loading,
            itemsSelected: this.itemsSelected,
            showBatchOps: this.showBatchOps
        })
    },

    getUsageDetails() {
        this.loading = true;
        this.trigger({
            loading: this.loading
        })
    },

    getUsageDetailsSuccess(json) {
        this.usage = json;
        this.loading = false;
        this.trigger({
            usage: this.usage,
            loading: this.loading
        })
    },

    startUpload() {
        this.loading = true;
        this.trigger({
            uploading: this.loading
        })
    },

    startUploadSuccess(uploadId, details) {
        this.uploads[uploadId] = details;
        ProjectActions.hashFile(this.uploads[uploadId], uploadId);
        ProjectActions.updateAndProcessChunks(uploadId, null, null);
        window.onbeforeunload = function (e) {// If uploading files and user navigates away from page, send them warning
            let preventLeave = true;
            if (preventLeave) {
                return "If you refresh the page or close your browser, files being uploaded will be lost and you" +
                    " will have to start again. Are" +
                    " you sure you want to do this?";
            }
        };
        this.trigger({
            uploads: this.uploads
        })
    },

    updateChunkProgress(uploadId, chunkNum, progress) {
        if (!uploadId && !this.uploads[uploadId]) {
            return;
        }
        let upload = this.uploads[uploadId];
        let chunks = this.uploads[uploadId] ? this.uploads[uploadId].chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    // update progress of chunk in bytes
                    if (progress) chunks[i].chunkUpdates.progress = progress;
                    break;
                }
            }
        }
        // calculate % uploaded
        let bytesUploaded = 0;
        if (chunks) {
            chunks.map(chunk => bytesUploaded += chunk.chunkUpdates.progress);
            upload.uploadProgress = upload.size > 0 ? (bytesUploaded / upload.size) * 100 : 0;
        }
        this.trigger({
            uploads: this.uploads
        });
    },

    updateAndProcessChunks(uploadId, chunkNum, chunkUpdates) {
        if (!uploadId && !this.uploads[uploadId]) {
            return;
        }
        let upload = this.uploads[uploadId];
        let chunks = this.uploads[uploadId] ? this.uploads[uploadId].chunks : '';
        if (chunkNum !== null) {
            for (let i = 0; i < chunks.length; i++) {
                // find chunk to update
                if (chunks[i].number === chunkNum) {
                    //update status
                    if (chunkUpdates.status !== undefined) chunks[i].chunkUpdates.status = chunkUpdates.status;
                    if (chunks[i].chunkUpdates.status === StatusEnum.STATUS_RETRY && chunks[i].retry > StatusEnum.MAX_RETRY) {
                        chunks[i].chunkUpdates.status = StatusEnum.STATUS_FAILED;
                        ProjectStore.uploadError(uploadId, chunks[i].number);
                        return;
                    }
                    if (chunks[i].chunkUpdates.status === StatusEnum.STATUS_RETRY) chunks[i].retry++;
                    break;
                }
            }
        }
        // Decide what action to do next
        let allDone = true;
        for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk.chunkUpdates.status === StatusEnum.STATUS_WAITING_FOR_UPLOAD || chunk.chunkUpdates.status === StatusEnum.STATUS_RETRY) {
                chunk.chunkUpdates.status = StatusEnum.STATUS_UPLOADING;
                ProjectActions.getChunkUrl(uploadId, upload.blob.slice(chunk.start, chunk.end), chunk.number, upload.size, upload.parentId, upload.parentKind, upload.name, chunk.chunkUpdates);
                return;
            }
            if (chunk.chunkUpdates.status !== StatusEnum.STATUS_SUCCESS) allDone = false;
        }
        if (allDone === true) ProjectActions.checkForHash(uploadId, upload.parentId, upload.parentKind, upload.name, upload.label, upload.fileId);
        window.onbeforeunload = function (e) { // If done, set to false so no warning is sent.
            let preventLeave = false;
        };
    },

    uploadError(uploadId, fileName) {
        if (this.uploads.hasOwnProperty(uploadId)) {
            this.failedUploads.push({
                upload: this.uploads[uploadId],
                fileName: fileName,
                id: uploadId
            });
            delete this.uploads[uploadId];
            MainActions.failedUpload(this.failedUploads);
        }
        this.trigger({
            uploads: this.uploads,
            failedUploads: this.failedUploads
        })
    },

    removeFailedUploads() {
        this.failedUploads = [];
        MainActions.removeFailedUploads(this.failedUploads);
        this.trigger({
            failedUploads: this.failedUploads
        })
    },

    checkForHash(uploadId, parentId, parentKind, name, label, fileId) {
        if (!Array.prototype.find) { // Polyfill for Internet Explorer Array.find()
            Array.prototype.find = function(predicate) {
                'use strict';
                if (this == null) {
                    throw new TypeError('Array.prototype.find called on null or undefined');
                }
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }
                var list = Object(this);
                var length = list.length >>> 0;
                var thisArg = arguments[1];
                var value;

                for (var i = 0; i < length; i++) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) {
                        return value;
                    }
                }
                return undefined;
            };
        }
        let hash = this.fileHashes.find((fileHash)=>{ // array.find() method not supported in IE
            return fileHash.id === uploadId;
        });
        if(!hash) {
            ProjectActions.updateAndProcessChunks(uploadId, null, null);
        }else{
            ProjectActions.allChunksUploaded(uploadId, parentId, parentKind, name, label, fileId, hash.hash);
        }
    },

    postHash(hash) {
        let fileHashes = this.fileHashes.push(hash);
        this.fileHashes = fileHashes;
        this.trigger({
            fileHashes: this.fileHashes
        })
    },

    toggleModals(id) {
        this.toggleModal.open = !this.toggleModal.open;
        this.toggleModal.id = id;
        this.trigger({
            toggleModal: this.toggleModal
        });
    }
});

export default ProjectStore;