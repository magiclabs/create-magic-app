import { useUser } from '../lib/hooks';
import Layout from '../components/layout';

const Profile = () => {
  const user = useUser({ redirectTo: '/login' });

  return (
    <Layout>
      {user && (
        <>
          <h2>Profile</h2>
          <pre style={{ overflow: 'auto' }}>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </Layout>
  );
};

export default Profile;
