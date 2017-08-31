import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { graphOptions } from '../../graphConfig';
import { Color } from '../../theme/customTheme';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import ProvenanceActivityManager from '../globalComponents/provenanceActivityManager.jsx';
import ProvenanceDetails from '../globalComponents/provenanceDetails.jsx';
import ProvenanceFilePicker from '../globalComponents/provenanceFilePicker.jsx';
import FileVersionsList from '../fileComponents/fileVersionsList.jsx';
import BorderColor from 'material-ui/svg-icons/editor/border-color';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Help from 'material-ui/svg-icons/action/help';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';

@observer
class Provenance extends React.Component {
    /**
     * Creates a provenance graph using the Vis.js library
     * Uses a network graph from Vis.js
     * Vis docs @ visjs.org/docs/network/
     */

    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            floatingErrorText: 'This field is required.',
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        // Listen for resize changes when rotating device
        window.addEventListener('resize', this.handleResize);
        mainStore.getProjectListForProvenanceEditor();
        provenanceStore.getActivities();
    }

    componentWillUpdate() {
        const {currentGraph, provEdges, provNodes, position, scale} = provenanceStore;
        const id = this.props.params.id;
        const edges = provEdges && provEdges.length > 0 ? provEdges.slice() : currentGraph !== null && currentGraph.id === id ? currentGraph.edges.slice() : [];
        const nodes = provNodes && provNodes.length > 0 ? provNodes.slice() : currentGraph !== null && currentGraph.id === id ? currentGraph.nodes.slice() : [];
        if(provenanceStore.renderGraph) this.renderProvGraph(edges, nodes, scale, position);
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
        provenanceStore.shouldRenderGraph();
        let edges = new vis.DataSet(edge);
        let nodes = new vis.DataSet(node);
        let onAddEdgeMode = (data, callback) => {
            provenanceStore.onAddEdgeMode(data, callback);
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
        provenanceStore.createGraph(new vis.Network(container, data, options));
        //Add manipulation options to network options so that addEdgeMode is defined
        provenanceStore.network.setOptions({manipulation: {
            enabled: false,
            addEdge: onAddEdgeMode
        }});
        if(scale !== null && position !== null) {
            provenanceStore.network.moveTo({
                position: position,
                scale: scale
            });
        }
        provenanceStore.network.on("select", (params) => {
            provenanceStore.networkSelect(params, nodes, edges);
        });
        provenanceStore.network.on("doubleClick", (params) => { // Show more nodes on graph on double click event
            provenanceStore.networkDoubleClick(params, nodes);
        });
        provenanceStore.network.on("click", (params) => {
            provenanceStore.networkClick(params, nodes, edges);
        });
    }

    render() {
        const { addEdgeMode, dltRelationsBtn, doubleClicked, drawerLoading, dropdownSelectValue, provEdges, provNodes, provEditorModal, relationMode, relFrom, relTo, relMsg, removeFileFromProvBtn, selectedEdge, showProvDetails, toggleProv, toggleProvEdit } = provenanceStore;
        const { entityObj, fileVersions, projPermissions, screenSize } = mainStore;
        let fileName = entityObj && entityObj.name ? entityObj.name : null;
        if(fileName === null) fileName = entityObj ? entityObj.file.name : null;
        let fileVersion = entityObj && entityObj.current_version ? entityObj.current_version.version : null;
        if(fileVersion === null) fileVersion = entityObj ? entityObj.version : null;
        let addFile = provEditorModal.id !== null && provEditorModal.id === 'addFile' ? provEditorModal.open : false;
        let addAct = provEditorModal.id !== null && provEditorModal.id === 'addAct' ? provEditorModal.open : false;
        let dltAct = provEditorModal.id !== null && provEditorModal.id === 'dltAct' ? provEditorModal.open : false;
        let dltRel = provEditorModal.id !== null && provEditorModal.id === 'dltRel' ? provEditorModal.open : false;
        let editAct = provEditorModal.id !== null && provEditorModal.id === 'editAct' ? provEditorModal.open : false;
        let nodeWarning = provEditorModal.id !== null && provEditorModal.id === 'nodeWarning' ? provEditorModal.open : false;
        let openRelWarn = provEditorModal.id !== null && provEditorModal.id === 'relWarning' ? provEditorModal.open : false;
        let openConfirmRel = provEditorModal.id !== null && provEditorModal.id === 'confirmRel' ? provEditorModal.open : false;
        let drvFrmMsg = relMsg && relMsg === 'wasDerivedFrom' ?
            <h5>Only<u><i>Was Derived From</i></u> relations can go
                <u><i> from </i></u> files <u><i>to</i></u> files.</h5> : '';
        let invalidRelMsg = relMsg && relMsg === 'invalidRelMsg' ?
            <h5>A relation can not be created between these entity types.</h5> : '';
        let actToActMsg = relMsg && relMsg === 'actToActMsg' ?
            <h5>An <u><i>activity</i></u> can not have a relation to another <u><i>activity</i></u></h5> : '';
        let notFileToFile = relMsg && relMsg === 'notFileToFile' ?
            <h5><u><i>Was Derived From</i></u> relations can only be created <u><i>from </i></u>
                files <u><i>to</i></u> files.</h5> : '';
        let permissionError = relMsg && relMsg === 'permissionError' ?
            <h5>Your can only create <u><i>used </i></u> relations from activities you are the creator of.</h5> : '';
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let relationInstructions = null;
        switch(dropdownSelectValue){
            case 0:
                relationInstructions = <span><span style={styles.relationInstructions}>You are adding a Used relation</span>
                    <br/>Click on an activity node and<br/> drag to a file node
                   to show that the<br/> activity used that file.</span>;
                break;
            case 1:
                relationInstructions = <span><span style={styles.relationInstructions}>You are adding a <br/>Was Generated By relation</span>
                    <br/>Click on a file node and drag to <br/>an activity node to show that the <br/>activity
                    generated that file.</span>;
                break;
            case 2:
                relationInstructions = <span><span style={styles.relationInstructions}>You are adding a <br/>Was Derived From relation</span>
                    <br/>Click on a file node and drag to <br/>another file node to show that the <br/>file is a derivation of another
                    file.<br/> You will then have the option to<br/> confirm which file was the derivative.</span>;
                break;
        }
        let relationTypeSelect = null;
        if(prjPrm !== null) {
            relationTypeSelect = prjPrm === 'viewOnly' ?
                <SelectField value={dropdownSelectValue}
                             id="selectRelation"
                             onChange={this.handleSelectValueChange.bind(this, 'value')}
                             floatingLabelText="Select Relation Type"
                             floatingLabelStyle={styles.selectStyles.floatingLabel}
                             errorText={this.state.errorText}
                             errorStyle={styles.textStyles}
                             labelStyle={styles.selectStyles.label}
                             iconStyle={styles.selectStyles.icon}
                             style={styles.selectStyles}>
                    <MenuItem value={0} primaryText='used'/>
                </SelectField>:
                <SelectField value={dropdownSelectValue}
                             id="selectRelation"
                             onChange={this.handleSelectValueChange.bind(this, 'value')}
                             floatingLabelText="Select Relation Type"
                             floatingLabelStyle={styles.selectStyles.floatingLabel}
                             errorText={this.state.errorText}
                             errorStyle={styles.textStyles}
                             labelStyle={styles.selectStyles.label}
                             iconStyle={styles.selectStyles.icon}
                             style={styles.selectStyles}>
                    <MenuItem value={0} primaryText='used'/>
                    <MenuItem value={1} primaryText='was generated by'/>
                    <MenuItem value={2} primaryText='was derived from'/>
                </SelectField>;
        }
        let rmFileBtn = removeFileFromProvBtn ? 'block' : 'none';
        let showDltRltBtn = dltRelationsBtn ? 'block' : 'none';
        let versions = null;
        let versionsButton = null;
        let versionCount = [];
        if(fileVersions && fileVersions != null && fileVersions.length > 1) {
            versions = fileVersions.map((version) => {
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
                                            onTouchTap={() => this.openVersionsModal()} />
                    }
                }
            }
        }
        let width = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.width : window.innerWidth;
        let dialogWidth = width < 680 ? {width: '100%'} : {};
        const dltRelationActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose('delRel')}/>,
            <FlatButton
                label="Delete"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.deleteRelation(selectedEdge)}
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
                onTouchTap={() => this.switchRelations(relFrom, relTo)}/>,
            <FlatButton
                label="Yes"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={() => this.addDerivedFromRelation('was_derived_from', relFrom, relTo)}
                />
        ];

        return (
            <div>
                <Drawer disableSwipeToOpen={true} width={width} openSecondary={true} open={toggleProv}>
                    <Drawer width={220} openSecondary={true} open={toggleProvEdit}>
                        <div style={styles.provEditor}>
                            <IconButton style={styles.closeEditorIcon}
                                        onTouchTap={() => this.toggleEditor()}>
                                <NavigationClose />
                            </IconButton>
                            {versionsButton}
                            <FileVersionsList {...this.props} />
                            <ProvenanceFilePicker {...this.props} />
                            <ProvenanceActivityManager {...this.props} />
                            <RaisedButton
                                label="Add Relation"
                                labelStyle={{fontWeight: 200}}
                                primary={true}
                                disabled={!!relationMode}
                                style={styles.btnStyle}
                                onTouchTap={() => this.addRelationMode()}/>
                            {relationMode ? relationTypeSelect : null}
                            {relationMode ?
                                <RaisedButton
                                    label="Cancel"
                                    labelStyle={{color: Color.red}}
                                    style={styles.btnStyle}
                                    onTouchTap={() => this.toggleEdgeMode()}/>
                                : null}
                            {addEdgeMode && relationMode ?
                            <span style={styles.provEditor.expandGraphInstructions}>Instructions
                                <IconButton tooltip={relationInstructions}
                                            tooltipPosition="bottom-center"
                                            iconStyle={styles.infoIcon.iconStyle}
                                            style={styles.infoIcon}>
                                    <Help color={Color.ltGrey}/>
                                </IconButton>
                            </span> : null}
                            <RaisedButton
                                label="Delete Relation"
                                labelStyle={{fontWeight: 200}}
                                primary={true}
                                style={{zIndex: 9999, margin: 10, width: '80%', display: showDltRltBtn}}
                                onTouchTap={() => this.openModal('dltRel')}/>
                            <span style={styles.provEditor.expandGraphInstructions}>Expand Graph
                                <IconButton tooltip={<span>Double click on a node<br/>to expand and<br/>explore the graph</span>}
                                            tooltipPosition="bottom-center"
                                            iconStyle={styles.infoIcon2.iconStyle}
                                            style={styles.infoIcon2}>
                                    <Help color={Color.ltGrey}/>
                                </IconButton>
                            </span><br/>
                            {showProvDetails ? <ProvenanceDetails {...this.props}/> : null}
                        </div>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={dialogWidth}
                            title="This entity is already on the graph, please choose a different one."
                            autoDetectWindowHeight={true}
                            actions={nodeWarningActions}
                            open={nodeWarning}
                            onRequestClose={() => this.handleClose('nodeWarning')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={dialogWidth}
                            title="Are you sure you want to delete this relation?"
                            autoDetectWindowHeight={true}
                            actions={dltRelationActions}
                            open={dltRel}
                            onRequestClose={() => this.handleClose('dltRel')}>
                            <i className="material-icons" style={styles.warning}>warning</i>
                        </Dialog>
                        <Dialog
                            style={styles.dialogStyles}
                            contentStyle={dialogWidth}
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
                            contentStyle={dialogWidth}
                            title="Please confirm that 'was derived from' relation"
                            autoDetectWindowHeight={true}
                            actions={derivedRelActions}
                            open={openConfirmRel}
                            onRequestClose={() => this.handleClose('confirmRel')}>
                            <i className="material-icons" style={styles.derivedRelationDialogIcon}>help</i>
                            <h6>Are you sure that the file <b>{relFrom && relFrom !== null ? relFrom.label+' ' : ''}</b>
                                was derived from the file <b>{relTo && relTo !== null ? relTo.label+' ' : ''}</b>?</h6>
                        </Dialog>
                    </Drawer>
                    <IconButton tooltip="Edit Graph"
                                style={styles.openEditorIcon}
                                onTouchTap={() => this.toggleEditor()}>
                        <BorderColor color="#424242" />
                    </IconButton>
                    <IconButton style={styles.closeEditorIcon}
                                onTouchTap={() => this.toggleProv()}>
                        <NavigationClose />
                    </IconButton>
                    <h6 className="mdl-color-text--grey-800"
                        style={styles.provEditor.title}>
                        <span style={styles.provEditor.title.span1}>{fileName}</span>
                        <span style={styles.provEditor.title.span2}>{'Version '+ fileVersion}</span>
                    </h6>
                    {drawerLoading ?
                        <CircularProgress size={80} thickness={5} style={styles.graphLoader}/>
                        : null}
                    <div id="graphContainer" ref="graphContainer"
                         className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                         style={{position: 'relative',
                                 marginTop: 50,
                                 maxWidth: width,
                                 height: screenSize.height,
                                 float: 'left'}}>
                    </div>
                </Drawer>
            </div>
        );
    }

    addDerivedFromRelation(kind, from, to) {
        provenanceStore.startAddRelation(kind, from, to);
        this.saveZoomState();
    }

    addRelationMode() {
        if(provenanceStore.showProvCtrlBtns) provenanceStore.showProvControlBtns();//Hide buttons while in add edge mode
        if(provenanceStore.dltRelationsBtn) provenanceStore.showDeleteRelationsBtn([]);
        provenanceStore.toggleRelationMode();
        this.saveZoomState();
    }

    deleteRelation(edge) {
        let id = this.props.params.id;
        provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
        provenanceStore.deleteProvItem(edge, id);
        this.saveZoomState();
        this.handleClose('dltRel');
        provenanceStore.showDeleteRelationsBtn(provenanceStore.selectedEdge, provenanceStore.selectedNode);
    }

    handleClose(id) {
        provenanceStore.closeProvEditorModal(id);
        this.saveZoomState();
    }

    handleSelectValueChange(index, event, value) {
        if(window.innerWidth < 680) {
            setTimeout(()=>{this.toggleEditor()}, 2000);
        }
        provenanceStore.toggleAddEdgeMode(value);
        provenanceStore.network.manipulation.addEdgeMode();
        provenanceStore.setDropdownSelectValue(value);
        this.setState({
            errorText: null
        });
    }

    openModal(id) {
        provenanceStore.openProvEditorModal(id);
        this.saveZoomState();
    }

    openVersionsModal() {
        mainStore.toggleModals('fileVersions')
    }

    switchRelations(from, to){
        provenanceStore.switchRelationFromTo(from, to);
    }

    toggleDetails() {
        provenanceStore.toggleProvNodeDetails();
    }

    toggleEdgeMode() {
        provenanceStore.network.manipulation.disableEditMode();
        provenanceStore.toggleAddEdgeMode();
        this.saveZoomState();
        provenanceStore.setDropdownSelectValue(null);
        provenanceStore.toggleRelationMode();
    }

    toggleProv() {
        if(provenanceStore.toggleProvEdit && provenanceStore.toggleProv) provenanceStore.toggleProvEditor();
        provenanceStore.toggleProvView();
    }

    toggleEditor() {
        provenanceStore.toggleProvEditor();
    }

    saveZoomState() {
        provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
    }
}

