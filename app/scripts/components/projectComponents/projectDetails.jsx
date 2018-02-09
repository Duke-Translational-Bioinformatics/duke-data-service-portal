import React from 'react';
import PropTypes from 'prop-types';
const { object, string } = PropTypes;
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';
import { UrlGen } from '../../util/urlEnum';
import { Roles } from '../../enum';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import ProjectOptions from './projectOptions.jsx';
import Details from './details.jsx';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Card from 'material-ui/Card';
import KeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'

@observer
class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDetails: false,
            showClass: 'hide-details'
        }
    }

    render() {
        const { project, projectRole } = mainStore;

        return (
            project !== undefined && <Card className="mdl-cell mdl-cell--12-col" style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <Link to={UrlGen.routes.home()} style={styles.back} className="external mdl-color-text--grey-800">
                            <i className="material-icons mdl-color-text--grey-800" style={styles.backIcon}>keyboard_backspace</i>
                            Back
                        </Link>
                        <div style={styles.menuIcon}>
                            { projectRole === Roles.project_admin || projectRole === Roles.system_admin ? <ProjectOptionsMenu {...this.props} /> : null}
                            <ProjectOptions {...this.props}/>
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--9-col mdl-cell--4-col-tablet mdl-cell--4-col-phone"
                         style={styles.detailsTitle}>
                        <h4 style={styles.projectName}>
                            <FontIcon className="material-icons" style={styles.projectIcon}>content_paste</FontIcon>
                            { project ? project.name : '' }
                        </h4>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.details}>
                        <span style={styles.createdBy}>Created By: {' '+ project && project.audit ? project.audit.created_by.full_name : '' }</span>
                        <FlatButton
                            style={styles.btn}
                            label={'PROJECT DETAILS'}
                            labelPosition="before"
                            secondary={true}
                            onTouchTap={() => this.showDetails()}
                            icon={!this.state.showDetails ? <KeyboardArrowDown color={Color.blue}/> : <KeyboardArrowUp color={Color.blue}/>}
                        />
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                        <div style={styles.moreDetails} className={this.state.showClass}>
                            { this.state.showDetails ? <Details {...this.props} {...this.state}/> : null }
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    showDetails() {
        this.setState((prevState) => {
            return {
                showDetails: !prevState.showDetails,
                showClass: prevState.showClass === 'show-details' ? 'hide-details' : 'show-details'
            }
        })
    }
}

const styles = {
    arrow: {
        textAlign: 'left'
    },
    back: {
        verticalAlign: -2
    },
    backIcon: {
        fontSize: 24,
        float: 'left'
    },
    btn: {
        float: 'right'
    },
    container: {
        overflow: 'auto',
        padding: '10px 0px 10px 0px',
        maxWidth: 1228,
        margin: '0 auto'
    },
    createdBy: {
        verticalAlign: '-10px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginTop: 10,
        fontWeight: 200
    },
    details: {
        textAlign: 'left',
        float: 'left',
        marginTop: 0
    },
    details2: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 7,
        marginTop: 19
    },
    moreDetails: {
        textAlign: 'left'
    },
    menuIcon: {
        float: 'right'
    },
    projectName: {
        margin: 0,
        fontWeight: 200
    },
    projectIcon: {
        fontSize: 36,
        color: Color.dkGrey2,
        margin: '0px 8px 0px -3px',
        verticalAlign: 'text-bottom'
    },
    summary: {
        float: 'left',
        textAlign: 'left'
    }
};

ProjectDetails.propTypes = {
    project: object,
    projectRole: string
};

export default ProjectDetails;