import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import apiFunctions from './global/api-functions';

export default class Category extends CatalogPage {
    onReady() {
        compareProducts(this.context.urls);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        /*$.ajax({
            url: 'https://api.bigcommerce.com/stores/pnoumftmbw/v3/customers?id:in=1',
            type: 'GET',
            dataType: 'json',
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-auth-client": "sesb5zbpkwmgylt47r51wnf7f4veo0q",
                "x-auth-token": "2p1ufd4vwujdmze9nxmf9nk6x6ftamp"
            },
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               console.log(result);
            },
            error: function (error) {
                console.log('error');
            }
        });*/

        /*var xmlhttp = new XMLHttpRequest();
        var url = '/api/stores/pnoumftmbw/v3/customers?id:in=1';
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var optionResponse = JSON.parse(this.responseText);
                console.log(optionResponse);
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send();*/

        /*$.ajax({
            url: 'https://api.bigcommerce.com/stores/pnoumftmbw/v3/customers?id:in=1',
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Bearer 2p1ufd4vwujdmze9nxmf9nk6x6ftamp")
            }, success: function(data){
                alert(data);
                //process the JSON data etc
            }
        })*/

        function customerJWT() {
            var appClientId = "cvovnr7t20t7g768fa4uldfj3zodzzv"; // TODO: Fill this in with your app's client ID
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 ) {
                   if (xmlhttp.status == 200) {
                        //console.log(xmlhttp.responseText);
                        const token = xmlhttp.responseText;

                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const buff = new Buffer(base64, 'base64');
                        const payloadinit = buff.toString('ascii');
                        const payload = JSON.parse(payloadinit);
                        //console.log(payload);

                        if(payload.customer != null && payload.customer != undefined){                            
                            $.get('https://espisdev2.com/bigcommerce/pnoumftmbw.php?uid='+payload.customer.id, function(data){
                                //console.log(data.data[0].company);
                                $('#customerName').html(data.data[0].first_name + ' ' +data.data[0].last_name);
                                $('#customerEmail').html(data.data[0].email);
                                $('#customerCompany').html(data.data[0].company);
                                $('#customerPhone').html(data.data[0].phone);
                                $('#customerInfo').show();
                            },"json");                            
                       }
                   } else if (xmlhttp.status == 404) {
                      console.log('Not logged in!');
                   }
                   else {
                      console.log('Something went wrong');
                   }
                }
            };
            xmlhttp.open("GET", "/customer/current.jwt?app_client_id="+appClientId, true);
            xmlhttp.send();
        }
        customerJWT();


        /*var data = JSON.stringify({
                      "allowed_cors_origins": [
                        "http://localhost:3001"
                      ]
                    });
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            console.log('Hello World!');
            console.log(this.responseText);
          }
        });
        xhr.open("GET", "https://store-pnoumftmbw.mybigcommerce.com/api/v2/customers"); //https://api.bigcommerce.com/stores/pnoumftmbw/v2/customers
        xhr.setRequestHeader("accept", "application/json");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-auth-client", "knsk9yrjr11i4r01dykycz7u2buh76l");
        xhr.setRequestHeader("x-auth-token", "stbev1gtuiji0iog4lcnoclx8lyft9q");
        xhr.setRequestHeader("access-control-allow-origin", "*");
        xhr.send(data);*/


        /*var http = require("https");

        var options = {
          "method": "GET",
          "hostname": "api.bigcommerce.com",
          "port": null,
          "path": "/stores/pnoumftmbw/v3/customers",
          "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "x-auth-client": "knsk9yrjr11i4r01dykycz7u2buh76l",
            "x-auth-token": "stbev1gtuiji0iog4lcnoclx8lyft9q",
            "access-control-allow-origin": "http://localhost:3001"
          }
        };

        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
          });
        });

        req.end();*/



        var mainImages = [];
        var rollOvers = [];
        var productIds = [];
        this.context.categoryProducts.forEach(function(e, i) {
            //console.log(e)
            if(!e.has_options)
            productIds[e.id] = e.id;
            if (e.images[0]) {
              mainImages[e.id] = e.images[0].data;
            }
            if (e.images[1]) {
              rollOvers[e.id] = e.images[1].data;
            }
        });

        rollOvers.forEach(function(image, id) {
            image = image.replace('{:size}', '500x659');

            $('a[data-product-id="' + id + '"]').closest('li.product').find('.card-image')
              .on('mouseover', function() {
              $(this).removeAttr("srcset");
              $(this).attr('src', image);
            }).on('mouseout', function() {
              $(this).removeAttr("srcset");
              $(this).attr('src', mainImages[id].replace('{:size}', '500x659'));
            });
        });

        apiFunctions.getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
        .then(data => { apiFunctions.getCartSuccess(data) })
        .catch(error => { $('.loadingOverlay').hide(); console.error(error) });

        $('#addalltocart').on('click', function(){
            $(".alertBox").remove();
            $('.loadingOverlay').show();

            var cartItems = []
            productIds.forEach(function(e, i) {
              //$.extend(cartItems, {"quantity": 1, "productId": e});
              cartItems.push({"quantity": 1, "productId": e});
            });

            apiFunctions.getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
            .then(data => { apiFunctions.getAddToCartSuccess(data, cartItems) })
            .catch(error => { $('.loadingOverlay').hide(); console.error(error) });
        })

        $('#deleteallfromcart').on('click', function(){
            $(".alertBox").remove();
            $('.loadingOverlay').show();

            apiFunctions.getCart('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options')
            .then(data => { apiFunctions.getDeleteCartSuccess(data); })
            .catch(error => { $('.loadingOverlay').hide(); console.error(error); });            
        })        
    }

    initFacetedSearch() {
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        });
    }
}
