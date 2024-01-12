/*!
 * Product features comparison matrix generator
 * Version 1.1
 *
 * Copyright 2016 Daniel BP - contact@danbp.org - http://www.danbp.org
 * Licensed under MIT
 */

//
//
// JSON data file source URL configuration.
// The use of local paths (example: /data/mydatafile.json) will be blocked in some browsers. Use the full web URL to avoid being blocked.
// Example: http://www.danbp.org/myfolder/mydatafile.json.
//
var ctDataURL = "data/ct-Data.json";
//
//
//
// Layout for the table data+
//
//- First column:
//     blank = Ignore the row data (don´t display the row)
//     0 = Category row, collapsed by default
//     1 = Category row, expanded by default
//     2 = Feature row
//
//- Second column:
//	  First row: Feature list title.
//    Other rows: Category or feature labels.
//
//- Third column:
//	  First row: Select box text placeholder.
//	  Other rows: Category or feature tip. Leave blank for no tooltips.
//
//- First row, first column
//	  Leave zero (0).
//
//- First row (from the 4th column)
//	  Product display name (will populate the select boxes).
//
//
$(document).ready(function () {

	//------------------------
	//Loads the JSON data table using AJAX requests
	//------------------------
	$.ajax({
		dataType : "json",
		url : ctDataURL,
		mimeType : "application/json",
		success : function (data) {

			var json_error = [];
			var json_fields = ["select_count", "autoformat_rules", "data"];

			//Verify the received data for malformed answers
			$.each(json_fields, function (key, value) {
				if (!data.hasOwnProperty(value))
					json_error.push(value);
			});

			//If there are no errors, go ahead...
			if (json_error.length > 0) {
				var error_message = "Error loading the data, missing JSON properties: " + json_error;
				console.log(error_message);
				$("#ctLoaderStatus").html(error_message);
			} else
				ctGenerateTable(data);

		},
		//Error handling. Should give a good clue about the problem location.
		error : function (xhr, ajaxOptions, thrownError) {
			$("#ctLoaderStatus").html(
				"Unable to load the comparison data. Request status: " + xhr.status + "<BR>" + thrownError);
		}
	});

	//------------------------
	//Generates the table only once
	//------------------------
	function ctGenerateTable(data) {

		//------------------------
		//Retrieve dataset info and set the variables
		//------------------------

		var ctData = data.data;
		var ctRowCount = ctData.length;
		var ctColCount = Object.keys(ctData[0]).length;
		var ctFormatRules = data.autoformat_rules
			var ctSelectText = ctData[0][2];
		var ctFeatureListTitle = ctData[0][1];
		var ctCompareColumns = data.select_count; //How many columns will be compared at the same time.
		
		//SelectBox texts in alphabetical order
		var ctTitles = [];
		for (var i = 3; i<ctColCount; i++) {
			ctTitles[i-3] = [];
			ctTitles[i-3][0] = ctData[0][i];
			ctTitles[i-3][1] = i;
		}
		ctTitles.sort(function(a,b) {
		return a[0].localeCompare(b[0]);
		});

		
		
		var ctType = [];
		for (var row in ctData) {
			ctType[row] = ctData[row][0];
		}

		//------------------------
		//Table skeleton
		//------------------------

		var ctTSelectBegin = '<tr><th class="ct-select-cell">&nbsp;</th>';
		var ctTSelectTDBegin = '<th class="ct-select-cell"><select id="select';
		//Select column count will be placed here
		var ctTSelectTDEnd = '" class="form-control ct-selectprod"></select></th>';
		var ctTSelectEnd = '</tr>';

		var ctTitleBegin = '<tr><th class="ct-title-cell">' + ctFeatureListTitle + '</th>';
		var ctTitleTDBegin = '<th class="ct-title-cell" id="th';
		//Header IDs will be placed here
		var ctTitleTDEnd = '">&nbsp;</th>';
		var ctTitleEnd = '</tr>';

		var ctTCatBegin = '<tr class="';
		var ctTCatClassExpand = 'ct-parent ct-expanded"><td class="ct-category-cell" id="cat';
		var ctTCatClassCollapse = 'ct-parent ct-collapsed"><td class="ct-category-cell" id="cat';
		//Category IDs will be placed here
		var ctTCatText = '"><i></i>';
		//Category text goes here
		var ctTCatEnd = '</td><td class="ct-category-cell" colspan="' + ctCompareColumns + '">&nbsp;</td></tr>';

		var ctTFeatBegin = '<tr class="ct-child"><td class="ct-feature-cell" id="feat';
		//Feature ID
		var ctTFeatCloseBegin = '">';
		//Feature text goes here
		var ctTFeatPopOverBegin = '<span tabindex="0" class="ct-popover" role="button" data-toggle="popover" data-trigger="focus" data-placement="bottom" data-content="';
		//Popover Text
		var ctTFeatPopOverEnd = '"></span>';
		var ctTFeatMiddle = '</td>';
		var ctTFeatTDBegin = '<td id="rat';
		//Rating ID
		var ctTFeatTDEnd = '">&nbsp;</td>';
		var ctTFeatEnd = '</tr>';

		//------------------------
		//Generates the table header
		//------------------------

		var ctHeader = ctTSelectBegin;
		for (var i = 0; i < ctCompareColumns; i++) {
			ctHeader += ctTSelectTDBegin + i + ctTSelectTDEnd;
		}
		ctHeader += ctTSelectEnd + ctTitleBegin;

		for (var i = 0; i < ctCompareColumns; i++) {
			ctHeader += ctTitleTDBegin + i + ctTitleTDEnd;
		}
		ctHeader += ctTitleEnd;

		$("#ctable > thead").html(ctHeader);

		//------------------------
		//Populates the select lists
		//------------------------

		$('.ct-selectprod').append($("<option/>", {
				value : 0,
				text : ctSelectText
			}));
		$.each(ctTitles, function (key, value) {
				$('.ct-selectprod').append($("<option/>", {
						value : ctTitles[key][1],
						text : ctTitles[key][0]
					}));
		});

		//------------------------
		//Actions for the select lists
		//------------------------

		//Attach the action function to the select lists
		$('.ct-selectprod').change(function () {
			var selection = $(this).val();
			var column = parseInt($(this).attr('id').replace("select", ""));
			ctUpdateTable(column, selection, ctData, ctFormatRules);
			$(this).val(0);
		});

		//------------------------
		//Generates the table body
		//------------------------
		//The table is generated once to avoid overloading the user browser.

		var ctBody = "";
		for (var i = 1; i < ctRowCount; i++) {

			//Is category collapsed by default
			if (ctData[i][0] == 0)
				ctBody += ctTCatBegin + ctTCatClassCollapse + i + ctTCatText + ctData[i][1] + ctTCatEnd;
			//Is category expanded by default
			if (ctData[i][0] == 1)
				ctBody += ctTCatBegin + ctTCatClassExpand + i + ctTCatText + ctData[i][1] + ctTCatEnd;
			//Is feature
			if (ctData[i][0] == 2) {
				ctBody += ctTFeatBegin + i + ctTFeatCloseBegin + ctData[i][1];
				//Is feature with tooltip
				if (ctData[i][2] != "")
					ctBody += ctTFeatPopOverBegin + ctData[i][2] + ctTFeatPopOverEnd;
				//Feature text
				ctBody += ctTFeatMiddle;
				//Inserts the blank rows for the reviews
				for (var j = 0; j < ctCompareColumns; j++) {
					ctBody += ctTFeatTDBegin + j + "-" + i + ctTFeatTDEnd;
				}
				ctBody += ctTFeatEnd;
			}

		}

		$("#ctable > tbody").html(ctBody);

		//------------------------
		//Collapsing table rows switch
		//------------------------

		//Identifies the child rows from a parent row
		function getChildren($row) {
			var children = [];
			while ($row.next().hasClass('ct-child')) {
				children.push($row.next());
				$row = $row.next();
			}
			return children;
		}

		//------------------------
		//Set the rows status (collapsed or expanded)
		//------------------------


		//Expand the child rows by default
		$('.ct-expanded').each(function () {
			var children = getChildren($(this));
			$.each(children, function () {
				$(this).show();
			})
		});

		//Collapse the child rows by default
		$('.ct-collapsed').each(function () {
			var children = getChildren($(this));
			$.each(children, function () {
				$(this).hide();
			})
		});

		$('.ct-parent').on('click', function () {
			$(this).toggleClass("ct-collapsed ct-expanded"); //Change the row format
			var children = getChildren($(this));
			$.each(children, function () {
				$(this).toggle();
			})
		});

		//Enables the tooltips
		$(function () {
			$('[data-toggle="popover"]').popover();
		});

	}

	//------------------------
	//Populates the table
	//------------------------
	//Once the table is generated, we just need to update the rating values according to the users selection

	// Receives the desired column index to be updated (selectedColumn) and the ctData index (selectedIndex) of the desired product.
	function ctUpdateTable(selectedColumn, selectedIndex, ctData, ctFormatRules) {

		//Just to avoid "out-of-bounds" indexes
		if (selectedColumn >= 0)
			if (selectedIndex >= 3) {
				//Does the magic with the headers
				$("#th" + selectedColumn).html(ctData[0][selectedIndex]);
				//Does the magic with the rating rows
				for (var i = 1; i < Object.keys(ctData).length; i++)
					if (ctData[i][0] == 2) {
						var row_id = "#rat" + selectedColumn + "-" + i;
						$(row_id).html(ctData[i][selectedIndex]);
					}
			}

		//Applies the conditional formnatting
		ctUpdateFormatting(ctFormatRules);

	}

	//------------------------
	//Conditional formatting
	//------------------------

	function ctUpdateFormatting(ctFormatRules) {

		$("#ctable > tbody > .ct-child > td").removeClass();
		$("#ctable > tbody > .ct-child > td").addClass("ct-rating-cell");

		//Apply formatting rules
		$.each(ctFormatRules, function (key, value) {
			$("#ctable > tbody > .ct-child > td").filter(function () {
				return $(this).text() === ctFormatRules[key][0]
			}).addClass(ctFormatRules[key][1]);
		});

		//Shortens web addresses and generates links
		$("#ctable > tbody > .ct-child > td").filter(function () {
			return $(this).text().indexOf("http") == 0
		}).each(function () {
			var linkurl = $(this).text();
			var short_url = linkurl.replace("http://", "").replace("https://", "");
			$(this).html("<a href='" + linkurl + "' target='_blank'>" + short_url + "</a>");
		});

		//Generates links for www. style URLs
		$("#ctable > tbody > .ct-child > td").filter(function () {
			return $(this).text().indexOf("www") == 0
		}).each(function () {
			$(this).html("<a href='" + $(this).text() + "' target='_blank'>" + $(this).text() + "</a>");
		});
	};

});
