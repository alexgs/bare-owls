/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */


import Document, { Html, Head, Main, NextScript } from 'next/document'
import * as React from 'react';

/* eslint-disable @next/next/google-font-display */
// noinspection HtmlRequiredTitleElement
class OwlDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/normalize.css/normalize.css"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default OwlDocument
