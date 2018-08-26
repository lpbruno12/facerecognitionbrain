import React from 'react';
import FaceBox from '../FaceBox/FaceBox';
import './FaceRecognition.css';

const FaceRecognition = ({ boxes, imageUrl }) => {
	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' alt='Face Image' src={ imageUrl } width='500px' heigh='auto'/>
				<div>
					{
						boxes.map((box, i) => (<FaceBox key={boxes[i].key} box={boxes[i]} />))
					}
				</div>
			</div>
		</div>
	);
}

export default FaceRecognition;