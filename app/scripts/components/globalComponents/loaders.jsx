import React, { PropTypes } from 'react';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils';
import { Color } from '../../theme/customTheme';
import {Card, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';

class Loaders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        }
    }

    @observer
    render() {
        let {expandUploadProgressCard, hideUploadProgress, loading, uploads} = mainStore;
        let uploading = null;
        if (uploads) {
            uploading = uploads.entries().map(uploads => {
                let upload = uploads[1];
                let id = uploads[0];
                return <div key={BaseUtils.generateUniqueKey()}>
                    <LinearProgress mode="determinate" color={Color.pink} style={styles.uploader} value={upload.uploadProgress} max={100} min={0}/>
                    <i className="material-icons" style={styles.deleteIcon} onTouchTap={()=>this.cancelUpload(id, upload.name)}>cancel</i>
                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>
                        {upload.uploadProgress === 100 ? upload.uploadProgress.toFixed(2) + '% of ' + upload.name +' uploaded... Processing file, please wait.' : upload.uploadProgress === 0 ? 'Preparing to upload '+ upload.name : upload.uploadProgress.toFixed(2) + '% of ' + upload.name +' uploaded...'}
                    </div>
                </div>;
            });
        }
        let pageLoading = loading ? <LinearProgress mode="indeterminate" color={Color.pink} style={styles.loader}/> : '';
        if (uploads && uploads.size !== 0) {
            if (hideUploadProgress) {
                return (
                    <div>
                        <Card
                            className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                            style={{float: 'left', marginLeft: '4px auto'}}
                            initiallyExpanded={true}
                            expanded={expandUploadProgressCard}
                            onExpandChange={()=>this.toggleExpandIcon()}>
                            <FlatButton
                                style={styles.btn}
                                hoverColor={Color.white}
                                rippleColor={Color.white}
                                label={'UPLOAD PROGRESS'}
                                labelPosition="before"
                                secondary={true}
                                onTouchTap={()=>this.toggleExpandIcon()}
                                icon={<i className="material-icons" style={{color: Color.blue}}>{expandUploadProgressCard ? 'expand_less' : 'expand_more'}</i>}
                            />
                            <CardText expandable={true} >
                                {uploading}
                            </CardText>
                        </Card>
                    </div>
                )
            } else {
                return (
                    <div>
                        {uploading}
                    </div>
                )
            }
        } else {
            return (
                <div>
                    {pageLoading}
                </div>
            )
        }
    }
    cancelUpload(uploadId, name) {
        mainStore.cancelUpload(uploadId, name);
    }
    toggleExpandIcon() {
        mainStore.toggleUploadProgressCard();
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