import { useRouter } from "next/router";
import UserKittyPics from "../components/kitties/user-kitty-pics";

const User = () => {
  const router = useRouter();
  const { user, username } = router.query;

  return (
    <div>
      <p>User: {username}</p>
      <UserKittyPics userId={user} />
    </div>
  );
};

export default User;
