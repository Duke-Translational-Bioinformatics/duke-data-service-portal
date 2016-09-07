import React from 'react';
import ReactDOM from 'react-dom';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AutoComplete from 'material-ui/lib/auto-complete';
import BaseUtils from '../../../util/baseUtils.js';
import CircularProgress from 'material-ui/lib/circular-progress';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';

class ProvenanceActivityManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activityNode: null,
            addNew: true,
            errorText: null,
            floatingErrorText: 'This field is required.',
            network: null,
            node: null,
            timeout: null,
            value: null
        };
    }

    render() {
        let autoCompleteData = this.props.activities && this.props.activities.length ? this.props.activities.map((activity)=>{
            return {text: activity.name, value: activity.name, id: activity.id, node: activity}
        }) : [];
        let addAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'addAct' ? this.props.provEditorModal.open : false;
        let dltAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'dltAct' ? this.props.provEditorModal.open : false;
        let editAct = this.props.provEditorModal.id !== null && this.props.provEditorModal.id === 'editAct' ? this.props.provEditorModal.open : false;
        let showBtns = this.props.showProvCtrlBtns ? 'block' : 'none';
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
                onTouchTap={() => this.deleteActivity(this.props.selectedNode)}
                />
        ];

        return (
            <div>
                <RaisedButton
                    id="addAct"
                    label="Add Activity"
                    labelStyle={styles.btn.label}
                    style={styles.btn}
                    onTouchTap={() => this.openModal('addAct')}/>
                {!this.props.doubleClicked ?
                    <span>
                <RaisedButton
                    label="Edit Activity"
                    labelStyle={styles.btn.label}
                    style={{zIndex: 9999, margin: '10px 0px 10px 0px', minWidth: 168, width: '100%', display: showBtns}}
                    onTouchTap={() => this.openModal('editAct')}/>
                <RaisedButton
                    label="Delete Activity"
                    labelStyle={{color: '#F44336'}}
                    style={{zIndex: 9999, margin: '20px 0px 10px 0px', minWidth: 168, width: '100%', display: showBtns}}
                    onTouchTap={() => this.openModal('dltAct')}/>
                </span>
                    : null}
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.width < 680 ? {width: '100%'} : {}}
                    title={this.state.addNew ? "Add a New Activity" : "Add an Existing Activity"}
                    autoDetectWindowHeight={true}
                    actions={addActivityActions}
                    open={addAct}
                    onRequestClose={() => this.handleClose('addAct')}>
                    <div style={styles.provEditor}>
                        <Toggle
                            label={this.state.addNew ? "Use an existing activity" : "Add a new activity"}
                            thumbStyle={{backgroundColor: '#E1F5FE'}}
                            style={{maxWidth: 260, textAlign: 'left'}}
                            onToggle={() => this.toggleActivityForm()}/>
                    </div>
                    {this.state.addNew ? null : <AutoComplete
                        id="searchText"
                        fullWidth={true}
                        style={{display: this.state.addNew ? 'none' : 'block', paddingBottom: 31, paddingTop: 32}}
                        menuStyle={{maxHeight: 200}}
                        errorText={this.state.floatingErrorText}
                        floatingLabelText="Type an Activity Name"
                        dataSource={autoCompleteData}
                        filter={AutoComplete.caseInsensitiveFilter}
                        openOnFocus={true}
                        onNewRequest={(value) => this.chooseActivity(value)}
                        underlineStyle={styles.autoCompleteUnderline}/>}
                    {this.state.addNew ? <form action="#" id="newActivityForm">
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
                    </form> : null}
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.width < 680 ? {width: '100%'} : {}}
                    title="Are you sure you want to delete this activity?"
                    autoDetectWindowHeight={true}
                    actions={dltActivityActions}
                    open={dltAct}
                    onRequestClose={() => this.handleClose('dltAct')}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                </Dialog>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={this.props.width < 680 ? {width: '100%'} : {}}
                    title="Edit Activity"
                    autoDetectWindowHeight={true}
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
            </div>
        );
    }

    addNewActivity() {
        let graphNodes = this.props.provNodes;
        if(this.state.activityNode) {
            let node = this.state.activityNode;
            let id = node.id;
            if (!BaseUtils.objectPropInArray(graphNodes, 'id', id)) {
                ProjectActions.addProvActivitySuccess(node);
                ProjectActions.closeProvEditorModal('addAct');
                this.setState({
                    addNew: true,
                    activityNode: null
                });
            } else {
                ProjectActions.openProvEditorModal('nodeWarning');
            }
        } else {
            if (this.state.floatingErrorText) {
                return null
            } else {
                let name = document.getElementById('activityNameText').value;
                let desc = document.getElementById('activityDescText').value;
                if (this.props.addEdgeMode) this.toggleEdgeMode();
                //ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
                ProjectActions.addProvActivity(name, desc);
                ProjectActions.closeProvEditorModal('addAct');
                this.setState({
                    addNew: true,
                    floatingErrorText: 'This field is required.'
                });
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
        let id = this.props.selectedNode.id;
        let actName = this.props.selectedNode.label;
        if (this.state.floatingErrorText) {
            return null
        } else {
            let name = document.getElementById('activityNameText').value;
            let desc = document.getElementById('activityDescText').value;
            if(this.props.addEdgeMode) this.toggleEdgeMode();
            //ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
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
        //ProjectActions.saveGraphZoomState(this.state.network.getScale(), this.state.network.getViewPosition());
        ProjectActions.deleteProvItem(node, id);
        ProjectActions.closeProvEditorModal('dltAct');
        ProjectActions.showProvControlBtns();
        ProjectActions.toggleProvNodeDetails();
    }

    handleClose(id) {
        this.setState({addNew: true, activityNode: null});
        ProjectActions.closeProvEditorModal(id);
    }

    handleFloatingError(e) {
        if(this.state.floatingErrorText !== '' || !e.target.value) { // Avoid lagging text input due to re-renders
            this.setState({floatingErrorText: e.target.value ? '' : 'This field is required.'});
        }
    }

    openModal(id) {
        ProjectActions.openProvEditorModal(id);
    }

    toggleActivityForm() {
        this.setState({addNew: !this.state.addNew});
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
            color: '#235F9C'
        }
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

export default ProvenanceActivityManager;