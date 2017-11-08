import React, { PropTypes } from 'react';
const { object, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { Path } from '../../util/urlEnum';
import { Roles } from '../../enum';
import FolderOptionsMenu from './folderOptionsMenu.jsx';
import BaseUtils from '../../util/baseUtils';
import Card from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';

@observer
class FolderPath extends React.Component {

    render() {
        const {entityObj, projectRole} = mainStore;

        return (
            entityObj !== null && entityObj.parent ? <Card className="project-container mdl-cell mdl-cell--12-col" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href={'/#/' + BaseUtils.getUrlPath(entityObj.parent.kind) + entityObj.parent.id } className="mdl-color-text--grey-800 external" onTouchTap={() => this.goBack()}>
                            <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>
                            Back
                        </a>
                        <div style={styles.menuIcon}>
                            { projectRole !== Roles.project_viewer && projectRole !== Roles.file_uploader  && projectRole !== Roles.file_downloader ? <FolderOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity()} /> : null }
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-color-text--grey-800"
                         style={styles.detailsTitle}>
                        <h4 style={styles.heading}><FontIcon className="material-icons" style={styles.folderIcon}>folder_open</FontIcon>{ entityObj.name }</h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.breadcrumbs}>
                        <h6 style={styles.breadcrumbHeading}>{BaseUtils.getFilePath(entityObj.ancestors)}  {' '+entityObj.name}</h6>
                    </div>
                </div>
            </Card> : null
        );
    }

    goBack() {
        mainStore.showBackButton ? this.props.router.goBack() : null;
    }

    setSelectedEntity() {
        let id = this.props.params.id;
        let isListItem = false;
        mainStore.setSelectedEntity(id, Path.FOLDER, isListItem);
    }
}

const styles = {
    arrow: {
        textAlign: 'left'
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -7
    },
    breadcrumbs: {
        float: 'left'
    },
    breadcrumbHeading: {
        margin: '0px 0px 6px 3px'
    },
    container: {
        overflow: 'auto',
        padding: '10px 0px 10px 0px',
        margin: '0 auto'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    folderIcon: {
        fontSize: 36,
        verticalAlign: 'text-bottom',
        marginRight: 8,
        color: Color.dkGrey
    },
    heading: {
        margin: 0,
        fontWeight: 200
    },
    menuIcon: {
        float: 'right',
        marginTop: -10,
        marginRight: -12
    }
};

FolderPath.propTypes = {
    entityObj: object,
    projectRole: string
};

export default FolderPath;