const styles = {
    btnStyle: {
        margin: 10,
        width: '80%',
        minWidth: 168
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
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
        color: Color.blue
    },
    closeEditorIcon: {
        position: 'absolute',
        top: 88,
        left: 10,
        zIndex: 9999
    },
    closeGraphIcon: {
        position: 'absolute',
        top: 88,
        left: 2,
        zIndex: 9999
    },
    infoIcon: {
        verticalAlign: 8,
        zIndex: 9999,
        iconStyle: {
            height: 20,
            width: 20
        }
    },
    infoIcon2: {
        verticalAlign: 8,
        iconStyle: {
            height: 20,
            width: 20
        }
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
    openEditorIcon: {
        position: 'absolute',
        top: 90,
        right: 10,
        zIndex: 200
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
            color: Color.dkGrey
        },
        addEdgeInstruction: {
            maxWidth:'168px',
            margin: '5px 15px 5px 15px',
            padding: 8,
            backgroundColor: Color.green,
            color: '#FFF'
        },
        btn: {
            zIndex: 9999,
            margin: 10,
            width: '80%',
            label: {
                fontWeight: 200
            }
        },
        expandGraphInstructions: {
            width: 170,
            fontSize: 16,
            color: Color.dkGrey
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
    relationInstructions: {
        fontWeight: 600,
        textDecoration: 'underline'
    },
    selectStyles: {
        margin: '-15px 20px 0px 20px',
        maxWidth: '90%',
        minWidth: 160,
        textAlign: 'left',
        color: Color.dkGrey,
        floatingLabel: {
            color: Color.blue
        },
        icon: {
            right: -10
        },
        label: {
            paddingRight: 0,
            color: Color.blue
        }
    },
    textStyles: {
        textAlign: 'left',
        fontColor: Color.dkBlue
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: Color.red
    }
};

Provenance.propTypes = {
    entityObj: object,
    selectedNode: object,
    screenSize: object,
    provEditorModal: object,
    projPermissions: object,
    selectedEdge: object,
    relFrom: object,
    relTo: object,
    showProvCtrlBtns: bool,
    showProvDetails: bool,
    toggleProv: bool,
    toggleProvEdit: bool,
    addEdgeMode: bool,
    doubleClicked: bool,
    dltRelationsBtn: bool,
    drawerLoading: bool,
    relationMode: bool,
    removeFileFromProvBtn: bool,
    provEdges: array,
    provNodes: array,
    fileVersions: array,
    dropdownSelectValue: string,
    relMsg: string
};

export default Provenance;