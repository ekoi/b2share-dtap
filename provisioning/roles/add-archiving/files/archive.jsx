import React, { Component } from 'react/lib/ReactWithAddons';
import { ajaxGet, ajaxPost } from '../data/ajax.js';
import { Link } from 'react-router';
import { serverCache } from '../data/server';


const PT = React.PropTypes;
const baseUrl = location.protocol + '//' + location.host;
var bridgeUrl = 'akmi';
var versionsUrl ='';

export const Archive = React.createClass({
	getInitialState() {
		return {
			archivingState: 'Archive',
			archivingPid: '',
			archivingLink: '',
			versionsData: '',
		};
	  },
	mixins: [React.addons.PureRenderMixin],
	componentDidMount() {
		ajaxGet({
			url: bridgeUrl,
			successFn : (data) => {
				if (data.pid) {
					this.setState({archivingPid : data.pid.replace("https://doi.org/", "")});
					this.setState({archivingState : data.state});
					this.setState({archivingLink : data.pid});
				} else
				    this.setState({archivingState : 'Archiving in progress'});

			},
			errorFn: (xhr) => {
				if(xhr.status == 404){
					console.log("--------404: NOT FOUND-----------")
					this.setState({archivingState : "Archive"});
				}else
					this.setState({archivingState : ''});
			  }
		});

	  },
    render() {
		let {recordID, communityName, curVersion} = this.props;
		const curVersionNum = curVersion.index + 1;
        const commEnableArchive = serverCache.getInfo().get('communities_enable_archive');

		bridgeUrl= baseUrl + '/api/archive/state?r=' + recordID +'&srcMetadataVersion=' + curVersionNum;

        const style = {
            float:'left',
            marginTop:'-3em',
            marginBottom:'-3em',
            color:'black',
            padding:'15px',
        };
        const doArchive = () => {
			var jsonData = {"record" : recordID, "version" : curVersionNum}
			this.setState({archivingState : "Archiving in progress"});
			ajaxPost({
				url: baseUrl + '/api/archive',
				params: jsonData,
				successFn: (data) => {
					this.setState({archivingState : "Archiving in progress"});
				},
				errorFn: (xhr) => {
					if(xhr.status == 408) {
						console.log("Invalid EASY credentials.");
						this.setState({archivingState : "Error: Ivalid credentials"});
					}
				  }
			});
		};
		const _refreshPage = () => {
			window.location.reload();
		};
		if (commEnableArchive	) {
            const commEnableArchiveArr = commEnableArchive.split(',');
            var archiveButtonEnable = false;
            for (var commEnable of commEnableArchiveArr ) {
                if (communityName == commEnable) {
                    archiveButtonEnable = true;
                    break;
                }
            }
            if (!archiveButtonEnable)
                return false;
        }

		if (this.state.archivingState == 0) {
            return (
                    <p className="alert alert-warning" style={{color:'red', margin:'-1.5em'}}>
                    The service is currently unavailable, please try again later.
                    </p>

            );

        } else if (this.state.archivingState == "Archive")	{
            return (
                <div style={style}>
                    <Link to={`/records/${recordID}`} onClick={doArchive} className="btn btn-warning" style={{margin: '0 0.5em'}}>Archive</Link>
                </div>
            );
        } else if (this.state.archivingState == "Archiving in progress")	 {
            return (
                <div style={style}>
                    <Link to={`/records/${recordID}`} onClick={_refreshPage} className="btn btn-warning" style={{margin: '0 0.5em'}}>Archiving in progress</Link>
                </div>
            );
        }

		if (this.state.archivingState == "ARCHIVED")
            return (
                <div style={style}>
                    DANS DOI: <a target="_blank" href={this.state.archivingLink}>{this.state.archivingPid}</a>
                </div>
            );
    }
});
