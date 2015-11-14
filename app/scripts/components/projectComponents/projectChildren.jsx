import React from 'react';
import { RouteHandler, Link } from 'react-router';
import ProjectDetails from './projectDetails.jsx';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import AddFolderModal from '../../components/folderComponents/addFolderModal.jsx';
import Header from '../../components/globalComponents/header.jsx';
import urlGen from '../../../util/urlGen.js';
var mui = require('material-ui'),
    TextField = mui.TextField,
    Dialog = mui.Dialog,
    Checkbox = mui.Checkbox,
    Table = mui.Table;

class ProjectChildren extends React.Component {

    render() {
        var error = '';
        if (this.props.error)
            error = (<h4>{this.props.error}</h4>);

        let kind = this.props.children.map((children) => {
            if (children.kind === 'dds-folder') {
                return true;
            } else {
                return false
            }
        });

        let projectChildren = this.props.children.map((children) => {
            return (
                <li key={ children.id }>
                    <a href={!kind ? urlGen.routes.baseUrl + "file/" + children.id : urlGen.routes.baseUrl + "folder/" + children.id} className="item-content external" onTouchTap={() => this.handleTouchTap(children.id, kind)}>
                        <div className="item-media"><i className="material-icons mdl-color-text--grey-800" style={styles.icon}>{!kind ? 'description' : 'folder'}</i></div>
                        <div className="item-inner">
                            <div className="item-title-row">
                                <div className="item-title mdl-color-text--grey-800">{ children.name }</div>
                            </div>
                            <div className="item-subtitle mdl-color-text--grey-600">ID: { children.id }</div>
                        </div>
                    </a>
                </li>
            );
        });

        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        let standardActions = [
            {text: 'Submit'},
            {text: 'Cancel'}
        ];

        return (
            <div className="list-container">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.addFolder}>
                        <AddFolderModal {...this.props}/>
                    </div>
                </div>
                { error }
                { loading }
                <div className="mdl-cell mdl-cell--12-col content-block">
                <div className="list-block media-list">
                    <ul>
                        {projectChildren}
                    </ul>
                </div>
                </div>
            </div>
        );
    }
    handleTouchTap(id, kind) {
        if(!kind){
            return null
        }else{
            ProjectActions.getFolderInfo(id);
        }
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
    listTitle: {
        margin: 20,
        marginBottom: -2,
        marginTop: -2,
        float: 'left',
        paddingLeft: 20
    },
    dialogStyles: {
        textAlign: 'center'
    },
    textStyles: {
        textAlign: 'left'
    },
    upLoadBox: {
        textAlign: 'center',
        height: 200,
        border: '1px solid grey',
        margin: '0px 20px 20px 20px'
    }
};

ProjectChildren.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.string,
    is_deleted: React.PropTypes.bool,
};

export default ProjectChildren;
