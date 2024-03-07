import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ClipLoader } from "react-spinners";


const SellProduct = () => {
  const { userName } = useAuth();

  let [title, setTitle] = useState(null);
  let [description, setDescription] = useState(null);
  let [price, setPrice] = useState(null);
  let [category, setCategory] = useState(null);
  let [stock, setStock] = useState(null);
  let [imageFiles,setImageFiles]=useState(null)


  const [errorDisplay, setErrorDisplay] = useState(null);
  const [messageDisplay, setMessageDisplay] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  let handleImageUpload=(e)=>{
    setImageFiles(e.target.files)
  }
  let createProduct = async (e) => {
    try {
      //to get Please Wait
      setLoading(true);

      e.preventDefault();
      

      let formData=new FormData()
      formData.append('title',title)
      formData.append('description',description)
      formData.append('price',price)
      formData.append('category',category)
      formData.append('stock',stock)

      
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append(`imageUrls`, imageFiles[i]);
      }


      const response = await axios.post("/api/createProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setErrorDisplay(null);
      setMessageDisplay(response.data.message);
      setLoading(false);
      // console.log(response.data)

      //navigate to product page
      navigate(`/getProduct/${response.data.newProduct._id}`);
    } catch (error) {
       setMessageDisplay(null);
       setErrorDisplay(error.response.data.message);
       setLoading(false);
    }
  };
  return userName ? (
    <div className="sellProductContainer">
      <h2>Add a New Product</h2>
      <form onSubmit={createProduct} encType="multipart/form-data">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          required
        >
          <option value="" disabled selected>
            Select products category
          </option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Footwear">Footwear</option>
          <option value="Home and Furniture">Home and Furniture</option>
          <option value="Beauty and Personal Care">
            Beauty and Personal Care
          </option>
          <option value="Sports and Outdoors">Sports and Outdoors</option>
          <option value="Books and Media">Books and Media</option>
          <option value="Toys and Games">Toys and Games</option>
          <option value="Automotive">Automotive</option>
          <option value="Health and Wellness">Health and Wellness</option>
          <option value="Pet Supplies">Pet Supplies</option>
        </select>

        <label >Images:</label>
        <input type="file" onChange={handleImageUpload} multiple required/>

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          onChange={(e) => {
            setStock(e.target.value);
          }}
          required
        />

        <div>
          <div>{errorDisplay}</div>
          <div>{messageDisplay}</div>
        </div>

        <button type="submit">
          {loading ? (
            <ClipLoader size={20} color={"black"} loading={loading} />
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  ) : (
    <div className="showInMiddle">Please Login</div>
  );
};

export default SellProduct;
