const SearchUser = ({ text, onChange }) => {
  return (
    <input
      className="form-control"
      placeholder="Search by name, email, or role"
      value={text}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};

export default SearchUser;
