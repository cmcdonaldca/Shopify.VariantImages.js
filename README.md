# Description

This JavaScript module switches the product image when the variant is switched (i.e. when a user switches an option).  It also switches the selected variant when the corresponding variant's thumbnail is clicked.


## Demo

* 1 option	http://krajcik-christiansen-and-durgan5294.myshopify.com/products/fundamental-24-hour-productivity
* 2 options	http://krajcik-christiansen-and-durgan5294.myshopify.com/products/iphone-case

## Requirements

* jQuery > 1.3

## How to Install

* add new asset shopify.variantimages.js
* include the script in your layout template
```html

  {{ 'shopify.variantimages.js' | asset_url | script_tag }} 

```

* copy this right before the "new Shopify.OptionSelectors(" line.

```html
    $(function() {
        

	{% for img in product.images %}
        Shopify.VariantImages.addImage('{{ img | product_img_url: 'small' }}', '{{ img | product_img_url: 'medium' }}');
        {% endfor %}
        {% for variant in product.variants %}        
            {% for option in variant.options %}
            Shopify.VariantImages.addVariantOption({{ variant.id}}, '{{ option }}');
            {% endfor %}
        {% endfor %}
        Shopify.VariantImages.init({});


	
	new Shopify.OptionSelectors("product-select", { product: {{ product | json }}, onVariantSelected: selectCallback });
      
```

