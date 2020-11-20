import React from 'react';
import { useRecoilValue } from 'recoil';
import { Submissions } from '../../../../api';
import { top3, DnD } from '../../../../state';
import { SubCard } from '../../../common';

import { DropZone } from '../DropZone';
import { dragons } from '../DragonBank/DragonBank';

const DropBank = (): React.ReactElement => {
  const top3List = useRecoilValue(top3.top3List);

  return (
    <div className="drop-bank">
      {top3List?.map((item, i) => (
        <VotingItem key={i} {...item} dropZoneId={`sub-${i + 1}`} />
      ))}
    </div>
  );
};

const VotingItem = ({ dropZoneId, ...sub }: VotingItemProps) => {
  const DnDState = useRecoilValue(DnD.DnDContainerState);
  return (
    <div className="voting-item">
      <DropZone id={dropZoneId} isDropDisabled={!DnDState[dropZoneId].isEmpty}>
        <div>
          <SubCard {...sub} canPreview={false} />
          <div className="sub-info">
            <p>
              <span className="alt">{sub.username}</span>
            </p>
          </div>
          {dragons[DnDState[dropZoneId].contents]}
        </div>
      </DropZone>
    </div>
  );
};

interface VotingItemProps extends Submissions.SubItem {
  dropZoneId: string;
}

export default DropBank;
