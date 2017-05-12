import React, { PropTypes } from 'react';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import LinearProgress from 'material-ui/LinearProgress';

class Loaders extends React.Component {

    @observer
    render() {
        let uploading = null;
        if (mainStore.uploads) {
            uploading = mainStore.uploads.entries().map(uploadId => {
                let upload = uploadId[1];
                let id = uploadId[0];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={Color.pink} style={styles.uploader} value={upload.uploadProgress} max={100} min={0}/>
                    <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.cancelUpload(id, upload.name)}>cancel</i>
                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress == 100 ? upload.uploadProgress.toFixed(2) + '% of ' + upload.name +' uploaded... Processing file, please wait.' : upload.uploadProgress == 0 ? 'Preparing to upload '+ upload.name : upload.uploadProgress.toFixed(2) + '% of ' + upload.name +' uploaded...'}
                    </div>
                </div>;
            });
        }
        let loading = mainStore.loading ? <LinearProgress mode="indeterminate" color={Color.pink} style={styles.loader}/> : '';
        if (mainStore.uploads && mainStore.uploads.size != 0) {
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

const styles = {
    deleteIcon: {
        fontSize: 18,
        cursor: 'pointer',
        color: Color.red,
        position: 'absolute',
        marginTop: -11,
        marginLeft: 4
    },
    uploader: {
        width: '97.7%',
        margin: '0px 8px 0px 22px',
        backgroundColor: Color.blue
    },
    loader: {
        width: '98.7%',
        margin: '0px 8px 0px 8px',
        backgroundColor: Color.blue
    },
    uploadText: {
        fontSize: 13,
        textAlign: 'left',
        marginLeft: 41
    }
};

Loaders.propTypes = {
    uploads: object,
    loading: bool
};

export default Loaders;