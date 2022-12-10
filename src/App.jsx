import UsersList from "./components/UsersList";
import "bootstrap/dist/css/bootstrap.min.css";

const dataUri =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

function App() {
  return <UsersList dataUri={dataUri} />;
}

export default App;
