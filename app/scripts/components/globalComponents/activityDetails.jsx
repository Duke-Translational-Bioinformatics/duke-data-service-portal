import React from 'react';
import PropTypes from 'prop-types';
const { object, bool } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import ActivityOptionsMenu from './activityOptionsMenu.jsx';
import CustomMetadata from '../fileComponents/customMetadata.jsx';
import Loaders from './loaders.jsx';
import TagCloud from './tagCloud.jsx';
import BaseUtils from '../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';

@observer
class ActivityDetails extends React.Component {

    render() {
        const { activity } = provenanceStore;
        const { screenSize, showBackButton, uploads, loading, objectMetadata } = mainStore;
        const width = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.width : window.innerWidth;

        const activityDetails = activity !== null && <Card className="item-info mdl-color--white content mdl-color-text--grey-800" style={styles.card}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        { showBackButton && <a style={styles.back} className="mdl-color-text--grey-800 external" onTouchTap={() => this.goBack()}>
                            <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>Back
                        </a> }
                        <div style={styles.menuIcon}>
                            <ActivityOptionsMenu {...this.props}/>
                        </div>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                        <span className="mdl-color-text--grey-800" style={styles.title}><FontIcon className="material-icons" style={styles.icon}>class</FontIcon>{ activity.name }</span>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-color-text--grey-800" style={styles.subTitle}>
                        <span style={styles.spanTitle}>{ activity.description }</span>
                    </div>
                    {width >  300 ? <TagCloud {...this.props}/> : null}
                    <div>
                        { uploads || loading ? <Loaders {...this.props}/> : null }
                    </div>
                    <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                        <div className="list-block">
                            <div className="list-group">
                                <ul>
                                    <li className="list-group-title">Activity Started On</li>
                                    <li className="item-content">
                                        <div className="item-inner">
                                            <div>{ BaseUtils.formatDate(activity.started_on) }</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="list-group">
                                <ul>
                                    <li className="list-group-title">Activity Ended On</li>
                                    <li className="item-content">
                                        <div className="item-inner">
                                            <div>{ activity.ended_on === null ? 'N/A' : BaseUtils.formatDate(activity.ended_on) }</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="list-group">
                                <ul>
                                    <li className="list-group-title">Last Updated By</li>
                                    <li className="item-content">
                                        <div className="item-inner">
                                            <div>{ activity.audit.last_updated_by === null ? 'N/A' : activity.audit.last_updated_by.full_name}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="list-group">
                                <ul>
                                    <li className="list-group-title">Last Updated On</li>
                                    <li className="item-content">
                                        <div className="item-inner">
                                            <div>{ activity.audit.last_updated_on === null ? 'N/A' : BaseUtils.formatDate(activity.audit.last_updated_on) }</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="list-group">
                                <ul>
                                    <li className="list-group-title">Activity ID</li>
                                    <li className="item-content">
                                        <div className="item-inner">
                                            <div>{ activity.id }</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>;

        return (
            <div>
                {activityDetails}
                {objectMetadata && objectMetadata.length ? <CustomMetadata {...this.props}/> : null}
            </div>
        )
    }

    goBack() {
        this.props.router.goBack();
        provenanceStore.currentGraph !== null ? provenanceStore.shouldRenderGraph() : null;
    }

}

const styles = {
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    backIcon: {
        cursor: 'pointer',
        fontSize: 24,
        verticalAlign:-7
    },
    back: {
        cursor: 'pointer',
        verticalAlign:-7
    },
    card: {
        paddingBottom: 30,
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        margin: '10px 0px 10px 20px'
    },
    icon: {
        fontSize: 28,
        verticalAlign: 'bottom'
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    menuIcon: {
        float: 'right',
        marginTop: -6,
        marginRight: -6
    },
    subTitle: {
        textAlign: 'left',
        float: 'left',
        margin: '10px 0px 20px 25px'
    },
    spanTitle: {
        fontSize: '1.2em'
    },
    title: {
        fontSize: 24,
        wordWrap: 'break-word'
    }
};

ActivityDetails.propTypes = {
    loading: bool,
    activity: object,
    screenSize: object
};

export default ActivityDetails;