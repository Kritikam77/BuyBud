import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [itemQuantity, setItemQuantity] = useState([]);
  const [trigger,setTrigger]=useState(false)

  //increase product quantity by 1
  let handleItemQuantityIncrease = async (id, index) => {
    try {

      //assign values of itemQuantity to a temp arr and then assign it back to setItemQuantity
      let tempArr=[...itemQuantity]
      tempArr.forEach((val)=>{
        if(val.index==index){
          val.quantity+=1
        }
      })
      setItemQuantity(tempArr)

      //send req to increase item quantity by 1
      await axios.put(`/api/addProductToCart/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //decrease product quantity by 1
  let handleItemQuantityDecrease = async(id,index) => {
    try {

      //assign values of itemQuantity to a temp arr and then assign it back to setItemQuantity
      let tempArr=[...itemQuantity]
      tempArr.forEach((val)=>{
        if(val.index==index && val.quantity>0){
          val.quantity-=1
        }

        if(val.quantity==0){
          //so the product disappears on 0
          setTrigger(true)
        }
      })
      setItemQuantity(tempArr)

      //send req to increase item quantity by 1
      await axios.put(`/api/decreaseProductQuantity/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  let removeProductFromCart=async(id,index)=>{
    try {
      await axios.delete(`/api/removeProductFromCart/${id}`);
      setTrigger(true)
    } catch (error) {
      
    }
  }
  //fetch get cart
  useEffect(() => {
    setTrigger(false)
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getCart");
        setCart(response.data.cartItems);
        // console.log('cart ',response.data.cartItems);

        //set itemQuantity to original quantities of items
        setItemQuantity(response.data.cartItems.map((item,index)=>{
          return {index:index,quantity:item.quantity}
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [trigger]);

  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="cart">
      <h2>Cart</h2>

      <div className="cart_items">
        {cart.length === 0 ? (
          <div className="showInMiddle">No products in cart. Add some.</div>
        ) : (
          cart.map((item, index) => (
            <div key={item._id}>
              <div style={{cursor:"pointer"}} onClick={() => removeProductFromCart(item.product._id)}>
                <CancelIcon />
              </div>
              <div>
                <Link to={`/getProduct/${item.product._id}`}>
                  <img src={item.product.imageUrls[0].url} />
                  {truncateText(item.product.title, 30)}
                </Link>
              </div>
              <div>
                <RemoveIcon
                  className="cart_button"
                  onClick={() =>
                    handleItemQuantityDecrease(item.product._id, index)
                  }
                />
                <span>{itemQuantity ? itemQuantity[index].quantity : "0"}</span>
                <AddIcon
                  className="cart_button"
                  onClick={() =>
                    handleItemQuantityIncrease(item.product._id, index)
                  }
                />
              </div>
            </div>
          ))
          // <div>This</div>
        )}
      </div>
      {/* <div>CHECKOUT</div> */}
    </div>
  );
};

export default Cart;
