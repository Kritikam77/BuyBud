import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [admin, setAdmin] = useState(false);
  const [content, setContent] = useState(false);
  const [users, setUsers] = useState(false);
  const [posts, setPosts] = useState(false);
  const [products, setProducts] = useState(false);

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  const fetchUser = async () => {
    try {
      await axios.get("/api/admin");
      setAdmin(true);

      //set posts
      const allPostsResponse = await axios.get("/api/getAllPosts");
      setPosts(allPostsResponse.data.posts);

      //set products
      const allProductsResponse = await axios.get("/api/getAllProducts");
      setProducts(allProductsResponse.data.products);

      //set users
      const allUsersResponse = await axios.get("/api/getAllUsers");
      setUsers(allUsersResponse.data.users);
    } catch (error) {
      //   console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="admin">
      {admin ? (
        <>
          <div className="admin_links">
            <div
              style={{ fontWeight: "1000", color: "black" }}
              onClick={() => {
                setContent("posts");
              }}
              className={content == "posts" ? `active-link` : ""}
            >
              Posts
            </div>
            <div
              style={{ fontWeight: "1000", color: "black" }}
              onClick={() => {
                setContent("users");
              }}
              className={content == "users" ? `active-link` : ""}
            >
              Users
            </div>
            <div
              style={{ fontWeight: "1000", color: "black" }}
              onClick={() => {
                setContent("products");
              }}
              className={content == "products" ? `active-link` : ""}
            >
              Products
            </div>
          </div>
          <div className="admin_display">
            {content == "posts" ? (
              <div className="admin_items">
                {posts.length === 0 ? (
                  <div className="showInMiddle">No Posts</div>
                ) : (
                  <>
                    <div className="admin_items-length">
                      {posts.length} posts
                    </div>
                    <div className="admin_items-data">
                      {posts.map((post) => (
                        <div className="userDetails_display-div" key={post._id}>
                          <a
                            className="userDetails_display-div-link"
                            href={`/posts/${post._id}/comments`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={post.images[0].url} alt={post.title} />
                            <div>{truncateText(post.caption, 20)}</div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
            {content == "users" ? (
              <div className="admin_items">
                {users.length === 0 ? (
                  <div className="showInMiddle">No users</div>
                ) : (
                  <>
                    <div className="admin_items-length">
                      {users.length} users
                    </div>
                    <div className="admin_items-data">
                      {users.map((follower) => (
                        <div
                          className="userDetails_display-div"
                          key={follower._id}
                        >
                          <a
                            className="userDetails_display-div-link"
                            href={`/user/${follower._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={follower.avatar.url}
                              alt={follower.userName}
                            />
                            <div>{truncateText(follower.userName, 20)}</div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
            {content == "products" ? (
              <div className="admin_items">
                {products.length === 0 ? (
                  <div className="showInMiddle">No Products</div>
                ) : (
                  <>
                    <div className="admin_items-length">
                      {products.length} products
                    </div>
                    <div className="admin_items-data">
                      {products.map((product) => (
                        <div
                          className="userDetails_display-div "
                          key={product._id}
                        >
                          <a
                            className="userDetails_display-div-link"
                            href={`/getProduct/${product._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={product.imageUrls[0].url}
                              alt={product.title}
                            />
                            <div>{truncateText(product.title, 20)}</div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <div style={{color:"black",fontWeight:"1000",margin:" 2rem auto",width:"100vw",fontSize:"2.5rem"}}>Page Not Found !!</div>
      )}
    </div>
  );
};

export default Admin;
