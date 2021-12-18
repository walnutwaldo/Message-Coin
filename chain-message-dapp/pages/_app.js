import React from 'react';
import App from 'next/app';
import wrapper from '../store/store';

import '../components/index.css';

class MyApp extends App {

    render() {
        const {Component, pageProps} = this.props;

        return (
            <Component {...pageProps} />
        );
    }
}

export default wrapper.withRedux(MyApp);