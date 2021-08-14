import { useState } from "react";
import { Input, Icon, MonochromeIcons, CallToAction } from "@magiclabs/ui";

const SignupForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email, username);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Sign up</h3>
        <div className="input-wrapper">
          <Input
            placeholder="Enter your email"
            size="sm"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<Icon inline type={MonochromeIcons.Envelope} size={22} />}
          />
          <Input
            placeholder="Username"
            size="sm"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            prefix={<Icon inline type={MonochromeIcons.Astronaut} size={22} />}
          />
        </div>
        <div>
          <CallToAction
            leadingIcon={MonochromeIcons.PaperPlane}
            color="primary"
            size="sm"
            disabled={disabled}
            onClick={handleSubmit}
          >
            Sign up
          </CallToAction>
        </div>
      </form>
      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 75%;
          margin: 0 auto 20px;
        }
      `}</style>
    </>
  );
};

export default SignupForm;
