import React, { Component } from 'react/lib/ReactWithAddons';
import { ajaxGet, ajaxPost, ajaxPost2 } from '../data/ajax.js';
import { Link } from 'react-router';



const PT = React.PropTypes;
var bridgeUrl = 'frasn';

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
		let {recordID, communityName, version} = this.props;

		bridgeUrl= 'http://localhost:8592/api/v1/archiving/state?srcMetadataUrl=http://192.168.33.11:5000/api/records/' + recordID +'&srcMetadataVersion=' + version + '&targetDarName=EASY';

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
			var jsonData={ "darData": { "darName": "EASY", "darPassword": "user001", "darUserAffiliation": "B2SHARE", "darUsername": "user001" }, "srcData": { "srcApiToken": "qwerty", "srcMetadataUrl": "http%3A%2F%2F192.168.33.11%3A5000%2Fapi%2Frecords%2F8fabac2fc0074e7ab010bad0b48e3603", "srcMetadataVersion": "1", "srcName": "b2share" } };
			var urlArchive = 'http://localhost:8592/api/v1/archiving';

			ajaxPost2({
				url: 'http://localhost:8592/api/v1/archiving',
				params: recordID,
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
				{/* <button onClick={checkArchivingStatus} title={'Archiving'}>{archiveButtonLabel}</button> */}
				{/* <button onClick={hello('xxxjjjjjjjddd')}>{archiveButtonLabel}</button> */}

				DANS DOI: <a target="_blank" href={archiveLinkUrl}>{archiveButtonLabel}</a>
            </div>
        );
    }

});

