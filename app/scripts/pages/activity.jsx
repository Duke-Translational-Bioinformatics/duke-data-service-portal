import React from 'react'
import { observer } from 'mobx-react';
import mainStore from '../stores/mainStore';
import provenanceStore from '../stores/provenanceStore';
import { Kind, Path } from '../util/urlEnum';
import ActivityDetails from '../components/globalComponents/activityDetails.jsx';
import TagManager from '../components/globalComponents/tagManager.jsx';

@observer
class Activity extends React.Component {

    componentDidMount() {
        this._loadActivity();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.params.id !== this.props.params.id) {
            this._loadActivity();
        }
    }

    _loadActivity() {
        let id = this.props.params.id;
        mainStore.setSelectedEntity(null, null);
        provenanceStore.getActivity(id, Path.ACTIVITIES);
        mainStore.getObjectMetadata(id, Kind.DDS_ACTIVITY);
        mainStore.getTags(id, Kind.DDS_ACTIVITY);
        mainStore.getTagLabels();
    }

    render() {
        return (
            <div>
                <ActivityDetails {...this.props} />
                <TagManager {...this.props} />
            </div>
        );
    }
}

export default Activity;