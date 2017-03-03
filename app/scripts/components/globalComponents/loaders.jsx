import React from 'react'
import { observer,  map } from 'mobx-react';
import ProjectActions from '../../actions/projectActions';
import mainStore from '../../stores/mainStore';
import LinearProgress from 'material-ui/LinearProgress';

class Loaders extends React.Component {

    componentDidUpdate() {
        console.log(mainStore.uploads)
    }

    @observer
    render() {
        let uploading = null;
        if (mainStore.uploads) {
            uploading = mainStore.uploads.entries().map(uploadId => {
                let upload = uploadId[1];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={'#EC407A'} style={styles.uploader} value={upload.uploadProgress} max={100} min={0}/>
                    <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.cancelUpload(uploadId, upload.name)}>cancel</i>
                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress.toFixed(2) + '% of ' + upload.name } uploaded...
                    </div>
                </div>;
            });
        }
        let loading = mainStore.loading ?
        <LinearProgress mode="indeterminate" color={'#EC407A'} style={styles.uploader}/> : '';
        if (mainStore.uploads && Object.keys(mainStore.uploads).length != 0) {
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
        mainStore.cancelUpload(uploadId, name);
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
        marginRight: 24,
        backgroundColor: "#235F9C"
    },
    uploadText: {
        fontSize: 13,
        textAlign: 'left',
        marginLeft: 41
    }
};

export default Loaders;