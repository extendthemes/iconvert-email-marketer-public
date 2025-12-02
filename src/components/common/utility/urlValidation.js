export const validateYouTubeUrl = ( url ) =>
{

	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
	if (url !== '') {
		const match = url.match(regExp);
		if (match && match[2].length == 11) {
			return  true;
		}
	}

	return false;
}

export const validateVimeoURL = (url) =>  {
	return /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)(.+)$/.test(url);
}
