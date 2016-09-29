import React from 'react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import BaseUtils from '../../../util/baseUtils.js';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

class RetryUploads extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            retryUploads: this.props.failedUploads,
            retryUploadModal: true,
            warningText: {}
        };
    }

    render() {
        let failedUploads = this.props.failedUploads && this.props.failedUploads.length ? this.props.failedUploads.map((obj, i) => {
            return <TableRow key={i} selected={this.state.selected}>
                <TableRowColumn>{obj.fileName}</TableRowColumn>
                <TableRowColumn>{obj.id}</TableRowColumn>
            </TableRow>
        }) : null;
        let failedUploadModal = null;
        if (this.props.failedUploads.length) {
            let actions = [
                <FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={() => this.handleClose()}/>,
                <FlatButton
                            label="Retry"
                            secondary={true}
                            onTouchTap={() => this.retryUploads()}/>
            ];
            failedUploadModal = <Dialog
                title="Upload Failed"
                actions={actions}
                modal={false}
                open={this.state.retryUploadModal}
                onRequestClose={this.handleClose.bind(this)}
                contentStyle={this.props.windowWidth < 580 ? {width: '100%'} : {}}
                autoDetectWindowHeight={true}
                style={styles.dialogStyles}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <h6 style={this.state.warningText}>Please select files and try again</h6>
                    <Table multiSelectable={true}
                           allRowsSelected={true}
                           onRowSelection={(e)=>this.selectTableRow(e)}>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>ID</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody deselectOnClickaway={false}>
                            {failedUploads}
                        </TableBody>
                    </Table>
            </Dialog>;
        }

        return (
            <span>
                {failedUploadModal}
            </span>
        );
    }

    handleClose() {
        ProjectActions.removeFailedUploads();
        this.setState({retryUploadModal: false});
        setTimeout(() => this.setState({retryUploadModal: true, warningText: {}}), 500);
    }

    retryUploads() {
        let projId = this.props.appRouter.getCurrentParams().id;
        if(this.state.retryUploads.length) {
            for (let i = 0; i < this.state.retryUploads.length; i++) {
                let blob = this.state.retryUploads[i].upload.blob;
                let parentId = this.state.retryUploads[i].upload.parentId;
                let parentKind = this.state.retryUploads[i].upload.parentKind;
                let tags = this.state.retryUploads[i].upload.tags;
                ProjectActions.startUpload(projId, blob, parentId, parentKind, null, null, tags);
            }
            ProjectActions.removeFailedUploads();
            this.setState({retryUploadModal: false});
            setTimeout(() => this.setState({retryUploadModal: true, retryUploads: []}), 1500);
        } else {
            this.setState({warningText: {color: '#F44336', fontWeight: 800}});
        }
    }

    selectTableRow(rows) {
        if (rows === 'all') {
            this.setState({retryUploads: this.props.failedUploads});
        }
        if (rows === 'none') this.setState({retryUploads: []});
        if (rows !== 'none' && rows !== 'all') {
            for (let i = 0; i < rows.length; i++) {
                if (!BaseUtils.objectPropInArray(this.state.retryUploads, 'id', this.props.failedUploads[rows[i]].id)) {
                    this.state.retryUploads.push(this.props.failedUploads[rows[i]]);
                    break;
                }
                if (rows.length < this.state.retryUploads.length) {
                    this.state.retryUploads = [];
                    this.state.retryUploads.push(this.props.failedUploads[rows[i]]);
                    break;
                }
            }
        }
    }
}

var styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '9999'
    },
    loginWrapper: {
        width: '90vw',
        height: 'auto',
        textAlign: 'center',
        margin: '0 auto',
        marginTop: 50,
        padding: 10
    },
    toast: {
        position: 'absolute',
        bottom: 20,
        left: 0
    },
    warning: {
        fontSize: 48,
        textAlign: 'center',
        color: '#F44336'
    }
};

export default RetryUploads;