//TODO: dokumentacja

# How to run project in dev mode

1. Change name of .env.example to .env
2. Fill all fields with values from firebase project

# Disclaimers for developers

<h2>
  <a name="security-note" href="#security-note">
  </a>
  Security note 🔐
</h2>
<p>Any environment variable prefixed with <code>VITE_</code> has the potential to be leaked to the client browser if you use it in your Svelte components. Make sure to do the following to keep potential secrets safe:</p>
<ul>
<li>✅ ALWAYS: Only use secret keys in "endpoints" or other server-side code (e.g. a database connection string, auth token or secret)</li>
<li>🛑 NEVER: do something like <code>const env = import.meta.env</code> in a component as now anyone can access all the values attached to <code>env</code>.</li>
<li>🛑 NEVER: access your private environment variables in React components or routes (e.g. DON'T do this in a component: <code>console.log(import.meta.env.VITE_DATABASE_URL)</code>).</li>
</ul>

# Used technologies, api, hooks

- firebase
- react-firebase-hooks
- react-hook-form
- yup schema resolver for validation
- react router
