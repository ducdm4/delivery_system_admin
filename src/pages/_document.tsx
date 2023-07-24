import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';
export default class MyDocument extends Document {
  render() {
    return (
      <Html className={'min-h-[100vh] bg-gray-100'}>
        <Head>
          <meta name="description" content="Delivery system by DucDM" />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta name="author" content="DucDM" />
          <meta
            name="keywords"
            content="DucDM,delivery,system,deliverysystem, delivery system"
          />
          <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
            integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
