import { auth } from "../backend/db";

function Dashboard() {
  return <div>Hello user: {auth.email}</div>;
}

export default Dashboard;
