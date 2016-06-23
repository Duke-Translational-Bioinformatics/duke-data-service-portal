import React from 'react';
import ReactDOM from 'react-dom';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import MoveItemModal from '../globalComponents/moveItemModal.jsx';
import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import IconButton from 'material-ui/lib/icon-button';

import SelectField from 'material-ui/lib/select-field';
import RaisedButton from 'material-ui/lib/raised-button';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import Fullscreen from 'material-ui/lib/svg-icons/navigation/fullscreen';
import FullscreenExit from 'material-ui/lib/svg-icons/navigation/fullscreen-exit';
import BorderColor from 'material-ui/lib/svg-icons/editor/border-color';
import Cancel from 'material-ui/lib/svg-icons/navigation/cancel';
import LeftNav from 'material-ui/lib/left-nav';

class Provenance extends React.Component {
    /**
     * Creates a provenance graph using the Vis.js library
     * Vis docs @ visjs.org/docs/network/
     */

    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            floatingErrorText: 'This field is required.',
            from: null,
            height: window.innerHeight,
            openAddAct: false,
            openConfirmRel: false,
            openDltAct: false,
            openDltRel: false,
            openEdit: false,
            openFileSearch: false,
            openRelWarn: false,
            relMsg: null,
            to: null,
            value: null,
            width: window.innerWidth < 580 ? window.innerWidth : window.innerWidth * .85
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        // Listen for resize changes when rotating device
        window.addEventListener('resize', this.handleResize);
        setTimeout(()=>{
            let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
            let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
            this.renderProvGraph(edges,nodes);
        },100);
    }

    componentWillUpdate(nextProps, nextState){
        let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        if(nextProps.addEdgeMode !== this.props.addEdgeMode){
        //Check if addEdgeMode has changed. If true render graph in add edge mode or with newly added edge
            this.renderProvGraph(edges, nodes);
        }
    }

    handleResize(e) {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth < 580 ? window.innerWidth : window.innerWidth * .85
        })
    }

    renderProvGraph(edge, node) {
        let nodes = new vis.DataSet(node);
        let edges = new vis.DataSet(edge);

        // create a network
        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            edges: {
                color: {
                    color:'#1976D2',
                    highlight:'#1565C0',
                    hover: '#1565C0',
                    opacity:1
                }
            },
            nodes: {
                shape: 'dot',
                size: 14,
                borderWidth: 1,
                borderWidthSelected: 3,
                font: {
                    color: '#343434',
                    size: 10,
                    face: 'roboto'
                },
                color: {
                    border: '#1565C0',
                    background: '#64B5F6',
                    highlight: {
                        border: '#1565C0',
                        background: '#2196F3'
                    },
                    hover: {
                        border: '#1565C0',
                        background: '#2196F3'
                    }
                }
            },
            interaction: {
                hover: true,
                selectable: true,
                tooltipDelay: 200
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 100,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                    direction: 'DU',        // UD, DU, LR, RL
                    sortMethod: 'directed'   // hubsize, directed
                }
            },
            manipulation: {
                enabled: false,
                addEdge: (data, callback) => {
                    let from = null;
                    let to = null;
                    let node1 = null;
                    let node2 = null;
                    let nodes = ProjectStore.provNodes;
                    let relationKind = null;
                    if (data.from == data.to) {
                        callback(null);
                    } else {
                        switch(this.state.value){
                            case 0:
                                relationKind = 'used';
                                break;
                            case 1:
                                relationKind = 'was_generated_by';
                                break;
                            case 2:
                                relationKind = 'was_derived_from';
                                break;
                        }
                        let getFromAndToNodes = () => {
                            nodes.forEach((node) => { //Todo: Insert logic here to enforce rules of relation types//////////
                                if (data.from === node.id) {
                                    node1 = node;
                                }
                                if (data.to === node.id) {
                                    node2 = node;
                                }
                            });
                            if(relationKind !== 'was_derived_from') {
                                if (node1.properties.kind === 'dds-file-version' && node2.properties.kind === 'dds-file-version') {
                                    this.setState({
                                        openRelWarn: true,
                                        relMsg: <h5>Only<u><i>Was Derived From</i></u> relations can go
                                            <u><i>from</i></u> files <u><i>to</i></u> files.
                                        </h5>
                                    });
                                }
                                if (node1.properties.kind === 'dds-activity' && node2.properties.kind === 'dds-activity') {
                                    this.setState({
                                        openRelWarn: true,
                                        relMsg: <h5>An <u><i>activity</i></u> can not have a relation to another <u><i>activity</i></u>
                                        </h5>
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
                                    this.addRelation(relationKind, from, to);
                                }
                            } else {
                                if (node1.properties.kind !== 'dds-file-version' || node2.properties.kind !== 'dds-file-version') {
                                    // Send error modal to user explaining rules of was_derived_from relation
                                    this.setState({
                                        openRelWarn: true,
                                        relMsg: <h5><u><i>Was Derived From</i></u> relations can only be created <u><i>from </i></u>
                                            files <u><i>to</i></u> files.
                                        </h5>
                                    });
                                } else {
                                    from = node1;
                                    to = node2;
                                    this.confirmDerivedFromRel(from, to);
                                }
                            }
                        };
                        getFromAndToNodes();
                        ProjectActions.toggleAddEdgeMode();
                        if(ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();
                        this.setState({value: null});
                        callback(null); // Disable default behavior and update dataset in the store instead
                    }
                }
            }
        };

        let container = ReactDOM.findDOMNode(this.refs.graphContainer);
        // remove old contents of dom node
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        let network = new vis.Network(container, data, options);

        if (ProjectStore.addEdgeMode) {
            if(ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();//Hide buttons while in add edge mode
            if(ProjectStore.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn([]);
            network.addEdgeMode();
        }

        network.on("select", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });

        network.on("click", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            if(params.nodes.length > 0) {
                if (nodeData.properties.kind !== 'dds-activity') {
                    network.unselectAll();
                }
                if (nodeData.properties.kind !== 'dds-file-version' && nodeData.id !== ProjectStore.selectedNode.id) {
                    if(!ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();
                    if(ProjectStore.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                }
                if (nodeData.properties.kind !== 'dds-activity' && ProjectStore.showProvCtrlBtns) {
                    network.unselectAll();
                    ProjectActions.showProvControlBtns();
                }
                if (nodeData.properties.kind !== 'dds-activity' && ProjectStore.dltRelationsBtn) {
                    network.unselectAll();
                    ProjectActions.showDeleteRelationsBtn(edgeData, nodeData);
                }
            }
            if (params.nodes.length === 0 && ProjectStore.showProvCtrlBtns) {//If clicked
            // on canvas only or on an edge while showProvCntrlBtns
                ProjectActions.showProvControlBtns(data);
                network.unselectAll();
                if(edgeData.length > 0) network.selectEdges([edgeData[0].id]);
            }
            if (params.edges.length === 0 && ProjectStore.dltRelationsBtn) {//If clicked on canvas only
                ProjectActions.showDeleteRelationsBtn(edgeData);
                network.unselectAll();
            }
            if (params.edges.length > 0 && params.nodes.length < 1){
                if(!ProjectStore.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                if(ProjectStore.showProvCtrlBtns && ProjectStore.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
            }
        });
    }

    render() {
        const addActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addNewActivity()}
                />
        ];
        const editActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.editActivity()}
                />
        ];
        const dltActivityActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteActivity(ProjectStore.selectedNode)}
                />
        ];
        const dltRelationActions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.handleClose()}/>,
                <FlatButton
                    label="Delete"
                    secondary={true}
                    keyboardFocused={true}
                    onTouchTap={() => this.deleteRelation(ProjectStore.selectedEdges[0])}//TODO: Fix this here
                    />
        ];
        const relationWarningActions = [
                <FlatButton
                    label="Okay"
                    secondary={true}
                    onTouchTap={() => this.handleClose()}/>
        ];
        const derivedRelActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="Switch"
                secondary={true}
                onTouchTap={() => this.switchRelationFromTo()}/>,
            <FlatButton
                label="Yes"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addRelation('was_derived_from', this.state.from, this.state.to )}
                />
        ];

        let fileName = this.props.entityObj ? this.props.entityObj.name : null;
        let addFile = 'addFile';
        let addAct = 'addAct';
        let dltAct = 'dltAct';
        let dltRel = 'dltRel';
        let editAct = 'editAct';
        let selectedNode = this.props.selectedNode ? this.props.selectedNode : null;
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
        let showDltRltBtn = this.props.dltRelationsBtn ? 'block' : 'none';

        return (
            <div>
                <LeftNav docked={false} width={this.state.width} openRight={true} open={this.props.toggleProv}>
                    <LeftNav width={220} openRight={true} open={this.props.toggleProvEdit}>
                        <div style={styles.provEditor}>
                            <IconButton style={styles.provEditor.toggleProvBtn}
                                        onTouchTap={() => this.toggleEditor()}>
                                <NavigationClose />
                            </IconButton>
                                <RaisedButton
                                id="addAct"
                                label="Add Activity"
                                labelStyle={styles.provEditor.btn.label}
                                style={styles.provEditor.btn}
                                onTouchTap={() => this.openModal(addAct)}/>
                            <RaisedButton
                                label="Add File"
                                labelStyle={styles.provEditor.btn.label}
                                style={styles.provEditor.btn}
                                onTouchTap={() => this.openModal(addFile)}/>
                            <SelectField value={this.state.value}
                                         id="selectRelation"
                                         onChange={this.handleSelectValueChange.bind(this, 'value')}
                                         floatingLabelText="Add Relation"
                                         floatingLabelStyle={{color: '#757575'}}
                                         errorText={this.state.errorText}
                                         errorStyle={styles.textStyles}
                                         style={styles.selectStyles}>
                                <MenuItem value={0} primaryText='used'/>
                                <MenuItem value={1} primaryText='was generated by'/>
                                <MenuItem value={2} primaryText='was derived from'/>
                            </SelectField><br/>
                            <RaisedButton
                                label="Edit Activity"
                                labelStyle={styles.provEditor.btn.label}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showBtns}}
                                onTouchTap={() => this.openModal(editAct)}/>
                            <RaisedButton
                                label="Delete Activity"
                                labelStyle={{color: '#F44336'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showBtns}}
                                onTouchTap={() => this.openModal(dltAct)}/>
                            <RaisedButton
                                label="Delete Relation"
                                labelStyle={{color: '#F44336'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showDltRltBtn}}
                                onTouchTap={() => this.openModal(dltRel)}/>
                            {this.props.addEdgeMode ?
                                <div style={styles.provEditor.addEdgeInstruction}>
                                    Click on a node and drag to another node to create a new relation. <br/>
                                    <span style={styles.provEditor.addEdgeInstruction.text}>Exit Add Relation Mode</span> <Cancel style={styles.cancelBtn} color={'#757575'} onTouchTap={() => this.toggleEdgeMode()}/>
                                </div> : ''}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Add Activity"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={addActions}
                            open={this.state.openAddAct}
                            onRequestClose={() => this.handleClose()}>
                            <form action="#" id="newActivityForm">
                                <TextField
                                    style={styles.textStyles}
                                    hintText="Activity Name"
                                    errorText={this.state.floatingErrorText}
                                    floatingLabelText="Activity Name"
                                    id="activityNameText"
                                    type="text"
                                    multiLine={true}
                                    onChange={this.handleFloatingError.bind(this)}/> <br/>
                                <TextField
                                    style={styles.textStyles}
                                    hintText="Activity Description"
                                    floatingLabelText="Activity Description"
                                    id="activityDescText"
                                    type="text"
                                    multiLine={true}/>
                            </form>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Are you sure you want to delete this activity?"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={dltActivityActions}
                            open={this.state.openDltAct}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Are you sure you want to delete this relation?"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={dltRelationActions}
                            open={this.state.openDltRel}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Can't create relation"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={relationWarningActions}
                            open={this.state.openRelWarn}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                            {this.state.relMsg}
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Please confirm this 'was derived from' relation"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={derivedRelActions}
                            open={this.state.openConfirmRel}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.help}>help</i>
                            <h6>Are you sure that the file <b>{this.state.to && this.state.to !== null ? this.state.to.label+' ' : ''}</b>
                            was derived from the file <b>{this.state.from && this.state.from !== null ? this.state.from.label+' ' : ''}</b>?</h6>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Edit Activity"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={editActions}
                            open={this.state.openEdit}
                            onRequestClose={() => this.handleClose()}>
                            <form action="#" id="newActivityForm">
                                <TextField
                                    autoFocus={true}
                                    onFocus={this.handleFloatingError.bind(this)}
                                    style={styles.textStyles}
                                    defaultValue={this.props.selectedNode.label}
                                    hintText="Activity Name"
                                    errorText={this.state.floatingErrorText}
                                    floatingLabelText="Activity Name"
                                    id="activityNameText"
                                    type="text"
                                    multiLine={true}
                                    onChange={this.handleFloatingError.bind(this)}/> <br/>
                                <TextField
                                    disabled={false}
                                    style={styles.textStyles}
                                    hintText="Activity Description"
                                    floatingLabelText="Activity Description"
                                    id="activityDescText"
                                    type="text"
                                    multiLine={true}/>
                            </form>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Add File to Graph"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={addActions}
                            open={this.state.openFileSearch}
                            onRequestClose={() => this.handleClose()}>
                        </Dialog>
                    </LeftNav>
                    <IconButton tooltip="Edit Graph"
                                style={styles.provEditor.toggleEditor}
                                onTouchTap={() => this.toggleEditor()}>
                        <BorderColor color="#424242" />
                    </IconButton>
                    <IconButton style={styles.provEditor.toggleProvBtn}
                                onTouchTap={() => this.toggleProv()}>
                        <NavigationClose />
                    </IconButton>
                    <IconButton tooltip={this.state.width === window.innerWidth ? "Exit Fullscreen" : "Fullscreen Mode"}
                                tooltipPosition="bottom-right"
                                style={styles.provEditor.toggleFullscreenBtn}
                                onTouchTap={() => this.toggleFullscreen()}>
                        {this.state.width === window.innerWidth ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                    <h5 className="mdl-color-text--grey-800"
                        style={styles.provEditor.title}>
                        Provenance
                    </h5>
                    <div>
                        <div id="graphContainer" ref="graphContainer"
                             style={{
                             marginTop: 50,
                             maxWidth: this.state.width,
                             height: this.state.height,
                             float: 'left'}}
                             className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        </div>
                    </div>
                </LeftNav>
            </div>
        );
    }

    addNewActivity() {
        if (this.state.floatingErrorText) {
            return null
        } else {
            let name = document.getElementById('activityNameText').value;
            let desc = document.getElementById('activityDescText').value;
            ProjectActions.addProvActivity(name, desc);
            this.setState({
                openAddAct: false,
                floatingErrorText: 'This field is required.'
            });
        }
    }

    addRelation(kind, from, to) {
        ProjectActions.buildRelationBody(kind, from, to);
        this.setState({
            openConfirmRel: false
        });
    }

    confirmDerivedFromRel(from, to) {
        this.setState({
            from: from,
            to: to,
            openConfirmRel: true
        });
    }

    editActivity() {
        let id = this.props.selectedNode.id;
        let actName = this.props.selectedNode.label;
        if (this.state.floatingErrorText) {
            return null
        } else {
            let name = document.getElementById('activityNameText').value;
            let desc = document.getElementById('activityDescText').value;
            ProjectActions.editProvActivity(id, name, desc, actName);
            this.setState({
                openEdit: false,
                floatingErrorText: 'This field is required.'
            });
        }
    }

    openModal(id) {
        if(id === 'addFile') this.setState({openFileSearch: true});
        if(id === 'addAct') this.setState({openAddAct: true});
        if(id === 'editAct') this.setState({openEdit: true});
        if(id === 'dltAct') this.setState({openDltAct: true});
        if(id === 'dltRel') this.setState({openDltRel: true});
    }

    deleteActivity(node) {
        //Todo: delete nodes and or edges here
        let id = this.props.params.id;
        ProjectActions.deleteProvActivity(node, id);
        this.setState({openDltAct: false});
    }

    deleteRelation(edge) {
        //Todo: delete nodes and or edges here
        let id = this.props.params.id;
        ProjectActions.deleteProvRelation(edge, id);
        this.setState({openDltAct: false});
    }

    handleClose() {
        this.setState({
            openAddAct: false,
            openConfirmRel: false,
            openDltAct: false,
            openDltRel: false,
            openEdit: false,
            openFileSearch: false,
            openRelWarn: false
        });
    }

    handleFloatingError(e) {
        this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
    }

    handleSelectValueChange(event, index, value) {
        if(window.innerWidth < 480) this.toggleEditor();
        ProjectActions.toggleAddEdgeMode(value);
        this.setState({
            value: value,
            errorText: null
        });
    }

    switchRelationFromTo(){
        this.setState({
            from: this.state.to,
            to: this.state.from,
            openConfirmRel: true
        });
    }

    toggleEdgeMode() {
        ProjectActions.toggleAddEdgeMode();
        this.setState({value: null});
    }

    toggleFullscreen() {
        let width = this.state.width !== window.innerWidth ? window.innerWidth
            : window.innerWidth * .85;
        this.setState({width: width});
    }


    toggleProv() {
        ProjectActions.toggleProvView();
    }

    toggleEditor() {
        ProjectActions.toggleProvEditor();
    }
}

var styles = {
    cancelBtn: {
        fontSize: 18
    },
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    help: {
        fontSize: 48,
        textAlign: 'center',
        color: '#235F9C'
    },
    provEditor:{
        display: 'flex',
        justifyContent: 'center',
        flexFlow: 'row wrap',
        marginTop: 140,
        addEdgeInstruction: {
            margin: 20,
            text: {
                color:'#757575'
            }
        },
        btn: {
            zIndex: 9999,
            margin: 10,
            width: '80%',
            label: {
                color: '#235F9C'
            }
        },
        toggleFullscreenBtn: {
            position: 'absolute',
            top: 130,
            left: 2,
            zIndex: 9999
        },
        toggleProvBtn: {
            position: 'absolute',
            top: 98,
            left: 2,
            zIndex: 9999
        },
        title: {
            margin: '112px 0px 0px 48px',
            fontWeight: 100
        },
        toggleEditor: {
            position: 'absolute',
            top: 100,
            right: 10,
            zIndex: 200
        }
    },
    selectStyles: {
        marginTop: -20,
        maxWidth: '80%',
        minWidth: 160,
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    textStyles: {
        textAlign: 'left',
        fontColor: '#303F9F'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default Provenance;