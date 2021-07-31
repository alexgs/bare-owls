/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

import { Box } from 'grommet';
import * as React from 'react';

import { NavBar, Protect } from 'components';
import db from 'server-lib/prisma';
import { Session } from 'types';

const HomePage: React.FC = () => {
  return (
    <>
      <NavBar />
      <Box direction="row" flex overflow={{ horizontal: 'hidden' }}>
        <Box flex align="start" direction="column" justify="start" pad="medium">
          <Protect>
            {(session: Session) => <div>Hello {session.user?.name}</div>}
          </Protect>
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  const posts = await db.userAccount.count();
  return { props: { posts } };
};

export default HomePage;
