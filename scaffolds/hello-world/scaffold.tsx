import React from 'react';
import { Template, Zombi } from 'zombi';
import { createScaffold } from 'lib/utils/scaffold-helpers';

export default createScaffold(
  (data, props) => (
    <Zombi {...props}>
      <Template source="./" />
    </Zombi>
  ),

  {
    shortDescription: 'Just testing...',
  },
);
