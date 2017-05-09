import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import authStore from '../../stores/authStore';
import EditTemplateModal from '../globalComponents/editTemplateModal.jsx';
import DeleteTemplateModal from '../globalComponents/deleteTemplateModal.jsx';
import MetadataTemplateProperties from '../globalComponents/metadataTemplateProperties.jsx';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

@observer
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
        const { metadataTemplate } = mainStore;
        const { currentUser } = authStore;
        let templateInfo = metadataTemplate && metadataTemplate !== null ? showTemplate(metadataTemplate) : null;
        let templateCreator = metadataTemplate && metadataTemplate !== null ? metadataTemplate.audit.created_by.id : null;
        let templateLabel = metadataTemplate && metadataTemplate !== null ? metadataTemplate.label : null;

        return (
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.wrapper}>
                {currentUser.id === templateCreator ? <IconMenu iconButtonElement={<IconButton iconClassName="material-icons">more_vert</IconButton>}
                          style={styles.menuIconBtn}
                          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                          targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <MenuItem primaryText="Edit Template" leftIcon={<i className="material-icons">mode_edit</i>} onTouchTap={() => this.editTemplateModal()}/>
                    <MenuItem primaryText="Add Template Properties" leftIcon={<i className="material-icons">add_circle</i>} onTouchTap={() => this.createProperties()}/>
                    <MenuItem primaryText="Delete Template" leftIcon={<i className="material-icons">delete</i>} onTouchTap={()=>this.deleteTemplateModal()}/>
                </IconMenu> : null}
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800" style={styles.headingWrapper}>
                   <h5 className="mdl-color-text--grey-600" style={styles.title}>{templateLabel}</h5>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.detailsWrapper}>
                    {templateInfo}
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-600" style={styles.btnWrapper}>
                    <h5 className="mdl-color-text--grey-600" style={styles.heading}>Properties</h5>
                    {currentUser.id === templateCreator ? <RaisedButton label={'Add Properties'} secondary={true}
                                  labelStyle={styles.btn.label}
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
        mainStore.showTemplatePropManager();
    }

    deleteTemplateModal() {
        mainStore.toggleModals('dltTemplate');
    }

    editTemplateModal() {
        mainStore.toggleModals('editTemplate');
    }

    toggleMetadataManager() {
        mainStore.toggleMetadataManager();
        this.setState({
            errorText: 'This field is required',
            errorText2: 'This field is required'
        });
    }
}

const styles = {
    btn: {
        margin: '12px 0px 12px 12px',
        float: 'right',
        label: {
            fontWeight: 100
        }
    },
    btnWrapper: {
        marginBottom: -10,
        maxWidth: 670
    },
    detailsWrapper: {
        maxWidth: 670
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
    menuIconBtn: {
        position: 'absolute',
        top: 90 ,
        right: 5,
        zIndex: 200
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
    metadataTemplate: React.PropTypes.object,
    screenSize: React.PropTypes.object
};

export default MetadataTemplateOptions;