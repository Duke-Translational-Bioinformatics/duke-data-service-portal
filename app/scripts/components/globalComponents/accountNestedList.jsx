import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
import { UrlGen } from '../../util/urlEnum';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Subheader from 'material-ui/Subheader';

@observer
class AccountNestedList extends React.Component {

    state = {
      open: false,
    };

    handleToggle = () => {
      this.setState({
        open: !this.state.open,
      });
    };

    handleNestedListToggle = (item) => {
      this.setState({
        open: item.state.open,
      });
    };

    render() {
        const { loading, responseHeaders, projects, projectRoles, usage } = mainStore;
        let projectListItem = projects ? projects.map((project) => {
            let role = projectRoles.get(project.id);
            return (
              <ListItem
                key={ project.id }
                primaryText={project.name}
                leftIcon={<FontIcon className="material-icons">content_paste</FontIcon>}
                initiallyOpen={false}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <ListItem
                    key={1}
                    primaryText="Starred"
                    leftIcon={<ActionGrade />}
                  />,
                ]}
              />
            );
        }) : null;
        {debugger}

        // let folderListItem = folders ? folders.map((folder) => {
        //     let role = folderRoles.get(folder.id);
        //     return (
        //       <ListItem
        //         key={ folder.id }
        //         primaryText={folder.name}
        //         leftIcon={<FontIcon className="material-icons">content_paste</FontIcon>}
        //         initiallyOpen={true}
        //         primaryTogglesNestedList={true}
        //         nestedItems={[
        //           <ListItem
        //             key={1}
        //             primaryText="Starred"
        //             leftIcon={<ActionGrade />}
        //           />,
        //         ]}
        //       />
        //     );
        // }) : null;

        return (
          <div className="project-container mdl-grid">
            <Card className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.card}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                        <h4>Provenances</h4>
                        <List>
                          {projectListItem}
                        </List>
                </div>
             </Card>
          </div>
        );
    }
}

const styles = {
    card: {
        minHeight: 260,
        padding: 10
    },
    cardTitle: {
        fontWeight: 200,
        marginBottom: -15,
        marginRight: 24
    },
    cardTitle2: {
        fontWeight: 200,
        marginBottom: -15,
        padding: '4px 4px 4px 16px'
    },
    icon: {
        fontSize: 36,
        float: 'left',
        margin: '20px 15px 0px 13px',
        color: Color.dkGrey2
    },
    listTitle: {
        margin: '0px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 20
    },
    menuIcon: {
        float: 'right',
        marginTop: 19,
        marginRight: 3
    },
    title: {
        margin: '-10px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        marginLeft: -14
    }
};

export default AccountNestedList;
