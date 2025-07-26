import React, { useCallback } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const ProductCard = React.memo(({ grid, data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Memoize wishlist selector
  const wishlistState = useSelector(
    (state) => state?.auth?.wishlist?.wishlist || []
  );

  // useCallback to memoize the wishlist checker function
  const isProductInWishlist = useCallback(
    (productId) => wishlistState.some((item) => item._id === productId),
    [wishlistState]
  );

  // Memoize add to wishlist handler to avoid creating new function each render
  const addToWish = useCallback(
    (productId) => {
      dispatch(addToWishlist(productId));
    },
    [dispatch]
  );

  const fallbackImage = "/images/fallback-product.jpg"; // Adjust path as needed

  return (
    <>
      {data?.map((item) => {
        const isWishlist = isProductInWishlist(item._id);

        return (
          <div
            key={item._id}
            className={`${
              location.pathname === "/product" ? `gr-${grid}` : "col-3"
            }`}
          >
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                <button
                  className="border-0 bg-transparent"
                  onClick={() => addToWish(item._id)}
                  aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isWishlist ? (
                    <AiFillHeart className="fs-5 me-1 text-danger" />
                  ) : (
                    <AiOutlineHeart className="fs-5 me-1" />
                  )}
                </button>
              </div>

              <div className="product-image">
                <img
                  src={
                    item?.images?.length > 0 && item.images[0].url
                      ? item.images[0].url
                      : fallbackImage
                  }
                  alt={item?.title || "Product Image"}
                  height="250px"
                  width="100%"
                  onClick={() => navigate("/product/" + item._id)}
                  style={{ cursor: "pointer" }}
                />
              </div>

              <div className="product-details">
                <h6 className="brand">{item?.brand}</h6>
                <h5 className="product-title">
                  {grid === 12 || grid === 6
                    ? item?.title
                    : item?.title?.length > 80
                    ? item.title.substr(0, 80) + "..."
                    : item.title}
                </h5>
                <ReactStars
                  count={5}
                  size={24}
                  value={Number(item?.totalrating) || 0}
                  edit={false}
                  activeColor="#ffd700"
                />
                <p className="price">Rs. {item?.price}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
});

export default ProductCard;
