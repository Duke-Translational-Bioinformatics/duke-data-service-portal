import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { Link } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddCircle from 'material-ui/lib/svg-icons/content/add-circle';
import AutoComplete from 'material-ui/lib/auto-complete';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';
import LeftNav from 'material-ui/lib/left-nav';
import Info from 'material-ui/lib/svg-icons/action/info';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import Tooltip from '../../../util/tooltip.js';

class UploadManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            floatingErrorText: '',
            searchText: '',
            timeout: null,
            tagsToAdd: [],
            value: null
        };
    }

    render() {
        let tags = this.state.tagsToAdd.length > 0 ? this.state.tagsToAdd.map((tag)=>{
            return (<div key={Math.random()} className="chip">
                <span className="chip-text">{tag.label}</span>
                <span className="closebtn" onTouchTap={() => this.deleteTag(tag.id, tag.label)}>&times;</span>
            </div>)
        }) : null;
        let tagLabels = this.props.tagLabels.map((label)=>{
            return (
                <li key={label.label+Math.random()} style={styles.tagLabels} onTouchTap={() => this.addTagToCloud(label.label)}>{label.label}
                    <span className="mdl-color-text--grey-600">,</span>
                </li>
            )
        });
        let name = this.props.entityObj ? this.props.entityObj.name : '';
        let autoCompleteData = this.props.tagAutoCompleteList && this.props.tagAutoCompleteList.length > 0 ? this.props.tagAutoCompleteList : [];
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;
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
                    <LeftNav disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openRight={true} open={this.props.openUploadManager}>
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
                                <div className="mdl-cell mdl-cell--6-col mdl-textfield mdl-textfield--file">
                                    <textarea className="mdl-textfield__input mdl-color-text--grey-800" type="text" id="uploadFile" rows="3" readOnly></textarea>
                                    <div className="mdl-button--file mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                                        <i className="material-icons" style={styles.iconColor}>attach_file</i>
                                        <input type='file' id="uploadBtn" ref='fileUpload' onChange={this.handleFileName.bind(this)} multiple />
                                    </div>
                                </div>
                            <br/>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                            <div className="mdl-cell mdl-cell--6-col mdl-cell--6-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                                <h6 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags For These Files
                                    <span className="mdl-color-text--grey-400" style={styles.heading.span}>(optional)</span>
                                    <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                                tooltipPosition="top-center"
                                                iconStyle={{height: 20, width: 20}}
                                                style={styles.infoIcon}>
                                        <Info color={'#BDBDBD'}/>
                                    </IconButton>
                                </h6>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                                <AutoComplete
                                    fullWidth={true}
                                    id="tagInputText"
                                    ref={`autocomplete`}
                                    style={{maxWidth: 'calc(100% - 5px)'}}
                                    floatingLabelText="Type a Tag Label Here"
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={autoCompleteData}
                                    errorText={this.state.floatingErrorText}
                                    onNewRequest={(value) => this.addTagToCloud(value)}
                                    onUpdateInput={this.handleUpdateInput.bind(this)}
                                    underlineStyle={{borderColor: '#0680CD', maxWidth: 'calc(100% - 42px)'}}/>
                                <IconButton onTouchTap={() => this.addTagToCloud(document.getElementById("tagInputText").value)}
                                            iconStyle={{width: 24, height: 24}}
                                            style={styles.addTagIcon}>
                                    <AddCircle color={'#235F9C'}/>
                                </IconButton><br/>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-400" style={styles.tagLabelsContainer}>
                                <h6 style={styles.tagLabelsHeading}>Recently used tags <span style={styles.tagLabelsHeading.span}>(click on a tag to add it to {name})</span></h6>
                                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400">
                                    <ul style={styles.tagLabelList}>
                                        { tagLabels }
                                    </ul>
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-400" style={styles.chipWrapper}>
                                {this.state.tagsToAdd.length ? <h6 style={styles.chipHeader}>Tags To Add</h6> : null}
                                <div className="chip-container" style={styles.chipContainer}>
                                    { tags }
                                </div>
                            </div>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                                <RaisedButton label="Upload Files" secondary={true}
                                              labelStyle={{fontWeight: 100}}
                                              style={styles.uploadFilesBtn}
                                              onTouchTap={() => this.handleUploadButton()}/>
                            </div>
                        </div>
                    </LeftNav>
                </div>
            </div>
        )
    }

    addTagToCloud(label) {
        let clearText = ()=> {
            this.refs[`autocomplete`].setState({searchText:''});
            this.refs[`autocomplete`].focus();
        };
        if(label && !label.indexOf(' ') <= 0) {
            if (this.state.tagsToAdd.some((el) => { return el.label === label; })) {
                this.setState({floatingErrorText:label + 'This tag is already in the list'});
                setTimeout(()=>{
                    this.setState({floatingErrorText: ''});
                    clearText();
                }, 2000)
            }else{
                this.state.tagsToAdd.push({label: label.trim()}); // Todo: Do this in store
                this.setState({tagsToAdd: this.state.tagsToAdd})
            }
        }
        setTimeout(() => {
            clearText();
        }, 500);
    }

    deleteTag(id, label) {
        let fileId = this.props.params.id;
        let tags = this.state.tagsToAdd;
        tags = tags.filter(( obj ) => {
            return obj.label !== label;
        });
        this.setState({tagsToAdd: tags});
    }

    handleUploadButton() {
        if (document.getElementById("uploadFile").value) {
            let projId = '';
            let parentKind = '';
            let parentId = this.props.params.id;
            let fileList = document.getElementById('uploadBtn').files;
            let tags = this.state.tagsToAdd;
            for (let i = 0; i < fileList.length; i++) {
                let blob = fileList[i];
                if (!this.props.entityObj) {
                    projId = this.props.params.id;
                    parentKind = 'dds-project';
                }else{
                    projId = this.props.entityObj ? this.props.entityObj.ancestors[0].id : null;
                    parentKind = this.props.entityObj ? this.props.entityObj.kind : null;
                }
                ProjectActions.startUpload(projId, blob, parentId, parentKind, null, null, tags);
            }
        }else{
            return null
        }
        ProjectActions.toggleUploadManager();
    }

    handleFileName() {
        let fList = [];
        let fl = document.getElementById('uploadBtn').files;
        for (var i = 0; i < fl.length; i++) {
            fList.push(fl[i].name);
            var fileList = fList.toString().split(',').join(', ');
        }
        document.getElementById('uploadFile').value = 'Preparing to upload: ' + fileList;
    }


    handleUpdateInput (text) {
        // Add 500ms lag to autocomplete so that it only makes a call after user is done typing
        let timeout = this.state.timeout;
        let textInput = document.getElementById('tagInputText');
        textInput.onkeyup = () => {
            clearTimeout(this.state.timeout);
            this.setState({
                timeout: setTimeout(() => {
                    if (!textInput.value.indexOf(' ') <= 0) {
                        ProjectActions.getTagAutoCompleteList(textInput.value);
                    }
                }, 500)
            })
        };
    };

    toggleUploadManager() {
        ProjectActions.toggleUploadManager();
        document.getElementById('uploadFile').value = '';
        setTimeout(() => {
            if(document.getElementById("tagInputText").value !== '') this.refs[`autocomplete`].setState({searchText:''});
        }, 500);
        this.setState({tagsToAdd: []});
    }
}

var styles = {
    addTagIcon: {
        margin: '-30px 20px 0px 0px',
        float: 'right',
        width: 24,
        height: 24,
        padding: 0
    },
    autoCompleteContainer: {
        textAlign: 'center',
        marginLeft: 15
    },
    fileInputContainer: {
        textAlign: 'center',
        marginLeft: 15
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
        marginLeft: 5
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
            fontSize: '.8em'
        }
    },
    iconColor: {
        color: '#ffffff'
    },
    infoIcon: {
        verticalAlign: 8
    },
    mainHeading: {
        textAlign: 'center'
    },
    tagLabels: {
        margin: 3,
        cursor: 'pointer',
        color: '#235F9C',
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left'
    },
    tagLabelsHeading: {
        margin: '10px 0px 10px 0px',
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
    loading: bool,
    details: array,
    error: object
};

export default UploadManager;