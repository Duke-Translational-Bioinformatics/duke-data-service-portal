import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
const { object, bool, array } = PropTypes;
import DropZone from '../globalComponents/dropzone.jsx';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import BaseUtils from '../../util/baseUtils';
import { Kind } from '../../util/urlEnum';
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
            floatingErrorText: '',
            searchText: '',
            timeout: null
        };
    }

    render() {
        const {filesRejectedForUpload, filesToUpload, isFolderUpload, openUploadManager, showTagCloud, tagAutoCompleteList, tagLabels, tagsToAdd} = mainStore;
        let tags = tagsToAdd && tagsToAdd.length > 0 ? tagsToAdd.map((tag)=>{
            return (<div key={BaseUtils.generateUniqueKey()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.label, tagsToAdd)}>&times;</span>
            </div>)
        }) : null;

        let tagLbls = tagLabels.map((label)=>{
            return (
                <li key={label.label+Math.random()} style={styles.tagLabels} onTouchTap={() => this.addTagToCloud(label.label, tagsToAdd)}>{label.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });

        let files = filesToUpload.length ? filesToUpload.map((file, i)=>{
            return <div key={BaseUtils.generateUniqueKey()} className="mdl-cell mdl-cell--6-col" style={styles.fileList}>
                <i className="material-icons" style={styles.deleteIcon} onTouchTap={() => this.removeFileFromList(i)}>cancel</i>
                {file.name}
            </div>

        }) : null;

        let rejectedFiles = filesRejectedForUpload.length ? filesRejectedForUpload.map((file)=>{
            return <div key={BaseUtils.generateUniqueKey()} className="mdl-cell mdl-cell--12-col" style={styles.rejectedFileList}>
                {file.name+' exceeds the maximum size of 18 GB.'}
            </div>
        }) : null;

        let autoCompleteData = tagAutoCompleteList && tagAutoCompleteList.length > 0 ? tagAutoCompleteList : [];
        let width = window.innerWidth > 640 ? window.innerWidth*.8 : window.innerWidth;

        return (
            <div style={styles.fileUpload}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <Drawer docked={false} disableSwipeToOpen={true} width={width} openSecondary={true} open={openUploadManager} onRequestChange={() => this.toggleUploadManager()}>
                        <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={{marginTop: 65}}>
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
                                <DropZone />
                                {filesToUpload.length ? <h6 className="mdl-color-text--grey-600" style={styles.fileListHeader}>Preparing to upload {filesToUpload.length} file{filesToUpload.length > 1 ? 's' : ''}</h6> : null}
                            </div>
                            <div className="mdl-cell mdl-cell--6-col" style={{margin: '0 auto'}}>
                                {files}
                                {rejectedFiles}
                            </div>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                            <div className="mdl-cell mdl-cell--6-col mdl-cell--6-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                                <h6 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags For These Files
                                    <span className="mdl-color-text--grey-600" style={styles.heading.span}>(optional)</span>
                                    <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                                tooltipPosition="top-center"
                                                iconStyle={styles.infoIcon.icon}
                                                style={styles.infoIcon}>
                                        <Info color={Color.ltGrey}/>
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
                                    <AddCircle color={Color.blue}/>
                                </IconButton><br/>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={styles.tagLabelsContainer}>
                                <h6 style={styles.tagLabelsHeading} >Recently used tags</h6>
                                <i className="material-icons" style={{color: Color.blue}} onTouchTap={()=>this.toggleTagCloud()}>{showTagCloud ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</i>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={{display: showTagCloud ? 'block' : 'none', marginTop: 0}}>
                                    <span style={styles.tagLabelsHeading.span}>
                                        (click on a tag to add it to {filesToUpload.length === 1 ? filesToUpload[0].name + ' during upload' : 'these files during upload'})
                                    </span>
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
                                <RaisedButton label="Start Upload"
                                              labelStyle={styles.buttonLabel}
                                              style={styles.uploadFilesBtn}
                                              onTouchTap={() => this.handleUploadButton(filesToUpload, isFolderUpload, tagsToAdd)}/>
                                <RaisedButton label={'Cancel'}
                                              labelStyle={styles.buttonLabel}
                                              style={styles.cancelBtn}
                                              onTouchTap={() => this.toggleUploadManager()}/>
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

    deleteTag(label, tagsToAdd) {
        let tags = tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        mainStore.defineTagsToAdd(tags);
    }

    handleUploadButton(filesToUpload, isFolderUpload, tagsToAdd) {
        if (filesToUpload.length) {
            let projectId = mainStore.project.id != null ? mainStore.project.id : mainStore.entityObj.project.id;
            let parentKind = this.props.router.location.pathname.includes('project') ? Kind.DDS_PROJECT : Kind.DDS_FOLDER;
            let parentId = this.props.params.id;
            if(!isFolderUpload) {
                for (let i = 0; i < filesToUpload.length; i++) {
                    let blob = filesToUpload[i];
                    mainStore.startUpload(projectId, blob, parentId, parentKind, null, null, tagsToAdd);
                    mainStore.defineTagsToAdd([]);
                    mainStore.processFilesToUpload([], []);
                }
            } else {
                mainStore.processFilesToUploadDepthFirst(filesToUpload, parentId, parentKind, projectId)
            }
        } else {
            return null
        }
        mainStore.toggleUploadManager();
        if(mainStore.showTagCloud) this.toggleTagCloud();
    }

    handleUpdateInput (text) {
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

    removeFileFromList(index) {
        mainStore.removeFileFromUploadList(index);
    }

    toggleTagCloud() {
        mainStore.toggleTagCloud();
    }

    toggleUploadManager() {
        mainStore.toggleUploadManager();
        setTimeout(() => {
            if(this.autocomplete.state.searchText !== '') this.autocomplete.setState({searchText:''});
        }, 500);
        if(mainStore.showTagCloud) this.toggleTagCloud();
        mainStore.defineTagsToAdd([]);
        mainStore.processFilesToUpload([], []);
    }

}

const styles = {
    addTagIcon: {
        margin: '-30px 0px 0px 0px',
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
            borderColor: Color.ltBlue,
            maxWidth: 'calc(100% - 22px)'
        }
    },
    buttonWrapper: {
        textAlign: 'left'
    },
    buttonLabel: {
        color: Color.blue
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
    deleteIcon: {
        fontSize: 18,
        cursor: 'pointer',
        color: Color.red,
        verticalAlign: 'middle',
        marginRight: 3
    },
    dropzoneContainer: {
        margin: '0 auto',
    },
    fileInputContainer: {
        textAlign: 'center',
        marginLeft: 15,
        marginTop: 40
    },
    fileList: {
        margin: '0 auto',
        textAlign: 'left',
        color: Color.blue,
        padding: 5,
        float: 'left',
        minWidth: '50%'
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
        color: Color.white
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
        margin: '1.5px auto',
        textAlign: 'left',
        float: 'left',
        padding: 5,
        color: Color.white,
        backgroundColor: Color.red
    },
    tagLabels: {
        margin: 3,
        cursor: 'pointer',
        color: Color.blue,
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left',
        padding: 6
    },
    tagLabelsHeading: {
        margin: 0,
        float: 'left',
        span: {
            fontSize: '.9em',
            marginLeft: -8
        },
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
    cancelBtn: {
        float: 'right',
        margin: '10px 10px 20px 0px',
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
    selectedEntity: object,
    tagLabels: array,
    tagAutoCompleteList: array,
    tagsToAdd: array,
    filesRejectedForUpload: array,
    filesToUpload: array
};

export default UploadManager;