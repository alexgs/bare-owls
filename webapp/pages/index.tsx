/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import {
  Box,
  Button,
  Collapsible,
  Heading,
  Layer,
  ResponsiveContext,
} from 'grommet';
import { FormClose, Notification } from 'grommet-icons';
import { useRouter } from 'next/router'
import * as React from 'react';
import { db } from '../lib';

const AppBar = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation="medium"
    style={{ zIndex: '1' }}
    {...props}
  />
);

function HomePage(props) {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <Box fill>
          <AppBar>
            <Heading level="3" margin="none">Bare Owls</Heading>
            <Button
              icon={<Notification />}
              onClick={() => setShowSidebar(!showSidebar)}
            />
          </AppBar>
          <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
            <Box flex align="start" direction="column" justify="start" pad="medium">
              <Button label="Login" onClick={() => router.push('/login')} primary />
            </Box>
            {(!showSidebar || size !== 'small') ? (
              <Collapsible direction="horizontal" open={showSidebar}>
                <Box
                  flex
                  width="medium"
                  background="light-2"
                  elevation="small"
                  align="center"
                  justify="center"
                >
                  sidebar
                </Box>
              </Collapsible>
            ) : (
              <Layer>
                <Box
                  background="light-2"
                  tag="header"
                  justify="end"
                  align="center"
                  direction="row"
                >
                  <Button
                    icon={<FormClose />}
                    onClick={() => setShowSidebar(false)}
                  />
                </Box>
                <Box
                  fill
                  background="light-2"
                  align="center"
                  justify="center"
                >
                  sidebar
                </Box>
              </Layer>
            )}
          </Box>
        </Box>
      )}
    </ResponsiveContext.Consumer>
  );
}

export const getServerSideProps = async ({ req }) => {
  const posts = await db.post.count();
  return { props: { posts } }
}

export default HomePage;
