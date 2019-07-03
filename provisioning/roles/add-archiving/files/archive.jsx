import React, { Component } from 'react/lib/ReactWithAddons';
import { ajaxGet, ajaxPost } from '../data/ajax.js';
import { Link } from 'react-router';



const PT = React.PropTypes;
var bridgeUrl = 'akmi';
var versionsUrl='';

export const Archive = React.createClass({
	getInitialState() {
		return {
		  checked: false,
			archivingState: '',
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
					this.setState({archivingState : data.pid.replace("https://doi.org/", "")});
					this.setState({archivingLink : data.pid});
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
		const curVersionNum = curVersion.index + 1;

		bridgeUrl= 'http://devb2share.dans.knaw.nl:5000/api/archive/state?r=' + recordID +'&srcMetadataVersion=' + curVersionNum;

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
			var jsonData = {"record" : recordID, "version" : curVersionNum}
			ajaxPost({
				url: 'http://devb2share.dans.knaw.nl:5000/api/archive',
				params: jsonData,
				successFn: (data) => {
					console.log("Archiving success");
					this.setState({archivingState : 'Archiving in progress'});
				},
				errorFn: (xhr) => {
					console.log('POST - response code: ' + xhr.status);
					if(xhr.status == 408)
						console.log("Invalid EASY credentials.");
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
