import _ from 'lodash';
import { playColors, playSizes, playTypes } from './constants';

export function playTypeFactory(playType, playColorType, playSize) {
	const [colorPrimary, colorSecondary] = playColorFactory(playColorType);
	const { height, width, padding, borderWidth } = playSizeFactory(playSize, playType);
	switch (playType) {
		case playTypes.rectangleFill:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										background: colorPrimary,
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
										borderRadius: '3px',
									}}>
				<div style={{
					boxSizing: 'content-box', padding: padding,
				}}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorSecondary}`,
							 }}>&nbsp;</div>
				</div>
			</div>;
		case playTypes.rectangleOutline:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
										borderRadius: '3px',
									}}>
				<div style={{
					boxSizing: 'content-box', padding: padding,
				}}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorPrimary}`,
							 }}>&nbsp;</div>
				</div>
			</div>;
		case playTypes.circleFill:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										backgroundColor: colorPrimary,
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
										borderRadius: '100%',
									}}>
				<div style={{ boxSizing: 'content-box', padding: padding }}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorSecondary}`
							 }}>
						&nbsp;
					</div>
				</div>
			</div>;
		case playTypes.circleOutline:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
										borderRadius: '100%',
									}}>
				<div style={{ boxSizing: 'content-box', padding: padding }}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorPrimary}`
							 }}>
						&nbsp;
					</div>
				</div>
			</div>
		case playTypes.squareFill:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										background: colorPrimary,
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
									}}>
				<div style={{ boxSizing: 'content-box', padding: padding }}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorSecondary}`
							 }}>
						&nbsp;
					</div>
				</div>
			</div>
		case playTypes.squareOutline:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										border: `3px solid ${colorPrimary}`,
										height: height,
										width: width,
									}}>
				<div style={{ boxSizing: 'content-box', padding: padding }}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorPrimary}`
							 }}>
						&nbsp;
					</div>
				</div>
			</div>
		case playTypes.arrow :
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										height: height,
										width: width
									}}>
				<div style={{ boxSizing: 'content-box', padding: padding }}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: 'block',
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorPrimary}`
							 }}
					>&nbsp;
					</div>
				</div>
			</div>
		default:
			return <div className="play-button_outer"
									style={{
										boxSizing: 'content-box',
										display: 'inline-block',
										verticalAlign: 'middle',
										background: colorPrimary,
										border: '3px solid colorPrimary',
										height: height,
										width: width,
										borderRadius: '3px',
									}}>
				<div style={{
					boxSizing: 'content-box', padding: padding,
				}}>
					<div className="play-button_inner"
							 style={{
								 boxSizing: 'content-box',
								 borderStyle: 'solid',
								 borderWidth: borderWidth,
								 display: block,
								 fontSize: 0,
								 height: 0,
								 width: 0,
								 borderColor: `transparent transparent transparent ${colorSecondary}`,
							 }}>&nbsp;</div>
				</div>
			</div>;
	}
}

function playColorFactory(playColorType) {
	switch (playColorType) {
		case playColors.light:
			return ['#FFFFFF', '#000000'];
		case playColors.dark:
			return ["#000000", '#FFFFFF'];
		case playColors.red:
			return ['#FF0000', '#FFFFFF'];
		case playColors.blue:
			return ['#00AEDF', '#FFFFFF'];

		default:
			return ['#FF0000', '#FFFFFF'];
	}
}

function playSizeFactory(playSize, playType) {
	switch (true) {
		case playSize === playSizes.small && playType === playTypes.circleFill:
		case playSize === playSizes.small && playType === playTypes.circleOutline:
			return {
				height: '44px',
				width: '44px',
				padding: '11px 16.923076923076923px',
				borderWidth: '11px 0 11px 15px',
			}

		case playSize === playSizes.medium && playType === playTypes.circleFill:
		case playSize === playSizes.medium && playType === playTypes.circleOutline:
			return {
				height: '59px',
				width: '59px',
				padding: '14.75px 22.69230769230769px',
				borderWidth: '15px 0 15px 20px',
			}

		case playSize === playSizes.large && playType === playTypes.circleFill:
		case playSize === playSizes.large && playType === playTypes.circleOutline:
			return {
				height: '74px',
				width: '74px',
				padding: '18.5px 28.46153846153846px',
				borderWidth: '19px 0 19px 25px',
			}
		case playSize === playSizes.small && playType === playTypes.rectangleFill:
		case playSize === playSizes.small && playType === playTypes.rectangleOutline:
			return {
				height: '28.16px',
				width: '44px',
				padding: '5.866666666666666px 16.761904761904763px',
				borderWidth: '9px 0 9px 12px',
			}

		case playSize === playSizes.medium && playType === playTypes.rectangleFill:
		case playSize === playSizes.medium && playType === playTypes.rectangleOutline:
			return {
				height: '37.76px',
				width: '59px',
				padding: '7.866666666666666px 22.476190476190474px',
				borderWidth: '12px 0 12px 16px',
			}

		case playSize === playSizes.large && playType === playTypes.rectangleFill:
		case playSize === playSizes.large && playType === playTypes.rectangleOutline:
			return {
				height: '47.36px',
				width: '74px',
				padding: '9.866666666666667px 28.19047619047619px',
				borderWidth: '15px 0 15px 20px',
			}

		case playSize === playSizes.small && playType === playTypes.squareFill:
		case playSize === playSizes.small && playType === playTypes.squareOutline:
			return {
				height: '44px',
				width: '44px',
				padding: '11px 16.923076923076923px',
				borderWidth: '11px 0 11px 15px',
			}

		case playSize === playSizes.medium && playType === playTypes.squareFill:
		case playSize === playSizes.medium && playType === playTypes.squareOutline:
			return {
				height: '59px',
				width: '59px',
				padding: '14.75px 22.69230769230769px',
				borderWidth: '15px 0 15px 20px',
			}

		case playSize === playSizes.large && playType === playTypes.squareFill:
		case playSize === playSizes.large && playType === playTypes.squareOutline:
			return {
				height: '74px',
				width: '74px',
				padding: '18.5px 28.46153846153846px',
				borderWidth: '19px 0 19px 25px',
			}

		case playSize === playSizes.small && playType === playTypes.arrow:
			return {
				height: '44px',
				width: '44px',
				padding: '11px 16.923076923076923px',
				borderWidth: '11px 0 11px 15px',
			}

		case playSize === playSizes.medium && playType === playTypes.arrow:
			return {
				height: '59px',
				width: '59px',
				padding: '14.75px 22.69230769230769px',
				borderWidth: '15px 0 15px 20px',
			}

		case playSize === playSizes.large && playType === playTypes.arrow:
			return {
				height: '74px',
				width: '74px',
				padding: '18.5px 28.46153846153846px',
				borderWidth: '19px 0 19px 25px',
			}
		default:
			return {
				height: '59px',
				width: '59px',
				padding: '14.75px 22.69230769230769px',
				borderWidth: '15px 0 15px 20px',
			}
	}
}

export function msoPlayTypeFactory(playType, playColorType, playSize, maxWidth, maxHeight, videoUrl, imageUrl, wrapperClassVideoPreview) {
	const [colorPrimary, colorSecondary] = playColorFactory(playColorType);
	const {
		tagHeight,
		tagWidth,
		tagLeft,
		tagTop,
		shapeHeight,
		shapeWidth,
		shapeLeft,
		shapeTop
	} = msoPlaySizesFactory(playSize, playType, maxWidth, maxHeight);


	switch (playType) {
		case playTypes.rectangleFill:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
   <v:group
     xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:w="urn:schemas-microsoft-com:office:word"
     coordsize="${maxWidth},${maxHeight}"
     coordorigin="0,0"
     href="${videoUrl}"
     style="width:${maxWidth};height:${maxHeight}"
   >
     <v:rect
    fill="t"
    stroked="f"
    style="position:absolute;width:${maxWidth};height:${maxHeight}"
     >
    <v:fill
      src="${imageUrl}"
      type="frame"
    />
     </v:rect>
     <v:roundrect
     		arcsize="5%"
     		fill="t"
     		strokecolor="${colorPrimary}"
     		strokeweight="3px"
     		style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}">
                        <v:fill color="${colorPrimary}" opacity="100%"/>
				</v:roundrect>
     <v:shape
    coordsize="24,32"
    path="m,l,32,24,16,xe"
    fillcolor="${colorSecondary}"
    stroked="f"
    style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
     />
   </v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.rectangleOutline:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
   <v:group
     xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:w="urn:schemas-microsoft-com:office:word"
     coordsize="${maxWidth},${maxHeight}"
     coordorigin="0,0"
     href="${videoUrl}"
     style="width:${maxWidth};height:${maxHeight}"
   >
     <v:rect
    fill="t"
    stroked="f"
    style="position:absolute;width:${maxWidth};height:${maxHeight}"
     >
    <v:fill
      src="${imageUrl}"
      type="frame"
    />
     </v:rect>
     <v:roundrect
			 arcsize="5%"
			 fill="t"
			 strokecolor="${colorPrimary}"
			 strokeweight="3px"
			 style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}">
				<v:fill color="${colorPrimary}" opacity="0%"/>
		</v:roundrect>
     <v:shape
    coordsize="24,32"
    path="m,l,32,24,16,xe"
    fillcolor="${colorPrimary}"
    stroked="f"
    style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
     />
   </v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.circleFill:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
<v:group
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    coordsize="${maxWidth},${maxHeight}"
    coordorigin="0,0"
    href="${videoUrl}"
    style="width:${maxWidth};height:${maxHeight};"
>
  <v:rect fill="t" stroked="f" style="position:absolute;width:${maxWidth};height:${maxHeight};">
    <v:fill src="${imageUrl}" type="frame"/>
  </v:rect>
  <v:oval
      fill="t"
      strokecolor="${colorPrimary}"
      strokeweight="3px"
      style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}"
  >
    <v:fill color="${colorPrimary}" opacity="100%" />
  </v:oval>
  <v:shape
      coordsize="24,32"
      path="m,l,32,24,16,xe"
      fillcolor="${colorSecondary}"
      stroked="f"
      style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
  />
</v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.circleOutline:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
<v:group
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    coordsize="${maxWidth},${maxHeight}"
    coordorigin="0,0"
    href="${videoUrl}"
    style="width:${maxWidth};height:${maxHeight};"
>
  <v:rect fill="t" stroked="f" style="position:absolute;width:${maxWidth};height:${maxHeight};">
    <v:fill src="${imageUrl}" type="frame"/>
  </v:rect>
  <v:oval
      fill="t"
      strokecolor="${colorPrimary}"
      strokeweight="3px"
      style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}"
  >
    <v:fill color="${colorPrimary}" opacity="0%" />
  </v:roundrect>
  <v:shape
      coordsize="24,32"
      path="m,l,32,24,16,xe"
      fillcolor="${colorPrimary}"
      stroked="f"
      style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
  />
</v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.squareFill:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
<v:group
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    coordsize="${maxWidth},${maxHeight}"
    coordorigin="0,0"
    href="${videoUrl}"
    style="width:${maxWidth}px;height:${maxHeight}px;"
>
  <v:rect fill="t" stroked="f" style="position:absolute;width:${maxWidth};height:${maxHeight};">
    <v:fill src="${imageUrl}" type="frame"/>
  </v:rect>
  <v:rect
      fill="t"
      strokecolor="${colorPrimary}"
      strokeweight="3px"
      style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}"
  >
    <v:fill color="${colorPrimary}" opacity="100%" />
  </v:rect>
  <v:shape
      coordsize="24,32"
      path="m,l,32,24,16,xe"
      fillcolor="${colorSecondary}"
      stroked="f"
      style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
  />
</v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.squareOutline:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
<v:group
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    coordsize="${maxWidth},${maxHeight}"
    coordorigin="0,0"
    href="${videoUrl}"
    style="width:${maxWidth}px;height:${maxHeight}px;"
>
  <v:rect fill="t" stroked="f" style="position:absolute;width:${maxWidth};height:${maxHeight};">
    <v:fill src="${imageUrl}" type="frame"/>
  </v:rect>
  <v:rect
      fill="t"
      strokecolor="${colorPrimary}"
      strokeweight="3px"
      style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}"
  >
    <v:fill color="${colorPrimary}" opacity="0%" />
  </v:rect>
  <v:shape
      coordsize="24,32"
      path="m,l,32,24,16,xe"
      fillcolor="${colorPrimary}"
      stroked="f"
      style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
  />
</v:group>
<![endif]-->
`,
				}}
			/>
		case playTypes.arrow:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
	<v:group
		xmlns:v="urn:schemas-microsoft-com:vml"
		xmlns:w="urn:schemas-microsoft-com:office:word"
		coordsize="${maxWidth},${maxHeight}"
		coordorigin="0,0"
		href="${videoUrl}"
		style="width:${maxWidth}px;height:${maxHeight}px;"
	>
		<v:rect fill="t" stroked="f" style="position:absolute;width:${maxWidth};height:${maxHeight};">
			<v:fill src="${imageUrl}" type="frame"/>
		</v:rect>
		<v:shape
			coordsize="24,32"
			path="m,l,32,24,16,xe"
			fillcolor="#ffffff"
			stroked="f"
			style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
		/>
	</v:group>
