export function capitalizeFirstLetterWord(phrase){
	const arrWords = phrase.split(' ');
	const result = [];
	arrWords.forEach(word => {
		result.push(word[0].toUpperCase() + word.substring(1));
	});

	return result.join(' ');
}

export const colorRegex = new RegExp(/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/);
export const urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/);
