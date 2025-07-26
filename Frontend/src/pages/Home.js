import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Marquee from "react-fast-marquee"
import BlogCard from "../components/BlogCard"
import SpecialProduct from "../components/SpecialProduct"
import Container from "../components/Container"
import { services } from "../utils/Data"
import wish from "../images/wish.svg"
import { useDispatch, useSelector } from "react-redux"
import { getAllBlogs } from "../features/blogs/blogSlice"
import { selectPopularProducts } from "../features/products/productSelectors"
import moment from "moment"
import {  getAllProducts, addToWishlist } from "../features/products/productSlice.js"
import ReactStars from "react-rating-stars-component"

const Home = () => {
  const blogState = useSelector(state => state.blog.blog)
  const productState = useSelector((state) => state.product.product);
console.log("productState:", productState);

const productsArray = productState?.products || productState || [];

const popularProducts = Array.isArray(productsArray)
  ? productsArray.filter(product => {
      return (
        typeof product.tags === "string" &&
        product.tags.toLowerCase().trim() === "popular"
      );
    })
  : [];
  // const popularProducts = useSelector(selectPopularProducts)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllBlogs())
    dispatch(getAllProducts())
  }, [dispatch])

  const addToWish = id => dispatch(addToWishlist(id))

  console.log("All products from redux:", productState);

  return <>
    <Container class1="home-wrapper-1 py-5">
      <div className="row">
        <div className="col-6">
          <div className="main-banner position-relative">
            <img
              src="images/main-banner-1.jpg"
              className="img-fluid rounded-3"
              alt="Supercharged iPad S13+ Pro"
            />
            <div className="main-banner-content position-absolute">
              <h4>SUPERCHARGED FOR PROS.</h4>
              <h5>iPad S13+ Pro.</h5>
              <p>From Rs. 81,900.00</p>
              <button className="button">BUY NOW</button>
            </div>
          </div>
        </div>
        <div className="col-6 d-flex flex-wrap gap-10 justify-content-between align-items-center">
          {[
            { src: "images/catbanner-01.jpg", title: "Best Sake", subtitle: "MacBook Pro.", price: "From Rs. 1,29,900.00" },
            { src: "images/catbanner-02.jpg", title: "NEW ARRIVAL", subtitle: "But IPad Air", price: "From Rs. 21,625.00" },
            { src: "images/catbanner-03.jpg", title: "NEW ARRIVAL", subtitle: "But IPad Air", price: "From Rs. 41,900.00" },
            { src: "images/catbanner-04.jpg", title: "NEW ARRIVAL", subtitle: "But Headphone", price: "From Rs. 41,000.00" }
          ].map((banner, i) =>
            <div key={i} className="small-banner position-relative">
              <img src={banner.src} className="img-fluid rounded-3" alt={`${banner.title} - ${banner.subtitle}`} />
              <div className="small-banner-content position-absolute">
                <h4>{banner.title}</h4>
                <h5>{banner.subtitle}</h5>
                <p>{banner.price}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>

   <Container class1="home-wrapper-2 py-5">
  <div className="row">
    <div className="col-12 servies d-flex align-items-center justify-content-between">
      {services.map((service, j) => (
        <div className="d-flex align-items-center gap-15" key={j}>
          <img src={service.image} alt={service.title} />
          <div>
            <h6>{service.title}</h6>
            <p className="mb-0">{service.tagline}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</Container>


    <Container class1="featured-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-12"><h3 className="section-heading">Featured Collection</h3></div>
        {productState && productState.filter(item => item.tags === "featured").map(item =>
          <div key={item._id} className="col-3">
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                <button className="border-0 bg-transparent" onClick={() => addToWish(item._id)}>
                  <img src={wish} alt="Add to wishlist" />
                </button>
              </div>
              <div className="product-image" onClick={() => navigate("/product/" + item._id)}>
                <img src={item.images?.[0]?.url || "images/default.png"} alt={item.title || "product"} height="250px" width="260px" />
              </div>
              <div className="product-details">
                <h6 className="brand">{item.brand}</h6>
                <h5 className="product-title">{item.title?.substr(0, 70) + "..."}</h5>
                <ReactStars count={5} size={24} value={Number(item.totalrating)} edit={false} activeColor="#ffd700" />
                <p className="price">Rs. {item.price}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>

    <Container class1="popular-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-12"><h3 className="section-heading">Our Popular Products</h3></div>
      </div>
      <div className="row">

        {popularProducts && popularProducts.length > 0 ? popularProducts.map(item =>
          <div key={item._id} className="col-3">
            <div className="product-card position-relative">
              <div className="wishlist-icon position-absolute">
                <button className="border-0 bg-transparent" onClick={() => addToWish(item._id)}>
                  <img src={wish} alt="Add to wishlist" />
                </button>
              </div>
              <div className="product-image" onClick={() => navigate("/product/" + item._id)}>
                <img src={item.images?.[0]?.url || "images/default.png"} alt={item.title || "product"} height="250px" width="100%" />
              </div>
              <div className="product-details">
                <h6 className="brand">{item.brand}</h6>
                <h5 className="product-title">{item.title?.substr(0, 70) + "..."}</h5>
                <ReactStars count={5} size={24} value={Number(item.totalrating)} edit={false} activeColor="#ffd700" />
                <p className="price">Rs. {item.price}</p>
              </div>
            </div>
          </div>
        ) : <p className="text-center">No popular products found.</p>}
      </div>
    </Container>
    
    {/* You can add other containers similarly */}

  </>
}

export default Home
