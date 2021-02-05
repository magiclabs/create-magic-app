import { createButton } from "react-social-login-buttons";

export default {
  id: 'apple',
  Button: createButton({
    text: "Sign in with Apple",
    icon: () => <img width="24px" src="/img/apple.svg" />,
    style: { background: "#000" },
    activeStyle: { background: "#000" }
  }),
}
