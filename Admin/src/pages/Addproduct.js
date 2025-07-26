import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useLocation, useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import {
  createProducts,
  getAProduct,
  resetState,
  updateAProduct,
} from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup.array().min(1, "Pick at least one color").required("Color is Required"),
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const getProductId = location.pathname.split("/")[3];
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, [dispatch]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state?.upload?.images);
  const newProduct = useSelector((state) => state.product);
  const {
    isSuccess,
    isError,
    createdProduct,
    updatedProduct,
    productName,
    productDesc,
    productPrice,
    productBrand,
    productCategory,
    productTag,
    productColors,
    productQuantity,
    productImages,
  } = newProduct;

  useEffect(() => {
    if (getProductId !== undefined) {
      dispatch(getAProduct(getProductId));
    } else {
      dispatch(resetState());
    }
  }, [dispatch, getProductId]);

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
    }
    if (isSuccess && updatedProduct) {
      toast.success("Product Updated Successfully!");
      navigate("/admin/list-product");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, createdProduct, updatedProduct, navigate]);

  // Prepare color options for Select component
  const coloropt = colorState.map((color) => ({
    label: (
      <div className="col-3">
        <ul
          className="colors ps-0"
          style={{
            width: "20px",
            height: "20px",
            marginBottom: "10px",
            backgroundColor: color.title,
            borderRadius: "50%",
            listStyle: "none",
            border: "2px solid transparent",
          }}
        ></ul>
      </div>
    ),
    value: color._id,
  }));

  // Prepare initial images from Redux upload slice and product details
  const combinedImages = [...(productImages || []), ...(imgState || [])];

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true, // important to update initialValues when product loads
    initialValues: {
      title: productName || "",
      description: productDesc || "",
      price: productPrice || "",
      brand: productBrand || "",
      category: productCategory || "",
      tags: productTag || "",
      color: productColors?.map((c) => c._id) || [], // store only color IDs in Formik
      quantity: productQuantity || "",
      images: combinedImages,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const productData = {
        ...values,
        images: combinedImages, // ensure images from both productImages and uploaded images are sent
      };
      if (getProductId !== undefined) {
        dispatch(updateAProduct({ id: getProductId, productData }));
      } else {
        dispatch(createProducts(productData));
        formik.resetForm();
        dispatch(resetState());
      }
    },
  });

  // Sync Formik images value when imgState or productImages change (avoid infinite loops)
  useEffect(() => {
    const currentImages = formik.values.images || [];
    if (JSON.stringify(currentImages) !== JSON.stringify(combinedImages)) {
      formik.setFieldValue("images", combinedImages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedImages]);

  return (
    <div>
      <h3 className="mb-4 title">{getProductId !== undefined ? "Edit" : "Add"} Product</h3>
      <div>
        <form onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">{formik.touched.title && formik.errors.title}</div>

          <div>
            <ReactQuill
              theme="snow"
              name="description"
              onChange={(content) => formik.setFieldValue("description", content)}
              value={formik.values.description}
            />
          </div>
          <div className="error">{formik.touched.description && formik.errors.description}</div>

          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">{formik.touched.price && formik.errors.price}</div>

          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
          >
            <option value="">Select Brand</option>
            {brandState.map((brand, idx) => (
              <option key={idx} value={brand.title}>
                {brand.title}
              </option>
            ))}
          </select>
          <div className="error">{formik.touched.brand && formik.errors.brand}</div>

          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
          >
            <option value="">Select Category</option>
            {catState.map((cat, idx) => (
              <option key={idx} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
          <div className="error">{formik.touched.category && formik.errors.category}</div>

          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
          >
            <option value="" disabled>
              Select Tag
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">{formik.touched.tags && formik.errors.tags}</div>

          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            value={formik.values.color}
            onChange={(value) => formik.setFieldValue("color", value)}
            options={coloropt}
          />
          <div className="error">{formik.touched.color && formik.errors.color}</div>

          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">{formik.touched.quantity && formik.errors.quantity}</div>

          <div className="bg-white border-1 p-5 text-center">
            <Dropzone onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          <div className="showimages d-flex flex-wrap gap-3">
            {formik.values.images?.map((img, idx) => (
              <div className="position-relative" key={idx}>
                <button
                  type="button"
                  onClick={() => dispatch(delImg(img.public_id))}
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img src={img.url} alt="" width={200} height={200} />
              </div>
            ))}
          </div>

          <button className="btn btn-success border-0 rounded-3 my-5" type="submit">
            {getProductId !== undefined ? "Edit" : "Add"} Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
