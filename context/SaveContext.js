import React, { createContext } from 'react';

export const SaveContext = createContext({
  saveBothToFirestore: () => {},
  isSaving: false,
});