<![endif]-->
`,
				}}
			/>
		default:
			return <div
				className="sizer"
				align="center"
				style={{ boxSizing: 'content-box', maxWidth: maxWidth + 'px', minWidth: maxWidth + 'px' }}
				dangerouslySetInnerHTML={{
					__html: `
<!--[if !vml]><!-->
${wrapperClassVideoPreview}
<!--<![endif]-->
<!--[if vml]>
   <v:group
     xmlns:v="urn:schemas-microsoft-com:vml"
     xmlns:w="urn:schemas-microsoft-com:office:word"
     coordsize="${maxWidth},${maxHeight}"
     coordorigin="0,0"
     href="${videoUrl}"
     style="width:${maxWidth};height:${maxHeight};"
   >
     <v:rect
    fill="t"
    stroked="f"
    style="position:absolute;width:${maxWidth};height:${maxHeight};"
     >
    <v:fill
      src="${imageUrl}"
      type="frame"
    />
     </v:rect>
     <v:oval
    fill="t"
    strokecolor="${colorPrimary}"
    strokeweight="3px"
    style="position:absolute;left:${tagLeft};top:${tagTop};width:${tagWidth};height:${tagHeight}"
     >
    <v:fill color="${colorPrimary}" opacity="100%" />
     </v:oval>
     <v:shape
    coordsize="24,32"
    path="m,l,32,24,16,xe"
    fillcolor="${colorSecondary}"
    stroked="f"
    style="position:absolute;left:${shapeLeft};top:${shapeTop};width:${shapeWidth};height:${shapeHeight};"
     />
   </v:group>
