import { useUser } from "../lib/hooks";
import { useState, useEffect } from "react";
import Loading from "../components/loading";
import UserKittyPics from "../components/kitties/user-kitty-pics";

const Profile = () => {
  const user = useUser();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user && user.issuer) {
      getUsername();
    }
  }, [user]);

  const queryHasura = async (query) => {
    try {
      let res = await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + user?.token,
        },
        body: JSON.stringify(query),
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getUsername = async () => {
    const getUsernameQuery = {
      query: `{
        users(where: {issuer: {_eq: "${user.issuer}"}}) {
          username
        }
      }`,
    };
    try {
      let res = await queryHasura(getUsernameQuery);
      let { data, error } = await res.json();
      error
        ? console.log(error)
        : data.users && setUsername(data.users[0].username);
    } catch (error) {
      console.log(`Error fetching username: ${error}`);
    }
  };

  return (
    <>
      {!user || user.loading ? (
        <Loading />
      ) : (
        user && (
          <>
            <div className="label">Username</div>
            <div className="profile-info">{username}</div>

            <div className="label">Email</div>
            <div className="profile-info">{user.email}</div>

            <div className="label">User Id</div>
            <div className="profile-info">{user.issuer}</div>
            <UserKittyPics />
          </>
        )
      )}

      <style jsx>{`
        .label {
          font-size: 12px;
          color: #6851ff;
          margin: 30px 0 5px;
        }
        .profile-info {
          font-size: 17px;
          word-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default Profile;
