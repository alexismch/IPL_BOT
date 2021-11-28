import {useRouter} from 'next/router';
import {useEffect} from 'react';

const Error404 = () => {
	const {replace} = useRouter();

	useEffect(() => {
		replace('/');
	});

	return null;
};

export default Error404;