import React from "react";

const UserProducts = ({ user }) => {
  //truncate name
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="userDetails_display">
      {user.products.length === 0 ? (
        <div className="showInMiddle">No Products</div>
      ) : (
        user.products.map((product) => (
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
  );
};

export default UserProducts;
