# Automatic generator for product features comparison matrixes


This package provides a "product comparison matrix" generator using HTML 5, JQuery and Bootstrap.
The data for the table can be provided by a server backend (AJAX) or by a simple `.json` static file.


## Features

* Automatically generates an interactive product comparison table:
	* Product features grouped by categories
	* Collapsible categories
	* Optional feature tips and detailed descriptions
	* Supports HTML tags inside the tables
	* Supports images (via img tags)
	* No limits for the amount of products compared.
	* No limits for the amount of features compared.
	* Autoformat table cells based on the content
* Customization options:
	* Autoformat criterias are defined in the data set (no HTML or JavaScript editing)
	* Categories are defined in the data set
	* Categories collapsing is defined in the data set
	* Number of columns to be displayed is defined in the data set
	* Extra table customization options via a dedicated css
* Dataset in the JSON format for maximum compatiblity and integration
* Dataset is load by AJAX requests:
	* Can be provided by a server backend (PHP, ASP, etc...)
	* or by a static `.JSON` file
* Bootstrap 3.x compliant CSS styles
* Bootstrap.js popover plugin for product feature tips
* JQuery 1.1x compliant
* Included in the package
	* Sample HTML file
	* Sample JSON dataset file
	* Sample Excel template for data table generation (with instructions)
	* [Bootstrap 3.3.6](https://www.getbootstrap.com)
	* [JQuery 1.11.3](https://jquery.com)


## Issues
Some browsers block the access of local `.json` files. To be able to load the data you will need to specify the full URL (example: http://www.mysite.com/mypage/mydata.json) of the json data file at the `ctDataURL` configuration parameter in the *ct-tablegen.js* script.


## Live example

Check this [live example](http://www.danbp.org/product-compare-matrix-generator/example.html)

## Installation


### Step 1: Get the code

* From the [GitHub repository](https://github.com/danpeig/product-compare-matrix")
* From the developer website [danbp.org](http://www.danbp.org/w/English_Version)

### Step 2: Configure

Edit the *ct-tablegen.js* script and configure the full URL of the json file path. There's a sample json file inside the data folder from this package.

```
var ctDataURL = "http://www.mypage.com/mydataservice/ct-Data.json";
```

### Step 3: Test

Run the *example.html* file. You should see the sample table.

## Customization


### JSON properties


| Name | Description|
|:----|:----|
|select_count|Number of products to be compared at the same time|
|autoformat_rules|Matrix with the autoformat rules|
|data|Data table, see layout below|


### Autoformat rules
| Column | Description |
|:-:|:----|
|0|String that will trigger the format|
|1|CSS class name to be used|


### Data table format
|----| Column 0 | Column 1 | Column2 | Column 3 | Column N... |
|:--------|:---:| ----:| ----:| ----:|----:|
|First row| 0 | Feature list label |  Select box placeholder text | Prod 1 Title | Prod N Title|
|Other rows| Row type | Category/feature label |  Feature tip (optional)| Prod 1 Spec | Prod N Spec |

### Row types
| Type | Description|
|:----:|:----|
|blank|Ignore row data, don't display the row|
|0|Category row, collapsed by default|
|1|Category row, expanded by default|
|2|Feature row|


### Removing Bootstrap


If your site has it's own layout framework you can get rid of all Bootstrap CSS files and replace them with yours. The pieces of Boostrap I don't recommend removing without some workouts in the code are:

* bootstrap.js: required for the popover tips in the feature list details.
* Glyphicons Halflings fonts: Used in the popover tips and in the collapsable rows icons.
 

 
## License

This is free software distributed under the terms of the MIT license

## Additional information

Any questions, feel free to [contact me](http://www.danbp.org).
