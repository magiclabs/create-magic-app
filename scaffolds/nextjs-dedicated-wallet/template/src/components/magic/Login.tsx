import { LoginProps } from '@/utils/types'
import Header from '@/components/ui/Header'
<% loginMethods.forEach(authType => { %>
  <%-`import ${authType.replaceAll(' ', '')} from './auth/${authType.replaceAll(' ', '')}';`-%>
  <% }) %>

const Login = ({ token, setToken }: LoginProps) => {
  return (
    <div className="login-page">
      <Header />
      <div className={`max-w-[100%] grid grid-cols-<%= Math.min(loginMethods.length, 3) %> grid-flow-row auto-rows-fr gap-5 p-4 mt-8`}>
      <% loginMethods.forEach(authType => { %>
      <% if (authType !== "Social Logins") { %>
        <%-`<${authType.replaceAll(' ', '')} token={token} setToken={setToken} />`-%>
      <% } %>
  		<% }) %>
      </div>
    </div>
  )
}

export default Login
