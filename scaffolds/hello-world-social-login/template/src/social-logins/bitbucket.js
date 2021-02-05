import { createButton } from "react-social-login-buttons";

export default {
  id: 'bitbucket',
  Button: createButton({
    text: "Login with BitBucket",
    icon: () => <img width="24px" src="/img/bitbucket.svg" />,
    style: { background: "#293e69" },
    activeStyle: { background: "#172B4D" }
  }),
}
