export const morganFormat = [
	':date[iso]',
	'":method :url HTTP/:http-version"',
	':status',
	':res[content-length] b',
	':response-time ms',
	'":referrer"',
	'":user-agent"',
	':remote-addr',
].join(' - ');
