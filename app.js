const $ = require('jquery');
const _ = require('underscore');

$(document).ready(function() {
    // READ products
    $.ajax({
        method: 'get',
        url: '/test',
        success: function( response ) { 
            var productTemplate = _.template( $('#product-template').html() );
            _.each( response.products, function( product ) {
                $('#inventory').append( productTemplate({
                    id: product._id,
                    item: product.item,
                    qty: product.qty,
                    status: product.status,
                    tags: product.tags
                }) );
            });
        },
        error: function( response ) { console.log('error: ', response ) }
    });
    
    // CREATE products
    $('#test').click(function() {
        let data = {
            item: $('#data-input').val(),
            qty: $('#qty-input').val(),
            status: $('#status-input').val(),
            tags: $('#tags-input').val()
        };
        $.ajax({
            url: '/test',
            method: 'post',
            data: JSON.stringify( data ),
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            success: function( response ) { 
                console.log('Product saved');
                $('#inventory').html('');
                var productTemplate = _.template( $('#product-template').html() );
                _.each( response.products, function( product ) {
                    $('#inventory').append( productTemplate({
                        id: product._id,
                        item: product.item,
                        qty: product.qty,
                        status: product.status,
                        tags: product.tags
                    }) );
                });
                $('.form').find('input').val('');
            },
            error: function( err ) { console.log('Save failed: ', err) }
        });
    });

    // UPDATE product
    $('#inventory').delegate('.add-ten', 'click', function() {
        var $thisProduct = $(this).closest('.product');
        var thisId = $thisProduct.attr('id');

        var data = { qty: 10 };
        
        $.ajax({
            method: 'put',
            url: '/test/' + thisId,
            data: JSON.stringify( data ),
            dataType: 'json',
            contentType: 'application/json',
            processData: false,
            success: function(response) {
                var thisQty = $thisProduct.find('li:nth-child(2)');
                thisQty.html('<b>Qty:</b> ' + response.qty );
            },
            error: function( err ) { console.log( 'update failed: ', err ); }
        });
    });
    
    // DELETE products
    $('#inventory').delegate('.delete-product', 'click', function() {
        var $thisProduct = $(this).closest('.product');
        var thisId = $thisProduct.attr('id');

        $.ajax({
            method: 'delete',
            url: '/test/' + thisId,
            success: function(response) {
                console.log('Product deleted: ', response);
                $thisProduct.remove();
            },
            error: function() { console.log('Delete failed'); }
        });
    });
});