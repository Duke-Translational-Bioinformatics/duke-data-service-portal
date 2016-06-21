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
import Cancel from 'material-ui/lib/svg-icons/navigation/cancel';
import LeftNav from 'material-ui/lib/left-nav';

class Provenance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            floatingErrorText: 'This field is required.',
            openAddAct: false,
            openDltAct: false,
            openDltRel: false,
            openEdit: false,
            openFileSearch: false,
            value: null
        };
    }

    componentDidMount() {
        setTimeout(()=>{
            let e = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
            let n = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
            this.renderProvGraph(e,n);
        },100);
    }

    componentWillUpdate(nextProps, nextState){
        let e = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let n = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        if(nextProps.addEdgeMode !== this.props.addEdgeMode){
        //Check if addEdgeMode has changed. If true render graph in add edge mode
            this.renderProvGraph(e, n);
        }
    }

    renderProvGraph(e, n) {
        let nodes = new vis.DataSet(n);
        let edges = new vis.DataSet(e);

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
                addEdge: (data, callback) => {
                    if (data.from == data.to) {
                        callback(null);
                    } else {
                        let nodes = ProjectStore.provNodes;
                        //Todo: Need to access state so I can get value of select and setState of value back to null
                        //Todo: post new relation and make fetch call to update dataset !!!!!!!!!!!!!!!!!!!!!!!!!!!
                        nodes.forEach((node) => { //Todo: Insert logic here to enforce rules of relation types//////////
                            if(data.from === node.id){// Todo: Build 'from' object????
                                console.log('from: '+node.properties.kind)
                            }
                            if(data.to === node.id){// Todo: Build 'to' object????
                                console.log('to: '+node.properties.kind)
                            }
                        });
                        this.setState({
                            value: null
                        });
                        ProjectActions.toggleAddEdgeMode();
                        if(ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();
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
            if(ProjectStore.showProvCtrlBtns) ProjectActions.showProvControlBtns();//Hide buttons while in add edge mode
            if(ProjectStore.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn([]);
            network.addEdgeMode();
        }

        network.on("select", function (params) {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });

        network.on("click", function (params) {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            if(params.nodes.length > 0) {
                //Todo:Send nodes and edge ids to be deleted to store.Enforce that you can only delete activities/relations
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

        let fileName = this.props.entityObj ? this.props.entityObj.name : null;
        let addFile = 'addFile';
        let addAct = 'addAct';
        let dltAct = 'dltAct';
        let dltRel = 'dltRel';
        let editAct = 'editAct';
        let selectedNode = this.props.selectedNode ? this.props.selectedNode : null;
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
        let showDltRltBtn = this.props.dltRelationsBtn ? 'block' : 'none';
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
                                label="Edit Activity"
                                labelStyle={{color: '#235F9C'}}
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
                                <div style={{margin: 20}}>
                                    Click on a node and drag to another node to create a new relation. <br/>
                                    <span style={{color:'#757575'}}>Exit Add Relation Mode</span> <Cancel style={styles.cancelBtn} color={'#757575'} onTouchTap={() => this.toggleEdgeMode()}/>
                                </div> : ''}
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
                            actions={dltActivityActions}
                            open={this.state.openDltAct}
                            onRequestClose={() => this.handleClose()}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
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
        if(id === 'dltAct') this.setState({openDltAct: true});
        if(id === 'dltRel') this.setState({openDltRel: true});
    }

    deleteActivity(node) {
        //Todo: delete nodes and or edges here
        let id = this.props.params.id;
        ProjectActions.deleteProvActivity(node, id);
        this.setState({
            openDltAct: false
        });
    }

    deleteRelation(edge) {
        //Todo: delete nodes and or edges here
        let id = this.props.params.id;
        ProjectActions.deleteProvRelation(edge, id);
        this.setState({
            openDltAct: false
        });
    }

    handleClose() {
        this.setState({
            openAddAct: false,
            openDltAct: false,
            openDltRel: false,
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
        ProjectActions.toggleAddEdgeMode(value); //TODO: Store relation type in store for access when creating relation
        this.setState({
            value: value,
            errorText: null
        });
    }

    toggleEdgeMode() {
        ProjectActions.toggleAddEdgeMode();
        this.setState({
            value: null
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