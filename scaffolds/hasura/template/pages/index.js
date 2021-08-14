import { useUser } from "../lib/hooks";
import KittyDashboard from "../components/kitties/kitty-dashboard";

const Home = () => {
  const user = useUser();
  return (
    <>
      {!user ? (
        <div>Welcome to Boxi! Please sign up or log in to continue.</div>
      ) : (
        <KittyDashboard />
      )}
    </>
  );
};

export default Home;
