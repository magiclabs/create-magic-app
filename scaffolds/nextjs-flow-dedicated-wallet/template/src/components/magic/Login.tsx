import {LoginProps} from '@/utils/types'
import Header from './Header'
<% selectedAuthTypes.forEach(authType => { %>
<%-`import ${authType.replaceAll(' ', '')} from './auth/${authType.replaceAll(' ', '')}';`-%>
<% }) %>

const Login = ({token, setToken}: LoginProps) => {
	return (
		<div className='login-page'>
			<Header />
			<div className='login-method-grid'>
			<% selectedAuthTypes.forEach(authType => { %>
			<% if (authType !== "Social Logins") { %>
				<%-`<${authType.replaceAll(' ', '')} token={token} setToken={setToken} />`-%>
			<% } %>
			<% }) %>
			</div>
		</div>
	)
}

export default Login
