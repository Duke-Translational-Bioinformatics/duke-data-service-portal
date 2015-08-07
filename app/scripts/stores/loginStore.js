import Reflux from 'reflux';
import LoginActions from '../actions/loginActions';

var LoginStore = Reflux.createStore({

    init() {
        this.listenToMany(LoginActions);
    },

});

export default LoginStore;