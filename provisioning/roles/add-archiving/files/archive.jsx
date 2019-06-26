import React, { Component } from 'react/lib/ReactWithAddons';
import { ajaxGet, ajaxPostWithHeaders } from '../data/ajax.js';
import { Link } from 'react-router';



const PT = React.PropTypes;
var bridgeUrl = 'akmi';
export const Archive = React.createClass({
	getInitialState() {
		return {
		  checked: false,
			archivingState: '',
			archivingLink: '',
		};
	  },
	mixins: [React.addons.PureRenderMixin],
	componentDidMount() {
		ajaxGet({
			url: bridgeUrl,
			headers: {
				'Accept': 'application/json'
			},
			successFn : (data) => {
				if (data.pid) {
					this.setState({archivingState : data.pid});
					this.setState({archivingLink : data.darLandingPage});
				} else {
				this.setState({checked : true});
				this.setState({archivingState : 'Archiving in progress'});
			}
			},
			errorFn: (xhr) => {
				if(xhr.status == 404){
					console.log("--------404: NOT FOUND-----------")
					this.setState({archivingState : 'Archive'});
				}else
					this.setState({archivingState : ''});
			  }
		});
	  },
    render() {
		let {recordID, communityName, curVersion} = this.props;
		console.log("================ begin =============== recordID: ");
		console.log("recordID: " + recordID);
		console.log("communityName: " + communityName);
		console.log("versions: " + curVersion.index);
		console.log("================ end =============== recordID: " );
		const curVersionNum = curVersion.index + 1;

		bridgeUrl= 'http://localhost:8592/api/v1/archiving/state?srcMetadataUrl=http://192.168.33.11:5000/api/archive/?r=' + recordID +'&srcMetadataVersion=' + curVersionNum + '&targetDarName=EASY';
		const className = this.state.checked ? 'toggle checkbox TRUE checked'  : 'toggle FALSE checkbox';
		const archiveButtonLabel = this.state.archivingState;
		const archiveLinkUrl = this.state.archivingLink;
        const style = {
            float:'left',
            marginTop:'-3em',
            marginBottom:'-3em',
            color:'black',
            padding:'15px',
        };
        const doArchive = () => {
			var jsonData={ "darData": { "darName": "EASY", "darPassword": "user001", "darUserAffiliation": "B2SHARE", "darUsername": "user001" }, "srcData": { "srcApiToken": "qwerty", "srcMetadataUrl": "http://192.168.33.11:5000/api/archive/?r=" + recordID, "srcMetadataVersion": curVersionNum, "srcName": "b2share" } };
			var urlArchive = 'http://localhost:8592/api/v1/archiving';
			ajaxPostWithHeaders({
				url: 'http://localhost:8592/api/v1/archiving',
				apikey: 'qwerty',
				params: jsonData,
				successFn: (data) => {
					console.log("Archiving success");
					this.setState({archivingState : 'Archiving in progress'});
				},
				errorFn: (xhr) => {
					console.log('POST - response code: ' + xhr.status);
					//alert("error: " + xhr.status);
					if(xhr.status == 408)
						alert("Invalid EASY credentials.");
				  }
			});

			};
			if (communityName != 'DANS')
				return false;

		if (archiveButtonLabel.length == 0)
			return false;

		else if (archiveButtonLabel == 'Archive')	{
        return (
            <div style={style}>
				<button onClick={doArchive}>{archiveButtonLabel}</button>
            </div>
        );
		}
		else if (archiveButtonLabel == 'Archiving in progress')	 {
        return (
            <div style={style}>
				<button>{archiveButtonLabel}</button>
            </div>
        );
		}

		if (archiveButtonLabel.includes('dans'))
        return (
            <div style={style}>
				DANS DOI: <a target="_blank" href={archiveLinkUrl}>{archiveButtonLabel}</a>
            </div>
        );
    }

});
