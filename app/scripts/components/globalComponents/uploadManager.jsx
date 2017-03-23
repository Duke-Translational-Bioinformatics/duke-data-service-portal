import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
const { object, bool, array, string } = PropTypes;
import Dropzone from 'react-dropzone';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import Info from 'material-ui/svg-icons/action/info';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class UploadManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dropzoneHover: false,
            floatingErrorText: '',
            searchText: '',
            timeout: null
        };
    }

    render() {
        const {entityObj, filesRejectedForUpload, filesToUpload, openUploadManager, screenSize, selectedEntity, tagAutoCompleteList, tagLabels, tagsToAdd} = mainStore;
        let tags = tagsToAdd && tagsToAdd.length > 0 ? tagsToAdd.map((tag)=>{
            return (<div key={BaseUtils.generateUniqueKey()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.id, tag.label, selectedEntity, tagsToAdd)}>&times;</span>
            </div>)
        }) : null;
        let tagLbls = tagLabels.map((label)=>{
            return (
                <li key={label.label+Math.random()} style={styles.tagLabels} onTouchTap={() => this.addTagToCloud(label.label, tagsToAdd)}>{label.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });
        let files = filesToUpload.length ? filesToUpload.map((file)=>{
            return <div key={BaseUtils.generateUniqueKey()}>
                <div className="mdl-cell mdl-cell--6-col" style={styles.fileList}>{file.name}</div>
            </div>
        }) : null;
        let rejectedFiles = filesRejectedForUpload.length ? filesRejectedForUpload.map((file)=>{
            return <div key={BaseUtils.generateUniqueKey()}>
                <div className="mdl-cell mdl-cell--6-col" style={styles.rejectedFileList}>{'Exceeds maximum size of' +
                ' 5 GB. Cannot upload: '+file.name}</div>
            </div>
        }) : null;
        let autoCompleteData = tagAutoCompleteList && tagAutoCompleteList.length > 0 ? tagAutoCompleteList : [];
        let dropzoneColor = this.state.dropzoneHover ? '#EEE' : '#FFF';
        let height = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.height : window.innerHeight;
        let name = entityObj ? entityObj.name : 'these files';
        let width = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.width : window.innerWidth;

        return (
            <div style={styles.fileUpload}>
                <button
                    title="Upload File"
                    rel="tooltip"
                    className='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored'
                    style={styles.floatingButton}
                    onTouchTap={() => this.toggleUploadManager()}>
                    <i className='material-icons'>file_upload</i>
                </button>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <Drawer docked={false} disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openSecondary={true} open={openUploadManager}>
                        <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                             style={{marginTop: width > 680 ? 65 : 85}}>
                            <IconButton style={styles.toggleBtn}
                                        onTouchTap={() => this.toggleUploadManager()}>
                                <NavigationClose />
                            </IconButton>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                            <h5 className="mdl-color-text--grey-600" style={styles.mainHeading}>Upload Files</h5>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.fileInputContainer}>
                            <div className="mdl-cell mdl-cell--6-col" style={styles.dropzoneContainer}>
                                <Dropzone ref={(drop)=> this.dropzone = drop}
                                          onMouseEnter={(e)=>this.onHoverDropzone(e)}
                                          onMouseLeave={(e)=>this.onHoverDropzone(e)}
                                          onDrop={this.onDrop.bind(this)}
                                          maxSize={5*1024*1024*1024}
                                          style={{width: '100%', border: '2px dashed #BDBDBD', backgroundColor: dropzoneColor}}>
                                    <div style={styles.dropzoneText}>Drag and drop files here, or click to select files to upload.<br/>Folders cannot be uploaded.</div>
                                </Dropzone>
                                {filesToUpload.length ? <h6 className="mdl-color-text--grey-600" style={styles.fileListHeader}>Preparing to upload:</h6> : null}
                            </div>
                            {files}
                            {rejectedFiles}
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                            <div className="mdl-cell mdl-cell--6-col mdl-cell--6-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                                <h6 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags For These Files
                                    <span className="mdl-color-text--grey-600" style={styles.heading.span}>(optional)</span>
                                    <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                                tooltipPosition="top-center"
                                                iconStyle={styles.infoIcon.icon}
                                                style={styles.infoIcon}>
                                        <Info color={'#BDBDBD'}/>
                                    </IconButton>
                                </h6>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                                <AutoComplete
                                    fullWidth={true}
                                    id="tagInputText"
                                    ref={(autocomplete) => this.autocomplete = autocomplete}
                                    style={styles.autoComplete}
                                    floatingLabelText="Type a Tag Label Here"
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={autoCompleteData}
                                    errorText={this.state.floatingErrorText}
                                    onNewRequest={(value) => this.addTagToCloud(value)}
                                    onUpdateInput={this.handleUpdateInput.bind(this)}
                                    underlineStyle={styles.autoComplete.underline}/>
                                <IconButton onTouchTap={() => this.addTagToCloud(this.autocomplete.state.searchText)}
                                            iconStyle={styles.addTagIcon.icon}
                                            style={styles.addTagIcon}>
                                    <AddCircle color={'#235F9C'}/>
                                </IconButton><br/>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={styles.tagLabelsContainer}>
                                <h6 style={styles.tagLabelsHeading}>Recently used tags <span style={styles.tagLabelsHeading.span}>(click on a tag to add it to {name})</span></h6>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600">
                                    <ul style={styles.tagLabelList}>
                                        { tagLbls }
                                    </ul>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={styles.chipWrapper}>
                                {tagsToAdd.length ? <h6 style={styles.chipHeader}>New Tags To Add</h6> : null}
                                <div className="chip-container" style={styles.chipContainer}>
                                    { tags }
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                                <RaisedButton label="Upload Files" secondary={true}
                                              labelStyle={{fontWeight: 100}}
                                              style={styles.uploadFilesBtn}
                                              onTouchTap={() => this.handleUploadButton(filesToUpload, tagsToAdd, entityObj)}/>
                            </div>
                        </div>
                    </Drawer>
                </div>
            </div>
        )
    }

    addTagToCloud(label) {
        let tags = mainStore.tagsToAdd;
        let clearText = ()=> {
            this.autocomplete.setState({searchText:''});
            this.autocomplete.focus();
        };
        if(label && !label.indexOf(' ') <= 0) {
            if (tags.some((el) => { return el.label === label.trim(); })) {
                this.setState({floatingErrorText: label + ' tag is already in the list'});
                setTimeout(()=>{
                    this.setState({floatingErrorText: ''});
                    clearText();
                }, 2000)
            } else {
                tags.push({label: label.trim()});
                mainStore.defineTagsToAdd(tags);
                setTimeout(()=>clearText(), 500);
                this.setState({floatingErrorText: ''})
            }
        }
    }

    deleteTag(id, label, selectedEntity, tagsToAdd) {
        let fileId = selectedEntity !== null ? selectedEntity.id : this.props.params.id;
        let tags = tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        mainStore.defineTagsToAdd(tags);
    }

    handleUploadButton(filesToUpload, tagsToAdd, entityObj) {
        if (filesToUpload.length) {
            let projId;
            let parentKind;
            let parentId = this.props.params.id;
            for (let i = 0; i < filesToUpload.length; i++) {
                let blob = filesToUpload[i];
                if (!this.props.entityObj) {
                    projId = this.props.params.id;
                    parentKind = 'dds-project';
                }else{
                    projId = entityObj ? entityObj.ancestors[0].id : null;
                    parentKind = entityObj ? entityObj.kind : null;
                }
                mainStore.startUpload(projId, blob, parentId, parentKind, null, null, tagsToAdd);
                mainStore.defineTagsToAdd([]);
            }
        } else {
            return null
        }
        mainStore.toggleUploadManager();
    }

    handleUpdateInput (text) {
        let timeout = this.state.timeout;
        let searchInput = this.autocomplete;
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                let value = text;
                if (!value.indexOf(' ') <= 0) {
                    mainStore.getTagAutoCompleteList(value);
                }
            }, 500)
        });
    }

    onDrop (files, rejectedFiles) {
        mainStore.processFilesToUpload(files, rejectedFiles);
    }

    onHoverDropzone(e) {
        this.setState({dropzoneHover: !this.state.dropzoneHover});
    }

    toggleUploadManager() {
        mainStore.toggleUploadManager();
        setTimeout(() => {
            if(this.autocomplete.state.searchText !== '') this.autocomplete.setState({searchText:''});
        }, 500);
        mainStore.defineTagsToAdd([]);
        mainStore.processFilesToUpload([], []);
    }
}

