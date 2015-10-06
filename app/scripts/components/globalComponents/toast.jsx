import React from 'react';
import ProjectListActions from '../../actions/projectListActions';
import ProjectStore from '../../stores/projectStore';
import FolderActions from '../../actions/folderActions';
import FolderStore from '../../stores/folderStore';

let mui = require('material-ui'),
    Snackbar = mui.Snackbar


class Toast extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Snackbar
                    ref= {this.state.ref}
                    message="Folder Deleted!"
                    autoHideDuration={1300}/>
            </div>
        );
    }
}

export default Toast;