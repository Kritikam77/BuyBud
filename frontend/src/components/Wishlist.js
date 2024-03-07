import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [trigger,setTrigger]=useState(false)

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  useEffect(() => {
    setTrigger(false)
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getWishlist");
        setWishlist(response.data.wishlist);
        // console.log('wishlist ',response.data.wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchData();
  }, [trigger]);

  let removeProductFromWishlist=async(id)=>{
    try {
      setTrigger(true);
      // console.log("hehe")
      await axios.put(`/api/addProductToWishlist/${id}`);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="wishlist">
      <h2>Wishlist</h2>
      <div className="wishlist_grid">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => removeProductFromWishlist(item.product._id)}
              >
                <CancelIcon />
              </div>
              <Link to={`/getProduct/${item.product._id}`} key={item._id}>
                <img
                  src={item.product.imageUrls[0].url}
                  alt={item.product.title}
                />
                <div>{truncateText(item.product.title, 20)}</div>
              </Link>
            </div>
          ))
          // <div>This</div>
        ) : (
          <div className="showInMiddle">No products in wishlist.</div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
