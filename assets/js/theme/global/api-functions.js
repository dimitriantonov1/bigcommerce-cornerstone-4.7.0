import apiDefaultFun from './api-default-functions';

const apiFunctions = {

    getCart: (url) => {
       return fetch(url, {
           method: "GET",
           credentials: "same-origin"
       })
       .then(response => response.json());
    },
    
    getCartSuccess: (data) => {
        if(data.length >= 1 && data[0].id != undefined && data[0].id != null){
            $('#deleteallfromcart').show();
        }
    },
    
    getAddToCartSuccess: (data, cartItems) => {
        //console.log(JSON.stringify(data))
        var alertBoxSuccess = '<div class="alertBox alertBox--success"><div class="alertBox-column alertBox-icon"><icon glyph="ic-info" class="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></icon></div><p class="alertBox-column alertBox-message"><span>Products has been added by to your cart. <a href="/cart.php">Click here</a> to view cart.</span></p></div>';

        if(data.length >= 1 && data[0].id != undefined && data[0].id != null){
            //console.log('Cart Id => '+data[0].id);
            $('#deleteallfromcart').show();
            apiDefaultFun.addCartItem('/api/storefront/carts/', data[0].id, {
               "lineItems": cartItems})
             .then(data => { 
                //window.location.href = '/cart.php'; 
                $('.loadingOverlay').hide();
                $(".page-heading").after(alertBoxSuccess);
              } /*console.log('addCartItem') console.log(JSON.stringify(data))*/)
             .catch(error => { $('.loadingOverlay').hide(); console.error(error); });   
        }else{
            $('#deleteallfromcart').show();
            apiDefaultFun.createCart('/api/storefront/carts', {
               "lineItems": cartItems}
            )
            .then(data => { 
                //window.location.href = '/cart.php'; /*console.log('Done createCart'); console.log('Cart Id => '+data.id);*/
                $('.loadingOverlay').hide();
                $(".page-heading").after(alertBoxSuccess);
            } /*console.log(JSON.stringify(data))*/)
            .catch(error => { $('.loadingOverlay').hide(); console.error(error) });
        }
    },
    
    getDeleteCartSuccess: (data) => {
        var alertCartBoxSuccess = '<div class="alertBox alertBox--success"><div class="alertBox-column alertBox-icon"><icon glyph="ic-info" class="icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></icon></div><p class="alertBox-column alertBox-message"><span>Your cart is empty</span></p></div>';
        
        //console.log('Cart Id => '+data[0].id);
        apiDefaultFun.deleteCart('/api/storefront/carts/', data[0].id)
        .then(resp => {})
        .catch(error => { $('.loadingOverlay').hide(); $('#deleteallfromcart').hide(); $(".page-heading").after(alertCartBoxSuccess); /*window.location.reload();*/ });   
    }
}
export default apiFunctions;