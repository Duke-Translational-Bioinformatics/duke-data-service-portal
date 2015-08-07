import React from 'react';
import { Link } from 'react-router';
import Header from '../components/header.jsx';
import LoginStore from '../stores/loginStore.js';
import LoginActions from '../actions/loginActions.js';
var mui = require('material-ui'),
    Paper = mui.Paper;

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            security_state: '',
            loading: false,
        };
    }

    componentDidMount() {
        this.unsubscribe = LoginStore.listen(this.onStatusChange.bind(this));
        //this.setState({security_state: $('meta[name="csrf-token"]').attr('content')});
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(state) {
        this.setState(state);
    }
    //Temporary hard coded variables
    //var auth_service_uri = "https://192.168.99.100:3000";//Heroku app URL
    //var service_id = "c87de9f2-1690-4523-87dc-6395f665a757";
    //var auth_service_name = "Duke Authentication Service";
    render () {
        return (
            <div className="project-container mdl-color--white mdl-shadow--2dp content mdl-color-text--grey-800">
                <h5>Please login with an Authentication Service</h5>
                <ul>
                    <li><a href={this.props.auth_service_uri+"/authenticate?client_id="+this.props.service_id+"&state="
                    +this.state.security_state+"&response_type=Bearer&scope=display_name mail uid"}>{this.props.auth_service_name}</a></li>
                </ul>
            </div>
        )
    }
};

export default Login;