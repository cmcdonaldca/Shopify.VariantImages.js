var Shopify = Shopify || {};

// extend the OptionSelectors so we can inject and event handler
Shopify.OptionSelectorsBase = Shopify.OptionSelectors;
Shopify.OptionSelectors = function(existingSelectorId, options){
    var onVariantSelectedHandler;
    if (Shopify.isDefined(options.onVariantSelected)) {
        var onVariantSelectedOrigHandler = options.onVariantSelected;
        onVariantSelectedHandler = function(variant, selector) {
            onVariantSelectedOrigHandler(variant, selector);
            Shopify.VariantImages.showVariantImage(variant);
        };
    } else {
        onVariantSelectedHandler = function(variant, selector) {
            Shopify.VariantImages.showVariantImage(variant);
        };
    }
    options.onVariantSelected = onVariantSelectedHandler;
    var returnVal = new Shopify.OptionSelectorsBase(existingSelectorId, options);
    
    return returnVal;
};

Shopify.VariantImages = (function($){
    // this Module
    var variantImages = {};
    //Private Vars
    var _pThumbnails = [];
    var _pImages = [];
    var _pVariants = {};
    
    variantImages.preLoadImages = function() {
        var preLoadImage = new Image();
        $.each(_pImages, function(i, imageURL){
            preLoadImage.src = imageURL;
        });
    };    
    variantImages.addImage = function(thumbURL, imageURL) {
        _pThumbnails.push(thumbURL);
        _pImages.push(imageURL);
    };
    variantImages.addVariantOption = function(variantId, option) {
        if (typeof _pVariants[variantId] === "undefined" )
            _pVariants[variantId] = [];
            
        _pVariants[variantId].push(option);
    };
    
    variantImages.init = function(options) {
        var that = this;
        
        this.settings = $.extend({
            'thumb-anchor-selector':        '#thumbs a',
            'large-image-selector' :        '#active-wrapper img',
            'large-image-anchor-selector' : '#active-wrapper a',
            'product-select-id':              'product-select',
        }, options)
        
        this.preLoadImages();
        
        $(this.settings['thumb-anchor-selector']).click(function(ev) {
            ev.preventDefault();
            var variantID = that.findVariantFromImage(this.href);
            if (variantID) {
                for (var i=0; i<_pVariants[variantID].length; ++i) {
                  $('#' + variantImages.settings['product-select-id'] + '-option-' + i).val(_pVariants[variantID][i]).trigger('change');
                }            
            }
        });    
    };
    
    variantImages.showVariantImage = function (variant) {
        //find best image map
        var vOptions = _pVariants[variant.id];
        var imageMatchIndex = -1;
        var maxMatchCount = 0;
        // look at each image for the image that has the most matches
        // in it's filename for this variant
        for (var i=0; i<_pImages.length; ++i) {
            var matchCount = 0;
            for (var j=0; j<vOptions.length; ++j) {
                if (_pImages[i].indexOf(vOptions[j].toLowerCase()) > -1)
                    matchCount++;
            }
            
            if (matchCount > maxMatchCount) {
                imageMatchIndex = i;
                maxMatchCount = matchCount;
            }
        }
        if (imageMatchIndex < 0)// just use the first index
            imageMatchIndex = 0;
        $(Shopify.VariantImages.settings['large-image-selector']).attr('src', _pImages[imageMatchIndex]);
        $(Shopify.VariantImages.settings['large-image-anchor-selector']).attr('href', $(Shopify.VariantImages.settings['large-image-selector'] + "[src='" + _pThumbnails[imageMatchIndex] + "']").parent().attr("href"));
    };

    variantImages.findVariantFromImage = function(imageURL) {
        for (var variantID in _pVariants) {
            var hasNoMatch = false;
            for (var i=0; i<_pVariants[variantID].length; ++i) {
                if (imageURL.indexOf(_pVariants[variantID][i].toLowerCase()) < 0) {
                    hasNoMatch = true;
                }
            }
            
            if (!hasNoMatch) {
                //foundVariantID = variantID;
                return variantID;
            }
        }
        return null;
    };

    return variantImages;
}(jQuery));

