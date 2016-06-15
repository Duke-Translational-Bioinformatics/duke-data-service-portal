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

import Divider from 'material-ui/lib/divider';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Slider from 'material-ui/lib/slider';
import SelectField from 'material-ui/lib/select-field';
import RaisedButton from 'material-ui/lib/raised-button';

import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import LeftNav from 'material-ui/lib/left-nav';

class Provenance extends React.Component {

    constructor() {
        this.state = {
            errorText: null,
            floatingErrorText: 'This field is required.',
            openAddAct: false,
            openDlt: false,
            openEdit: false,
            openFileSearch: false,
            value: null
        }
    }

    componentDidMount() {
        setTimeout(()=>{
            let e = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
            let n = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
            this.renderProvGraph(e, n);
        },100);
    }

    componentWillUpdate(nextProps, nextState){
        let relInstructions = document.createElement("p");
        let e = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let n = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        if(nextProps.addEdgeMode){ //Check if addEdge state has changed. If true render graph in add edge mode
            this.renderProvGraph(e, n);//TODO: Toggle editor buttons if they are showing
        }
    }

    renderProvGraph(e, n) {
        let showUpdate = false;
        let newEdge = null;
        let nodes = new vis.DataSet(n);
        let edges = new vis.DataSet(e);

        //add edges
        function addNewEdge(newEdge) {
            edges.add([newEdge]); //Todo: post new relation and make fetch call to update dataset
        }

        // create a network
        let data = {
            nodes: nodes,
            edges: edges
        };

        let options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            nodes: {
                shape: 'dot',
                size: 16
            },
            interaction: {
                hover: true,
                selectable: true,
                tooltipDelay: 200,
                multiselect: true
            },
            layout: {
                randomSeed: 1,
                improvedLayout: true,
                hierarchical: {
                    enabled: true,
                    levelSeparation: 150,
                    nodeSpacing: 200,
                    treeSpacing: 200,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                    direction: 'DU',        // UD, DU, LR, RL
                    sortMethod: 'directed'   // hubsize, directed
                }
            },
            manipulation: {
                enabled: false,
                //addNode: function (data, callback) {
                //    // filling in the popup DOM elements
                //    document.getElementById('operation').innerHTML = "Add Node";
                //    document.getElementById('node-id').value = data.id;
                //    document.getElementById('node-label').value = data.label;
                //    document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                //    document.getElementById('cancelButton').onclick = clearPopUp.bind();
                //    document.getElementById('network-popUp').style.display = 'block';
                //},
                //editNode: function (data, callback) {
                //    // filling in the popup DOM elements
                //    if (data.properties.kind == "dds-activity") {
                //        document.getElementById('operation').innerHTML = "Edit Node";
                //        document.getElementById('node-id').value = data.id;
                //        document.getElementById('node-label').value = data.label;
                //        document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
                //        document.getElementById('cancelButton').onclick = cancelEdit.bind(this, callback);
                //        document.getElementById('network-popUp').style.display = 'block';
                //    }
                //},
                addEdge: function (data, callback) {
                    if (data.from == data.to) {
                        callback(null);
                    } else {
                        newEdge = {from: data.from, to: data.to, id: Math.random(), kind: "used", arrows: "from"};
                        addNewEdge(newEdge);
                        ProjectActions.toggleAddEdgeMode();
                        callback(data);
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
            if(ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();
            //Todo: Use event listeners to get location of start and end node??
            network.once("hoverNode", function (params) {
                let node = params.node;
                let nodeList = nodes.get(params);
                function getNode(nodeList){
                    return nodeList.id === node;
                }
                nodeList.find(getNode);
                console.log(nodeList.find(getNode));
                setTimeout(()=> {
                    network.addEdgeMode();
                }, 50);
            });
            //network.addEdgeMode();
        }

        network.on("select", function (params) {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });

        network.on("click", function (params) {
            if(params.nodes.length > 0) {
                let nodeData = nodes.get(params.nodes[0]);
                //Todo:Send nodes and edge ids to be deleted to store.Enforce that you can only delete activities/relations
                if (nodeData.kind !== 'dds-file-version' && nodeData.id !== ProjectStore.selectedNode.id) {
                    ProjectActions.showProvControlBtns();
                }
                if (nodeData.kind !== 'dds-activity' && ProjectStore.showProvCtrlBtns) {
                    network.unselectAll();
                    ProjectActions.showProvControlBtns();
                }
            }
            if(params.nodes.length === 0 && ProjectStore.showProvCtrlBtns) {
                ProjectActions.showProvControlBtns(data);
                network.unselectAll();
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
        const dltActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteSelected(ProjectStore.selectedNode)}
                />
        ];

        let fileName = this.props.entityObj ? this.props.entityObj.name : null;
        let addFile = 'addFile';
        let addAct = 'addAct';
        let dltAct = 'dltAct';
        let editAct = 'editAct';
        let selectedNode = this.props.selectedNode ? this.props.selectedNode : null;
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
        let width = window.innerWidth * .85;

        return (
            <div>
                <LeftNav docked={false} width={width} openRight={true} open={this.props.toggleProv}>
                    <LeftNav width={220} openRight={true} open={this.props.toggleProvEdit}>
                        <div
                             style={{display: 'flex', justifyContent: 'center', flexFlow: 'row wrap', marginTop: 140}}>
                            <NavigationClose style={{position: 'absolute', top: 110, left: 10, zIndex: 9999}}
                                             onTouchTap={() => this.toggleEditor()}/>
                            <RaisedButton
                                id="addAct"
                                label="Add Activity"
                                labelStyle={{color: '#235F9C'}}
                                style={{zIndex: 9999, margin: 10, width: '80%'}}
                                onTouchTap={() => this.openModal(addAct)}/>
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
                                label="Add File"
                                labelStyle={{color: '#235F9C'}}
                                style={{zIndex: 9999, margin: 10, width: '80%'}}
                                onTouchTap={() => this.openModal(addFile)}/>
                            <RaisedButton
                                label="Edit Selected"
                                labelStyle={{color: '#235F9C'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showBtns}}
                                onTouchTap={() => this.openModal(editAct)}/>
                            <RaisedButton
                                label="Delete Selected"
                                labelStyle={{color: '#F44336'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showBtns}}
                                onTouchTap={() => this.openModal(dltAct)}/>
                            {this.props.addEdgeMode ? <div style={{margin: 10}}>Click on a node and drag to another node to create a new relation</div> : ''}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
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
                            title="Are you sure you want to delete this activity?"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={dltActions}
                            open={this.state.openDlt}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
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
                            title="Add File to Graph"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={addActions}
                            open={this.state.openFileSearch}
                            onRequestClose={() => this.handleClose()}>
                        </Dialog>
                    </LeftNav>
                    <i className="material-icons" style={{position: 'absolute', top: 110, right: 10, zIndex: 200}}
                       onTouchTap={() => this.toggleEditor()}>border_color</i>
                    <NavigationClose style={{position: 'absolute', top: 110, left: 10, zIndex: 9999}}
                                     onTouchTap={() => this.toggleProv()}/>
                    <h4 style={styles.detailsTitle}>Provenance</h4>
                    <div>
                        <div id="graphContainer" ref="graphContainer"
                             style={{marginTop: 50,maxWidth: width* .75,height: window.innerHeight, float: 'left'}}
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
        if(id === 'dltAct') this.setState({openDlt: true});
    }

    deleteSelected(node) {
        //Todo: delete nodes and or edges here
        let id = this.props.params.id;
        ProjectActions.deleteProvActivity(node, id);
        this.setState({
            openDlt: false
        });
    }

    handleClose() {
        this.setState({
            openAddAct: false,
            openDlt: false,
            openEdit: false,
            openFileSearch: false
        });
    }

    handleFloatingError(e) {
        this.setState({
            floatingErrorText: e.target.value ? '' : 'This field is required.'
        });
    }

    handleSelectValueChange(event, index, value) {
        if(window.innerWidth < 480) this.toggleEditor();
        ProjectActions.toggleAddEdgeMode();
        this.setState({
            value: value,
            errorText: null
        });
    }

    toggleProv() {
        //this.renderProvGraph(); //Re-render graph after toggle
        ProjectActions.toggleProvView();
    }

    toggleEditor() {
        ProjectActions.toggleProvEditor();
    }
}

var styles = {
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