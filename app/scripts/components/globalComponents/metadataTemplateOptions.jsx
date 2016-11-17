import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import EditTemplateModal from '../globalComponents/editTemplateModal.jsx';
import DeleteTemplateModal from '../globalComponents/deleteTemplateModal.jsx';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import BaseUtils from '../../../util/baseUtils'
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';

class MetadataTemplateOptions extends React.Component {

    render() {
        function showTemplate({id, name, label, description}) {
            return (
                <span id={id}>
                    <dl>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Name</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{name}</dd>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Display Label</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{label}</dd>
                        <dt className="mdl-color-text--grey-800" style={styles.tableKey}>Description</dt>
                        <dd className="mdl-color-text--grey-600" style={styles.tableValue}>{description}</dd>
                    </dl>
                </span>
            );
        }
        let currentUser = this.props.currentUser && this.props.currentUser !== null ? this.props.currentUser : null;
        let height = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.height : window.innerHeight;
        let templateInfo = this.props.metadataTemplate && this.props.metadataTemplate !== null ? showTemplate(this.props.metadataTemplate) : null;
        let templateCreator = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.audit.created_by.id : null;
        let templateDesc = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.description : null;
        let templateId = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.id : null;
        let templateLabel = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.label : null;
        let templateName = this.props.metadataTemplate && this.props.metadataTemplate !== null ? this.props.metadataTemplate.name : null;
        let width = this.props.screenSize !== null && Object.keys(this.props.screenSize).length !== 0 ? this.props.screenSize.width : window.innerWidth;

        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                {this.props.currentUser.id === templateCreator ? <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          style={{position: 'absolute',top: width > 680 ? 91 : 101,right: 25,zIndex: 200}}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Delete Template" leftIcon={<i className="material-icons">delete</i>} onTouchTap={()=>this.deleteTemplateModal()}/>
                    <MenuItem primaryText="Edit Template" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.editTemplateModal()}/>
                    <MenuItem primaryText="Add Template Properties" leftIcon={<i className="material-icons">add_circle</i>} onTouchTap={() => this.createProperties()}/>
                </IconMenu> : null}
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.headingWrapper}>
                   <h5 className="mdl-color-text--grey-600" style={styles.title}>{templateLabel}</h5>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.detailsWrapper}>
                    {templateInfo}
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.btnWrapper}>
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>Properties</h5>
                    {templateCreator === currentUser.id ? <RaisedButton label={'Add Properties'} secondary={true}
                                  labelStyle={{fontWeight: 100}}
                                  style={styles.btn}
                                  onTouchTap={() => this.createProperties()}/> : null}
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.listWrapper}>
                   <MetadataTemplateProperties {...this.props}/>
                </div>
                <EditTemplateModal {...this.props}/>
                <DeleteTemplateModal {...this.props}/>
            </div>
        )
    }

    createProperties() {
        ProjectActions.showTemplatePropManager();
    }

    deleteTemplateModal() {
        ProjectActions.toggleModals('dltTemplate');
    }

    editTemplateModal() {
        ProjectActions.toggleModals('editTemplate');
        setTimeout(()=>{
            document.getElementById('templateLabel').select();
        },350);
    }

    toggleMetadataManager() {
        ProjectActions.toggleMetadataManager();
        this.setState({
            errorText: 'This field is required',
            errorText2: 'This field is required'
        });
    }
}

var styles = {
    btn: {
        margin: '12px 0px 12px 12px',
        float: 'right'
    },
    btnWrapper: {
        marginBottom: -10,
        maxWidth: 670
    },
    detailsWrapper: {
        maxWidth: 670
    },
    dialogStyles: {
        textAlign: 'center',
        fontColor: '#303F9F',
        zIndex: '5000'
    },
    heading: {
        textAlign: 'left',
        float: 'left'
    },
    headingWrapper: {
        maxWidth: 670
    },
    listWrapper: {
        marginTop: -10,
        maxWidth: 670
    },
    tableKey: {
        fontSize: 12,
        fontWeight: 200
    },
    tableValue: {
        fontSize: 16,
        marginLeft: 0,
        marginBottom: 10
    },
    title: {
        textAlign: 'center'
    },
    wrapper:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: 5
    }
};

MetadataTemplateOptions.contextTypes = {
    muiTheme: React.PropTypes.object
};

MetadataTemplateOptions.propTypes = {
    currentUser: React.PropTypes.object,
    metaTemplates: React.PropTypes.array,
    metadataTemplate: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default MetadataTemplateOptions;