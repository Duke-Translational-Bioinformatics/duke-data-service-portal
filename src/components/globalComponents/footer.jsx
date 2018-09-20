import React from 'react';
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import { Color } from '../../theme/customTheme';

@observer
class Footer extends React.Component {

    getAppStatus = () => {
        const { appStatus } = mainStore;
        const status = new Map();
        status.set('development', {color: Color.red, name:  '- DEVELOPMENT'});
        status.set('production', {color: Color.blue, name:  ''});
        status.set('ua_test', {color: Color.green, name: '- UA_TEST'});
        return status.get(appStatus.environment) || {color: Color.blue, name:  ''};
    };

    render() {
        const { loading } = mainStore;
        let status = this.getAppStatus();

        return (
            !loading && <footer style={{backgroundColor : status.color, padding: '10px 16px 10px 16px', position: 'relative'}}>
                <div>
                    <h6 style={styles.logo}>Duke Data Service {status.name}</h6>
                </div>
                <div>
                    {window.innerWidth < 600 ? null : <span style={styles.phi}><b>The Health Insurance Portability and Accountability Act of 1996 (HIPAA)
                        established standards for health information that must be kept private and secure, called Protected Health Information
                        (PHI).</b><br/>The use of PHI within the Duke Data Service is prohibited in this Alpha release. By reading this, you
                        attest that you will not enter PHI. If you are unclear about what constitutes PHI, or are
                        uncertain about the nature of the data you use, contact the Duke University
                        IT Security Office (security@duke.edu) for further information.</span>}
                </div>
            </footer>
        );
    }
}

const styles = {
    themeColor: {
        backgroundColor: Color.blue
    },
    logo: {
        color: Color.white,
        margin: '8px 0px 4px 0px'
    },
    phi: {
        color: '#f9f9f9',
        fontSize: '.8em'
    }
};

export default Footer;