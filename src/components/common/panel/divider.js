import { BoxUnitValueControl } from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from "@wordpress/i18n";
import { useBlockData } from "../../../core";

export const Divider = ({ label= false }) => {

	return (
		<Fragment>
			<div className="icb-divider">
                {label && <h3>{label}</h3>}
                <hr />
            </div>
		</Fragment>
	);
};
