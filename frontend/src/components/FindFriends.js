import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const FindFriends = () => {
  let [users, setUsers] = useState(null);
  let [keyword, setKeyword] = useState("");

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let response = await axios.get(`/api/getAllUsers?keyword=${keyword}`);
        setUsers(response.data.users);
        // console.log(response.data.users)
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [keyword]);

  return (
    <div className="findFriends">
      <div className="search-container findFriendsSearch">
        <input
          type="text"
          placeholder="Search for your friend..."
          onChange={handleInputChange}
        />
      </div>
      <div className="findFriend-user-list">
        {users && users.length !== 0 ? (
          users.map((user) => (
            <div className="findFriend-user-card" key={user.userId}>
              <Link to={`/user/${user._id}`}>
                {user.avatar.url ? (
                  <img className="" src={user.avatar.url} />
                ) : (
                  <img
                    className=""
                    src={`https://res.cloudinary.com/dgfcyqq8e/image/upload/v1701364233/BuyBud/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM_e0i4jk.jpg`}
                  />
                )}
                <div>{user.userName}</div>
              </Link>
            </div>
          ))
        ) : (
          <div className="showInMiddle">Please Login</div>
        )}
      </div>
    </div>
  );
};

export default FindFriends;
