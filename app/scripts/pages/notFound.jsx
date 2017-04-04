import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';

class NotFound extends React.Component {

    render() {
        let content = (
            <div className="mdl-cell mdl-cell--12-col mdl-shadow--2dp" style={styles.wrapper}>
                <div className="mdl-cell mdl-cell--12-col">
                    <h3 style={styles.title}>404</h3>
                    <h4 style={styles.msg}>Oops! It looks like this page couldn't be found or doesn't exist.</h4>
                    <h5 style={styles.msg}>Please check the address or go to the home page and try again.</h5>
                    <RaisedButton label="Home Page" labelStyle={{fontWeight: '400'}} labelColor={'#f9f9f9'}
                                  backgroundColor={'#0680CD'} style={{marginBottom: 10}} onClick={() => this.goHome()}>
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
       this.props.router.push('/home');
    }
}
var styles = {
    button: {
        marginBottom: 10
    },
    msg: {
        fontWeight: '100',
        color: '#235F9C',
        paddingBottom: 20,
        marginTop: -10
    },
    title: {
        textAlign: 'center',
        fontSize: '5em',
        fontWeight: '100',
        color: '#235F9C'
    },
    wrapper: {
        maxWidth: '50%',
        margin: '0 auto',
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#BBDEFB',
        marginTop: 100
    }
}

export default NotFound;