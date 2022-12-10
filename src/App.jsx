import { useState } from "react";
import SearchUser from "./components/SearchUser";
import UsersList from "./components/UsersList";
import "bootstrap/dist/css/bootstrap.min.css";

const dataUri =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

function App() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="container mt-4">
      <SearchUser
        text={searchText}
        onChange={(text) => {
          setSearchText(text);
        }}
      />
      <UsersList dataUri={dataUri} searchText={searchText} />
    </div>
  );
}

export default App;
