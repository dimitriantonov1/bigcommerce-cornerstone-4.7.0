const apiDefaultFun = {
    addCartItem: (url, cartId, cartItems) => {
         return fetch(url + cartId + '/items', {
             method: "POST",
             credentials: "same-origin",
             headers: {
                 "Content-Type": "application/json"},
             body: JSON.stringify(cartItems),
         })
         .then(response => response.json());
    },

    createCart: (url, cartItems) => {
        return fetch(url, {
           method: "POST",
           credentials: "same-origin",
           headers: {
               "Content-Type": "application/json"},
           body: JSON.stringify(cartItems),
        })
        .then(response => response.json());
    },

    deleteCart: (url, cartId) => {
       return fetch(url + cartId, {
           method: "DELETE",
           credentials: "same-origin"
       })
       .then(response => response.json());
    }
}
export default apiDefaultFun;