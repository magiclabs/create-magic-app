import { LoginProps } from '@/utils/types'
<% selectedAuthTypes.forEach(authType => { %>
<%-`import ${authType.replaceAll(' ', '')} from './auth/${authType.replaceAll(' ', '')}';`-%>
<% }) %>

const Login = ({ token, setToken }: LoginProps) => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300">
      <div className="w-[100%] grid grid-cols-4 gap-5 p-4">
      <% selectedAuthTypes.forEach(authType => { %>
				<%-`<${authType.replaceAll(' ', '')} token={token} setToken={setToken} />`-%>
  		<% }) %>
      </div>
    </div>
  )
}

export default Login
