import { useEffect } from "react";
import { auth } from "../backend/db";
import SignOutBtn from "../components/SignOutBtn";

function Dashboard() {
  useEffect(() => {
    console.log(auth.email, auth);
  });
  return (
    <div>
      Hello user: {auth}
      <SignOutBtn />
    </div>
  );
}

export default Dashboard;
