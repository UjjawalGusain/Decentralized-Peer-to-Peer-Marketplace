export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function getRazorpayOptions({ key, order, product, user, token, onSuccess }) {
  return {
    key,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
    name: product.title,
    description: product.description,
    handler: onSuccess, // callback defined in your page
    modal: {
      ondismiss: function () {
        alert("Payment popup closed without completing payment.");
      },
    },
    prefill: {
      name: user.name || "",
      email: user.email || "",
      contact: user.phone || "",
    },
  };
}
