import React from 'react'
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import LinearProgress from 'material-ui/lib/linear-progress';

class Loaders extends React.Component {

    render() {
        let uploading = null;
        if (this.props.uploads) {
            uploading = Object.keys(this.props.uploads).map(uploadId => {
                let upload = this.props.uploads[uploadId];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={'#EC407A'} style={styles.uploader}
                                    value={upload.uploadProgress} max={100} min={0}/>

                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress.toFixed(2) + '% of ' + upload.name } uploaded...
                    </div>
                </div>;
            });
        }
       let loading = this.props.loading || this.props.childrenLoading ?
       <LinearProgress mode="indeterminate" color={'#EC407A'} style={styles.uploader}/> : '';
        if (this.props.uploads && Object.keys(this.props.uploads).length != 0) {
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
}
var styles = {
    uploader: {
        width: '95%',
        margin: '0 auto'
    },
    uploadText: {
        textAlign: 'left',
        marginLeft: 31,
        fontSize: 13
    }
};

export default Loaders;