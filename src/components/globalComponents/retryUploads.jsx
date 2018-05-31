import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import BaseUtils from '../../util/baseUtils.js';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
const { object, array } = PropTypes;

@observer
class RetryUploads extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            retryUploads: mainStore.failedUploads.slice(),
            retryUploadModal: true,
            warningText: {}
        };
    }

    render() {
        const { failedUploads, screenSize } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let failed = failedUploads && failedUploads.length ? failedUploads.map((obj, i) => {
            return <TableRow key={i} selected={this.state.selected}>
                <TableRowColumn>{obj.fileName}</TableRowColumn>
                <TableRowColumn>{obj.id}</TableRowColumn>
            </TableRow>
        }) : null;
        let failedUploadModal = null;
        if (failedUploads.length) {
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
                contentStyle={dialogWidth}
                autoDetectWindowHeight={true}
                style={styles.dialogStyles}>
                    <i className="material-icons" style={styles.warning}>warning</i>
                    <h6 style={this.state.warningText}>Please select files and try again</h6>
                    <Table multiSelectable={true}
                           onRowSelection={(e)=>this.selectTableRow(e)}>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>ID</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody deselectOnClickaway={false}>
                            {failed}
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
        mainStore.removeFailedUploads();
        this.setState({retryUploadModal: false});
        setTimeout(() => this.setState({retryUploadModal: true, warningText: {}}), 500);
    }

    retryUploads() {
        if(this.state.retryUploads.length) {
            for (let i = 0; i < this.state.retryUploads.length; i++) {
                let blob = this.state.retryUploads[i].upload.blob;
                let parentId = this.state.retryUploads[i].upload.parentId;
                let parentKind = this.state.retryUploads[i].upload.parentKind;
                let projId = this.state.retryUploads[i].upload.projectId;
                let tags = this.state.retryUploads[i].upload.tags;
                mainStore.startUpload(projId, blob, parentId, parentKind, null, null, tags);
            }
            mainStore.removeFailedUploads();
            this.setState({retryUploadModal: false});
            setTimeout(() => this.setState({retryUploadModal: true, retryUploads: []}), 1500);
        } else {
            this.setState({warningText: {color: '#F44336', fontWeight: 800}});
        }
    }

    selectTableRow(rows) {
        let failedUploads = mainStore.failedUploads;
        if (rows === 'all') {
            this.setState({retryUploads: failedUploads});
        }
        if (rows === 'none') this.setState({retryUploads: []});
        if (rows !== 'none' && rows !== 'all') {
            for (let i = 0; i < rows.length; i++) {
                if (!BaseUtils.objectPropInArray(this.state.retryUploads, 'id', failedUploads[rows[i]].id)) {
                    this.state.retryUploads.push(failedUploads[rows[i]]);
                    break;
                }
                if (rows.length < this.state.retryUploads.length) {
                    this.setState({retryUploads: []});
                    this.state.retryUploads.push(failedUploads[rows[i]]);
                    break;
                }
            }
        }
    }
}

const styles = {
    dialogStyles: {
        textAlign: 'center',
        fontColor: Color.dkBlue,
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

RetryUploads.propTypes = {
    screenSize: object,
    failedUploads: array
};

export default RetryUploads;