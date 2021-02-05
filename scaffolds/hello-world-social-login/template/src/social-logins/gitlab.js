import { createButton } from "react-social-login-buttons";

export default {
  id: 'gitlab',
  Button: createButton({
    text: "Login with GitLab",
    icon: () => <img width="24px" src="/img/gitlab.svg" />,
    style: { background: "#805de7" },
    activeStyle: { background: "#4a2192" }
  }),
}
