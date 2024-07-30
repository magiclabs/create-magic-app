import { useCallback, useEffect, useState } from 'react';
import Divider from '@/components/ui/Divider';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import CardLabel from '@/components/ui/CardLabel';
import Spinner from '@/components/ui/Spinner';
import { getContractId, abi } from '@/utils/smartContract';
import { useMagic } from '@/hooks/MagicProvider';
import useWeb3 from '@/hooks/Web3';
import FormInput from '@/components/ui/FormInput';
import FormButton from '@/components/ui/FormButton';
import showToast from '@/utils/showToast';
import Spacer from '@/components/ui/Spacer';

const SmartContract = () => {
  const { magic } = useMagic();
  const web3 = useWeb3();
  const [contractAddress, setContractAddress] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [newValue, setNewValue] = useState<string>('');
  const [copied, setCopied] = useState('Copy');
  const [updating, setUpdating] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      const address = getContractId();
      setContractAddress(address);

      if (web3 && address) {
        const contract = new web3.eth.Contract(abi, address);

        try {
          const value = await contract.methods.retrieve().call();
          setValue(value);
        } catch (error) {
          console.error('Error retrieving value:', error);
        }
      }
    };

    initialize();
  }, [web3, updating]);

  const submit = async () => {
    if (web3 && contractAddress) {
      const contract = new web3.eth.Contract(abi, contractAddress);
      setUpdating(true);

      try {
        if (!newValue) {
          throw new Error('No value entered');
        }

        const accounts = await web3.eth.getAccounts();
        const accountBalance = await web3.eth.getBalance(accounts[0]);

        const gasPrice = await web3.eth.getGasPrice();
        console.log(`Current gas price: ${gasPrice}`);

        // Estimate gas limit
        const gasLimit = await contract.methods.store(Number(newValue)).estimateGas({
          from: accounts[0]
        });
        console.log(`Estimated gas limit: ${gasLimit}`);

        // Check if account balance is sufficient
        const transactionCost = BigInt(gasPrice) * BigInt(gasLimit);
        if (BigInt(accountBalance) < transactionCost) {
          throw new Error(`Insufficient funds for gas * price + value: have ${accountBalance}, need ${transactionCost}`);
        }

        // Send the transaction
        await contract.methods.store(Number(newValue)).send({
          from: accounts[0],
          gasPrice: gasPrice,
          gas: gasLimit
        })
          .on('transactionHash', (txHash) => {
            setHash(txHash);
            console.log('Transaction hash:', txHash);
          })
          .then((receipt) => {
            showToast({ message: 'Value updated!', type: 'success' });
            console.log('Transaction receipt:', receipt);
            setNewValue('');
          })
          .catch((error) => {
            console.error('Error submitting value:', error);
            showToast({ message: error.message, type: 'error' });
          });

        setUpdating(false);
        setValue(await contract.methods.retrieve().call());
      } catch (error: any) {
        showToast({ message: error.message, type: 'error' });
        console.error('Error submitting value:', error);
        setUpdating(false);
      }
    }
  };

  const copy = useCallback(() => {
    if (contractAddress && copied === 'Copy') {
      setCopied('Copied!');
      navigator.clipboard.writeText(contractAddress);
      setTimeout(() => {
        setCopied('Copy');
      }, 1000);
    }
  }, [copied, contractAddress]);

  return (
    <Card>
      <CardHeader id="Wallet">Smart Contract</CardHeader>
      <CardLabel
        leftHeader="Contract Address"
        rightAction={!contractAddress ? <Spinner /> : <div onClick={copy}>{copied}</div>}
      />
      <div className="code">{contractAddress}</div>
      <Divider />
      <div>
        <div>
          <strong>Stored Value: </strong>{value !== undefined ? value.toString() : "...loading"}
        </div>
        <Spacer size={20} />
        <FormInput
          type="number"
          value={newValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewValue(e.target.value)}
          placeholder="Enter new value"
        />
        <FormButton onClick={submit} disabled={updating}>
          {updating ? "Updating value" : "Submit"}
        </FormButton>
      </div>
    </Card>
  );
};

export default SmartContract;
