import { __ } from '@wordpress/i18n';
import { KubioPanelBody } from '@kubio/controls';
import { RichText } from '@wordpress/block-editor';

const JSON_PARSER_URL = "https://jsonformatter.curiousconcept.com/";

const DebugControl = (props) => {
	const { withAttributes = true, withStyle = false, withStyleBlock = false, attributes } = props;
	const { _style, _styleBlock } = attributes;

	const copyToClipboard = (text, newWindow = false) => {
		navigator.clipboard.writeText(text);

		if(newWindow){
			setTimeout(() => {
				window.open(JSON_PARSER_URL, "_blank");
			}, 500)
		}
	}

	return (
		<KubioPanelBody title={ __( 'Debug' ) } initialOpen={ false }>
			{ withAttributes &&
				<>
					<div className={"debug-control"} >
						<label>{__( 'Attributes' )}</label>
						<div>
							<button onClick={() => copyToClipboard(JSON.stringify(attributes))} >Copy </button>
							<button onClick={() => copyToClipboard(JSON.stringify(attributes), true)} >Open parser</button>
						</div>
					</div>
					<RichText
						tagName={ 'textarea' }
						value={ JSON.stringify(attributes) }
						rows={3}
					/>
				</>
			}

			{ withStyle &&
				<>
					<div className={"debug-control"} >
						<label>{__( '_style' )}</label>
						<div>
							<button onClick={() => copyToClipboard(JSON.stringify(_style))} >Copy </button>
							<button onClick={() => copyToClipboard(JSON.stringify(_style), true)} >Open parser</button>
						</div>
					</div>
					<RichText
						tagName={ 'textarea' }
						value={ JSON.stringify(_style) }
						rows={3}
					/>
				</>
			}

			{ withStyleBlock &&
				<>
					<div className={"debug-control"} >
						<label>{__( '_styleBlock' )}</label>
						<div>
							<button onClick={() => copyToClipboard(JSON.stringify(_style))} >Copy </button>
							<button onClick={() => copyToClipboard(JSON.stringify(_style), true)} >Open parser</button>
						</div>
					</div>
					<RichText
						tagName={ 'textarea' }
						value={ JSON.stringify(_styleBlock) }
						rows={3}
					/>
				</>
			}

		</KubioPanelBody>
	)
}

export { DebugControl }
