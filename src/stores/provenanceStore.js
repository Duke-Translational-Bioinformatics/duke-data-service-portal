import { observable, action } from 'mobx';
import transportLayer from '../transportLayer';
import authStore from '../stores/authStore';
import mainStore from '../stores/mainStore';
import BaseUtils from '../util/baseUtils';
import { Path } from '../util/urlEnum';
import { graphColors, shadow} from '../graphConfig';
import { checkStatus } from '../util/fetchUtil';

export class ProvenanceStore {

    @observable activities
    @observable activity
    @observable addEdgeMode
    @observable currentGraph
    @observable dltRelationsBtn
    @observable doubleClicked
    @observable drawerLoading
    @observable dropdownSelectValue
    @observable generatedByActivity
    @observable network
    @observable onClickProvNode
    @observable openConfirmRel
    @observable position
    @observable provEditorModal
    @observable provFileVersions
    @observable provEdges
    @observable provNodes
    @observable relationMode
    @observable relFrom
    @observable relTo
    @observable relMsg
    @observable removeFileFromProvBtn
    @observable renderGraph
    @observable scale
    @observable selectedNode
    @observable selectedEdge
    @observable showProvAlert
    @observable showProvCtrlBtns
    @observable showProvDetails
    @observable toggleProv
    @observable toggleProvEdit
    @observable updatedGraphItem

    constructor() {
        this.activities = [];
        this.activity = null;
        this.addEdgeMode = false;
        this.currentGraph = null;
        this.dltRelationsBtn = false;
        this.doubleClicked = false;
        this.drawerLoading = false;
        this.dropdownSelectValue = null;
        this.generatedByActivity = null;
        this.network = {};
        this.onClickProvNode = {};
        this.openConfirmRel = false;
        this.position = null;
        this.provEditorModal = {open: false, id: null};
        this.provFileVersions = [];
        this.provEdges = [];
        this.provNodes = [];
        this.relationMode = false;
        this.relFrom = null;
        this.relTo = null;
        this.relMsg = null;
        this.removeFileFromProvBtn = false;
        this.renderGraph = false;
        this.scale = null;
        this.selectedNode = {};
        this.selectedEdge = null;
        this.showProvAlert = false;
        this.showProvCtrlBtns = false;
        this.showProvDetails = false;
        this.toggleProv = false;
        this.toggleProvEdit = true;
        this.updatedGraphItem = [];

        this.transportLayer = transportLayer
    }

    checkResponse(response) {
        return checkStatus(response, authStore);
    }

