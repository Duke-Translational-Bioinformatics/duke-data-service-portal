import React from 'react'
import FolderActions from '../actions/folderActions';
import FolderStore from '../stores/folderStore';

class FolderPath extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            folders: []
        };
    }

    componentDidMount() {
        this.unsubscribe = FolderStore.listen(state => this.setState(state));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {

        return (
            <div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800"
                 style={styles.container}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                    <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                        <a href="#"><i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>Back</a>
                    </div>
                    <div className="mdl-cell mdl-cell--12-col" style={styles.detailsTitle}>
                        <span className="mdl-color-text--grey-800" style={styles.breadcrumbs}>Test Project 123
                            <i className="material-icons mdl-color-text--grey-600" style={styles.moreIcon}>keyboard_arrow_right</i>
                            <span className="mdl-color-text--grey-600"style={styles.folderName}><a href="#">KOMP Data</a></span><i className="material-icons mdl-color-text--grey-600" style={styles.moreIcon}>keyboard_arrow_right</i>
                            <span className="mdl-color-text--grey-600"style={styles.folderName}>KOMP Data</span><i className="material-icons mdl-color-text--grey-600" style={styles.moreIcon}>keyboard_arrow_right</i>
                            <span className="mdl-color-text--grey-600"style={styles.folderName}>KOMP Data</span><i className="material-icons mdl-color-text--grey-600" style={styles.moreIcon}>keyboard_arrow_right</i>
                            <span className="mdl-color-text--grey-600"style={styles.folderName}>KOMP Data</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
    container: {
        marginTop: 20,
        padding: '10px 0px 10px 0px'
    },
    arrow: {
        textAlign: 'left'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    breadcrumbs: {
        fontSize: 24
    },
    folderName: {
        fontSize: 14
    },
    moreIcon: {
        fontSize: 36,
        verticalAlign: -11
    },
    backIcon: {
        fontSize: 24,
        verticalAlign: -6
    }
};

export default FolderPath;