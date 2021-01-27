import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconCirclePlus, IconCircleMinus, IconCaution
} from '@aragon/ui';

import usePool from "../../hooks/usePool";
import { isPos } from '../../utils/number';

import {
  BalanceBlock, MaxButton, BigNumberInput, TextBlock
} from '../../components/common';

type BondUnbondProps = {
  poolAddress: string,
  staged: BigNumber,
  bonded: BigNumber,
  status: number,
  lockup: number,
};

function BondUnbond({
  poolAddress, staged, bonded, status, lockup
}: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  const { onBond, onUnbond } = usePool();

  return (
    <Box heading="Bond">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* Total bonded */}
        <div style={{flexBasis: '16%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"UNI-V2"} />
        </div>
        {/* Exit lockup */}
        <div style={{flexBasis: '16%'}}>
          <TextBlock label="Exit Lockup" text={lockup === 0 ? "" : lockup === 1 ? "1 epoch" : `${lockup} epochs`}/>
        </div>
        {/* Bond UNI-V2 within Pool */}
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
              <>
                <BigNumberInput
                  adornment="UNI-V2"
                  value={bondAmount}
                  setter={setBondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setBondAmount(staged);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%', minWidth: '7em'}}>
              <Button
                wide
                icon={status === 0 ? <IconCirclePlus/> : <IconCaution/>}
                label="Bond"
                onClick={() => {
                  onBond(
                    bondAmount,
                    (hash) => setBondAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || !isPos(bondAmount)}
              />
            </div>
          </div>
        </div>
        <div style={{flexBasis: '2%'}}/>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
              <>
                <BigNumberInput
                  adornment="UNI-V2"
                  value={unbondAmount}
                  setter={setUnbondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setUnbondAmount(bonded);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%', minWidth: '7em'}}>
              <Button
                wide
                icon={status === 0 ? <IconCircleMinus/> : <IconCaution/>}
                label="Unbond"
                onClick={() => {
                  onUnbond(
                    poolAddress,
                    unbondAmount,
                    (hash) => setUnbondAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || !isPos(unbondAmount)}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Bonding events will restart the lockup timer </span>
      </div>
    </Box>
  );
}

export default BondUnbond;