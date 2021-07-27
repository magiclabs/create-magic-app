import { createButton } from "react-social-login-buttons";

export default {
  id: 'twitch',
  Button: createButton({
    text: "Login with Twitch",
    icon: () => <img width="24px" src="/img/twitch.svg" />,
    style: { background: "#9146FF" },
    activeStyle: { background: "#572f9f" }
  }),
}
