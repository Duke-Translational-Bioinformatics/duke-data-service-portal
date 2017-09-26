import React, { PropTypes } from 'react';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
import { UrlGen, Path } from '../../util/urlEnum';
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
import AccountTreeList from './accountTreeList.jsx';
// import AccountTreeListPure from './accountTreeListPure.jsx';

const projectListItems = [
  {
  	"depth": 0,
  	"children": []
  }, {
  	"title": "Chapter 1: Preamble",
  	"depth": 1,
  	"parentIndex": 0,
  	"children": [2, 5],
  	"disabled": false
  }, {
  	"title": "What is Functional Programming",
  	"depth": 2,
  	"children": [3, 4],
  	"parentIndex": 1,
  	"disabled": false
  }, {
  	"title": "Pure Functions",
  	"depth": 3,
  	"parentIndex": 2,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Composing Functions",
  	"depth": 3,
  	"parentIndex": 2,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Functional JavaScript",
  	"depth": 2,
  	"children": [6, 7],
  	"disabled": false,
  	"parentIndex": 1
  }, {
  	"title": "JavaScript Array Methods",
  	"depth": 3,
  	"parentIndex": 5,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Introduction to Ramda",
  	"depth": 3,
  	"parentIndex": 5,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Chapter 2: React",
  	"depth": 1,
  	"parentIndex": 0,
  	"disabled": false,
  	"children": [9, 12]
  }, {
  	"title": "Introduction to React",
  	"depth": 2,
  	"parentIndex": 8,
  	"disabled": false,
  	"children": [10, 11]
  }, {
  	"title": "Writing React Components",
  	"depth": 3,
  	"parentIndex": 9,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Composing React Components",
  	"depth": 3,
  	"parentIndex": 9,
  	"disabled": false,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "React Components",
  	"depth": 2,
  	"parentIndex": 8,
  	"disabled": true,
  	"children": [13, 14]
  }, {
  	"title": "Props and State in React",
  	"parentIndex": 12,
  	"depth": 3,
  	"disabled": true,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }, {
  	"title": "Component Lifecycle",
  	"parentIndex": 12,
  	"depth": 3,
  	"disabled": true,
  	"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio."
  }
]

@observer
class AccountNestedList extends React.Component {
    render() {
        // const { projectListItems } = mainStore;
        // const listItemBase = [
        //   {
        //     "depth": 0,
        //     "children": []
        //   }
        // ];


        // let listProjects = projects.length && projects.map((project) => {
        //   return (
        //     {
        //       "title": project.name,
        //       "depth": 1,
        //       "parentIndex": 0,
        //       "children": [],
        //       "disabled": false
        //     }
        //   );
        // });

        // let listItems = [...listItemBase, ...listProjects];

        // let setListItems = (listItems) => {
        //   if (listItems.length > 1) {
        //     return (
        //       <AccountTreeList
        //         listItems={listItems}
        //         mainStore={mainStore}
        //       />
        //     )
        //   }
        // };

        return (
          <div>
            <AccountTreeList
              // listItems={projectListItems}
            />
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
