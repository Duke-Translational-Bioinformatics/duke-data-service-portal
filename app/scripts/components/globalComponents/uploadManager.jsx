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
                    <LeftNav disableSwipeToOpen={true} width={width > 640 ? width*.80 : width} openRight={true} open={this.props.openUploadManager} style={styles.tagManager}>
                        <div className="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={{marginTop: 95}} >
                            <IconButton style={styles.toggleBtn}
                                        onTouchTap={() => this.toggleUploadManager()}>
                                <NavigationClose />
                            </IconButton>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" >
                            <h5 className="mdl-color-text--grey-600" style={styles.mainHeading}>Upload Files</h5>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.fileInputContainer}>
                            <form action='#' id='newFileForm'>
                                <div className="mdl-cell mdl-cell--6-col mdl-textfield mdl-textfield--file">
                                    <textarea className="mdl-textfield__input mdl-color-text--grey-800" type="text" id="uploadFile" rows="3" readOnly></textarea>
                                    <button className="mdl-button--file mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored">
                                        <i className="material-icons" style={styles.iconColor}>attach_file</i>
                                        <input type='file' id="uploadBtn" ref='fileUpload' onChange={this.handleFileName.bind(this)} multiple/>
                                    </button>
                                </div>
                            </form><br/>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.autoCompleteContainer}>
                            <div className="mdl-cell mdl-cell--6-col mdl-color-text--grey-600" style={{paddingRight: 0, marginRight: -102}}>
                                <h6 className="mdl-color-text--grey-600" style={styles.heading}>Add Tags For These Files
                                    <span className="mdl-color-text--grey-400" style={{marginLeft: 5, fontSize: '.8em'}}>(optional)</span>
                                    <IconButton tooltip={<span>Tag your files with relevant keywords<br/> that can help with search and organization of content</span>}
                                                tooltipPosition="bottom-center"
                                                iconStyle={{height: 20, width: 20}}
                                                style={styles.infoIcon}>
                                        <Info color={'#BDBDBD'}/>
                                    </IconButton>
                                </h6>
                                <AutoComplete
                                    fullWidth={true}
                                    id="tagText"
                                    floatingLabelText="Type a Tag Label Here"
                                    filter={AutoComplete.fuzzyFilter}
                                    dataSource={autoCompleteData}
                                    errorText={this.state.floatingErrorText}
                                    onNewRequest={(value) => this.addTagToCloud(value)}
                                    onUpdateInput={this.handleUpdateInput.bind(this)}
                                    underlineStyle={{borderColor: '#0680CD', maxWidth: 'calc(100% - 42px)'}} />
                            </div>
                            <div className="mdl-cell mdl-cell--1-col mdl-color-text--grey-600">
                                <IconButton onTouchTap={() => this.addTagToCloud(document.getElementById('tagText').value)} iconStyle={{width: 24, height: 24}} style={{margin: '100px 0px 0px 44px', width: 24, height: 24, padding: 0}}>
                                    <AddCircle color={'#235F9C'} />
                                </IconButton><br/>
                            </div>
                        </div>
                        <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-400" style={styles.chipWrapper}>
                            <h6 className="mdl-cell mdl-cell--9-col" style={styles.chipHeader}>Tags To Add</h6>
                            <div className="chip-container mdl-cell mdl-cell--9-col" style={styles.chipContainer}>
                                { tags }
                            </div>
                        </div>
                        <div className="mdl-cell mdl-cell--9-col mdl-color-text--grey-400" style={styles.buttonWrapper}>
                            <RaisedButton label="Upload Files" secondary={true}
                                          labelStyle={{fontWeight: 100}}
                                          style={{margin: '10px 0px 20px 0px', float: 'right'}}
                                          onTouchTap={() => this.handleUploadButton()}/>
                        </div>
                    </LeftNav>
                </div>
            </div>
        )
    }

    addTagToCloud(label) {
        let id = this.props.params.id;
        if(label && !label.indexOf(' ') <= 0) {
            if (this.state.tagsToAdd.some(function (el) { return el.label === label; })) {
                this.setState({floatingErrorText: 'This tag is already in the list'});
                setTimeout(()=>{
                    this.setState({floatingErrorText: ''});
                }, 2000)
            }else{
                this.state.tagsToAdd.push({label: label.trim()}); // Todo: Do this in store
                this.setState({tagsToAdd: this.state.tagsToAdd})
            }
        }
        setTimeout(() => {
            // Todo: this is temporary. There's a bug in AutoComplete that makes the input repopulate with the old text.
            // Todo: using timeout doesn't solve the problem reliably. For now using select() until we update MUI@v0.16
            document.getElementById("tagText").select();
        }, 500)
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
            for (var i = 0; i < fileList.length; i++) {
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
        let textInput = document.getElementById('tagText');
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
            // Todo: this is temporary. There's a bug in AutoComplete that makes the input repopulate with the old text.
            // Todo: using timeout doesn't solve the problem reliably. For now using select() until we update MUI@v0.16
            if(document.getElementById("tagText").value !== '') document.getElementById("tagText").select();
        }, 500);
        this.setState({tagsToAdd: []});
    }
}

var styles = {
    autoCompleteContainer: {
        textAlign: 'center',
        marginLeft: 15,
        marginBottom: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileInputContainer: {
        textAlign: 'center',
        clear: 'both',
        marginLeft: 15
    },
    buttonWrapper: {
        textAlign: 'left',
        clear: 'both'
    },
    chipWrapper: {
        textAlign: 'left',
        clear: 'both'
    },
    chipContainer: {
        float: 'right',
        marginTop: 0
    },
    chipHeader: {
        float: 'right',
        padding: 10
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
        textAlign: 'left'
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
        color: '#0680CD',
        float: 'left'
    },
    tagLabelsContainer: {
        textAlign: 'left',
        clear: 'both',
        marginBottom: 40
    },
    tagLabelsHeading: {
        margin: '10px 0px 10px 16px',
        span: {
            fontSize: '.7em'
        }
    },
    tagLabelList: {
        listStyleType: 'none',
        padding: '5px 5px 25px 5px',
        marginTop: 0
    },
    tagManager: {
        marginTop: 80,
        paddingBottom: 90
    },
    toggleBtn: {
        margin: '25px 0px 15px 0px',
        zIndex: 9999
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