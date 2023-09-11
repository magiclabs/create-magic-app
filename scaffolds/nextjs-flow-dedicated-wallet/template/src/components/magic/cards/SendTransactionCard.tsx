import React, { useCallback, useEffect, useState } from 'react';
import Divider from '@/components/ui/Divider';
import { useMagic } from '../MagicProvider';
import FormButton from '@/components/ui/FormButton';
import FormInput from '@/components/ui/FormInput';
import ErrorText from '@/components/ui/ErrorText';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import { getFaucetUrl, getNetwork } from '@/utils/network';
import Image from 'next/image';
import Link from 'public/link.svg';
import * as fcl from '@onflow/fcl';
import Spacer from '@/components/ui/Spacer';
import TransactionHistory from '@/components/ui/TransactionHistory';

const SendTransaction = () => {
  const { magic } = useMagic();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(!toAddress || !amount);
  const [toAddressError, setToAddressError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [hash, setHash] = useState('');
  const [transactionLoading, setTransactionLoading] = useState(false);
  const publicAddress = localStorage.getItem('user');

  useEffect(() => {
    setDisabled(!toAddress || !amount);
    setAmountError(false);
    setToAddressError(false);
  }, [amount, toAddress]);

  const sendTransaction = useCallback(async () => {
    if (!magic) {
      return;
    }
    try {
      setTransactionLoading(true);

      const response = await fcl.mutate({
        //cadence: transaction,
        template: 'https://flix.flow.com/v1/templates?name=transfer-flow',
        args: (arg, t) => [arg(Number(amount).toFixed(2), t.UFix64), arg(toAddress, t.Address)],
        proposer: magic.flow.authorization,
        authorizations: [magic.flow.authorization],
        payer: magic.flow.authorization,
        limit: 999,
      });
      setHash(response);
      console.log('response: ', JSON.stringify(response));

      console.log('Waiting for transaction to be sealed');
      var data = await fcl.tx(response).onceSealed();
      console.log('sealed: ', JSON.stringify(data));

      if (data.status === 4 && data.statusCode === 0) {
        alert('Transaction successful');
      } else {
        alert('Transaction Failed! Check console for more details');
        console.log('transaction error: ' + data.errorMessage);
      }
      setTransactionLoading(false);
      setToAddress('');
      setAmount('');
    } catch (e) {
      setTransactionLoading(false);
      alert('Transaction Failed! Check console for more details');
      console.log(e);
    }
  }, [magic, amount, publicAddress, toAddress]);

  return (
    <Card>
      <CardHeader id="send-transaction">Send Transaction</CardHeader>
      {getNetwork() == 'testnet' && (
        <div>
          <a href={getFaucetUrl()} target="_blank" rel="noreferrer">
            <FormButton onClick={() => null} disabled={false}>
              Get Test FLOW
              <Image src={Link} alt="link-icon" className="ml-[3px]" />
            </FormButton>
          </a>
          <Divider />
        </div>
      )}

      <FormInput
        value={toAddress}
        onChange={(e: any) => setToAddress(e.target.value)}
        placeholder="Receiving Address"
      />
      {toAddressError ? <ErrorText>Invalid address</ErrorText> : null}
      <FormInput value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder={`Amount (FLOW)`} />
      {amountError ? <ErrorText className="error">Invalid amount</ErrorText> : null}
      <FormButton onClick={sendTransaction} disabled={!toAddress || !amount || disabled}>
        {transactionLoading ? (
          <div className="w-full loading-container">
            <Spinner />
          </div>
        ) : (
          'Send Transaction'
        )}
      </FormButton>

      {hash ? (
        <>
          <Spacer size={20} />
          <TransactionHistory />
        </>
      ) : null}
    </Card>
  );
};

export default SendTransaction;
