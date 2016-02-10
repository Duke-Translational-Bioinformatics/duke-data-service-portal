import React from 'react';
import { RouteHandler, Link } from 'react-router';
import MainActions from '../../actions/mainActions';
import ProjectDetails from './projectDetails.jsx';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
import urlGen from '../../../util/urlGen.js';
import LinearProgress from 'material-ui/lib/linear-progress';

class ProjectChildren extends React.Component {

    render() {
        let uploading = null;
        if (this.props.uploads) {
            uploading = Object.keys(this.props.uploads).map(uploadId => {
                let upload = this.props.uploads[uploadId];
                return <div key={'pgrs'+uploadId}>
                    <LinearProgress mode="determinate" color={'#003366'} style={styles.uploader} value={upload.uploadProgress} max={100} min={0}/>
                    <div className="mdl-color-text--grey-600" style={styles.uploadText}>{Math.round(upload.uploadProgress) + '% of '+ upload.name } uploaded...</div>
                </div>;
            });
        }
        let loading = this.props.loading ? <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loader"></div> : '';
        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);
        let projectChildren = this.props.children.map((children) => {
            if (children.kind === 'dds-folder') {
                return (
                    <li key={ children.id } className="hover">
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/folder/" + children.id}
                           className="item-content external">
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>folder</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800">{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                            </div>
                        </a>
                    </li>
                );
            } else {
                return (
                    <li key={ children.id } className="hover">
                        <a className="mdl-button mdl-js-button mdl-button--icon external" style={styles.dlIcon} onTouchTap={() => this.handleTouchTap(children.id)}>
                            <i className="material-icons">get_app</i>
                        </a>
                        <a href={urlGen.routes.baseUrl + urlGen.routes.prefix + "/file/" + children.id}
                           className="item-content external">
                            <div className="item-media"><i className="material-icons"
                                                           style={styles.icon}>description</i>
                            </div>
                            <div className="item-inner">
                                <div className="item-title-row">
                                    <div className="item-title mdl-color-text--grey-800">{ children.name }</div>
                                </div>
                                <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                            </div>
                        </a>
                    </li>
                );
            }
        });

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div>
                        <AddFolderModal {...this.props}/>
                    </div>
                    { loading }
                    { uploading }
                </div>
                { error }
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    <div className="list-block list-block-search searchbar-found media-list">
                        <ul>
                            {projectChildren}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    handleTouchTap(id){
        ProjectActions.getDownloadUrl(id);
    }
}

ProjectChildren.contextTypes = {
    muiTheme: React.PropTypes.object
};

var styles = {
    table: {
        width: '100%',
        margin: '0 auto',
        overflow: 'visible'
    },
    tableText: {
        textAlign: 'left'
    },
    icon: {
        fontSize: 36
    },
    list: {
        paddingTop: 40
    },
    dialogStyles: {
        textAlign: 'center'
    },
    textStyles: {
        textAlign: 'left'
    },
    dlIcon: {
        float: 'right',
        fontSize: 18,
        color: '#EC407A',
        marginTop: 22
    },
    uploader: {
        width: '95%',
        margin: '0 auto'
    },
    uploadText: {
        textAlign: 'left',
        marginLeft: 25,
        fontSize: '.8em'
    }
};

ProjectChildren.propTypes = {
    loading: React.PropTypes.bool,
    uploading: React.PropTypes.bool,
    error: React.PropTypes.string
};

export default ProjectChildren;
