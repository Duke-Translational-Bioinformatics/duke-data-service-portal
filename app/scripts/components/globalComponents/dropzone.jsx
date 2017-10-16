import React from 'react';
import { observer } from 'mobx-react';
import Dropzone from 'dropzone';
import mainStore from '../../stores/mainStore';

@observer
class DropZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dropzoneHover: false
        };
    }

    componentDidMount () {
        let changeColor = () => {this.setState({dropzoneHover: !this.state.dropzoneHover})};
        Dropzone.autoDiscover = false;
        this.dropzone = new Dropzone('#dropArea', {
            autoProcessQueue: false,
            maxFilesize: 18*1024*1024*1024,
            previewTemplate: '<span></span>',
            dragenter: () => changeColor(),
            addedfile: (file) => { file.size <= 18*1024*1024*1024 ? mainStore.processFilesToUpload([file], []) : mainStore.processFilesToUpload([], [file])},
            dragleave: () => changeColor(),
            drop: () => changeColor(),
            dragleave: () => changeColor(),
            error: (rejectedFile) => {if (!rejectedFile.accepted) mainStore.processFilesToUpload([], [rejectedFile])},
        });
    }

    render() {
        let dropzoneColor = this.state.dropzoneHover ? '#C8E6C9' : '#F5F5F5';

        return (
            <form action="/" className="dropzone needsclick dz-clickable" id="dropArea">
                <div className="needsclick" style={{height: 144, width: '100%', border: '2px dashed #BDBDBD', backgroundColor: dropzoneColor, display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'}}>
                    <div className="dz-message" style={styles.dropzoneText}>
                        Drag and drop files or folders here, or click to select files to upload<br/>
                        Folders must be dropped here to upload and cannot be selected by clicking this box<br/>
                        <small>Uploading folders is only supported in Chrome, Firefox and Microsoft Edge browsers</small>
                    </div>
                </div>
            </form>
        )
    }
}

const styles = {
    dropzoneText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
};

export default DropZone;