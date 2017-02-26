import React from 'react'
import { observer } from 'mobx-react';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import LinearProgress from 'material-ui/LinearProgress';

class Loaders extends React.Component {

    @observer
    render() {
        let uploading = null;
        if (this.props.projectStore.uploads) {
            uploading = Object.keys(this.props.projectStore.uploads).map(uploadId => {
                let upload = this.props.projectStore.uploads[uploadId];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={'#EC407A'} style={styles.uploader} value={upload.uploadProgress} max={100} min={0}/>
                    <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.cancelUpload(uploadId, upload.name)}>cancel</i>
                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress.toFixed(2) + '% of ' + upload.name } uploaded...
                    </div>
                </div>;
            });
        }
        let loading = this.props.projectStore.loading ?
        <LinearProgress mode="indeterminate" color={'#EC407A'} style={styles.uploader}/> : '';
        if (this.props.projectStore.uploads && Object.keys(this.props.projectStore.uploads).length != 0) {
            return (
                <div>
                    {uploading}
                </div>
            )
        }else{
            return (
                <div>
                    {loading}
                </div>
            )
        }
    }
    cancelUpload(uploadId, name) {
        ProjectActions.cancelUpload(uploadId, name);
    }
}
var styles = {
    deleteIcon: {
        fontSize: 18,
        cursor: 'pointer',
        color: '#F44336',
        position: 'absolute',
        marginTop: -11,
        marginLeft: 22
    },
    uploader: {
        width: '95%',
        margin: '0 auto',
        marginRight: 24
    },
    uploadText: {
        fontSize: 13,
        textAlign: 'left',
        marginLeft: 41
    }
};

export default Loaders;