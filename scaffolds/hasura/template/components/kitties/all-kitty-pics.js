import Image from "next/image";
import { useUser } from "../../lib/hooks";
import Link from "next/link";

const AllKittyPics = ({ kittyPics }) => {
  const user = useUser();

  return (
    <>
      {kittyPics.map((data) => {
        const username = data && data.user && data.user.username ? data.user.username : "";
        return (
          <div className="kitty-item-container" key={data.id}>
            <div className="kitty-container">
              <Link href={{ pathname: "/[user]", query: { user, username }}} as={`/${data && data.user_id}`}>
                <a className="username">
                  {username}
                </a>
              </Link>
              <Image src={data.pic_url} alt="Kitty" width="450" height="450" />
            </div>
          </div>
        );
      })}
      <style jsx>{`
        .kitty-item-container,
        .username {
          font-size: larger;
          margin-bottom: 10px;
        }
        .kitty-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 5px 0;
          box-sizing: border-box;
        }
        .kitty-item-container {
          padding: 10px;
          border-bottom: 1px solid #dcdcdc;
          word-wrap: break-word;
          white-space: pre-wrap;
          word-break: normal;
        }
        .kitty {
          line-height: 28px;
        }
        .toggle-icon {
          margin: 5px 14px 0 5px;
          cursor: pointer;
        }
        .completed {
          text-decoration: line-through;
          color: gray;
        }
        .delete-btn {
          padding: 4px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default AllKittyPics;
