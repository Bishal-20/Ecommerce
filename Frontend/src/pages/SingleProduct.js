import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import ReactImageZoom from "react-image-zoom";
import Color from "../components/Color";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectPopularProducts } from "../features/products/productSelectors";
import {
  addRating,
  getAProduct,
  getAllProducts,
} from "../features/products/productSlice";
import { addProdToCart, getUserCart } from "../features/user/userSlice";

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [isFilled, setIsFilled] = useState(false);
  const [orderedProduct] = useState(true);
  // const [popularProduct, setPopularProduct] = useState([]);
  const popularProduct = useSelector(selectPopularProducts);

  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.singleproduct);
  const productsState = useSelector((state) => state?.product?.product);
  const cartState = useSelector((state) => state?.auth?.cartProducts);

  const rat = productState?.totalrating;

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  useEffect(() => {
    dispatch(getAProduct(getProductId));
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);

  useEffect(() => {
    for (let index = 0; index < cartState?.length; index++) {
      if (getProductId === cartState[index]?.productId?._id) {
        setAlreadyAdded(true);
      }
    }
  }, [cartState, getProductId]);

  // useEffect(() => {
  //   let data = [];
  //   for (let index = 0; index < productsState.length; index++) {
  //     const element = productsState[index];
  //     if (element.tags === "popular") {
  //       data.push(element);
  //     }
  //   }
  //   setPopularProduct(data);
  // }, [productsState]);

  const props = {
    width: 594,
    height: 600,
    zoomWidth: 600,
    img:
      productState?.images?.[0]?.url ||
      "https://via.placeholder.com/594x600.png?text=No+Image",
  };

  const copyToClipboard = (text) => {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    document.body.removeChild(textField);
    toast.success("Product link copied!");
  };

  const handleToggle = () => {
    setIsFilled(!isFilled);
  };

  const uploadCart = () => {
    if (color === null) {
      toast.error("Please choose Color");
      return;
    }
    dispatch(
      addProdToCart({
        productId: productState?._id,
        quantity,
        color,
        price: productState?.price,
      })
    );
    navigate("/cart");
  };

  const addRatingToProduct = () => {
    if (!star) {
      toast.error("Please add star rating");
      return;
    } else if (!comment) {
      toast.error("Please Write Review About the Product");
      return;
    }

    dispatch(
      addRating({ star: star, comment: comment, prodId: getProductId })
    );
    setTimeout(() => {
      dispatch(getAProduct(getProductId));
    }, 100);
  };

  return (
    <>
      <Meta title={productState?.title || "Product"} />
      <BreadCrumb title={productState?.title} />
      <Container class1="main-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-6">
            <div className="main-product-image">
              <ReactImageZoom {...props} />
            </div>
            <div className="other-product-images d-flex flex-wrap gap-15">
              {productState?.images?.map((item, index) => (
                <div key={index}>
                  <img
                    src={
                      item?.url ||
                      "https://via.placeholder.com/150x150.png?text=No+Image"
                    }
                    className="img-fluid"
                    alt="product"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="col-6">
            <div className="main-product-details">
              <div className="border-bottom">
                <h3 className="title">{productState?.title}</h3>
              </div>
              <div className="border-bottom py-3">
                <p className="price">Rs. {productState?.price}/-</p>
                <div className="d-flex align-items-center gap-10">
                  <ReactStars
                      count={5}
                      size={24}
                      value={Number(rat) || 0}
                      edit={false}
                      activeColor="#ffd700"
                    />
                  <p className="mb-0 t-review">
                    ({productState?.ratings?.length || 0} Reviews)
                  </p>
                </div>
              </div>

              <div className="py-3">
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Brand :</h3>
                  <p className="product-data">{productState?.brand}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Category :</h3>
                  <p className="product-data">{productState?.category}</p>
                </div>
                <div className="d-flex gap-10 align-items-center my-2">
                  <h3 className="product-heading">Tags :</h3>
                  <p className="product-data">{productState?.tags}</p>
                </div>

                {alreadyAdded === false && (
                  <>
                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                      <h3 className="product-heading">Color :</h3>
                      <Color
                        setColor={setColor}
                        colorData={productState?.color}
                      />
                    </div>

                    <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                      <h3 className="product-heading">Quantity :</h3>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        className="form-control"
                        style={{ width: "70px" }}
                        onChange={(e) => setQuantity(e.target.value)}
                        value={quantity}
                      />
                    </div>
                  </>
                )}

                <button
                  className="button border-0 mt-3"
                  type="button"
                  onClick={() => {
                    alreadyAdded ? navigate("/cart") : uploadCart();
                  }}
                >
                  {alreadyAdded ? "Go to Cart" : "Add to Cart"}
                </button>

                <div className="mt-3">
                  {isFilled ? (
                    <AiFillHeart
                      className="fs-5 me-2"
                      onClick={handleToggle}
                    />
                  ) : (
                    <AiOutlineHeart
                      className="fs-5 me-2"
                      onClick={handleToggle}
                    />
                  )}
                </div>

                <div className="d-flex gap-10 flex-column mt-3">
                  <h3 className="product-heading">Shipping & Returns :</h3>
                  <p className="product-data">
                    Free shipping and returns available on all orders!
                    <br /> Ships within 5–10 business days.
                  </p>
                </div>

                <div className="d-flex gap-10 align-items-center mt-3">
                  <h3 className="product-heading">Product Link:</h3>
                  <a
                    href="#copy"
                    onClick={() => copyToClipboard(window.location.href)}
                  >
                    Copy Product Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="reviews-wrapper home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 id="review">Reviews</h3>
            <div className="review-inner-wrapper">
              <div className="review-head d-flex justify-content-between align-items-end">
                <div>
                  <h4 className="mb-2">Customer Reviews</h4>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={24}
                      value={Number(rat) || 0}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p className="mb-0">
                      Based on {productState?.ratings?.length || 0} Reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="review-form py-4">
                <h4>Write a Review</h4>
                <ReactStars
                  count={5}
                  size={24}
                  value={0}
                  edit={true}
                  activeColor="#ffd700"
                  onChange={(e) => setStar(e)}
                />
                <textarea
                  className="w-100 form-control mt-2"
                  rows="4"
                  placeholder="Comments"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="d-flex justify-content-end mt-3">
                  <button
                    onClick={addRatingToProduct}
                    className="button border-0"
                  >
                    Submit Review
                  </button>
                </div>
              </div>

              <div className="reviews mt-4">
                {productState?.ratings?.map((item, index) => (
                  <div key={index} className="review">
                    <div className="d-flex gap-10 align-items-center">
                      <h6 className="mb-0">User</h6>
                      <ReactStars
                        count={5}
                        size={24}
                        value={Number(item?.star) || 0}
                        edit={false}
                        activeColor="#ffd700"
                      />
                    </div>
                    <p className="mt-3">{item?.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">Our Popular Products</h3>
          </div>
        </div>
        <div className="row">
          <ProductCard data={popularProduct} />
        </div>
      </Container>
    </>
  );
};

export default SingleProduct;
