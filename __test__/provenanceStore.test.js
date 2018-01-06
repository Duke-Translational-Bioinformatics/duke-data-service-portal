import * as fake from "../app/scripts/testData";
import { sleep, respondOK }  from "../app/scripts/util/testUtil";

describe('Provenance Store', () => {

    const ACTIVITY_ID = 'ACTIVITY_ID';
    const ACTIVITY_NAME = 'ACTIVITY_1';
    const ACTIVITY_DESCRIPTION = 'ACTIVITY_1_DESCRIPTION';
    const NODE_ID = 'NODE_ID';
    const FILE_NODE_1 = 'FILE_NODE_1';
    const FILE_ID = 'FILE_ID';
    const EDGE_ID = 'EDGE_ID';
    const RELATION_KIND = 'was_generated_by';

    let transportLayer = null;
    let provenanceStore = null;
    let mainStore = null;

    beforeEach(() => {
        provenanceStore = require('../app/scripts/stores/provenanceStore').default;
        mainStore = require('../app/scripts/stores/mainStore').default;
        transportLayer = {};
        provenanceStore.transportLayer = transportLayer;
    });

    it('@action getGeneratedByActivity - gets the generating activity for a file or file version', () => {
        provenanceStore.drawerLoading = false;
        expect(provenanceStore.drawerLoading).toBe(false);
        provenanceStore.generatedByActivity = null;
        expect(provenanceStore.generatedByActivity).toBe(null);
        transportLayer.getWasGeneratedByNode = jest.fn((id) => respondOK(fake.prov_activity_json));
        provenanceStore.getGeneratedByActivity(FILE_ID);
        expect(provenanceStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.getWasGeneratedByNode).toHaveBeenCalledTimes(1);
            expect(transportLayer.getWasGeneratedByNode).toHaveBeenCalledWith(FILE_ID);
            expect(provenanceStore.drawerLoading).toBe(false);
        });
    });

    it('@action resetGeneratedByActivity - resets the generating activity to null', () => {
        provenanceStore.generatedByActivity = 1;
        expect(provenanceStore.generatedByActivity).toBe(1);
        provenanceStore.resetGeneratedByActivity();
        expect(provenanceStore.generatedByActivity).toBe(null);
    });

    it('@action setDropdownSelectValue - sets the value of the relation type dropdown select field', () => {
        provenanceStore.setDropdownSelectValue(RELATION_KIND);
        expect(provenanceStore.dropdownSelectValue).toBe(RELATION_KIND);
    });

    it('@action toggleRelationMode - toggles relationMode', () => {
        provenanceStore.toggleRelationMode();
        expect(provenanceStore.relationMode).toBe(true);
        provenanceStore.toggleRelationMode();
        expect(provenanceStore.relationMode).toBe(false);
    });

    it('@action shouldRenderGraph - toggles whether graph should render or not', () => {
        provenanceStore.shouldRenderGraph();
        expect(provenanceStore.renderGraph).toBe(true);
        provenanceStore.shouldRenderGraph();
        expect(provenanceStore.renderGraph).toBe(false);
    });

    it('@action setOnClickProvNode - saves the node in provenanceStore that has been clicked', () => {
        provenanceStore.setOnClickProvNode(fake.prov_file_node_json);
        expect(provenanceStore.onClickProvNode.id).toBe(FILE_NODE_1);
    });

    it('@action isDoubleClick - sets a temporary status of doubleClicked to avoid additional firing single click events on graph', () => {
        provenanceStore.doubleClicked = false;
        provenanceStore.isDoubleClick();
        expect(provenanceStore.doubleClicked).toBe(true);
        return sleep(301).then(() => {
            expect(provenanceStore.doubleClicked).toBe(false);
        });
    });

    it('@action displayProvAlert - displays an alert that provenance can be added to a new file version', () => {
        provenanceStore.displayProvAlert();
        expect(provenanceStore.showProvAlert).toBe(true);
    });

    it('@action hideProvAlert - hides the alert telling that provenance can be added to a new file version', () => {
        provenanceStore.hideProvAlert();
        expect(provenanceStore.showProvAlert).toBe(false);
    });

    it('@action openProvEditorModal - opens prov editor modal', () => {
        provenanceStore.openProvEditorModal(FILE_ID);
        expect(provenanceStore.provEditorModal.open).toBe(true);
        expect(provenanceStore.provEditorModal.id).toBe(FILE_ID);
    });

    it('@action closeProvEditorModal - closes prov editor modal', () => {
        provenanceStore.closeProvEditorModal(FILE_ID);
        expect(provenanceStore.provEditorModal.open).toBe(false);
        expect(provenanceStore.provEditorModal.id).toBe(FILE_ID);
    });

    it('@action toggleProvEditor - toggles prov editor', () => {
        provenanceStore.toggleProvEdit = false;
        provenanceStore.toggleProvEditor();
        expect(provenanceStore.toggleProvEdit).toBe(true);
        provenanceStore.toggleProvEditor();
        expect(provenanceStore.toggleProvEdit).toBe(false);
    });

    it('@action toggleGraphLoading - toggles graph loading status off', () => {
        provenanceStore.drawerLoading = true;
        provenanceStore.toggleGraphLoading();
        expect(provenanceStore.drawerLoading).toBe(false);
    });

    it('@action toggleProvView - toggles provenance graph drawer', () => {
        provenanceStore.toggleProv = false;
        provenanceStore.toggleProvView();
        expect(provenanceStore.toggleProv).toBe(true)
        provenanceStore.toggleProvView();
        expect(provenanceStore.toggleProv).toBe(false)
    });

    it('@action toggleProvView CLEAR OLD GRAPH - toggles provenance graph drawer and clears graph', () => {
        provenanceStore.provEdges = fake.graph_json.graph.relationships;
        provenanceStore.provNodes = fake.graph_json.graph.nodes;
        expect(provenanceStore.provEdges.length).toBe(1)
        expect(provenanceStore.provNodes.length).toBe(2)
        provenanceStore.toggleProv = true;
        provenanceStore.toggleProvView();
        expect(provenanceStore.toggleProv).toBe(false)
        expect(provenanceStore.provEdges.length).toBe(0)
        expect(provenanceStore.provNodes.length).toBe(0)
    });

    it('@action toggleProvNodeDetails - toggles provenance node details on/off', () => {
        provenanceStore.showProvDetails = false;
        provenanceStore.toggleProvNodeDetails();
        expect(provenanceStore.showProvDetails).toBe(true)
        provenanceStore.toggleProvNodeDetails();
        expect(provenanceStore.showProvDetails).toBe(false)
    });

    it('@action toggleAddEdgeMode - toggles addEdgeMode on/off', () => {
        provenanceStore.addEdgeMode = false;
        provenanceStore.toggleAddEdgeMode(EDGE_ID);
        expect(provenanceStore.addEdgeMode).toBe(true)
    });

    it('@action toggleAddEdgeMode - toggles addEdgeMode on/off', () => {
        provenanceStore.addEdgeMode = true;
        provenanceStore.toggleAddEdgeMode(null);
        expect(provenanceStore.addEdgeMode).toBe(false)
    });

    it('@action createGraph - sets `graph` from json to network', () => {
        provenanceStore.network = {};
        provenanceStore.createGraph(fake.graph_json.graph);
        expect(provenanceStore.network.nodes[0].id).toBe(ACTIVITY_ID);
    });

    it('@action clearProvFileVersions - clears prov file version list after file picker closes', () => {
        provenanceStore.provFileVersions = fake.file_version_list_json.results;
        expect(provenanceStore.provFileVersions.length).toBe(1);
        provenanceStore.clearProvFileVersions();
        expect(provenanceStore.provFileVersions.length).toBe(0);
    });

    it('@action getProvFileVersions - gets a list of file versions for the prov file picker', () => {
        transportLayer.getProvFileVersions = jest.fn((id) => respondOK(fake.file_version_list_json));
        provenanceStore.getProvFileVersions(FILE_ID);
        return sleep(1).then(() => {
            expect(transportLayer.getProvFileVersions).toHaveBeenCalledTimes(1);
            expect(transportLayer.getProvFileVersions).toHaveBeenCalledWith(FILE_ID);
            expect(provenanceStore.provFileVersions.length).toBe(1);
            expect(provenanceStore.provFileVersions[0].id).toBe('TEST_FILE_VERSION_1');
        });
    });

    it('@action showDeleteRelationsBtn - hides/shows `delete relation` button', () => {
        provenanceStore.dltRelationsBtn = true;
        provenanceStore.showProvControlBtns([fake.relation_json], [fake.prov_file_node_json]);
        expect(provenanceStore.dltRelationsBtn).toBe(false);
    });

    it('@action showProvControlBtns - hides/shows prov editor control buttons', () => {
        provenanceStore.showProvControlBtns();
        expect(provenanceStore.removeFileFromProvBtn).toBe(false);
        expect(provenanceStore.dltRelationsBtn).toBe(false);
    });

    it('@action showProvControlBtns - hides/shows prov editor control buttons', () => {
        provenanceStore.removeFileFromProvBtn = true;
        provenanceStore.dltRelationsBtn = true;
        provenanceStore.showProvControlBtns();
        expect(provenanceStore.removeFileFromProvBtn).toBe(false);
        expect(provenanceStore.dltRelationsBtn).toBe(false);
    });

    it('@action selectNodesAndEdges - sets selected nodes and edges', () => {
        provenanceStore.selectNodesAndEdges([fake.relation_json], fake.prov_file_node_json);
        expect(provenanceStore.selectedEdge.id).toBe(fake.relation_json.id);
        expect(provenanceStore.selectedNode.id).toBe(fake.prov_file_node_json.id);
    });

    it('@action saveGraphZoomState - saves the graph scale and zoom state position to be used during graph re-render', () => {
        provenanceStore.saveGraphZoomState(fake.scale_position_data.scale, fake.scale_position_data.position);
        expect(provenanceStore.scale).toBe(fake.scale_position_data.scale);
        expect(provenanceStore.position.x).toBe(fake.scale_position_data.position.x);
        expect(provenanceStore.position.y).toBe(fake.scale_position_data.position.y);
    });

    it('@action switchRelationFromTo - switches the from and to node direction of a `derivedFrom` relation', () => {
        expect(provenanceStore.openConfirmRel).toBe(false);
        provenanceStore.switchRelationFromTo(fake.edge_data.from, fake.edge_data.to);
        expect(provenanceStore.openConfirmRel).toBe(true);
        expect(provenanceStore.relFrom).toBe(fake.edge_data.to);
        expect(provenanceStore.relTo).toBe(fake.edge_data.from);
    });

    it('@action addFileToGraph - adds a file to the provenance graph', () => {
        provenanceStore.provNodes = [fake.prov_activity_json];
        provenanceStore.currentGraph = {};
        expect(provenanceStore.provNodes.length).toBe(1);
        provenanceStore.addFileToGraph(fake.prov_file_node_json);
        expect(provenanceStore.provNodes.length).toBe(2);
        expect(provenanceStore.renderGraph).toBe(true);
    });


    it('@action editProvActivity - edits provenance activity name and description', () => {
        provenanceStore.renderGraph = false;
        expect(provenanceStore.renderGraph).toBe(false);
        provenanceStore.provNodes = [];
        transportLayer.editProvActivity = jest.fn((id, name, desc) => respondOK(fake.prov_activity_json));
        provenanceStore.editProvActivity(ACTIVITY_ID, ACTIVITY_NAME, ACTIVITY_DESCRIPTION);
        return sleep(1).then(() => {
            expect(transportLayer.editProvActivity).toHaveBeenCalledTimes(1);
            expect(transportLayer.editProvActivity).toHaveBeenCalledWith(ACTIVITY_ID, ACTIVITY_NAME, ACTIVITY_DESCRIPTION);
            expect(provenanceStore.provNodes.length).toBe(2);
            expect(provenanceStore.provNodes[1].id).toBe(ACTIVITY_ID);
            expect(provenanceStore.showProvCtrlBtns).toBe(false);
            expect(provenanceStore.renderGraph).toBe(true);
        });
    });

    it('@action addProvActivity - adds a new provenance activity ', () => {
        provenanceStore.renderGraph = false;
        expect(provenanceStore.renderGraph).toBe(false);
        provenanceStore.provNodes = [];
        transportLayer.addProvActivity = jest.fn((name, desc) => respondOK(fake.prov_activity_json));
        provenanceStore.addProvActivity(ACTIVITY_NAME, ACTIVITY_DESCRIPTION);
        return sleep(1).then(() => {
            expect(transportLayer.addProvActivity).toHaveBeenCalledTimes(1);
            expect(transportLayer.addProvActivity).toHaveBeenCalledWith(ACTIVITY_NAME, ACTIVITY_DESCRIPTION);
            expect(provenanceStore.provNodes.length).toBe(3);
            expect(provenanceStore.provNodes[2].id).toBe(ACTIVITY_ID);
            expect(provenanceStore.renderGraph).toBe(true);
        });
    });

    it('@action deleteProvItem RELATION - deletes a provenance activity or relation', () => {
        provenanceStore.provEdges = fake.graph_json.graph.relationships;
        provenanceStore.provEdges.push(fake.relation_json);
        expect(provenanceStore.provEdges.length).toBe(2);
        transportLayer.deleteProvItem = jest.fn((data, id) => respondOK());
        provenanceStore.deleteProvItem(fake.relation_json, fake.relation_json.id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteProvItem).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteProvItem).toHaveBeenCalledWith(fake.relation_json.id, 'relations/');
            expect(provenanceStore.provEdges.length).toBe(1);
        });
    });

    it('@action deleteProvItem ACTIVITY - deletes a provenance activity or relation', () => {
        provenanceStore.provNodes = fake.graph_json.graph.nodes;
        expect(provenanceStore.provNodes.length).toBe(2);
        transportLayer.deleteProvItem = jest.fn((data, id) => respondOK());
        provenanceStore.deleteProvItem(fake.graph_json.graph.nodes[0], fake.graph_json.graph.nodes[0].id);
        return sleep(1).then(() => {
            expect(transportLayer.deleteProvItem).toHaveBeenCalledTimes(1);
            expect(transportLayer.deleteProvItem).toHaveBeenCalledWith(fake.graph_json.graph.nodes[0].id, 'activities/');
            expect(provenanceStore.provNodes.length).toBe(1);
        });
    });

    it('@action addProvRelation - adds a new relationship between nodes', () => {
        provenanceStore.provEdges = fake.graph_json.graph.relationships;
        expect(provenanceStore.provEdges.length).toBe(1);
        transportLayer.addProvRelation = jest.fn((kind, body) => respondOK(fake.relation_json));
        provenanceStore.addProvRelation(RELATION_KIND, {});
        return sleep(1).then(() => {
            expect(transportLayer.addProvRelation).toHaveBeenCalledTimes(1);
            expect(transportLayer.addProvRelation).toHaveBeenCalledWith(RELATION_KIND, {});
            expect(provenanceStore.provEdges.length).toBe(2);
        });
    });

    it('@action getProvenanceSuccess - gets the provenance graph nodes and edges', () => {
        provenanceStore.getProvenanceSuccess(fake.graph_json.graph, null);// params are graph and previous graph if applicable
        expect(provenanceStore.provNodes.length).toBe(2);
        expect(provenanceStore.provNodes[0].id).toBe(ACTIVITY_ID);
        expect(provenanceStore.provEdges[0].id).toBe(EDGE_ID);
        expect(provenanceStore.drawerLoading).toBe(false);
        expect(provenanceStore.showProvCtrlBtns).toBe(false);
        expect(provenanceStore.showProvDetails).toBe(false);
        expect(provenanceStore.dltRelationsBtn).toBe(false);
    });

    it('@action getWasGeneratedByNode - gets the wasGeneratedBy activity node', () => {
        transportLayer.getWasGeneratedByNode = jest.fn((id, prevGraph) => respondOK());
        provenanceStore.getWasGeneratedByNode(NODE_ID);
        expect(provenanceStore.drawerLoading).toBe(true);
        return sleep(1).then(() => {
            expect(transportLayer.getWasGeneratedByNode).toHaveBeenCalledTimes(1);
            expect(transportLayer.getWasGeneratedByNode).toHaveBeenCalledWith(NODE_ID);
        });
    });

    it('@action getActivities - gets all provenance activities', () => {
        transportLayer.getActivities = jest.fn(() => respondOK(fake.activities_json));
        provenanceStore.getActivities();
        return sleep(1).then(() => {
            expect(transportLayer.getActivities).toHaveBeenCalledTimes(1);
            expect(provenanceStore.activities.length).toBe(2);
            expect(provenanceStore.activities[0].id).toBe(ACTIVITY_ID);
        });
    });


});