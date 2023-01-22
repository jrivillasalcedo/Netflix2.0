import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function PlansScreen() {
  const [products, setProducts] = useState();
  useEffect(() => {
    getDocs(collection(db, "products")).then((querySnapshot) => {
      const products = {};
      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data();
        const priceSnap = await getDocs(collection(productDoc.ref, "prices"));
        priceSnap.docs.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data,
          };
        });
      });
      setProducts(products);
    });
  }, []);

  console.log(products);
  return (
    <div className="plansScreen">
      {products && (
        <>
          {Object.entries(products).map(([productId, productData]) => {
            //TODO: add some logic to check if the user is subscribed
            return (
              <div className="plansScreen__plan">
                <div className="plansScreen__info">
                  <h5>{productData.name}</h5>
                  <h6>{productData.description}</h6>
                </div>
                <button>Subscribe</button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default PlansScreen;
