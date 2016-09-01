import React from 'react';
import ReactDOM from 'react-dom';
import {graphOptions, graphColors} from '../../graphConfig';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import ProvenanceDetails from '../globalComponents/provenanceDetails.jsx';
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

import DropDownMenu from 'material-ui/lib/DropDownMenu';

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
            errorText: null,
            floatingErrorText: 'This field is required.',
            height: window.innerHeight,
            network: null,
            node: null,
            projectId: 0,
            projectSelectValue: null,
            showDetails: false,
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
                if(this.state.showDetails) this.setState({showDetails: false});
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
            if(params.nodes.length > 0) this.setState({node: nodeData});
            if(params.nodes.length === 0) this.setState({showDetails: false});
            ProjectActions.selectNodesAndEdges(edgeData, nodeData);
        });
        //this.state.network.on("doubleClick", (params) => { // Todo: show more nodes on graph on double click event
        //    nodes.add({
        //        id: "4c63996f-e837-48d7-b2bb-dbf2d86929e9",
        //        label: 'testAddNode',
        //        labels: 'test',
        //        properties: {
        //            is_deleted: false,
        //            kind: "dds-file-version"
        //        },
        //        shape: 'box',
        //        color: '#1DE9B6',
        //        title:'<Card style="margin: 10px"><a href="#">File Name</a><p>date: date</p><p>size: size</p></Card>'
        //    })
        //});
        this.state.network.on("click", (params) => {
            let nodeData = nodes.get(params.nodes[0]);
            let edgeData = edges.get(params.edges);

            if(params.nodes.length > 0) {
                this.state.showDetails = true;
                if (nodeData.properties.kind !== 'dds-activity') {
                    if(!this.props.removeFileFromProvBtn) ProjectActions.showRemoveFileFromProvBtn();
                } else {
                    if (nodeData.properties.audit.created_by.id !== this.props.currentUser.id && this.props.showProvCtrlBtns) {
                        ProjectActions.showProvControlBtns();
                    }
                    if (nodeData.properties.audit.created_by.id === this.props.currentUser.id) {
                        // If not creator then don't allow edit/delete activity
                        if (nodeData.properties.kind !== 'dds-file-version' && nodeData.id !== this.props.selectedNode.id) {
                            if (!this.props.showProvCtrlBtns && nodeData.properties.kind === 'dds-activity') ProjectActions.showProvControlBtns();
                        }
                        if (nodeData.properties.kind !== 'dds-activity' && this.props.showProvCtrlBtns) {
                            this.state.network.unselectAll();
                            ProjectActions.showProvControlBtns();
                        }
                        //if(!nodeData.properties.hasOwnProperty('kind')) { //Only need this if actor/agent nodes are used
                        //    this.state.network.unselectAll();
                        //    if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();
                        //}
                        if (nodeData.properties.kind !== 'dds-activity' && this.props.dltRelationsBtn) {
                            this.state.network.unselectAll();
                            ProjectActions.showDeleteRelationsBtn(edgeData, nodeData);
                        }
                    }
                }
            }
            if(params.nodes.length === 0) {
                this.state.showDetails = false;
                this.state.network.unselectAll();
                if (edgeData.length > 0) this.state.network.selectEdges([edgeData[0].id]);
                if(this.props.removeFileFromProvBtn) ProjectActions.showRemoveFileFromProvBtn();
                if(this.props.showProvCtrlBtns) ProjectActions.showProvControlBtns();
            }
            if (params.edges.length === 0 && this.props.dltRelationsBtn) {
                //If clicked on canvas only
                this.state.showDetails = false;
                ProjectActions.showDeleteRelationsBtn(edgeData);
                this.state.network.unselectAll();
            }
            if(edgeData.length > 0) {
                if (edgeData[0].type !== 'WasAssociatedWith' || edgeData[0].type !== 'WasAttributedTo') {
                    if (edgeData.length > 0 && edgeData[0].properties.audit.created_by.id !== this.props.currentUser.id && this.props.dltRelationsBtn) {
                        this.state.showDetails = false;
                        ProjectActions.showDeleteRelationsBtn(edgeData);
                    }
                    if (edgeData.length > 0 && edgeData[0].properties.audit.created_by.id === this.props.currentUser.id) {
                        if (params.edges.length > 0 && params.nodes.length < 1) {
                            this.state.showDetails = false;
                            if (!this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                            if (this.props.showProvCtrlBtns && this.props.dltRelationsBtn) ProjectActions.showDeleteRelationsBtn(edgeData);
                        }
                        if (params.edges.length === 0 && params.nodes.length === 0) this.state.showDetails = false;

                    }
                }
            }
        });
    }

    render() {
        let autoCompleteData = this.props.searchFilesList.map((file)=>{
            if(file.kind === 'dds-file'){
                return {text: file.name, value: file.name, id: file.id, node: file}
            }
        });
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
        if (prjPrm !== null) {
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
        let projects = this.props.projects && this.props.projects.length ? this.props.projects.map((project)=>{
            if(!project.is_deleted) {
                return <MenuItem key={project.id}
                                 value={project.id}
                                 primaryText={project.name}
                                 onTouchTap={() => this.handleProjectSelect(project.id, project.name)}/>
            }
        }) : null;
        let provFileVersions = this.props.provFileVersions.map((node)=>{
            return <li key={node.id}
                       id={node.id}
                       onTouchTap={() => this.useFileVersion(node.id, node.file.name, node.version, node)}>
                       Version: {node.version}
            </li>
        });
        let rmFileBtn = this.props.removeFileFromProvBtn ? 'block' : 'none';
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
        let showDltRltBtn = this.props.dltRelationsBtn ? 'block' : 'none';
        let versions = null;
        let versionsButton = null;
        let versionCount = [];
        if(this.props.fileVersions && this.props.fileVersions != undefined && this.props.fileVersions.length > 1) {
            versions = this.props.fileVersions.map((version) => {
                return version.is_deleted;
            });
            for (let i = 0; i < versions.length; i++) {
                if (versions[i] === false) {
                    versionCount.push(versions[i]);
                    if (versionCount.length > 1) {
                        versionsButton = <RaisedButton
                            label="CHANGE VERSION"
                            labelStyle={styles.provEditor.btn.label}
                            style={styles.provEditor.btn}
                            onTouchTap={() => this.openVersionsModal()}
                            />
                    }
                }
            }
        }
        const addActivityActions = [
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
        const addFileNodeActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('addFile')}/>,
            <FlatButton
                label="Submit"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addFileToGraph()}
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
                onTouchTap={() => this.deleteRelation(this.props.selectedEdge)}//TODO: Fix this here
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
                <LeftNav disableSwipeToOpen={true} width={this.state.width} openRight={true} open={this.props.toggleProv}>
                    <LeftNav width={220} openRight={true} open={this.props.toggleProvEdit}>
                        <div style={styles.provEditor}>
                            <IconButton style={styles.provEditor.closeEditorBtn}
                                        onTouchTap={() => this.toggleEditor()}>
                                <NavigationClose />
                            </IconButton>
                            {versionsButton}
                            <FileVersionsList {...this.props}/>
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
                            {/*relationTypeSelect is a select element that shows the proper menuItems based on the
                             users project permissions. For some reason the select fails if using only dynamic menu
                             items*/}
                            { relationTypeSelect }<br/>
                            {/*<RaisedButton
                                label="Remove File"
                                labelStyle={styles.provEditor.btn.label}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: rmFileBtn}}
                                onTouchTap={() => this.openModal('editAct')}/>*/}
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
                                    <span style={styles.provEditor.addEdgeInstruction.text}>Cancel</span> <Cancel style={styles.cancelBtn} color={'#F44336'} onTouchTap={() => this.toggleEdgeMode()}/>
                                </div> : null}
                            {this.state.showDetails ? <ProvenanceDetails {...this.state} {...this.props}/> : null}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={this.state.width < 680 ? {width: '100%'} : {}}
                            title="Add Activity"
                            autoDetectWindowHeight={true}
                            actions={addActivityActions}
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
                            title="This file is already on the graph"
                            autoDetectWindowHeight={true}
                            autoScrollBodyContent={true}
                            actions={nodeWarningActions}
                            open={nodeWarning}
                            onRequestClose={() => this.handleClose('nodeWarning')}>
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
                            {permissionError}
                            {invalidRelMsg}
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
                                    defaultValue={this.props.selectedNode.properties ? this.props.selectedNode.properties.name : this.props.selectedNode.label}
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
                                    defaultValue={this.props.selectedNode.properties ? this.props.selectedNode.properties.description : null}
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
                            actions={addFileNodeActions}
                            open={addFile}
                            onRequestClose={() => this.handleClose('addFile')}>
                            <h6 style={{marginTop:0, paddingBottom: 20}}>Add files to the graph. File must already exist in Duke Data Service.</h6>
                            <SelectField id="selectProject"
                                         value={this.state.projectSelectValue}
                                         onChange={(e, index, value) => this.handleProjectSelect(e, index, value)}
                                         maxHeight={300}
                                         autoWidth={true}
                                         fullWidth={true}
                                         floatingLabelText="Select a Project"
                                         floatingLabelStyle={{color: '#BDBDBD', fontWeight: 100}}
                                         style={styles.projectSelect}>
                                {projects}
                            </SelectField>
                            <AutoComplete
                                id="searchText"
                                fullWidth={true}
                                style={styles.filePicker}
                                menuStyle={{maxHeight: 200}}
                                floatingLabelText="Type a File Name"
                                dataSource={autoCompleteData}
                                filter={AutoComplete.caseInsensitiveFilter}
                                openOnFocus={true}
                                onNewRequest={(value) => this.chooseFileVersion(value)}
                                onUpdateInput={this.handleUpdateInput.bind(this)}
                                underlineStyle={styles.autoCompleteUnderline}/>
                            {this.props.autoCompleteLoading ? <CircularProgress size={1} style={styles.autoCompleteProgress}/> : null}
                            {this.props.provFileVersions.length > 1 ?
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.versionListWrapper}>
                                <h7>Would you like to use a different version of this file?</h7>
                                 <ul id='fileVersionUl'>
                                    {provFileVersions}
                                </ul>
                                </div> : null}
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
                    <h6 className="mdl-color-text--grey-800"
                        style={styles.provEditor.title}>
                        <span style={styles.provEditor.title.span1}>{fileName}</span>
                        <span style={styles.provEditor.title.span2}>{'Version '+ fileVersion}</span>
                    </h6>
                    {this.props.graphLoading ? <div className="mdl-cell mdl-cell--12-col" style={styles.loadingContainer}>
                        <CircularProgress size={1.5} style={{marginTop: 20}}/>
                    </div> : null}
                    <div id="graphContainer" ref="graphContainer"
                         className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                         style={{
                             position: 'relative',
                             marginTop: 50,
                             maxWidth: this.state.width,
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

    addFileToGraph() {
        let node = this.state.addFileNode;
        let graphNodes = this.props.provNodes;
        if(this.state.addFileNode !== null) {
            let id = node.current_version ? node.current_version.id : node.id;
            if (!BaseUtils.objectPropInArray(graphNodes, 'id', id)) {
                ProjectActions.addFileToGraph(node);
                ProjectActions.closeProvEditorModal('addFile');
                ProjectActions.clearProvFileVersions();
                this.state.addFileNode = null;
            } else {
                ProjectActions.openProvEditorModal('nodeWarning');
            }
            this.state.projectSelectValue = null;
            ProjectActions.clearSearchFilesData();
        }
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

    chooseFileVersion(value) {
        let fileId = value.id;
        this.state.addFileNode = value.node;
        ProjectActions.getFileVersions(fileId, true);
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
        ProjectActions.showDeleteRelationsBtn(this.props.selectedEdge, this.props.selectedNode);
    }

    handleClose(id) {
        ProjectActions.closeProvEditorModal(id);
        ProjectActions.clearProvFileVersions();
        if(id === 'addFile') this.state.projectSelectValue = null;
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    handleProjectSelect(e, index, value) {
        ProjectActions.clearSearchFilesData(); //If project is changed, clear files from autocomplete list
        this.setState({
            projectId: value,
            projectSelectValue: value
        });
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

    handleUpdateInput (text) {
        // Add 500ms lag to autocomplete so that it only makes a call after user is done typing
        let id = this.state.projectId !== 0 ? this.state.projectId : this.props.entityObj.file ? this.props.entityObj.file.project.id : this.props.entityObj.project.id;
        let timeout = this.state.timeout;
        let textInput = document.getElementById('searchText');
        textInput.onkeyup = () => {
            clearTimeout(this.state.timeout);
            this.setState({
                timeout: setTimeout(() => {
                    if (!textInput.value.indexOf(' ') <= 0) {
                        ProjectActions.searchFiles(textInput.value, id);
                    }
                }, 500)
            })
        };
    }

    openModal(id) {
        ProjectActions.openProvEditorModal(id);
    }

    openVersionsModal() {
        ProjectActions.openModal()
    }

    selectProject(id) {
        this.state.projectId = id;
    }

    switchRelations(from, to){
        ProjectActions.switchRelationFromTo(from, to);
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
    autoCompleteProgress: {
        position: 'absolute',
        top: '28%',
        left: '45%'
    },
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
    filePicker: {
        maxWidth: 'calc(100% - 45px)'
    },
    help: {
        fontSize: 48,
        textAlign: 'center',
        color: '#235F9C'
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
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuItemStyle: {
        width: 170
    },
    projectSelect: {
        maxWidth: 'calc(100% - 45px)',
        textAlign: 'left'
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
        toggleProvBtn: {
            position: 'absolute',
            top: 98,
            left: 10,
            zIndex: 9999
        },
        closeEditorBtn: {
            position: 'absolute',
            top: 98,
            left: 2,
            zIndex: 9999
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
        },
        toggleEditor: {
            position: 'absolute',
            top: 100,
            right: 10,
            zIndex: 200
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
    versionListWrapper: {
        textAlign: 'left'
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default Provenance;