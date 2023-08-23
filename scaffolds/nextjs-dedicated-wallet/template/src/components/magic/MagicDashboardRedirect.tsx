import React, { useCallback } from 'react';
import Card from '../ui/Card';
import CardHeader from '../ui/CardHeader';
import FormButton from '../ui/FormButton';
import Spacer from '../ui/Spacer';

const MagicDashboardRedirect = () => {
  const onClick = useCallback(() => {
    window.open('https://dashboard.magic.link', '_blank');
  }, []);

  return (
    <div>
      <Card>
        <CardHeader id="missing-api-key">Missing API Key</CardHeader>
        <h3>
          Please set your <code>NEXT_PUBLIC_MAGIC_API_KEY</code> environment variable in <code>.env</code>. You can get
          your Magic API key from the Magic Dashboard.
        </h3>
        <Spacer size={30} />
        <FormButton onClick={onClick} disabled={false}>
          Go to Magic Dashboard
        </FormButton>
      </Card>
      <div style={{ textAlign: 'center' }}>
        <button className="connect-button" onClick={onClick}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MagicDashboardRedirect;
