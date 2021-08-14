import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser } from "../../lib/hooks";

const UserKittyPics = ({ userId }) => {
  const user = useUser();
  const [userKittyPics, setUserKittyPics] = useState([]);
  let issuer;

  useEffect(() => {
    if (user && user.issuer) {
      getUserKittyPics();
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

  const getUserKittyPics = async () => {
    if (userId) issuer = userId;
    else issuer = user.issuer;
    const getUserKittyPicsQuery = {
      query: `{
        users(where: {issuer: {_eq: "${issuer}"}}) {
          kitties {
            pic_url
          }
        }
      }`,
    };
    try {
      let res = await queryHasura(getUserKittyPicsQuery);
      let { data, error } = await res.json();
      error
        ? console.log(error)
        : data.users && setUserKittyPics(data.users[0].kitties);
    } catch (error) {
      console.log(`Error fetching user's kitty pics: ${error}`);
    }
  };

  return (
    <div className="kitties-container">
      {userKittyPics.map((data) => {
        return (
          <div className="kitties-container">
            <Image src={data.pic_url} alt="Kitty" width="400" height="400" />
          </div>
        );
      })}
      <style jsx>{`
        .kitties-container {
          display: flex;
          flex-direction: row;
          padding: 20px;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default UserKittyPics;
