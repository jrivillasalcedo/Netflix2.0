import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";
function PlansScreen() {
  const [products, setProducts] = useState();
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    async function fetchDocs() {
      const colRef = collection(doc(db, "customers", user.uid), "subscriptions");
      const docsSnap = await getDocs(colRef);
      docsSnap.forEach((doc) => {
        setSubscription({
          role: doc.data().role,
          current_period_end: doc.data().current_period_end.seconds,
          current_period_start: doc.data().current_period_start.seconds,
        })
      });
    };
    fetchDocs();
  }, [user.uid]);
  console.log(subscription);

  useEffect(() => {
    getDocs(collection(db, "products")).then((querySnapshot) => {
      const product = {};
      querySnapshot.forEach(async (productDoc) => {
        product[productDoc.id] = productDoc.data();
        const priceSnap = await getDocs(collection(productDoc.ref, "prices"));
        priceSnap.docs.forEach((price) => {
          product[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data,
          };
        });
      });
      setProducts(product);
    });
  }, []);

  console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = doc(db, "customers", user.uid);
    const colRef = collection(docRef, "checkout_sessions");
    const docRef2 = await addDoc(colRef, {
      price: priceId,
      sessionId: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    onSnapshot(docRef2, async (snap) => {
      const { error, sessionId } = snap.data();
      console.log(snap.data());
      if (error) {
        // Show an error to your customer and inspect your Cloud Function logs in the Firebase console
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51MQYYRIi5k5du1ZSqk69RHPaxg33XeyIGVg15uDV3CAFxp4BhRJHhBgWeUAFpK8wFcnDLris3CUYgMbHy8WPCJZ300LAMD7fcx"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };
  return (
    <div className="plansScreen">
      <br/>
      {subscription && <p>Renewal date: {new Date(subscription?.current_period_end * 100).toLocaleDateString()}</p>}
      {products && (
        <>
          {Object.entries(products).map(([productId, productData]) => {
            //TODO: add some logic to check if the user is subscribed
            const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role);
            return (
              <div key={productId} className={`${isCurrentPackage && "plansScreen__plan--disabled"} plansScreen__plan`}>
                <div className="plansScreen__info">
                  <h5>{productData.name}</h5>
                  <h6>{productData.description}</h6>
                </div>
                <button
                  onClick={() => !isCurrentPackage && loadCheckout(productData.prices.priceId)}
                >
                  {isCurrentPackage ? 'Current Package' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default PlansScreen;
