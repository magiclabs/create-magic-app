export default function ({ store, redirect }) {
  // If the user is not authenticated, redirect to login page.
  if (!store.state.authenticated) {
    return redirect('/login')
  }
}