<![endif]-->
`,
				}}
			/>
	}
}

function msoPlaySizesFactory(playSize, playType, maxWidth, maxHeight) {
	let tagHeight = 59;
	let tagWidth = 59;
	let shapeHeight = 15;
	let shapeWidth = 22;

	switch (true) {
		case playSize === playSizes.small && playType === playTypes.circleFill:
		case playSize === playSizes.small && playType === playTypes.circleOutline: {
			tagHeight = 59;
			tagWidth = 59;
			shapeHeight = 15;
			shapeWidth = 22;
			break;
		}
		case playSize === playSizes.medium && playType === playTypes.circleFill:
		case playSize === playSizes.medium && playType === playTypes.circleOutline: {
			tagHeight = 59;
			tagWidth = 59;
			shapeHeight = 30;
			shapeWidth = 21;
			break;
		}
		case playSize === playSizes.large && playType === playTypes.circleFill:
		case playSize === playSizes.large && playType === playTypes.circleOutline: {
			tagHeight = 74;
			tagWidth = 74;
			shapeHeight = 37;
			shapeWidth = 26;
			break;
		}
		case playSize === playSizes.small && playType === playTypes.rectangleFill:
		case playSize === playSizes.small && playType === playTypes.rectangleOutline: {
			tagHeight = 31;
			tagWidth = 44;
			shapeHeight = 20;
			shapeWidth = 18;
			break;
		}
		case playSize === playSizes.medium && playType === playTypes.rectangleFill:
		case playSize === playSizes.medium && playType === playTypes.rectangleOutline: {
			tagHeight = 42;
			tagWidth = 59;
			shapeHeight = 27;
			shapeWidth = 24;
			break;
		}
		case playSize === playSizes.large && playType === playTypes.rectangleFill:
		case playSize === playSizes.large && playType === playTypes.rectangleOutline: {
			tagHeight = 53;
			tagWidth = 74;
			shapeHeight = 33;
			shapeWidth = 30;
			break;
		}
		case playSize === playSizes.small && playType === playTypes.squareFill:
		case playSize === playSizes.small && playType === playTypes.squareOutline: {
			tagHeight = 44;
			tagWidth = 44;
			shapeHeight = 22;
			shapeWidth = 15;
			break;
		}
		case playSize === playSizes.medium && playType === playTypes.squareFill:
		case playSize === playSizes.medium && playType === playTypes.squareOutline: {
			tagHeight = 59;
			tagWidth = 59;
			shapeHeight = 30;
			shapeWidth = 21;
			break;
		}

		case playSize === playSizes.large && playType === playTypes.squareFill:
		case playSize === playSizes.large && playType === playTypes.squareOutline: {
			tagHeight = 74;
			tagWidth = 74;
			shapeHeight = 37;
			shapeWidth = 26;
			break;
		}
		case playSize === playSizes.small && playType === playTypes.arrow: {
			tagHeight = null;
			tagWidth = null;
			shapeHeight = 22;
			shapeWidth = 15;
			break;
		}
		case playSize === playSizes.medium && playType === playTypes.arrow: {
			tagHeight = null;
			tagWidth = null;
			shapeHeight = 30;
			shapeWidth = 21
			break;
		}
		case playSize === playSizes.large && playType === playTypes.arrow: {
			tagHeight = null;
			tagWidth = null;
			shapeHeight = 37;
			shapeWidth = 26;
			break;
		}
		default: {
			tagHeight = 59;
			tagWidth = 59;
			shapeHeight = 15;
			shapeWidth = 22;
			break;
		}
	}
	let tagLeft = tagWidth ?_.round(_.divide(_.subtract(maxWidth, tagWidth), 2)) : null;
	let tagTop = tagHeight ? _.round(_.divide(_.subtract(maxHeight, tagHeight), 2)) : null;
	let shapeLeft = shapeWidth ? _.round(_.divide(_.subtract(maxWidth, _.subtract(shapeWidth,3)), 2)) : null;
	let shapeTop = shapeHeight ? _.round(_.divide(_.subtract(maxHeight, _.add(shapeHeight,1)), 2)) : null;

	return {
		tagHeight: tagHeight,
		tagWidth: tagWidth,
		tagLeft: tagLeft,
		tagTop: tagTop,
		shapeHeight: shapeHeight,
		shapeWidth: shapeWidth,
		shapeLeft: shapeLeft,
		shapeTop: shapeTop,
	}
}


