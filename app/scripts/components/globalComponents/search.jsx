import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import Close from 'material-ui/lib/svg-icons/navigation/close';
import IconButton from 'material-ui/lib/icon-button';

import Paper from 'material-ui/lib/paper';
import TextField from 'material-ui/lib/text-field';

class Search extends React.Component {

    componentDidMount() {
        if (this.refs.searchInput) { // Check if searchInput is in DOM and focus
            let search = this.refs.searchInput ? this.refs.searchInput : null;
            if(this.props.showSearch && search !== null) search.focus();
        }
    }

    render() {
        return (this.props.showSearch ? <Paper style={{height: 76}} zDepth={2}>
            <i className="material-icons"
               style={styles.searchIcon}
               onTouchTap={()=>this.showSearch()}>search</i>
            <TextField
                ref="searchInput"
                id="searchInput"
                hintText="Search"
                hintStyle={{fontWeight: 100}}
                onKeyDown={(e)=>this.search(e)}
                style={{width: '90%',position: 'absolute',top: '20%', left: this.props.screenSize.width < 680 ? '11%' : '8%'}}
                underlineStyle={styles.textField.underline}
                underlineFocusStyle={styles.textField.underline} />
            <i className="material-icons"
               style={styles.closeSearchIcon}
               onTouchTap={()=>this.showSearch()}>
                close</i>
        </Paper> : null)
    }

    search(e) {
        let searchInput = this.refs.searchInput;
        if(e.keyCode === 13) {
            let value = searchInput.getValue();
            ProjectActions.searchObjects(value, ['dds-file', 'dds-folder']);
            this.props.appRouter.transitionTo('/results')
        }
    }

    showSearch() {
        ProjectActions.toggleSearch();
        if(this.props.routerPath === '/results') this.props.appRouter.goBack();
    }
}

const styles = {
    closeSearchIcon: {
        position: 'absolute',
        right: '3.66%',
        bottom: '34%',
        cursor: 'pointer'
    },
    searchBar: {
        width: '50vw',
        margin: '0 auto',
        fontSize: '.9em',
        display: 'block',
        hintStyle: {
            color: '#eeeeee',
            marginLeft: 25
        },
        inputWrapper: {
            margin: '0px 8px 0px 8px',
            padding: -15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        underlineStyle: {
            borderColor: '#fff'
        }
    },
    searchIcon: {
        position: 'absolute',
        left: '4%',
        bottom: '36%',
        cursor: 'pointer'
    },
    searchInput: {
        width: '90%',
        position: 'absolute',
        top: '20%',
        left: '12%'
    },
    textField: {color: "#fff",
        underline: {
            display: 'none'
        }
    },
    themeColor: {
        backgroundColor: '#235F9C'
    }
};

Search.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default Search;