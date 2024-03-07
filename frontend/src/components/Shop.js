import React, { useEffect, useState } from "react";
import Product from "./Product.js";
import axios from "axios";
import ImageSlider from "./ImageSlider.js";
import { Link } from "react-router-dom";

const Shop = () => {
  let filterCategory = [
    "Clothing",
    "Electronics",
    "Footwear",
    "Home and Furniture",
    "Beauty and Personal Care",
    "Sports and Outdoors",
    "Books and Media",
    "Toys and Games",
    "Automotive",
    "Health and Wellness",
    "Pet Supplies",
  ];
  let [products, setProducts] = useState();
  let [noOfProducts, setNoOfProducts] = useState();
  let [selectedCategories, setSelectedCategories] = useState([]);
  let [urlForProduct, setUrlForProduct] = useState("/api/getAllProducts?");
  let [minPrice, setMinPrice] = useState("0");
  let [maxPrice, setMaxPrice] = useState("100000");
  let [errorDisplay, setErrorDisplay] = useState("");
  let [sort, setSort] = useState("0");
  let [keyword, setKeyword] = useState("");

  //handle category change
  let handleCategoryChange = (e) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(e.target.value)) {
        // console.log(prevSelectedCategories);
        return prevSelectedCategories.filter((cat) => cat !== e.target.value);
      } else {
        // console.log(prevSelectedCategories);
        return [...prevSelectedCategories, e.target.value];
      }
    });
  };

  //update url when categories selected
  useEffect(() => {
    setUrlForProduct((prevUrl) => {
      if (selectedCategories.length === 0) {
        const regex =
          /&categories=(Clothing|Electronics|Footwear|Home\sand\sFurniture|Beauty\sand\sPersonal\sCare|Sports\sand\sOutdoors|Books\sand\sMedia|Toys\sand\sGames|Automotive|Health\sand\sWellness|Pet\sSupplies)/g;
        prevUrl = prevUrl.replace(regex, "");
        return prevUrl;
      }
      const regex =
        /&categories=(Clothing|Electronics|Footwear|Home\sand\sFurniture|Beauty\sand\sPersonal\sCare|Sports\sand\sOutdoors|Books\sand\sMedia|Toys\sand\sGames|Automotive|Health\sand\sWellness|Pet\sSupplies)/g;
      prevUrl = prevUrl.replace(regex, "");
      selectedCategories.forEach((cat) => {
        prevUrl = `${prevUrl}&categories=${cat}`;
      });
      return prevUrl;
    });
  }, [selectedCategories]);

  //handle price change
  let handlePriceChange = (e) => {
    setErrorDisplay("");

    if (parseInt(minPrice) > parseInt(maxPrice)) {
      return setErrorDisplay(
        "Minimum Price can't be greater than Maximum Price."
      );
    }
    setUrlForProduct((prevValue) => {
      //if we change price again , we get minPrice=34&maxPrice=100 added again, so we first remove it.
      const regex = /&minPrice=(\d{0,7})&maxPrice=(\d{0,7})/;
      prevValue = prevValue.replace(regex, "");
      if (minPrice !== 0 && maxPrice !== 0) {
        return `${prevValue}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }
    });
  };

  //handle sort price
  useEffect(() => {
    let handleSortPrice = () => {
      // Update URL with the correct 'sort' value
      setUrlForProduct((prevValue) => {
        if (sort == 0) {
          return prevValue;
        }
        const regex = /&sort=(-1|1)/;
        prevValue = prevValue.replace(regex, "");
        return `${prevValue}&sort=${sort}`;
      });
    };
    handleSortPrice();
  }, [sort]);

  //search products
  let handleInputChange = (e) => {
    setKeyword(e.target.value);
  };
  useEffect(() => {
    setUrlForProduct((prevUrl) => {
      const regex = /&keyword=([^&]*)/;
      prevUrl = prevUrl.replace(regex, "");
      return `${prevUrl}&keyword=${keyword}`;
    });
  }, [keyword]);

  //fetch products
  useEffect(() => {
    let fetchData = async () => {
      let response = await axios.get(urlForProduct);
      setNoOfProducts(response.data.count);
      setProducts(response.data.products);
    };
    fetchData();
  }, [urlForProduct]);

  //truncate title
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="shop-container">
      <div className="filter1">
        <div className="error shop-error">{errorDisplay}</div>
        {/* <>{selectedCategories}</> */}
        {/* <>{urlForProduct}</> */}
        <div>
          <form className="price-form">
            <div>
              <label htmlFor="minPrice" className="price-label">
                Min Price:
              </label>
              <input
                type="number"
                id="minPrice"
                className="price-input"
                onChange={(e) => {
                  setMinPrice(e.target.value);
                }}
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="price-label">
                Max Price:
              </label>
              <input
                type="number"
                id="maxPrice"
                className="price-input"
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                }}
              />
            </div>

            <button
              type="button"
              className="submit-button"
              onClick={handlePriceChange}
            >
              Search
            </button>
          </form>
        </div>

        <div className="products_search-container">
          <input
            type="text"
            placeholder="Search for product...."
            onChange={handleInputChange}
          />
        </div>

        <div className="sort-container">
          <p className="sort-label">Price:</p>
          <span className="radio-container">
            <div className="radio-group">
              <input
                type="radio"
                id="lowToHigh"
                name="sortOrder"
                value="1"
                onChange={() => {
                  setSort((prevValue) => {
                    return prevValue === "1" ? "0" : "1";
                  });
                }}
              />
              <label htmlFor="lowToHigh" className="radio-label">
                Low to High
              </label>
            </div>

            <div className="radio-group">
              <input
                type="radio"
                id="highToLow"
                name="sortOrder"
                value="-1"
                onChange={() => {
                  setSort((prevValue) => {
                    return prevValue === "-1" ? "0" : "-1";
                  });
                }}
              />
              <label htmlFor="highToLow" className="radio-label">
                High to Low
              </label>
            </div>
          </span>
        </div>
      </div>
      <div className="products">
        <h2> {noOfProducts ? `${noOfProducts} products` : "0 products"}</h2>
        <div className="product_display">
          {products
            ? products.map((product) => {
                return (
                  <div className="singleProduct">
                    <div className="singleProduct_img">
                      <ImageSlider imageArr={product.imageUrls} />
                    </div>

                    <Link to={`/getProduct/${product._id}`}>
                      <div className="singleProduct_title">
                        {truncateText(product.title, 70)}
                      </div>
                      <div className="singleProduct_price">
                        Rs. {product.price}
                      </div>
                    </Link>
                  </div>
                );
              })
            : <div className="showInMiddle">Please Wait</div>}
        </div>
      </div>
      <div className="filter2">
        <h2>Search By Category</h2>
        <div>
          {filterCategory.map((cat) => {
            return (
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="options"
                    value={cat}
                    onChange={handleCategoryChange}
                  />
                  {cat}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
