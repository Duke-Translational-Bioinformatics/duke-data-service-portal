import React from 'react';
import Card from 'material-ui/lib/card/card';

class Privacy extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Card className="project-container mdl-color--white content mdl-color-text--grey-800"
                  style={{marginTop: this.props.windowWidth > 680 ? 115 : 30, marginBottom: 30, padding: 30,
                                 overflow: 'visible'}}>
                <a className="external mdl-color--white mdl-cell mdl-cell--12-col mdl-color-text--grey-800"
                   onTouchTap={() => this.goBack()} style={{float: 'left', cursor: 'pointer'}}>
                    <i className="material-icons" style={{verticalAlign: -7, marginLeft: -10, marginRight: 5}}>keyboard_backspace</i>
                    Back
                </a>
                <h1 style={{textAlign: 'center', fontSize: '3em'}}>DukeDS / Data Service at Duke</h1>
                <h6>This is the privacy policy for Data Service at Duke, and is intended to describe the privacy
                   practices employed and detail how information is collected, accessed, stored and transmitted,
                   for what purpose(s), and by and to whom is it or may it be transmitted/shared.</h6>
                <h3 style={{fontSize: '2em'}}>“Plain English” Privacy Policy</h3>
                <p><b>Summary:</b><br/>
                    “At this time, Data Service is system for the storage of non-Protected Health Information (PHI)
                    research data, and provenance regarding those data. We store the data you upload, and metadata
                    associated with that data. Data Service is not currently approved for the storage of PHI
                    (but will in the future). Access to the data you store in DataService is determined by you.
                    We retain a small amount of logging information in order to support the service.”</p>
                <h3 style={{fontSize: '2em'}}>Data Service at Duke Privacy Policy Details</h3>
                <p><b>Purpose:</b><br/>
                    Data Service at Duke (https://dataservice.duke.edu) is a system designed for the storage of data
                    and metadata — information about the data and its relationship to other data.</p>
                <p>IMPORTANT NOTE: Currently, Data Service is NOT approved for the storage of patient data or PHI
                    (Protected Health Information) such as medical records, names, addresses, photographs, diagnoses
                    linked to a patient, etc. with or without patient permission. Acceptable data types include research
                    data, identified data sets, computational data.</p>
                <h4>Personally identifiable data we collect</h4>
                <p>Your login account ID (currently Duke Net ID) and name.</p>
                <h4>Other information we collect</h4>
                <p>In addition to login ID, we store data which you upload, along with metadata associated with that
                    data, directly (user-supplied tags and labels, filename) and indirectly (e.g. time, date).
                    We record the date of any system usage, and actions taken within the system (storage, retrieval, etc.)
                    using each user account.</p>
                <h4>Who has access to your information?</h4>
                <p>Application developers, system administrators, and Data Service project team members.
                    The Data Service team may disclose necessary data as required by federal, state or local law.</p>
                <h4>How do we use your information?</h4>
                <p>The Data Service project team may generate reports showing system usage (# of logins, peak times)
                    and summary figures showing total # of projects, total # of files, number of downloads, etc. for
                    the purposes of project resource planning and reporting to management and/or university leadership.</p>
                <p>The Data Service project team may directly access the database or generate reports for development
                    and debugging purposes, as needed to perform their roles. These reports could include summaries of
                    usage, project names, breakdowns of usage by department or division.)</p>
                <p>Access to data in Data Service is determined by the owner of each project (you).
                    The Data Service team does not access the individual files stored in DataService unless
                    you grant us this access.</p>
                <h4>How is your information protected?</h4>
                <p>Data is encrypted during transit (across the Duke network). The database itself encrypts
                    the data once it arrives.</p>
                <p>Access to your project data files is limited exclusively to those persons you invite to join your
                    project.</p>
                <h4>Updates and Changes to these policies</h4>
                <p>Changes to this policy will be posted on the DataService project/portal page at
                    <a href="https://dataservice.duke.edu" className="external" style={{marginLeft: 8, color: '#235F9C'}}>
                        https://dataservice.duke.edu</a>
                </p>
                <p style={{textAlign: 'right'}}>Effective Date: 10/7/16</p>
            </Card>
        );
    }
    goBack() {
        window.history.back();
    }
}

export default Privacy;