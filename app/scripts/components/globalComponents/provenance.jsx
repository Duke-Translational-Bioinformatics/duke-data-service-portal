import React from 'react';
import ReactDOM from 'react-dom';
import graphOptions from '../../graphConfig';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BorderColor from 'material-ui/lib/svg-icons/editor/border-color';
import Cancel from 'material-ui/lib/svg-icons/navigation/cancel';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import Fullscreen from 'material-ui/lib/svg-icons/navigation/fullscreen';
import FullscreenExit from 'material-ui/lib/svg-icons/navigation/fullscreen-exit';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import TextField from 'material-ui/lib/text-field';

class Provenance extends React.Component {
    /**
     * Creates a provenance graph using the Vis.js library
     * Vis docs @ visjs.org/docs/network/
     */

    constructor(props) {
        super(props);
        this.state = {
            delEdge: null,
            errorText: null,
            floatingErrorText: 'This field is required.',
            height: window.innerHeight,
            network: null,
            showDetails: false,
            value: null,
            width: window.innerWidth
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        // Listen for resize changes when rotating device
        window.addEventListener('resize', this.handleResize);
        setTimeout(()=>{// Make sure that provEdges and nodes are set before rendering graph the first time
            let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
            let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
            this.renderProvGraph(edges,nodes);
        },100);
    }

    componentWillUpdate(nextProps, nextState) {
        let scale = this.props.scale;// Todo: Remove this if not using saveZoomState
        let position = this.props.position;// Todo: Remove this if not using saveZoomState
        let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        //if(nextProps.addEdgeMode !== this.props.addEdgeMode){
        ////Check if addEdgeMode has changed. If true render graph in add edge mode or with newly added edge
        //    if(nextProps.addEdgeMode) this.renderProvGraph(edges, nodes);
        //}
        if(nextProps.updatedGraphItem !== this.props.updatedGraphItem && nextProps.updatedGraphItem.length > 0){
            this.renderProvGraph(edges, nodes, scale, position);// Todo: Remove extra params if not using saveZoomState
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize(e) {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    renderProvGraph(edge, node, scale, position) {
        let edges = new vis.DataSet(edge);
        let nodes = new vis.DataSet(node);

        let onAddEdgeMode = (data, callback) => {
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
                ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
                ProjectActions.getFromAndToNodes(data, relationKind, nodes);
                ProjectActions.toggleAddEdgeMode();
                if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();
                this.setState({value: null});
                callback(null); // Disable default behavior and update dataset in the store instead
            }
        };

        // create a network
        let data = {
            nodes: nodes,
            edges: edges
        };
        // import options from graphConfig
        let options = graphOptions;

        let container = ReactDOM.findDOMNode(this.refs.graphContainer);
        // remove old contents of dom node
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        this.state.network = new vis.Network(container, data, options);
        //Add manipulation options to network options so that addEdgeMode is defined
        this.state.network.setOptions({manipulation: {
            enabled: false,
            addEdge: onAddEdgeMode
        }});
        if(scale !== null && position !== null) {
            this.state.network.moveTo({
                position: position,
                scale: scale
            });
        }

        this.state.network.on("select", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });

        this.state.network.on("doubleClick", (params) => { // Todo: show more nodes on graph on double click event
            nodes.add({
                id: 123,
                label: 'testAddNode',
                labels: 'test',
                properties: {},
                shape: 'box',
                color: '#1DE9B6',
                title:'<Card style="margin: 10px"><a href="#">File Name</a><p>date: date</p><p>size: size</p></Card>'
            })
        });

        this.state.network.on("click", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);

            if(params.nodes.length > 0) {
                this.setState({showDetails: true});
                if (nodeData.properties.kind !== 'dds-activity') {
                    this.state.network.unselectAll();
                }
                if (nodeData.properties.kind !== 'dds-file-version' && nodeData.id !== this.props.selectedNode.id) {
                    if(!this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();
                    if(this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                }
                if (nodeData.properties.kind !== 'dds-activity' && this.props.showProvCtrlBtns) {
                    this.state.network.unselectAll();
                    ProjectActions.showProvControlBtns();
                }
                if (nodeData.properties.kind !== 'dds-activity' && this.props.dltRelationsBtn) {
                    this.state.network.unselectAll();
                    ProjectActions.showDeleteRelationsBtn(edgeData, nodeData);
                }
            }
            if (params.nodes.length === 0 && this.props.showProvCtrlBtns) {
                //If clicked on canvas only or on an edge while showProvCntrlBtns
                this.setState({showDetails: false});
                ProjectActions.showProvControlBtns();
                this.state.network.unselectAll();
                if(edgeData.length > 0) this.state.network.selectEdges([edgeData[0].id]);
            }
            if (params.edges.length === 0 && this.props.dltRelationsBtn) {//If clicked on canvas only
                this.setState({showDetails: false});
                ProjectActions.showDeleteRelationsBtn(edgeData);
                this.state.network.unselectAll();
            }
            if (params.edges.length > 0 && params.nodes.length < 1){
                this.setState({showDetails: false});
                if(!this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                if(this.props.showProvCtrlBtns && this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
            }
            if(params.edges.length === 0 && params.nodes.length === 0) this.setState({showDetails: false});
        });
    }

    render() {
        const addActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('addAct')}/>,
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
                onTouchTap={() => this.handleClose('editAct')}/>,
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
                onTouchTap={() => this.handleClose('dltAct')}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteActivity(this.props.selectedNode)}
                />
        ];
        const dltRelationActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('delRel')}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteRelation(this.props.selectedEdges[0])}//TODO: Fix this here
                />
        ];
        const relationWarningActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={() => this.handleClose('relWarning')}/>
        ];
        const derivedRelActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('confirmRel')}/>,
            <FlatButton
                label="Switch"
                secondary={true}
                onTouchTap={() => this.switchRelations(this.props.relFrom, this.props.relTo)}/>,
            <FlatButton
                label="Yes"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addDerivedFromRelation('was_derived_from', this.props.relFrom, this.props.relTo)}
                />
        ];

        let fileName = this.props.entityObj ? this.props.entityObj.name : null;
        let addFile = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addFile' ? this.props.provEditorModal.open : false;
        let addAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addAct' ? this.props.provEditorModal.open : false;
        let dltAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'dltAct' ? this.props.provEditorModal.open : false;
        let dltRel = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'dltRel' ? this.props.provEditorModal.open : false;
        let editAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'editAct' ? this.props.provEditorModal.open : false;
        let openRelWarn = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'relWarning' ? this.props.provEditorModal.open : false;
        let openConfirmRel = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'confirmRel' ? this.props.provEditorModal.open : false;
        let drvFrmMsg = this.props.relMsg && this.props.relMsg === 'wasDerivedFrom' ?
            <h5>Only<u><i>Was Derived From</i></u> relations can go
                <u><i> from </i></u> files <u><i>to</i></u> files.</h5> : '';
        let actToActMsg = this.props.relMsg && this.props.relMsg === 'actToActMsg' ?
            <h5>An <u><i>activity</i></u> can not have a relation to another <u><i>activity</i></u></h5> : '';
        let notFileToFile = this.props.relMsg && this.props.relMsg === 'notFileToFile' ?
            <h5><u><i>Was Derived From</i></u> relations can only be created <u><i>from </i></u>
                files <u><i>to</i></u> files.</h5> : '';
        let selectedNode = this.props.selectedNode ? this.props.selectedNode : null;
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
        let showDltRltBtn = this.props.dltRelationsBtn ? 'block' : 'none';

        return (
            <div>
                <LeftNav disableSwipeToOpen={true} width={this.state.width} openRight={true} open={this.props.toggleProv}>
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
                                onTouchTap={() => this.openModal('addAct')}/>
                            <RaisedButton
                                label="Add File"
                                labelStyle={styles.provEditor.btn.label}
                                style={styles.provEditor.btn}
                                onTouchTap={() => this.openModal('addFile')}/>
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
                                onTouchTap={() => this.openModal('editAct')}/>
                            <RaisedButton
                                label="Delete Activity"
                                labelStyle={{color: '#F44336'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showBtns}}
                                onTouchTap={() => this.openModal('dltAct')}/>
                            <RaisedButton
                                label="Delete Relation"
                                labelStyle={{color: '#F44336'}}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showDltRltBtn}}
                                onTouchTap={() => this.openModal('dltRel')}/>
                            {this.props.addEdgeMode ?
                                <div style={styles.provEditor.addEdgeInstruction}>
                                    Click on a node and drag to another node to create a new relation. <br/>
                                    <span style={styles.provEditor.addEdgeInstruction.text}>Exit Add Relation Mode</span> <Cancel style={styles.cancelBtn} color={'#757575'} onTouchTap={() => this.toggleEdgeMode()}/>
                                </div> : ''}
                            {this.state.showDetails ?
                                <div style={styles.provEditor.addEdgeInstruction}>
                                    <span>{this.props.selectedNode.label}</span><br/>
                                    <span>{this.props.selectedNode.id}</span><br/>
                                    <span>{this.props.selectedNode.id}</span><br/>
                                    <span>{this.props.selectedNode.id}</span><br/>
                                </div> : ''}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Add Activity"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={addActions}
                            open={addAct}
                            onRequestClose={() => this.handleClose('addAct')}>
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
                            open={dltAct}
                            onRequestClose={() => this.handleClose('dltAct')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Are you sure you want to delete this relation?"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={dltRelationActions}
                            open={dltRel}
                            onRequestClose={() => this.handleClose('dltRel')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Can't create relation"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={relationWarningActions}
                            open={openRelWarn}
                            onRequestClose={() => this.handleClose('relWarning')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                            {drvFrmMsg}
                            {actToActMsg}
                            {notFileToFile}
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Please confirm that 'was derived from' relation"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={derivedRelActions}
                            open={openConfirmRel}
                            onRequestClose={() => this.handleClose('confirmRel')}>
                            <i className="material-icons" style={styles.help}>help</i>
                            <h6>Are you sure that the file <b>{this.props.relFrom && this.props.relFrom !== null ? this.props.relFrom.label+' ' : ''}</b>
                                was derived from the file <b>{this.props.relTo && this.props.relTo !== null ? this.props.relTo.label+' ' : ''}</b>?</h6>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Edit Activity"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={editActions}
                            open={editAct}
                            onRequestClose={() => this.handleClose('editAct')}>
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
                            open={addFile}
                            onRequestClose={() => this.handleClose('addFile')}>
                            <h5>Need proper global search to build file picker (e.g. Elastisearch)</h5>
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
                    {//Todo: Remove this !!!!!!!!!!!!!
                        /*<IconButton tooltip={this.state.width === window.innerWidth ? "Exit Fullscreen" :
                         "Fullscreen" +
                         " Mode"}
                         tooltipPosition="bottom-right"
                         style={styles.provEditor.toggleFullscreenBtn}
                         onTouchTap={() => this.toggleFullscreen()}>
                         {this.state.width === window.innerWidth ? <FullscreenExit /> : <Fullscreen />}
                         </IconButton>*/}
                    <h5 className="mdl-color-text--grey-800"
                        style={styles.provEditor.title}>
                        Provenance
                    </h5>
                    <div id="graphContainer" ref="graphContainer"
                         style={{
                             position: 'relative',
                             marginTop: 50,
                             maxWidth: this.state.width,
                             height: this.state.height,
                             float: 'left'}}
                         className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    </div>
                </LeftNav>
            </div>
        );
    }

    addDerivedFromRelation(kind, from, to) {
        ProjectActions.startAddRelation(kind, from, to);
    }

    addNewActivity() {
        if (this.state.floatingErrorText) {
            return null
        } else {
            let name = document.getElementById('activityNameText').value;
            let desc = document.getElementById('activityDescText').value;
            if(this.props.addEdgeMode) this.toggleEdgeMode();
            ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
            ProjectActions.addProvActivity(name, desc);
            ProjectActions.closeProvEditorModal('addAct');
            this.setState({
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
            if(this.props.addEdgeMode) this.toggleEdgeMode();
            ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
            ProjectActions.editProvActivity(id, name, desc, actName);
            ProjectActions.closeProvEditorModal('editAct');
            ProjectActions.showProvControlBtns();
            this.setState({
                floatingErrorText: 'This field is required.'
            });
        }
    }

    deleteActivity(node) {
        let id = this.props.params.id;
        ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
        ProjectActions.deleteProvItem(node, id);
        ProjectActions.closeProvEditorModal('dltAct');
        ProjectActions.showProvControlBtns();
    }

    deleteRelation(edge) {
        let id = this.props.params.id;
        ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
        ProjectActions.deleteProvItem(edge, id);
        ProjectActions.closeProvEditorModal('dltRel');
        ProjectActions.showDeleteRelationsBtn(this.props.selectedEdges, this.props.selectedNode);
    }

    handleClose(id) {
        ProjectActions.closeProvEditorModal(id);
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    handleSelectValueChange(event, index, value) {
        if(window.innerWidth < 680) this.toggleEditor();
        ProjectActions.toggleAddEdgeMode(value);
        if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();//Hide buttons while in add edge mode
        if(this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn([]);
        this.state.network.manipulation.addEdgeMode();
        this.setState({
            value: value,
            errorText: null
        });
    }

    openModal(id) {
        ProjectActions.openProvEditorModal(id);
    }

    switchRelations(from, to){
        ProjectActions.switchRelationFromTo(from, to);
    }

    toggleEdgeMode() {
        this.state.network.manipulation.disableEditMode();
        ProjectActions.toggleAddEdgeMode();
        this.setState({value: null});
    }

    //toggleFullscreen() { //Todo: Remove this once it is decided that we don't need it!!!!!!!!!!!!!!!!!!!!!!!
    //    let width = this.state.width !== window.innerWidth ? window.innerWidth
    //        : window.innerWidth * .85;
    //    this.setState({width: width});
    //}


    toggleProv() {
        if(this.props.toggleProvEdit && this.props.toggleProv) ProjectActions.toggleProvEditor();
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
        //toggleFullscreenBtn: {
        //    position: 'absolute',
        //    top: 130,
        //    left: 2,
        //    zIndex: 9999
        //},
        toggleProvBtn: {
            position: 'absolute',
            top: 98,
            left: 4,
            zIndex: 9999
        },
        title: {
            margin: '112px 0px 0px 54px',
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