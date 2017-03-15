import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import AutoComplete from 'material-ui/AutoComplete';
import BaseUtils from '../../../util/baseUtils.js';
import Checkbox from 'material-ui/Checkbox';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

@observer
class ProvenanceActivityManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityNode: null,
            errorText: null,
            floatingErrorText: '',
            network: null,
            node: null,
            timeout: null,
            value: null
        };
    }

    render() {
        const { activities, provEditorModal, selectedNode, showProvCtrlBtns } = provenanceStore;
        const { screenSize } = mainStore;
        let autoCompleteData = activities && activities.length ? activities.map((activity)=>{
            return {text: activity.name, value: activity.name, id: activity.id, node: activity}
        }) : [];
        let addAct = provEditorModal.id !== null && provEditorModal.id === 'addAct' ? provEditorModal.open : false;
        let dltAct = provEditorModal.id !== null && provEditorModal.id === 'dltAct' ? provEditorModal.open : false;
        let editAct = provEditorModal.id !== null && provEditorModal.id === 'editAct' ? provEditorModal.open : false;
        let dialogWidth = screenSize.width < 680 ? {width: '100%'} : {};
        let showBtns = showProvCtrlBtns ? 'block' : 'none';

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
                onTouchTap={() => this.deleteActivity(selectedNode)}
                />
        ];

        return (
            <div>
                <RaisedButton
                    id="addAct"
                    label="Add Activity"
                    primary={true}
                    labelStyle={styles.btn.label}
                    style={styles.btn}
                    onTouchTap={() => this.openModal('addAct')}/>
                {!this.props.doubleClicked ?
                    <span>
                        <RaisedButton
                            label="Edit Activity"
                            primary={true}
                            labelStyle={styles.btn.label}
                            style={{zIndex: 9999, margin: '10px 0px 10px 0px', minWidth: 168, width: '100%', display: showBtns}}
                            onTouchTap={() => this.openModal('editAct')}/>
                        <RaisedButton
                            label="Delete Activity"
                            primary={true}
                            labelStyle={styles.btn.label}
                            style={{zIndex: 9999, margin: '20px 0px 10px 0px', minWidth: 168, width: '100%', display: showBtns}}
                            onTouchTap={() => this.openModal('dltAct')}/>
                </span>
                    : null}
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    autoDetectWindowHeight={true}
                    actions={addActivityActions}
                    open={addAct}
                    onRequestClose={() => this.handleClose('addAct')}>
                        <Tabs inkBarStyle={styles.tabInkBar}>
                            <Tab onActive={() => this.toggleTab1()} label="New Activity" style={styles.tabStyles}>
                                <h2 style={styles.tabHeadline}>Add a New Activity</h2>
                                <form action="#" id="newActivityForm">
                                    <TextField
                                        style={styles.textStyles}
                                        fullWidth={true}
                                        autoFocus={true}
                                        hintText="New Activity Name"
                                        errorText={this.state.floatingErrorText}
                                        floatingLabelText="New Activity Name"
                                        ref={(input) => this.activityNameText = input}
                                        type="text"
                                        multiLine={true}
                                        onChange={this.handleFloatingError.bind(this)}/> <br/>
                                    <TextField
                                        style={styles.textStyles}
                                        fullWidth={true}
                                        hintText="New Activity Description"
                                        floatingLabelText="New Activity Description"
                                        ref={(input) => this.activityDescText = input}
                                        type="text"
                                        multiLine={true}/>
                                </form>
                            </Tab>
                            <Tab onActive={() => this.toggleTab2()} label="Use Existing Activity" style={styles.tabStyles}>
                                <h2 style={styles.tabHeadline}>Add an Existing Activity</h2>
                                <AutoComplete
                                    fullWidth={true}
                                    menuStyle={{maxHeight: 200}}
                                    errorText={this.state.floatingErrorText}
                                    floatingLabelText="Type an Existing Activity Name"
                                    dataSource={autoCompleteData}
                                    filter={AutoComplete.caseInsensitiveFilter}
                                    ref={(input) => this.activityNameSearch = input}
                                    openOnFocus={true}
                                    onNewRequest={(value) => this.chooseActivity(value)}
                                    underlineStyle={styles.autoCompleteUnderline}/>
                            </Tab>
                        </Tabs>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Are you sure you want to delete this activity?"
                    autoDetectWindowHeight={true}
                    actions={dltActivityActions}
                    open={dltAct}
                    onRequestClose={() => this.handleClose('dltAct')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title="Edit Activity"
                    autoDetectWindowHeight={true}
                    actions={editActions}
                    open={editAct}
                    onRequestClose={() => this.handleClose('editAct')}>
                    <form action="#" id="newActivityForm">
                        <TextField
                            autoFocus={true}
                            style={styles.textStyles}
                            defaultValue={selectedNode.properties ? selectedNode.properties.name : selectedNode.label}
                            hintText="Activity Name"
                            errorText={this.state.floatingErrorText}
                            floatingLabelText="Activity Name"
                            ref={(input) => this.editActivityNameText = input}
                            type="text"
                            multiLine={true}
                            onChange={this.handleFloatingError.bind(this)}/> <br/>
                        <TextField
                            disabled={false}
                            style={styles.textStyles}
                            defaultValue={selectedNode.properties ? selectedNode.properties.description : null}
                            hintText="Activity Description"
                            floatingLabelText="Activity Description"
                            ref={(input) => this.editActivityDescText = input}
                            type="text"
                            multiLine={true}/>
                    </form>
                </Dialog>
            </div>
        );
    }

    addNewActivity() {
        let graphNodes = provenanceStore.provNodes.slice();
        if(this.state.activityNode) {
            let node = this.state.activityNode;
            let id = node.id;
            if (!BaseUtils.objectPropInArray(graphNodes, 'id', id)) {
                provenanceStore.addProvActivitySuccess(node);
                provenanceStore.closeProvEditorModal('addAct');
                this.setState({activityNode: null});
            } else {
                provenanceStore.openProvEditorModal('nodeWarning');
            }
        } else {
            if (this.state.floatingErrorText !== '') {
                return null
            } else {
                let name = this.activityNameText.getValue();
                let desc = this.activityDescText.getValue();
                if (provenanceStore.addEdgeMode) this.toggleEdgeMode();
                provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
                provenanceStore.addProvActivity(name, desc);
                provenanceStore.closeProvEditorModal('addAct');
            }
        }
    }

    chooseActivity(value) {
        this.setState({
            activityNode: value.node,
            floatingErrorText: ''
        });
    }

    editActivity() {
        let id = provenanceStore.selectedNode.id;
        let actName = provenanceStore.selectedNode.label;
        if (this.state.floatingErrorText) {
            return null
        } else {
            let name = this.editActivityNameText.getValue();
            let desc = this.editActivityDescText.getValue();
            if(provenanceStore.addEdgeMode) this.toggleEdgeMode();
            provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
            provenanceStore.editProvActivity(id, name, desc, actName);
            provenanceStore.closeProvEditorModal('editAct');
            provenanceStore.showProvControlBtns();
        }
    }

    deleteActivity(node) {
        let id = this.props.params.id;
        provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
        provenanceStore.deleteProvItem(node, id);
        provenanceStore.closeProvEditorModal('dltAct');
        provenanceStore.showProvControlBtns();
        provenanceStore.toggleProvNodeDetails();
    }

    handleClose(id) {
        this.setState({activityNode: null, floatingErrorText: 'This field is required.'});
        provenanceStore.closeProvEditorModal(id);
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    openModal(id) {
        provenanceStore.saveGraphZoomState(provenanceStore.network.getScale(), provenanceStore.network.getViewPosition());
        provenanceStore.openProvEditorModal(id);
    }

    toggleEdgeMode() {
        provenanceStore.toggleAddEdgeMode();
    }

    toggleTab1() {
        this.activityNameText.focus();
    }

    toggleTab2() {
        this.activityNameSearch.focus();
    }
}

var styles = {
    provEditor:{
        display: 'flex',
        justifyContent: 'center',
        flexFlow: 'row wrap'
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    btn: {
        zIndex: 9999,
        margin: '10px 0px 10px 0px',
        minWidth: 168,
        width: '100%',
        label: {
            fontWeight: 200
        }
    },
    tabHeadline: {
        fontSize: 24,
        marginBottom: 12,
        fontWeight: 400,
        textAlign: 'center'
    },
    tabInkBar: {
        backgroundColor: '#EC407A',
        paddingTop: 3,
        marginTop: -3
    },
    tabStyles: {
        fontWeight: 200
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

ProvenanceActivityManager.propTypes = {
    selectedNode: object,
    provEditorModal: object,
    screenSize: object,
    showProvCtrlBtns: bool,
    activities: array
};

export default ProvenanceActivityManager;