import React, { useState } from 'react';

import { useSetRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { top3, user, dnd } from '../../../../state';

import { Header, Modal } from '../../../common';
import { nav } from '../../../../config';
import EmailCollectionForm from './EmailCollectionForm';

import { DropBank } from '../DropBank';
import { DragonBank } from '../DragonBank';
import {
  AiOutlineArrowLeft as Left,
  AiOutlineReload as Reload,
} from 'react-icons/ai';
import { Voting } from '../../../../api';

import dragonDropText from '../../../../assets/dragon-drop.png';

const RenderCastVotes = (): React.ReactElement => {
  const setHasRead = useSetRecoilState(top3.hasFinishedReadingState);
  const resetDnd = useResetRecoilState(dnd.dndContainerState);
  const voteSubmission = useRecoilValue(dnd.voteSubmissionState);
  const disableButton = useRecoilValue(dnd.disableVoteButton);
  // grab the user id from recoil to ensure we are logged in
  const userId = useRecoilValue(user.userId);
  const [error, setError] = useState<null | string>(null);

  //check if a user has voted
  const [voted, setVoted] = useState(false);

  const submitVotes = () => {
    setError(null);
    Voting.submit(voteSubmission)
      .then((res) => {
        // SUBMISSION SUCCESSFUL!
        setVoted(true);
        console.log(res.data);
      })
      .catch((err) => {
        console.log({ err });
        setError('Could not submit vote. Please try again later.');
      });
  };

  const backToRead = () => {
    setError(null);
    setHasRead(false);
  };

  /**
   * Resets the vote choices to starting positions
   */
  const resetVotes = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    setError(null);
    resetDnd();
  };

  return (
    <div>
      <Header menuItems={userId ? nav.siteNavItems : nav.landingNavItems} />
      <div className="voting-page">
        <div className="top-text">
          <h2>Welcome to</h2>
          <img src={dragonDropText} alt="Dragon Drop" />
          <p className="instructions">
            <span className="alt">Vote</span> by dragging the Drag-N-Drop
            Dragons onto your favorite story below.{' '}
            <span className="alt">Then</span> click the vote button!
          </p>
        </div>
        <div className="button-container">
          <button className="small" onClick={backToRead}>
            <Left />
            Go Back
          </button>
          <button className="small" onClick={resetVotes}>
            <Reload />
            Reset Votes
          </button>
        </div>
        <DragonBank />
        <DropBank />
        {error && <div className="error">{error}</div>}
        <div className="button-container">
          <button
            // disable the vote button if any of the submission containers don't have a vote
            disabled={disableButton}
            onClick={submitVotes}
          >
            Vote
          </button>
        </div>
      </div>
      {!userId && (
        <Modal.Component
          className="email"
          component={EmailCollectionForm}
          visible={voted}
          setVisible={() => {
            setVoted(false);
          }}
          centered={true}
        />
      )}
    </div>
  );
};

export default RenderCastVotes;
