import React from 'react';
import ReactDOM from 'react-dom';
//import vis from 'vis';
import {graphOptions, graphColors} from '../../graphConfig';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import ProvenanceActivityManager from '../globalComponents/provenanceActivityManager.jsx';
import ProvenanceDetails from '../globalComponents/provenanceDetails.jsx';
import ProvenanceFilePicker from '../globalComponents/provenanceFilePicker.jsx';
import FileVersionsList from '../fileComponents/fileVersionsList.jsx';
import BaseUtils from '../../../util/baseUtils.js';
import AutoComplete from 'material-ui/lib/auto-complete';
import BorderColor from 'material-ui/lib/svg-icons/editor/border-color';
import Cancel from 'material-ui/lib/svg-icons/navigation/cancel';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import Divider from 'material-ui/lib/divider';
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
import urlGen from '../../../util/urlGen.js';

import Help from 'material-ui/lib/svg-icons/action/help';


class Provenance extends React.Component {
    /**
     * Creates a provenance graph using the Vis.js library
     * Vis docs @ visjs.org/docs/network/
     */

    constructor(props) {
        super(props);
        this.state = {
            addFileNode: null,
            delEdge: null,
            doubleClicked: false,
            errorText: null,
            floatingErrorText: 'This field is required.',
            height: window.innerHeight,
            network: null,
            node: null,
            projectId: 0,
            timeout: null,
            value: null,
            width: window.innerWidth
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        // Listen for resize changes when rotating device
        window.addEventListener('resize', this.handleResize);
        ProjectActions.loadProjects();
        ProjectActions.getActivities();
    }

    componentWillUpdate(nextProps, nextState) {
        let scale = this.props.scale;// Todo: Remove this if not using saveZoomState
        let position = this.props.position;// Todo: Remove this if not using saveZoomState
        let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        if(nextProps.updatedGraphItem !== this.props.updatedGraphItem && nextProps.updatedGraphItem.length > 0){
            this.renderProvGraph(edges, nodes, scale, position);// Todo: Remove extra params if not using saveZoomState
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let edges = this.props.provEdges && this.props.provEdges.length > 0 ? this.props.provEdges : [];
        let nodes = this.props.provNodes && this.props.provNodes.length > 0 ? this.props.provNodes : [];
        if(prevProps.provEdges !== this.props.provEdges || prevProps.provNodes !== this.props.provNodes){
            //Check if addEdgeMode has changed. If true render graph in add edge mode or with newly added edge
            this.renderProvGraph(edges, nodes);
            ProjectActions.toggleGraphLoading();
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
            if(data.from == data.to) {
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
                if(this.props.showProvDetails) ProjectActions.toggleProvNodeDetails();
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
        let hideButtonsOnDblClk = ()=> {
            this.state.doubleClicked = true;
            setTimeout(()=>{
                this.state.doubleClicked = false;
            }, 300)
        };
        this.state.network.on("select", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            if(params.nodes.length > 0) this.setState({node: nodeData});
            if(params.nodes.length === 0) this.setState({showDetails: false});
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });
        this.state.network.on("doubleClick", (params) => { // Todo: show more nodes on graph on double click event
            hideButtonsOnDblClk();
            let prevGraph = {nodes: this.props.provNodes, edges: this.props.provEdges};
            let id = params.nodes[0];
            let kind = this.state.node.properties.kind;
            if(params.nodes.length > 0) ProjectActions.getProvenance(id, kind, prevGraph);
        });
        this.state.network.on("click", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);
            if(params.nodes.length > 0) {
                if(!this.props.showProvDetails) ProjectActions.toggleProvNodeDetails();
                if(nodeData.properties.kind !== 'dds-activity') {
                    if(!this.props.removeFileFromProvBtn) ProjectActions.showRemoveFileFromProvBtn();
                } else {
                    if(nodeData.properties.audit.created_by.id !== this.props.currentUser.id && this.props.showProvCtrlBtns) {
                        ProjectActions.showProvControlBtns();
                    }
                    if(nodeData.properties.audit.created_by.id === this.props.currentUser.id) {// If not creator then don't allow edit/delete activity
                        if(!this.props.showProvCtrlBtns && nodeData.properties.kind === 'dds-activity') ProjectActions.showProvControlBtns();
                        if(nodeData.properties.kind !== 'dds-activity' && this.props.showProvCtrlBtns) {
                            this.state.network.unselectAll();
                            ProjectActions.showProvControlBtns();
                        }
                        if(nodeData.properties.kind !== 'dds-activity' && this.props.dltRelationsBtn) {
                            this.state.network.unselectAll();
                            ProjectActions.showDeleteRelationsBtn(edgeData, nodeData);
                        }
                    }
                }
            }
            if(params.nodes.length === 0) {
                this.state.network.unselectAll();
                if(edgeData.length > 0) this.state.network.selectEdges([edgeData[0].id]);
                if(this.props.removeFileFromProvBtn) ProjectActions.showRemoveFileFromProvBtn();
                if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();
            }
            if(params.edges.length === 0 && this.props.dltRelationsBtn) {
                if(this.props.showProvDetails) ProjectActions.toggleProvNodeDetails();
                ProjectActions.showDeleteRelationsBtn(edgeData);
                this.state.network.unselectAll();
            }
            if(params.edges.length === 0 && params.nodes.length === 0 && this.props.showProvDetails) ProjectActions.toggleProvNodeDetails();
            if(edgeData.length > 0 && params.nodes.length < 1) {
                if(this.props.showProvDetails) ProjectActions.toggleProvNodeDetails();
                if(edgeData[0].type !== 'WasAssociatedWith' || edgeData[0].type !== 'WasAttributedTo') {
                    if(edgeData.length > 0 && edgeData[0].properties.audit.created_by.id !== this.props.currentUser.id && this.props.dltRelationsBtn) {
                        ProjectActions.showDeleteRelationsBtn(edgeData);
                    }
                    if(edgeData.length > 0 && edgeData[0].properties.audit.created_by.id === this.props.currentUser.id) {
                        if(params.edges.length > 0 && params.nodes.length < 1) {
                            if(!this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                            if(this.props.showProvCtrlBtns && this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                        }
                    }
                }
            }
        })
    }

    render() {
        let fileName = this.props.entityObj && this.props.entityObj.name ? this.props.entityObj.name : null;
        if(fileName === null) fileName = this.props.entityObj ? this.props.entityObj.file.name : null;
        let fileVersion = this.props.entityObj && this.props.entityObj.current_version ? this.props.entityObj.current_version.version : null;
        if(fileVersion === null) fileVersion = this.props.entityObj ? this.props.entityObj.version : null;
        let addFile = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addFile' ? this.props.provEditorModal.open : false;
        let addAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addAct' ? this.props.provEditorModal.open : false;
        let dltAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'dltAct' ? this.props.provEditorModal.open : false;
        let dltRel = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'dltRel' ? this.props.provEditorModal.open : false;
        let editAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'editAct' ? this.props.provEditorModal.open : false;
        let nodeWarning = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'nodeWarning' ? this.props.provEditorModal.open : false;
        let openRelWarn = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'relWarning' ? this.props.provEditorModal.open : false;
        let openConfirmRel = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'confirmRel' ? this.props.provEditorModal.open : false;
        let drvFrmMsg = this.props.relMsg && this.props.relMsg === 'wasDerivedFrom' ?
            <h5>Only<u><i>Was Derived From</i></u> relations can go
                <u><i> from </i></u> files <u><i>to</i></u> files.</h5> : '';
        let invalidRelMsg = this.props.relMsg && this.props.relMsg === 'invalidRelMsg' ?
            <h5>A relation can not be created between these entity types.</h5> : '';
        let actToActMsg = this.props.relMsg && this.props.relMsg === 'actToActMsg' ?
            <h5>An <u><i>activity</i></u> can not have a relation to another <u><i>activity</i></u></h5> : '';
        let notFileToFile = this.props.relMsg && this.props.relMsg === 'notFileToFile' ?
            <h5><u><i>Was Derived From</i></u> relations can only be created <u><i>from </i></u>
                files <u><i>to</i></u> files.</h5> : '';
        let permissionError = this.props.relMsg && this.props.relMsg === 'permissionError' ?
            <h5>Your can only create <u><i>used </i></u> relations from activities you are the creator of.</h5> : '';
        let prjPrm = this.props.projPermissions && this.props.projPermissions !== undefined ? this.props.projPermissions : null;
        let relationTypeSelect = null;
        if(prjPrm !== null) {
            relationTypeSelect = prjPrm === 'viewOnly' ?
                <SelectField value={this.state.value}
                             id="selectRelation"
                             onChange={this.handleSelectValueChange.bind(this, 'value')}
                             floatingLabelText="Add Relation"
                             floatingLabelStyle={{color: '#757575'}}
                             errorText={this.state.errorText}
                             errorStyle={styles.textStyles}
                             labelStyle={{paddingRight: 0}}
                             style={styles.selectStyles}>
                    <MenuItem style={styles.menuItemStyle} value={0} primaryText='used'/>
                </SelectField>:
                <SelectField value={this.state.value}
                             id="selectRelation"
                             onChange={this.handleSelectValueChange.bind(this, 'value')}
                             floatingLabelText="Add Relation"
                             floatingLabelStyle={{color: '#757575'}}
                             errorText={this.state.errorText}
                             errorStyle={styles.textStyles}
                             labelStyle={{paddingRight: 0}}
                             style={styles.selectStyles}>
                    <MenuItem style={styles.menuItemStyle} value={0} primaryText='used'/>
                    <MenuItem style={styles.menuItemStyle} value={1} primaryText='was generated by'/>
                    <MenuItem style={styles.menuItemStyle} value={2} primaryText='was derived from'/>
                </SelectField>;
        }
        let rmFileBtn = this.props.removeFileFromProvBtn ? 'block' : 'none';
        let showDltRltBtn = this.props.dltRelationsBtn ? 'block' : 'none';
        let versions = null;
        let versionsButton = null;
        let versionCount = [];
        if(this.props.fileVersions && this.props.fileVersions != undefined && this.props.fileVersions.length > 1) {
            versions = this.props.fileVersions.map((version) => {
                return version.is_deleted;
            });
            for (let i = 0; i < versions.length; i++) {
                if(versions[i] === false) {
                    versionCount.push(versions[i]);
                    if(versionCount.length > 1) {
                        versionsButton = <RaisedButton
                            label="CHANGE VERSION"
                            primary={true}
                            labelStyle={styles.provEditor.btn.label}
                            style={styles.provEditor.btn}
                            onTouchTap={() => this.openVersionsModal()}
                            />
                    }
                }
            }
        }
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
        const dltRelationActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('delRel')}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteRelation(this.props.selectedEdge)}
                />
        ];
        const relationWarningActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={() => this.handleClose('relWarning')}/>
        ];
        const nodeWarningActions = [
            <FlatButton
                label="Okay"
                secondary={true}
                onTouchTap={() => this.handleClose('nodeWarning')}/>
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

        return (
            <div>
                <LeftNav disableSwipeToOpen={true} width={width} openRight={true} open={this.props.toggleProv}>
                    <LeftNav width={220} openRight={true} open={this.props.toggleProvEdit}>
                        <div style={styles.provEditor}>
                            <IconButton style={{position: 'absolute',
                                                top: width > 680 ? 88 : 98,
                                                left: 2,
                                                zIndex: 9999}}
                                        onTouchTap={() => this.toggleEditor()}>
                                <NavigationClose />
                            </IconButton>
                            {versionsButton}
                            <FileVersionsList {...this.props}/>
                            <ProvenanceFilePicker {...this.props} {...this.state}/>
                            <ProvenanceActivityManager {...this.props} {...this.state}/>
                            <RaisedButton
                                label="Delete Relation"
                                labelStyle={{fontWeight: 200}}
                                primary={true}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showDltRltBtn}}
                                onTouchTap={() => this.openModal('dltRel')}/>
                            { relationTypeSelect }<br/>
                            {this.props.addEdgeMode ?
                                <div style={styles.provEditor.addEdgeInstruction}>
                                    Click on a node and drag to another node to create a new relation. <br/>
                                    <span style={styles.provEditor.addEdgeInstruction.text}>Cancel</span>
                                    <Cancel style={styles.cancelBtn} color={'#F44336'} onTouchTap={() => this.toggleEdgeMode()}/>
                                </div> : null}
                            <span style={{width: 170, fontSize: 16, color: '#757575'}}>Expand Graph
                                <IconButton tooltip={<span>Double click on a node<br/>to expand and<br/>explore the graph</span>}
                                            tooltipPosition="bottom-center"
                                            iconStyle={{height: 20, width: 20}}
                                            style={styles.infoIcon}>
                                    <Help color={'#BDBDBD'}/>
                                </IconButton>
                            </span><br/>
                            {this.props.showProvDetails ? <ProvenanceDetails {...this.state} {...this.props}/> : null}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={width < 680 ? {width: '100%'} : {}}
                            title="This entity is already on the graph, please choose a different one."
                            autoDetectWindowHeight={true}
                            actions={nodeWarningActions}
                            open={nodeWarning}
                            onRequestClose={() => this.handleClose('nodeWarning')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={width < 680 ? {width: '100%'} : {}}
                            title="Are you sure you want to delete this relation?"
                            autoDetectWindowHeight={true}
                            actions={dltRelationActions}
                            open={dltRel}
                            onRequestClose={() => this.handleClose('dltRel')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={width < 680 ? {width: '100%'} : {}}
                            title="Can't create relation"
                            autoDetectWindowHeight={true}
                            actions={relationWarningActions}
                            open={openRelWarn}
                            onRequestClose={() => this.handleClose('relWarning')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                            {drvFrmMsg}
                            {actToActMsg}
                            {notFileToFile}
                            {permissionError}
                            {invalidRelMsg}
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={width < 680 ? {width: '100%'} : {}}
                            title="Please confirm that 'was derived from' relation"
                            autoDetectWindowHeight={true}
                            actions={derivedRelActions}
                            open={openConfirmRel}
                            onRequestClose={() => this.handleClose('confirmRel')}>
                            <i className="material-icons" style={styles.derivedRelationDialogIcon}>help</i>
                            <h6>Are you sure that the file <b>{this.props.relFrom && this.props.relFrom !== null ? this.props.relFrom.label+' ' : ''}</b>
                                was derived from the file <b>{this.props.relTo && this.props.relTo !== null ? this.props.relTo.label+' ' : ''}</b>?</h6>
                        </Dialog>
                    </LeftNav>
                    <IconButton tooltip="Edit Graph"
                                style={{position: 'absolute',
                                        top: width > 680 ? 90 : 100,
                                        right: 10,
                                        zIndex: 200}}
                                onTouchTap={() => this.toggleEditor()}>
                        <BorderColor color="#424242" />
                    </IconButton>
                    <IconButton style={{position: 'absolute',
                                        top: width > 680 ? 88 : 98,
                                        left: 10,
                                        zIndex: 9999}}
                                onTouchTap={() => this.toggleProv()}>
                        <NavigationClose />
                    </IconButton>
                    <h6 className="mdl-color-text--grey-800"
                        style={styles.provEditor.title}>
                        <span style={styles.provEditor.title.span1}>{fileName}</span>
                        <span style={styles.provEditor.title.span2}>{'Version '+ fileVersion}</span>
                    </h6>
                    {this.props.graphLoading ?
                        <CircularProgress size={1.5} style={styles.graphLoader}/>
                    : null}
                    <div id="graphContainer" ref="graphContainer"
                         className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                         style={{position: 'relative',
                                 marginTop: 50,
                                 maxWidth: width,
                                 height: this.state.height,
                                 float: 'left'}}>
                    </div>
                </LeftNav>
            </div>
        );
    }

    addDerivedFromRelation(kind, from, to) {
        ProjectActions.startAddRelation(kind, from, to);
    }

    deleteRelation(edge) {
        let id = this.props.params.id;
        ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
        ProjectActions.deleteProvItem(edge, id);
        ProjectActions.closeProvEditorModal('dltRel');
        ProjectActions.showDeleteRelationsBtn(this.props.selectedEdge, this.props.selectedNode);
    }

    handleClose(id) {
        ProjectActions.closeProvEditorModal(id);
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    handleSelectValueChange(index, event, value) {
        if(window.innerWidth < 680) {
            setTimeout(()=>{this.toggleEditor()}, 2000);
        }
        ProjectActions.toggleAddEdgeMode(value);
        if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();//Hide buttons while in add edge mode
        if(this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn([]);
        this.state.network.manipulation.addEdgeMode();
        this.setState({
            showDetails: false,
            value: value,
            errorText: null
        });
    }

    openModal(id) {
        ProjectActions.openProvEditorModal(id);
    }

    openVersionsModal() {
        ProjectActions.openModal()
    }

    switchRelations(from, to){
        ProjectActions.switchRelationFromTo(from, to);
    }

    toggleDetails() {
        ProjectActions.toggleProvNodeDetails();
    }

    toggleEdgeMode() {
        this.state.network.manipulation.disableEditMode();
        ProjectActions.toggleAddEdgeMode();
        this.setState({value: null});
    }

    toggleProv() {
        if(this.props.toggleProvEdit && this.props.toggleProv) ProjectActions.toggleProvEditor();
        ProjectActions.toggleProvView();
    }

    toggleEditor() {
        ProjectActions.toggleProvEditor();
    }

    useFileVersion(id, name, version, node) {
        document.getElementById('searchText').value = name +'- Version: '+ version;
        this.state.addFileNode = node;
    }
}

var styles = {
    cancelBtn: {
        height: 18,
        width: 18,
        marginBottom: 4
    },
    deleteFile: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    graphLoader: {
        position: 'absolute',
        margin: '0 auto',
        top: 200,
        left: 0,
        right: 0
    },
    derivedRelationDialogIcon: {
        fontSize: 48,
        textAlign: 'center',
        color: '#235F9C'
    },
    infoIcon: {
        verticalAlign: 8
    },
    listBlock: {
        margin: 0
    },
    listGroupTitle: {
        padding: '0px 5px 0px 5px',
        height: 24,
        lineHeight: '175%'
    },
    listHeader: {
        margin: '20px 0px 5px 0px'
    },
    listItem: {
        padding: '0px 5px 0px 5px'
    },
    menuItemStyle: {
        width: 170
    },
    provEditor:{
        display: 'flex',
        justifyContent: 'center',
        flexFlow: 'row wrap',
        marginTop: 140,
        padding: 5,
        details: {
            width: '100%',
            margin: 0,
            color:'#757575'
        },
        addEdgeInstruction: {
            margin: 15,
            paddingLeft: 4,
            color: '#757575',
            text: {
                color:'#757575'
            }
        },
        btn: {
            zIndex: 9999,
            margin: 10,
            width: '80%',
            label: {
                fontWeight: 200
            }
        },
        title: {
            margin: '112px 0px 0px 54px',
            fontWeight: 100,
            textAlign: 'center',
            span1: {
                marginRight: 50
            },
            span2: {
                display: 'block',
                marginRight: 50
            }
        }
    },
    selectStyles: {
        margin: '-20px 20px 0px 20px',
        maxWidth: '90%',
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