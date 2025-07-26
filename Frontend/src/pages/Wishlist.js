import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlice";
import { getuserProductWishlist } from "../features/user/userSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const removeFromWishlist = (id) => {
    dispatch(addToWishlist(id));
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container class1="wishlist-wrapper home-wrapper-2 py-5">
        <div className="row">
          {wishlistState && wishlistState.length === 0 && (
            <div className="text-center fs-3">No Data</div>
          )}
          {wishlistState &&
            wishlistState.map((item, index) => {
              // Safe access to image url with fallback
              const imageUrl =
                item?.images && item.images.length > 0 && item.images[0].url
                  ? item.images[0].url
                  : "/images/watch.jpg"; // Use your actual fallback image path here

              return (
                <div className="col-3" key={item._id || index}>
                  <div className="wishlist-card position-relative">
                    <img
                      onClick={() => {
                        removeFromWishlist(item?._id);
                      }}
                      src="/images/cross.svg" // Make sure this path is correct
                      alt="Remove from wishlist"
                      className="position-absolute cross img-fluid"
                      style={{ cursor: "pointer" }}
                    />
                    <div className="wishlist-card-image">
                      <img
                        src={imageUrl}
                        className="img-fluid w-100"
                        alt={item?.title || "product image"}
                      />
                    </div>
                    <div className="py-3 px-3">
                      <h5 className="title">{item?.title || "Untitled"}</h5>
                      <h6 className="price">Rs. {item?.price ?? "N/A"}</h6>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Container>
    </>
  );
};

export default Wishlist;