    @action getActivity(id, path) {
        this.transportLayer.getEntity(id, path)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.activity= json;
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action getActivities() {
        this.transportLayer.getActivities(authStore.appConfig.apiToken)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.activities = json.results;
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action getWasGeneratedByNode(id, prevGraph) {
        const that = provenanceStore;
        that.drawerLoading = true;
        that.transportLayer.getWasGeneratedByNode(id)
            .then(that.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if(!json.graph.nodes.length) {
                    const retryArgs = [id, prevGraph];
                    const msg = "The provence graph you're requesting is unavailable...";
                    mainStore.tryAsyncAgain(that.getWasGeneratedByNode, retryArgs, 15000, id, msg, false )
                } else {
                    that.getProvenanceSuccess(json.graph, prevGraph);
                }
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action getGeneratedByActivity(id) {
        this.transportLayer.getWasGeneratedByNode(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.generatedByActivity = json.graph.relationships.find(r => r.type === 'WasGeneratedBy' && r.start_node === id);
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action resetGeneratedByActivity() {
        this.generatedByActivity = null;
    }

    @action getProvenance(id, kind, prevGraph) {
        const that = provenanceStore;
        that.drawerLoading = true;
        that.transportLayer.getProvenance(id, kind)
            .then(that.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if(!json.graph.nodes.length) {
                    const retryArgs = [id, kind, prevGraph];
                    const msg = "The provence graph you're requesting is unavailable...";
                    mainStore.tryAsyncAgain(that.getProvenance, retryArgs, 15000, id, msg, false )
                } else {
                    that.getProvenanceSuccess(json.graph, prevGraph);
                }
            }).catch(ex => mainStore.handleErrors(ex))
    }

    @action getProvenanceSuccess(prov, prevGraph) {
        let edges = prov.relationships.filter((edge) => {
            return edge.properties !== null && edge.type !== 'WasAttributedTo'
        });
        let nodes = prov.nodes.filter((node) => {
            return !node.properties.is_deleted && node.properties.hasOwnProperty('kind')
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
                    arrows: edge.type !== 'WasDerivedFrom' ? 'from' : 'to;from', // Todo: changed these arrow directions added check for WasDerivedFrom
                    title: '<div style="color: #616161" class="tooltip"><span>'
                    + edge.type + '</span></div>'
                };
            }
        });
        this.provNodes = nodes.map((node) => {
            if(node.properties.hasOwnProperty('audit')) {
                if (node.properties.kind === 'dds-activity') {
                    return {
                        id: node.id,
                        label: `Activity: ${node.properties.name}\nDescription: ${node.properties.description}`, margin: { top: 10, right: 10, bottom: 10, left: 10 },
                        labels: node.labels.toString(),
                        properties: node.properties,
                        shape: 'box',
                        color: graphColors.activity,
                        shadow: shadow.activity,
                        title: `<div style="margin: 10px; color: #616161" class="tooltip"><span>
                        Name:  ${node.properties.name}</span><br/>
                        <span>Description: ${node.properties.description} </span><br/>                       
                        <span> Started On: ${BaseUtils.formatLongDate(node.properties.started_on)} </span></div>`,
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
                        title: `<div style="margin: 10px; color: #616161" class="tooltip"><span>
                        ${node.properties.file.name}</span><br/><span>Version: 
                        ${node.properties.version}</span><br/><span>
                        ${label} </span></div>`
                    }
                }
            } else {
                return {
                    id: node.id,
                    label: node.properties.kind,
                    labels: node.labels.toString(),
                    properties: node.properties,
                    color: graphColors.noPermissions,
                    title: `<div style="margin: 10px; color: #616161" class="tooltip"><span>
                    You do not have permission to view this file.</span></div>`
                }
            }
        });
        if(prevGraph !== null && typeof prevGraph === 'object') {
            let prevNodes = prevGraph.nodes.length ? prevGraph.nodes : this.currentGraph.nodes;
            let prevEdges = prevGraph.edges.length ? prevGraph.edges : this.currentGraph.edges;
            for(let i=0; i<prevNodes.length; i++) {
                this.provNodes.push(prevNodes[i]);
            }
            for(let i=0; i<prevEdges.length; i++) {
                this.provEdges.push(prevEdges[i]);
            }
            this.provNodes = this.provNodes.filter((node, index, self) => self.findIndex((t) => {return t.id === node.id}) === index);
            this.provEdges = this.provEdges.filter((edge, index, self) => self.findIndex((t) => {return t.id === edge.id}) === index);
        }
        this.shouldRenderGraph();
        this.currentGraph = mainStore.currentLocation !== null ? {id: mainStore.currentLocation.id, edges: this.provEdges, nodes: this.provNodes} : null;
        this.drawerLoading = false;
        this.showProvCtrlBtns = false;
        this.showProvDetails = false;
        this.dltRelationsBtn = false;
    }

    @action getFromAndToNodes(data, relationKind, nodes) {
        let from = null;
        let to = null;
        let node1 = null;
        let node2 = null;
        nodes.forEach((node) => {
            if (data.to === node.id) {
                node1 = node;
            }
            if (data.from === node.id) {
                node2 = node;
            }
        });
        if (!node1.properties.hasOwnProperty('kind') || !node2.properties.hasOwnProperty('kind')) {
            this.provEditorModal = {open: true, id: 'relWarning'};
            this.relMsg = 'invalidRelMsg';
        }
        if (relationKind !== 'was_derived_from') {
            if (node1.properties.kind === 'dds-activity' && node1.properties.audit.created_by.id !== authStore.currentUser.id) {
                this.provEditorModal = {open: true, id: 'relWarning'};
                this.relMsg = 'permissionError';
            } else if (node2.properties.kind === 'dds-activity' && node2.properties.audit.created_by.id !== authStore.currentUser.id){
                this.provEditorModal = {open: true, id: 'relWarning'};
                this.relMsg = 'permissionError';
            } else {
                if (node1.properties.kind === 'dds-file-version' && node2.properties.kind === 'dds-file-version') {
                    this.provEditorModal = {open: true, id: 'relWarning'};
                    this.relMsg = 'wasDerivedFrom';
                }
                if (node1.properties.kind === 'dds-activity' && node2.properties.kind === 'dds-activity') {
                    this.provEditorModal = {open: true, id: 'relWarning'};
                    this.relMsg = 'actToActMsg';
                }
                if (node1.properties.kind !== node2.properties.kind) {
                    if (relationKind === 'used') {
                        from = node1.properties.kind === 'dds-activity' ? node2 : node1;
                        to = node1.properties.kind === 'dds-activity' ? node1 : node2;
                    }
                    if (relationKind === 'was_generated_by') {
                        from = node1.properties.kind === 'dds-activity' ? node1 : node2;
                        to = node1.properties.kind === 'dds-activity' ? node2 : node1;
                    }
                    if (node1.properties.hasOwnProperty('kind') && node2.properties.hasOwnProperty('kind')){
                        this.startAddRelation(relationKind, from, to);
                    }
                }
            }
        } else {
            if (node1.properties.kind === 'dds-activity' || node2.properties.kind === 'dds-activity') {
                // Send error modal to user explaining rules of was_derived_from relations
                this.provEditorModal = {open: true, id: 'relWarning'};
                this.relMsg = 'notFileToFile';
            } else {
                from = node1;
                to = node2;
                this.confirmDerivedFromRel(from, to);
            }
        }
    }

    @action confirmDerivedFromRel(from, to) {
        this.relFrom = from;
        this.relTo = to;
        this.provEditorModal = {open: true, id: 'confirmRel'}
    }

    @action startAddRelation(kind, from, to) {
        this.buildRelationBody(kind, from, to);
        this.provEditorModal = {open: false, id: 'confirmRel'}
    }

    @action buildRelationBody(kind, from, to) {
        let body = {};
        if (kind === 'used') {
            body = {
                'activity': {
                    'id': to.id
                },
                'entity': {
                    'kind': 'dds-file-version',
                    'id': from.id
                }
            };
        }
        if (kind === 'was_generated_by') {
            body = {
                'entity': {
                    'kind': 'dds-file-version',
                    'id': to.id
                },
                'activity': {
                    'id': from.id
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
        this.addProvRelation(kind, body);
    }

    @action addProvRelation(kind, body) {
        this.drawerLoading = true;
        this.transportLayer.addProvRelation(kind, body)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('New relation Added');
                let rel = [];
                rel.push(json);
                this.updatedGraphItem = rel.map((edge) => {//Update dataset in client
                    let color = edge.kind === 'dds-used_prov_relation' ? graphColors.edges.used : graphColors.edges.generated;
                    return {
                        id: edge.id,
                        from: edge.from.id,
                        to: edge.to.id,
                        type: edge.kind,
                        color: color,
                        arrows: edge.type !== 'WasDerivedFrom' ? 'from' : 'to;from', // Todo: changed these arrow directions added check for WasDerivedFrom
                        properties: {
                            audit: edge.audit
                        },
                        title: '<div style="color: #616161" class="tooltip"><span>'
                        + edge.kind + '</span></div>'
                    };
                });
                let edges = this.provEdges.length ? this.provEdges.slice() : this.currentGraph.edges;
                edges.push(this.updatedGraphItem[0]);
                this.shouldRenderGraph();
                this.provEdges = edges;
                this.currentGraph.edges = edges;
                this.drawerLoading = false;
            }).catch((ex) => {
            mainStore.addToast('Failed to add new relation');
            mainStore.handleErrors(ex)
        })
    }

    @action deleteProvItem(data) {
        this.drawerLoading = true;
        let kind = data.hasOwnProperty('from') ? 'relations/' : 'activities/';
        let msg = kind === 'activities/' ? data.label : data.type;
        this.transportLayer.deleteProvItem(data.id, kind)
            .then(this.checkResponse)
            .then((response) => {})
            .then((json) => {
                mainStore.addToast(msg + ' deleted');
                let item = [];
                item.push(data);
                this.showProvCtrlBtns = false;
                this.shouldRenderGraph();
                if(data.hasOwnProperty('from')){
                    this.provEdges = this.provEdges.filter(obj => obj.id !== data.id);
                    this.currentGraph.edges = this.provEdges;
                } else {
                    this.provNodes = this.provNodes.filter(obj => obj.id !== data.id);
                    this.currentGraph.nodes = this.provNodes;
                    this.getActivities();
                }
                this.updatedGraphItem = item;
                this.drawerLoading = false;
            }).catch((ex) => {
            mainStore.addToast('Failed to delete ' + msg);
            mainStore.handleErrors(ex)
        });
    }

    @action addProvActivity(name, desc) {
        this.drawerLoading = true;
        this.transportLayer.addProvActivity(name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                mainStore.addToast('New Activity Added');
                this.addProvActivitySuccess(json);
            }).catch((ex) => {
            mainStore.addToast('Failed to add new actvity');
            mainStore.handleErrors(ex)
        })
    }

    @action addProvActivitySuccess(json) {
        let act = [];
        act.push(json);
        this.updatedGraphItem = act.map((json) => {//Update dataset in client
            return {
                id: json.id,
                label: `Activity: ${json.name}\nDescription: ${json.description}`, margin: { top: 10, right: 10, bottom: 10, left: 10 },
                properties: json,
                shape: 'box',
                color: graphColors.activity,
                shadow: shadow.activity,
                title: `<div style="margin: 10px; color: #616161" class="tooltip"><span>
                        Name:  ${json.name}</span><br/>
                        <span>Description: ${json.description} </span><br/>                       
                        <span> Started On: ${BaseUtils.formatLongDate(json.started_on)} </span></div>`,
            };
        });
        let nodes = this.provNodes.length ? this.provNodes.slice() : this.currentGraph.nodes;
        nodes.push(this.updatedGraphItem[0]);
        this.shouldRenderGraph();
        this.provNodes = nodes;
        this.currentGraph.nodes = nodes;
        this.drawerLoading = false;
        mainStore.addToast(json.name+' was added to the graph');
    }

    @action editProvActivity(id, name, desc, prevName) {
        this.drawerLoading = true;
        this.transportLayer.editProvActivity(id, name, desc)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                if (name !== prevName) {
                    mainStore.addToast(prevName + ' name was changed to ' + name);
                } else {
                    mainStore.addToast(prevName + ' was edited');
                }
                let act = [];
                let nodes = this.provNodes.length ? this.provNodes.slice() : this.currentGraph.nodes;
                nodes = nodes.filter(obj => obj.id !== json.id);
                act.push(json);
                this.updatedGraphItem = act.map((json) => {//Update dataset in client
                    return {
                        id: json.id,
                        label: `Activity: ${json.name}\nDescription: ${json.description}`, margin: { top: 10, right: 10, bottom: 10, left: 10 },
                        properties: json,
                        shape: 'box',
                        color: graphColors.activity,
                        shadow: shadow.activity,
                        title: `<div style="margin: 10px; color: #616161" class="tooltip">
                                    <span>Name:  ${json.name}</span><br/>
                                    <span>Description: ${json.description} </span><br/>                       
                                    <span> Started On: ${BaseUtils.formatLongDate(json.started_on)} </span>
                                </div>`,
                    };
                });
                nodes.push(this.updatedGraphItem[0]);
                this.activity = json;
                this.shouldRenderGraph();
                this.provNodes = nodes;
                this.currentGraph.nodes = nodes;
                this.showProvCtrlBtns = false;
                this.drawerLoading = false;
            }).catch(ex =>mainStore.handleErrors(ex))
    }

    @action deleteProvActivity(id, name) {
        this.drawerLoading = true;
        this.transportLayer.deleteProvItem(id, Path.ACTIVITIES)
            .then(this.checkResponse)
            .then(response => {})
            .then(() => {
                mainStore.addToast(`${name} activity was deleted!`);
                this.provNodes = this.provNodes.filter(obj => obj.id !== id);
                this.currentGraph.nodes = this.provNodes;
                this.getActivities();
                this.shouldRenderGraph();
                this.drawerLoading = false;
            }).catch((ex) => {
            mainStore.addToast(`Failed to delete ${name}`);
            mainStore.handleErrors(ex)
        });
    }

    @action addFileToGraph(node) {
        let n = [];
        n.push(node);
        this.updatedGraphItem = n.map((node) => {//Update dataset in client
            if(node.current_version) {
                mainStore.addToast(node.name+' was added to the graph');
                node.kind = 'dds-file-version';
                let label = node.current_version.label !== null ? node.current_version.label : "";
                return {
                    id: node.current_version.id,
                    label: node.name + '\nVersion: ' + node.current_version.version,
                    labels: node.current_version.label,
                    properties: node,
                    color: graphColors.fileVersion,
                    title: `<div style="margin: 10px; color: #616161" class="tooltip">
                                <span>${node.name}</span><br/>
                                <span>Version: ${node.current_version.version}</span><br/>
                                <span>${label}</span>
                            </div>`
                };
            }else{
                mainStore.addToast(node.file.name+' was added to the graph');
                return {
                    id: node.id,
                    label: node.file.name + '\nVersion: ' + node.version,
                    labels: 'FileVersion',
                    properties: node,
                    color: graphColors.fileVersion,
                    title: `<div style="margin: 10px; color: #616161" class="tooltip">
                                <span>${node.file.name}</span><br/>
                                <span>Version: ${node.version}</span><br/>
                                <span>FileVersion</span>
                            </div>`
                };
            }
        });
        let nodes = this.provNodes.length ? this.provNodes.slice() : this.currentGraph.nodes;
        nodes.push(this.updatedGraphItem[0]);
        this.shouldRenderGraph();
        this.provNodes = nodes;
        this.currentGraph.nodes = nodes;
    }

    @action switchRelationFromTo(from, to){
        this.openConfirmRel = true;
        this.relFrom = to;
        this.relTo = from;
    }

    @action saveGraphZoomState(scale, position) {
        this.scale = scale;
        this.position = position;
    }

    @action selectNodesAndEdges(edgeData, nodeData) {
        this.selectedEdge = edgeData[0];
        this.selectedNode = nodeData;
    }

    @action showProvControlBtns() {
        this.showProvCtrlBtns = !this.showProvCtrlBtns;
        if(this.removeFileFromProvBtn) this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
        if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
    }

    @action showRemoveFileFromProvBtn() { //To remove unused files from graph (not currently in use)
        this.removeFileFromProvBtn = !this.removeFileFromProvBtn;
        if(this.showProvCtrlBtns) this.showProvCtrlBtns = !this.showProvCtrlBtns;
        if(this.dltRelationsBtn) this.dltRelationsBtn = !this.dltRelationsBtn;
    }

    @action showDeleteRelationsBtn(edges, nodes) {
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
    }

    @action getProvFileVersions(id) {
        this.transportLayer.getProvFileVersions(id)
            .then(this.checkResponse)
            .then(response => response.json())
            .then((json) => {
                this.provFileVersions = json.results
            }).catch((ex) => {
            mainStore.handleErrors(ex)
        })
    }

    @action createGraph(graph) {
        this.network = graph;
    }

    @action clearProvFileVersions() {
        if(this.provFileVersions.length) {
            this.provFileVersions = [];
        }
    }

    @action toggleAddEdgeMode(value) {
        if (value == null) {
            this.addEdgeMode = false;
        } else {
            this.addEdgeMode = true;
        }
    }

    @action toggleProvNodeDetails() {
        this.showProvDetails = !this.showProvDetails;
    }

    @action toggleProvView() {
        this.toggleProv = !this.toggleProv;
        this.selectedNode = {};
        if(!this.toggleProv) { //clear old graph on close of provenance view
            this.provEdges = [];
            this.provNodes = [];
        }
    }

    @action toggleProvEditor() {
        this.toggleProvEdit = !this.toggleProvEdit;
    }

    @action toggleGraphLoading() {
        this.drawerLoading = false;
    }

    @action openProvEditorModal(id) {
        this.provEditorModal = {open: true, id: id}
    }

    @action closeProvEditorModal(id) {
        this.provEditorModal = {open: false, id: id}
    }

    @action displayProvAlert() {
        this.showProvAlert = true;
    }

    @action hideProvAlert() {
        this.showProvAlert = false;
    }

    @action isDoubleClick() {
        this.doubleClicked = true;
        setTimeout(()=> this.doubleClicked = false, 300)
    }

    @action toggleRelationMode() {
        this.relationMode = !this.relationMode
    }

    @action shouldRenderGraph() {
        this.renderGraph = !this.renderGraph;
    }

    @action setOnClickProvNode(node) {
        this.onClickProvNode = node;
    }

    @action setDropdownSelectValue(value) {
        this.dropdownSelectValue = value;
    }

    networkSelect(params, nodes, edges) {
        let nodeData = nodes.get(params.nodes[0]);
        let edgeData = edges.get(params.edges);
        // User has visibility to node or it's an edge that is selected
        if (params.nodes.length > 0) this.setOnClickProvNode(nodeData);
        this.selectNodesAndEdges(edgeData, nodeData);
    }

    networkDoubleClick(params, nodes) {
        let nodeData = nodes.get(params.nodes[0]);
        this.saveGraphZoomState(this.network.getScale(), this.network.getViewPosition());
        if (!Array.isArray(nodeData) && nodeData.properties.hasOwnProperty('audit')) {
            this.isDoubleClick();
            let prevGraph = {nodes: this.provNodes, edges: this.provEdges};
            if (params.nodes.length > 0) {
                let id = this.onClickProvNode.properties.current_version ? this.onClickProvNode.properties.current_version.id : this.onClickProvNode.properties.id;
                let kind = this.onClickProvNode.properties.kind === 'dds-activity' ? 'dds-activity' : 'dds-file-version';
                // nodeData.properties.kind === 'dds-activity' ?  this.getProvenance(id, kind, prevGraph) : this.getWasGeneratedByNode(id, prevGraph);
                this.getProvenance(id, kind, prevGraph)
            }
        }
    }

    networkClick(params, nodes, edges) {
        let nodeData = nodes.get(params.nodes[0]);
        let edgeData = edges.get(params.edges);
        if ((!Array.isArray(nodeData) && nodeData.properties.hasOwnProperty('audit')) || edgeData.length === 1) {
            if (params.nodes.length > 0) {
                if (!this.showProvDetails && nodeData.properties.hasOwnProperty('audit')) this.toggleProvNodeDetails();
                if (this.showProvDetails && !nodeData.properties.hasOwnProperty('audit')) this.toggleProvNodeDetails();
                if (nodeData.properties.kind !== 'dds-activity') {
                    if (!this.removeFileFromProvBtn) this.showRemoveFileFromProvBtn();
                } else {
                    if (nodeData.properties.audit.created_by.id !== authStore.currentUser.id && this.showProvCtrlBtns) {
                        this.showProvControlBtns();
                    }
                    if (nodeData.properties.audit.created_by.id === authStore.currentUser.id) {
                        // If not creator of node then don't allow edit/delete activity
                        if (!this.showProvCtrlBtns && nodeData.properties.kind === 'dds-activity') this.showProvControlBtns();
                        if (nodeData.properties.kind !== 'dds-activity' && this.showProvCtrlBtns) {
                            this.network.unselectAll();
                            this.showProvControlBtns();
                        }
                        if (nodeData.properties.kind !== 'dds-activity' && this.dltRelationsBtn) {
                            this.network.unselectAll();
                            this.showDeleteRelationsBtn(edgeData, nodeData);
                        }
                    }
                }
            }
            if (params.nodes.length === 0) {
                this.network.unselectAll();
                if (edgeData.length > 0) this.network.selectEdges([edgeData[0].id]);
                if (this.removeFileFromProvBtn) this.showRemoveFileFromProvBtn();
                if (this.showProvCtrlBtns) this.showProvControlBtns();
            }
            if (params.edges.length === 0 && this.dltRelationsBtn) {
                if (this.showProvDetails) this.toggleProvNodeDetails();
                this.showDeleteRelationsBtn(edgeData);
                this.network.unselectAll();
            }
            if (params.edges.length === 0 && params.nodes.length === 0 && this.showProvDetails) this.toggleProvNodeDetails();
            if (edgeData.length > 0 && params.nodes.length < 1) {
                if (this.showProvDetails) this.toggleProvNodeDetails();
                if (edgeData[0].type !== 'WasAssociatedWith' || edgeData[0].type !== 'WasAttributedTo') {
                    if (edgeData.length > 0 && edgeData[0].properties.audit.created_by.id !== authStore.currentUser.id && this.dltRelationsBtn) {
                        this.showDeleteRelationsBtn(edgeData);
                    }
                    if (edgeData.length > 0 && edgeData[0].properties.audit.created_by.id === authStore.currentUser.id) {
                        if (params.edges.length > 0 && params.nodes.length < 1) {
                            if (!this.dltRelationsBtn) this.showDeleteRelationsBtn(edgeData);
                            if (this.showProvCtrlBtns && this.dltRelationsBtn) this.showDeleteRelationsBtn(edgeData);
                        }
                    }
                }
            }
        } else {
            this.network.unselectAll();
            if (this.showProvDetails) this.toggleProvNodeDetails();
            if (this.showProvCtrlBtns) this.showProvControlBtns();
            if (this.dltRelationsBtn) this.showDeleteRelationsBtn(edgeData, nodeData);
        }
    }

    @action onAddEdgeMode(data, callback) {
        let nodes = this.provNodes.length ? this.provNodes.slice() : this.currentGraph.nodes;
        let relationKind = null;
        if(data.from === data.to) {
            callback(null);
        } else {
            switch(this.dropdownSelectValue){
                case 0:
                    relationKind = 'used';
                    break;
                case 1:
                    relationKind = 'was_generated_by';
                    break;
                case 2:
                    relationKind = 'was_derived_from';
                    break;
                default:
                    break;
            }
            this.saveGraphZoomState(this.network.getScale(), this.network.getViewPosition());
            this.getFromAndToNodes(data, relationKind, nodes);
            this.toggleAddEdgeMode();
            if(this.showProvDetails) this.toggleProvNodeDetails();
            if(this.showProvCtrlBtns) this.showProvControlBtns();
            this.dropdownSelectValue = null;
            this.toggleRelationMode();
            callback(null); // Disable default behavior and update dataset in provenanceStore instead
        }
    }
}

const provenanceStore = new ProvenanceStore();

export default provenanceStore;