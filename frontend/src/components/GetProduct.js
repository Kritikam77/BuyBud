import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ImageSlider from "./ImageSlider";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ClipLoader } from "react-spinners";

import { useNavigate } from "react-router-dom";

const GetProduct = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [admin, setAdmin] = useState(false);

  const [product, setProduct] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [addToCartMsg, setAddToCartMsg] = useState("Add To Cart");
  const [inWishlist, setInWishlist] = useState();
  const [wishlistMessage, setWishlistMessage] = useState("Add To Wishlist");
  const [owner, setOwner] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [review, setReview] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState();


  const { user } = useAuth();

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  //to get product
  useEffect(() => {
    let fetchData = async () => {
      try {
        let response = await axios.get(`/api/getProduct/${id}`);
        setProduct(response.data.product);
        setReviews(response.data.product.reviews);
        // console.log(response.data.product.reviews);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  //show delete or not
  useEffect(() => {
    if (user) {
      user.products.forEach((item) => {
        if (id == item._id) {
          // console.log("yes");
          setOwner(true);
        }
      });
    }
  }, [user]);

  //check whether product in wishlist or not
  useEffect(() => {
    if (user) {
      if (user.wishlist.length === 0) {
        setInWishlist(false);
      }
      user.wishlist.forEach((item) => {
        if (item.product.toString() === product?._id.toString()) {
          setInWishlist(true);
        } else {
          setInWishlist(false);
        }
      });
    }
  }, [user, product]);

  let addProductToCart = async (id) => {
    try {
      setAddToCartMsg("Loading");
      await axios.put(`/api/addProductToCart/${id}`);
      setAddToCartMsg("Product added to cart.");
    } catch (error) {
      console.log(error);
    }
  };

  let addProductToWishlist = async (id) => {
    if (inWishlist) {
      setInWishlist(!inWishlist);
      setWishlistMessage("Yes");
    } else if (!inWishlist) {
      setInWishlist(!inWishlist);
      setWishlistMessage("Noo");
    }
    try {
      await axios.put(`/api/addProductToWishlist/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  let deleteProductFunction = async () => {
    try {
      await axios.delete(`/api/deleteOwnProduct/${id}`);
      navigate("/home/feed");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (inWishlist) {
      setWishlistMessage(<FavoriteIcon style={{ color: "red" }} />);
    } else {
      setWishlistMessage("Add To Wishlist");
    }
  }, [inWishlist]);

  //admin stuff
  const fetchAdmin = async () => {
    try {
      await axios.get("/api/admin");
      setAdmin(true);
    } catch (error) {
      //   console.log(error);
    }
  };
  useEffect(() => {
    fetchAdmin();
  }, []);

  let deleteByAdmin = async () => {
    try {
      console.log("id ", id);
      await axios.delete(`/api/deleteProduct/${id}`);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let fetchSimilarProducts = async () => {
      try {
        let resp = await axios.get(`/api/getSimilarProducts/${id}`);
        // console.log(resp.data.products)
        setSimilarProducts(resp.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSimilarProducts();
  }, [product]);

  //review stuff
  //update comment to whats written
  let updateReview = (e) => {
    setReview(e.target.value);
  };

  //post review
  let reviewOnProduct = async () => {
    try {
      setLoading(true);
      let response = await axios.post(
        `/api/reviewProduct/${product._id}`,
        {
          text: review,
        }
      );
      // console.log(response.data.newComment);
      setLoading(false);
      // console.log('hereee ',reviews)
      setReviews((prevReviews) => [
        ...prevReviews,
        response.data.newReview,
      ]);
      setReview("");
    } catch (error) {
      setLoading(true);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="getProduct">
      {product ? (
        <>
          <div className="getProduct_image">
            <ImageSlider
              imageArr={product.imageUrls}
              width={"35%"}
              height={"80%"}
            />
          </div>
          <div className="getProduct_info">
            <div className="getProduct_info-title">{product.title}</div>
            <div className="getProduct_info-price">
              <span>Price -</span> {product.price}
            </div>
            <div className="getProduct_info-stock">
              <span>Stock -</span> {product.stock}
            </div>
            <div className="getProduct_info-desc">
              <div className="getProduct_info-title">About the product-</div>
              {product.description}
            </div>
          </div>
          <div className="getProduct_reviews">
            <div className="getProduct_reviews-title">Reviews-</div>
            <div className="getProduct_reviews-list">
              {product.reviews.length !== 0
                ? product.reviews.map((review, index) => (
                    <div key={index}>
                      <span>
                        <Link
                          to={`/user/${review.userId._id}`}
                          className="getPost_comment-username"
                        >
                          {review.userId.userName} -
                        </Link>
                      </span>
                      <span>{review.text}</span>
                    </div>
                  ))
                : "No reviews yet"}
            </div>
            <div className="getPost_makeComment">
              <input type="text" value={review} onChange={updateReview} />
              <button onClick={reviewOnProduct}>
                {loading ? (
                  <ClipLoader size={20} color={"black"} loading={loading} />
                ) : (
                  "Post Your Review"
                )}
              </button>
            </div>
          </div>
          <div className="getProduct_button">
            <button onClick={() => addProductToCart(product._id)}>
              {addToCartMsg}
            </button>
            <button onClick={() => addProductToWishlist(product._id)}>
              {wishlistMessage}
            </button>
            <div className="getProduct_info-title">Seller - </div>
            <Link to={`/user/${product.owner?._id}`}>
              <img
                src={product.owner?.avatar.url}
                alt={product.owner?.userName}
              />
              <div>{product.owner?.userName}</div>
            </Link>
            {owner ? (
              <button
                style={{ backgroundColor: "red" }}
                onClick={() => {
                  setDeleteProduct(!deleteProduct);
                }}
              >
                Delete Product
              </button>
            ) : (
              ""
            )}
            {deleteProduct ? (
              <div style={{ fontWeight: "1000" }}>
                Are you sure you want to delete your product?{" "}
                <button
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    deleteProductFunction();
                  }}
                >
                  Yes
                </button>
              </div>
            ) : (
              ""
            )}

            {admin ? (
              <div className="deleteAdmin">
                <button
                  onClick={() => {
                    setDisplayDelete(!displayDelete);
                  }}
                >
                  Delete Product By Admin
                </button>
                {displayDelete ? (
                  <div>
                    Do you really want to delete the product?
                    <button
                      onClick={() => {
                        deleteByAdmin();
                      }}
                    >
                      Yes
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="getProduct_similarProduct">
            <div className="getProduct_similarProduct-title">
              SIMILAR PRODUCTS
            </div>
            <div className="userDetails_display">
              {similarProducts.length === 0 ? (
                <div className="showInMiddle">No Products</div>
              ) : (
                similarProducts.map((product) => (
                  <div className="userDetails_display-div" key={product._id}>
                    <a
                      className="userDetails_display-div-link"
                      href={`/getProduct/${product._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={product.imageUrls[0].url} alt={product.title} />
                      <div>{truncateText(product.title, 20)}</div>
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        "Hello"
      )}
    </div>
  );
};

export default GetProduct;
