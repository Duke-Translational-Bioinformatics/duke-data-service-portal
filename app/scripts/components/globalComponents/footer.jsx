import React from 'react';

class Footer extends React.Component {

    render() {
        let envColor = "#fff";
        let appName = '';
        switch(DDS_PORTAL_CONFIG.environment){
            case 'production':
                envColor = '#007aff';
                appName = '';
                break;
            case 'development':
                envColor = '#f44336';
                appName = 'DEVELOPMENT';
                break;
            case 'ua_test':
                envColor = '#4caf50';
                appName = 'UA TEST';
                break;
        }

        return (
            <footer className="mdl-mini-footer" style={{backgroundColor : envColor}}>
                <div className="mdl-mini-footer__left-section">
                    <div className="mdl-logo"><h6>Duke Data Service</h6><h5>{ appName }</h5></div>
                </div>
                <div className="mdl-mini-footer__right-section">
                    <p style={styles.phiFontColor}><b>The Health Insurance Portability and Accountability Act of 1996 (HIPAA)
                        established standards
                        for health information that must be kept private and secure, called Protected Health Information
                        (PHI).</b><br/>The use of PHI within Duke Data Service is prohibited. By reading this, you
                        attest that you will not enter PHI. If you are unclear about what constitutes PHI, or are
                        uncertain about the nature of the data you use, contact the Duke University
                        IT Security Office (security@duke.edu) for further information.</p>
                </div>
            </footer>
        );
    }

}
var styles = {
    color: {
        backgroundColor: '#007aff'
    },
    phiFontColor: {
        color: '#f9f9f9'
    }
};

export default Footer;
