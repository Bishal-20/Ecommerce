import { createSelector } from "@reduxjs/toolkit";

export const selectProducts = (state) => state.product?.products || [];

export const selectPopularProducts = createSelector(
  [selectProducts],
  (products) =>
  products.filter(
    (product) =>
      typeof product.tags === "string" &&
      product.tags.toLowerCase().trim() === "popular"
  )

);
