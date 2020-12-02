import { selector } from 'recoil';
import { currentPrompt } from './promptAtoms';

export const setSubmitted = selector<boolean>({
  key: 'setPromptAsSubmitted',
  get: ({ get }) => {
    const cur = get(currentPrompt);
    return cur ? cur.submitted : false;
  },
  set: ({ get, set }) => {
    const cur = get(currentPrompt);
    if (cur) set(currentPrompt, { ...cur, submitted: true });
  },
});
