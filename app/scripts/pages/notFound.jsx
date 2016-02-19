import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button';

class NotFound extends React.Component {

    render() {
        let content = (
            <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.wrapper}>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--white">
                    <img src="images/dukeDSLogo.png" style={styles.logo}/>
                    <h4>We're sorry, it looks like this page could not be found or doesn't exist.</h4>
                    <h5>Please check the address or go to the home page and try again.</h5>
                    <RaisedButton label="Go to the Home Page" labelColor={'#f9f9f9'} backgroundColor={'#0680CD'} style={{marginBottom: 10}} onClick={() => this.goHome()} >
                    </RaisedButton>
                </div>
            </div>
        );
        return (
            <div>
                {content}
            </div>
        );
    }
    goHome() {
        this.props.appRouter.transitionTo('/home')
    }
}
var styles = {
    wrapper: {
        height: 'auto',
        textAlign: 'center',
        padding: 20,
        overflow: 'auto',
        backgroundColor: '#235F9C',
        fontColor: '#f9f9f9',
        marginTop: 100
    },
    logo: {
        maxWidth: '10%'
    }
};

export default NotFound;