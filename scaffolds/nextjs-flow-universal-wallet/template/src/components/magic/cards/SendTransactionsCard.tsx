import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Divider from '../../ui/Divider';
import FormButton from '../../ui/FormButton';
import Link from 'public/link.svg';
import FormInput from '../../ui/FormInput';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';
import ErrorText from '../../ui/Error';
import { useMagicContext } from '@/components/magic/MagicProvider';
import { getFaucetUrl, getNetwork } from '@/utils/networks';
import * as fcl from '@onflow/fcl';
import Loading from 'public/loading.svg';
import Spacer from '@/components/ui/Spacer';
import TransactionHistory from '@/components/ui/TransactionHistory';

const SendTransaction = () => {
  const { magic } = useMagicContext();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(!toAddress || !amount);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [amountError, setAmountError] = useState(false);
  const publicAddress = localStorage.getItem('user');

  useEffect(() => {
    setDisabled(!toAddress || !amount);
    setAmountError(false);
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
      console.log('response: ', JSON.stringify(response));
      setHash(response);
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
        <a href={getFaucetUrl()} target="_blank" rel="noreferrer">
          <FormButton onClick={() => null} disabled={false}>
            Get Test FLOW
            <Image src={Link} alt="link-icon" className="ml-[3px]" />
          </FormButton>
        </a>
      )}
      <Divider />
      <FormInput
        value={toAddress}
        onChange={(e: any) => setToAddress(e.target.value)}
        placeholder="Receiving Address"
      />
      <FormInput value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder={`Amount (FLOW)`} />
      {amountError ? <ErrorText className="error">Invalid amount</ErrorText> : null}
      <FormButton onClick={sendTransaction} disabled={!toAddress || !amount || disabled || transactionLoading}>
        {transactionLoading ? (
          <div className="loading-container">
            <Image className="loading" alt="loading" src={Loading} />
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
