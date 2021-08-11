import { useState } from "react";
import { useUser } from "../../lib/hooks";
import { Input, Icon, MonochromeIcons } from "@magiclabs/ui";

const AddKittyForm = ({ setKittyPicUrlAdded, isLoading, setIsLoading }) => {
  const user = useUser();
  const [kittyPicUrl, setKittyPicUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kittyPicUrl) return;
    setIsLoading(true);
    await fetch(process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + user?.token,
      },
      body: JSON.stringify(addKittyQuery),
    });
    setKittyPicUrl("");
    setIsLoading(false);
    setKittyPicUrlAdded(true);
  };

  const addKittyQuery = {
    query: `mutation {
      insert_kitties_one(object: 
        { 
          pic_url: "${kittyPicUrl}", 
          user_id: "${user?.issuer}"
        }) 
        {
          pic_url
        }
      }`,
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <Input
          placeholder="Enter pic URL of your kitty"
          size="lg"
          type="text"
          value={kittyPicUrl}
          onChange={(e) => setKittyPicUrl(e.target.value)}
          prefix={
            <Icon
              inline
              type={MonochromeIcons.CaretRight}
              color={"#888"}
              size={26}
            />
          }
          suffix={
            isLoading && (
              <img
                height="20px"
                src={
                  "https://media.tenor.com/images/9da8a7cec33307a43306a32e54fbaca0/tenor.gif"
                }
              />
            )
          }
        />
      </form>
      <style jsx>{`
        .form {
          margin: 20px;
          width: 90%;
          padding: 20px;
        }
      `}</style>
    </>
  );
};

export default AddKittyForm;
