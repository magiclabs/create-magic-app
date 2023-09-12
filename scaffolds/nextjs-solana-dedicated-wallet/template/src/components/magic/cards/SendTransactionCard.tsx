import React, { useCallback, useEffect, useState } from 'react';
import Divider from '@/components/ui/Divider';
import { useMagic } from '../MagicProvider';
import FormButton from '@/components/ui/FormButton';
import FormInput from '@/components/ui/FormInput';
import ErrorText from '@/components/ui/ErrorText';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import Spacer from '@/components/ui/Spacer';
import TransactionHistory from '@/components/ui/TransactionHistory';

const SendTransaction = () => {
  const { magic, connection } = useMagic();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [disabled, setDisabled] = useState(!toAddress || !amount);
  const [toAddressError, setToAddressError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [airdropLoading, setAirdropLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [transactionLoading, setTransactionLoadingLoading] = useState(false);
  const publicAddress = localStorage.getItem('user');

  useEffect(() => {
    setDisabled(!toAddress || !amount);
    setAmountError(false);
    setToAddressError(false);
  }, [amount, toAddress]);

  const handleAirdrop = useCallback(async () => {
    try {
      setAirdropLoading(true);
      await connection?.requestAirdrop(new PublicKey(publicAddress as string), 2 * LAMPORTS_PER_SOL);
      setAirdropLoading(false);
      showToast({ message: 'Airdropped 2 SOL!', type: 'success' });
    } catch (e: any) {
      setAirdropLoading(false);
      if ((e.message as string).includes('429')) {
        showToast({ message: 'Limit reaced', type: 'error' });
      } else {
        showToast({
          message: 'Something went wrong. Check console for more details',
          type: 'error',
        });
      }
      console.log(e);
    }
  }, [connection]);

  const sendTransaction = useCallback(async () => {
    const userPublicKey = new PublicKey(publicAddress as string);
    const receiverPublicKey = new PublicKey(toAddress as string);
    if (!PublicKey.isOnCurve(receiverPublicKey.toBuffer())) {
      return setToAddressError(true);
    }
    if (isNaN(Number(amount))) {
      return setAmountError(true);
    }
    setDisabled(true);

    try {
      setTransactionLoadingLoading(true);
      const hash = await connection?.getLatestBlockhash();
      const transaction = new Transaction({
        feePayer: userPublicKey,
        recentBlockhash: hash?.blockhash,
      });

      const lamportsAmount = Number(amount) * LAMPORTS_PER_SOL;

      console.log('amount: ' + lamportsAmount);

      const transfer = SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: receiverPublicKey,
        lamports: lamportsAmount,
      });

      transaction.add(transfer);

      const serializeConfig = {
        requireAllSignatures: false,
        verifySignatures: true,
      };

      const signedTransaction = await magic?.solana.signTransaction(transaction, serializeConfig);
      const rawTransaction = Transaction.from(signedTransaction.rawTransaction);
      const signature = await connection?.sendRawTransaction(rawTransaction.serialize());
      setHash(signature);
      showToast({
        message: `Transaction successful sig: ${signature}`,
        type: 'success',
      });
      setTransactionLoadingLoading(false);
      setDisabled(false);
      setToAddress('');
      setAmount('');
    } catch (e: any) {
      setTransactionLoadingLoading(false);
      setDisabled(false);
      setToAddress('');
      setAmount('');
      showToast({ message: 'Transaction failed', type: 'error' });
      console.log(e);
    }
  }, [connection, amount, publicAddress, toAddress]);

  return (
    <Card>
      <CardHeader id="send-transaction">Send Transaction</CardHeader>
      <div>
        <FormButton onClick={handleAirdrop} disabled={airdropLoading}>
          {airdropLoading ? (
            <div className="loading-container w-full">
              <Spinner />
            </div>
          ) : (
            'Airdrop 2 SOL'
          )}
        </FormButton>
        <Divider />
      </div>

      <FormInput
        value={toAddress}
        onChange={(e: any) => setToAddress(e.target.value)}
        placeholder="Receiving Address"
      />
      {toAddressError ? <ErrorText>Invalid address</ErrorText> : null}
      <FormInput value={amount} onChange={(e: any) => setAmount(e.target.value)} placeholder={`Amount (SOL)`} />
      {amountError ? <ErrorText className="error">Invalid amount</ErrorText> : null}
      <FormButton onClick={sendTransaction} disabled={!toAddress || !amount || disabled}>
        {transactionLoading ? (
          <div className="loading-container w-full">
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
