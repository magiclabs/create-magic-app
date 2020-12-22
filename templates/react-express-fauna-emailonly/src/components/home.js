import Layout from './layout';
import { useUser } from '../lib/hooks';

const Home = () => {
  const user = useUser();

  return (
    <Layout>
      <h2>Home</h2>
      {user ? <div>You're logged in!</div> : <div>Log in to continue</div>}
    </Layout>
  );
};

export default Home;