var styles = {
    addTagIcon: {
        margin: '-30px 20px 0px 0px',
        float: 'right',
        width: 24,
        height: 24,
        padding: 0,
        icon: {
            width: 24,
            height: 24
        }
    },
    autoCompleteContainer: {
        textAlign: 'center',
        marginLeft: 15
    },
    autoComplete: {
        maxWidth: 'calc(100% - 5px)',
        underline: {
            borderColor: '#0680CD',
            maxWidth: 'calc(100% - 42px)'
        }
    },
    buttonWrapper: {
        textAlign: 'left'
    },
    chipWrapper: {
        textAlign: 'left'
    },
    chipContainer: {
        marginTop: 0
    },
    chipHeader: {
        marginLeft: 5,
        marginTop: 0
    },
    dropzoneContainer: {
        margin: '0 auto'
    },
    dropzoneText: {
        margin: '6% auto'
    },
    fileInputContainer: {
        textAlign: 'center',
        marginLeft: 15,
        marginTop: 40
    },
    fileList: {
        margin: '0 auto',
        textAlign: 'left',
        padding: 5
    },
    fileListHeader: {
        textAlign: 'left',
        paddingLeft: 5
    },
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px',
        height: 16
    },
    floatingButton: {
        position: 'absolute',
        top: -50,
        marginRight: 17,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    heading: {
        textAlign: 'left',
        margin: '0px 0px -26px 5px ',
        span: {
            marginLeft: 5,
            fontSize: '.7em'
        }
    },
    infoIcon: {
        verticalAlign: 8,
        icon: {
            height: 20,
            width: 20
        }
    },
    mainHeading: {
        textAlign: 'center'
    },
    rejectedFileList: {
        margin: '0 auto',
        textAlign: 'left',
        padding: 5,
        backgroundColor: '#ffcdd2'
    },
    tagLabels: {
        margin: 3,
        cursor: 'pointer',
        color: '#235F9C',
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left',
        padding: 6
    },
    tagLabelsHeading: {
        margin: 0,
        span: {
            fontSize: '.7em'
        }
    },
    tagLabelList: {
        listStyleType: 'none',
        padding: '5px 0px 5px 0px',
        margin: '0px 0px 0px -10px'
    },
    toggleBtn: {
        margin: '25px 0px 15px 0px',
        zIndex: 9999
    },
    uploadFilesBtn: {
        margin: '10px 0px 20px 0px',
        float: 'right'
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

UploadManager.contextTypes = {
    muiTheme: React.PropTypes.object
};

UploadManager.propTypes = {
    openUploadManager: bool,
    entityObj: object,
    screenSize: object,
    selectedEntity: object,
    tagLabels: array,
    tagAutoCompleteList: array,
    tagsToAdd: array,
    filesRejectedForUpload: array,
    filesToUpload: array
};

export default UploadManager;