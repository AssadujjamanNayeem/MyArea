<div class="asl-p-cont asl-new-bg">
	<div class="hide">
		<svg xmlns="http://www.w3.org/2000/svg">
		  <symbol id="i-trash" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		  		<title><?php echo __('Trash','asl_admin') ?></title>
			    <path d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6" />
			</symbol>
			<symbol id="i-clock" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		    <circle cx="16" cy="16" r="14" />
		    <path d="M16 8 L16 16 20 20" />
			</symbol>
			<symbol id="i-plus" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		  	<title><?php echo __('Add','asl_admin') ?></title>
		    <path d="M16 2 L16 30 M2 16 L30 16" />
			</symbol>
      <symbol id="i-chevron-top" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M30 20 L16 8 2 20" />
      </symbol>
      <symbol id="i-chevron-bottom" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M30 12 L16 24 2 12" />
      </symbol>
		</svg>
	</div>
	<div class="container">
		<div class="row asl-inner-cont">

			<div class="col-md-12">
      	<div class="card p-0 mb-4">
					<h3 class="card-title"><?php echo __('Manage Additional Fields','asl_admin') ?></h3>
	          <div class="card-body">
	          	
	            	<div class="row">
	            		<div class="col-md-12">
	            			<p><?php echo __('Additional fields for the store can be created through this section, new fields will appear in the store form and via CSV import.','asl_admin') ?> <?php echo __('To show the additional fields on the template, please add the fields in the template as in this <a target="_blank" href="https://www.youtube.com/watch?v=Nc0giVeODEI">Video Guide</a>.','asl_admin') ?></p>
										<p class="alert alert-info" role="alert"><?php echo __(' <b>Control Name</b> must be small-case and without spacing, please use underscore sign (_) as the space separator, example: <b>facebook_url</b></p>','asl_admin') ?> </p>
	            			<form id="frm-asl-custom-fields">
											<div class="table-responsive">
					            	<table class="table table-bordered table-stripped asl-attr-manage">
					            		<thead>
					            			<tr>
					            				<th><?php echo __('Label','asl_admin') ?></th>
					            				<th><?php echo __('Control Name','asl_admin') ?></th>
					            				<th><?php echo __('Action','asl_admin') ?></th>
					            			</tr>
					            		</thead>
												  <tbody>
												  	<?php foreach($fields as $field): ?>
															<tr>
		                            <td colspan="1"><div class="form-group"><input value="<?php echo $field['label'] ?>" type="text" class="asl-attr-label form-control validate[required,funcCall[ASLValidateLabel]]"></div></td>
		                            <td colspan="1"><div class="form-group"><input value="<?php echo $field['name'] ?>" type="text" class="asl-attr-name form-control validate[required,funcCall[ASLValidateName]]"></div></td>
		                            <td colspan="1">
		                              <span class="add-k-delete glyp-trash">
		                                <svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
		                              </span>
		                            </td>
		                          </tr>
												  	<?php endforeach; ?>
												  </tbody>
												</table>
											</div>
									</form>
									</div>
	            	</div>
								
								<div class="row">
	          			<div class="col-md-12">
	          				<button type="button" class="btn btn-dark mrg-r-10 mt-3 float-left" id="btn-asl-add-field"><i><svg width="13" height="13"><use xlink:href="#i-plus"></use></svg></i><?php echo __('New Field','asl_admin') ?></button>
	          				<button type="button" class="btn btn-primary mt-3 float-right" data-loading-text="<?php echo __('Saving...','asl_admin') ?>" data-completed-text="Fields Updated" id="btn-asl-save-schema"><?php echo __('Save Fields','asl_admin') ?></button>
	          			</div>
          			</div>
          		
	        </div>
	      </div>
    	</div>

			<div class="col-md-12">
				<div class="card p-0 mb-4">
					<h3 class="card-title"><?php echo __('ASL Settings (PRO)','asl_admin') ?></h3>
          <div class="card-body">
          	<form id="frm-usersetting">
          		<div class="row mt-2">
          			<div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Google API KEY','asl_admin') ?></label>
							    <input  type="text" class="form-control" name="data[api_key]" id="asl-api_key" placeholder="<?php echo __('API KEY','asl_admin') ?>">
							    <p class="help-p text-muted">(<?php echo __('Generate API Key using Google Console','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="map_type"><?php echo __('Default Map','asl_admin') ?></label>
							    <select   id="asl-map_type" name="data[map_type]" class="custom-select">
							      <option value="hybrid"><?php echo __('HYBRID','asl_admin') ?></option>
							      <option value="roadmap"><?php echo __('ROADMAP','asl_admin') ?></option>
							      <option value="satellite"><?php echo __('SATELLITE','asl_admin') ?></option>
							      <option value="terrain"><?php echo __('TERRAIN','asl_admin') ?></option>
							    </select>
							  </div>
          			<div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Default Latitude','asl_admin') ?></label>
							    <input  type="text" class="form-control validate[required]" name="data[default_lat]" id="asl-default_lat" placeholder="<?php echo __('Numberic Value (Example: 39.9217698526)','asl_admin') ?>">
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Default Longitude','asl_admin') ?></label>
							    <input  type="text" class="form-control validate[required]" name="data[default_lng]"  id="asl-default_lng" placeholder="<?php echo __('Numberic Value (Example: -75.5718432)','asl_admin') ?>">
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Header Title','asl_admin') ?></label>
							      <input  type="text" class="form-control validate[required]" name="data[head_title]" id="asl-head_title" placeholder="<?php echo __('Head title','asl_admin') ?>">
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Category Title','asl_admin') ?></label>
							      <input  type="text" class="form-control validate[required]" name="data[category_title]" id="asl-category_title" placeholder="<?php echo __('Category title','asl_admin') ?>">
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('No Item Text','asl_admin') ?></label>
							    <input  type="text" class="form-control validate[required]" name="data[no_item_text]" id="asl-no_item_text" placeholder="<?php echo __('No Item Text','asl_admin') ?>">
							  </div>
          			<div class="col-md-4 form-group mb-4">
							    <label for="txt_Cluster"><?php echo __('Cluster','asl_admin') ?></label>
							    <select  id="asl-cluster" name="data[cluster]" class="custom-select">
							      <option value="0"><?php echo __('OFF','asl_admin') ?></option>
							      <option value="1"><?php echo __('ON','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="txt_time_format"><?php echo __('Time Format','asl_admin') ?></label>
							    <select  id="asl-time_format" name="data[time_format]" class="custom-select">
							      <option value="0"><?php echo __('12 Hours','asl_admin') ?></option>
							      <option value="1"><?php echo __('24 Hours','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="distance_unit"><?php echo __('Distance Unit','asl_admin') ?></label>
							    <select  id="asl-distance_unit" name="data[distance_unit]" class="custom-select">
							      <option value="KM"><?php echo __('KM','asl_admin') ?></option>
							      <option value="Miles"><?php echo __('Miles','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="asl-zoom"><?php echo __('Default Zoom','asl_admin') ?></label>
							    <select  id="asl-zoom" name="data[zoom]" class="custom-select">
							      <?php for($index = 2;$index <= 20;$index++):?>
							      <option value="<?php echo $index ?>"><?php echo $index ?></option>
							      <?php endfor; ?>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Map Language','asl_admin') ?></label>
							      <input type="text" class="form-control validate[minSize[2]]" maxlength="2" name="data[map_language]" id="asl-map_language" placeholder="Example: US">
							    <p class="help-p">(<?php echo __('Enter the Language Code.','asl_admin') ?> <a href="https://agilestorelocator.com/wiki/display-maps-different-language/" target="_blank" rel="nofollow">Get Code</a>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="Template"><?php echo __('Map Region','asl_admin') ?></label>
							    <select  id="asl-map_region" name="data[map_region]" class="custom-select">
							      <option value=""><?php echo __('None','asl_admin') ?></option>
							      <?php foreach($countries as $country): ?>
							      <option value="<?php echo $country->code ?>"><?php echo $country->country ?></option>
							      <?php endforeach ?>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="sort_by"><?php echo __('Sort List','asl_admin') ?></label>
							    <select  id="asl-sort_by" name="data[sort_by]" class="custom-select">
							      <option value=""><?php echo __('Default (Distance)','asl_admin') ?></option>
							      <option value="id"><?php echo __('Store ID','asl_admin') ?></option>
							      <option value="title"><?php echo __('Title','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Sort your listing based on fields, distance is default.','asl_admin') ?>)</p>
							  </div>

							  <div class="col-md-4 form-group mb-4">
							    <label for="display_list"><?php echo __('Display List','asl_admin') ?></label>
							    <select id="asl-display_list" name="data[display_list]" class="custom-select">
							      <option value="1"><?php echo __('Yes','asl_admin') ?></option>
							      <option value="0"><?php echo __('No','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="prompt_location"><?php echo __('Geolocation','asl_admin') ?></label>
							    <select  id="asl-prompt_location" name="data[prompt_location]" class="custom-select">
							      <option value="0"><?php echo __('NONE','asl_admin') ?></option>
							      <option value="1"><?php echo __('GEOLOCATION DIALOG','asl_admin') ?></option>
							      <option value="2"><?php echo __('TYPE YOUR LOCATION Dialog','asl_admin') ?></option>
							      <option value="3"><?php echo __('GEOLOCATION WITHOUT DIALOG','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('GEOLOCATION ONLY WORKS WITH HTTPS CONNECTION','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="search_destin"><?php echo __('Search Result','asl_admin') ?></label>
							    <select  id="asl-search_destin" name="data[search_destin]" class="custom-select">
							      <option value="0"><?php echo __('Default','asl_admin') ?></option>
							      <option value="1"><?php echo __('Show My Nearest Location From Search','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('In search address point to my nearest markers','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="geo_button"><?php echo __('Field Button Type','asl_admin') ?></label>
							    <select  id="asl-geo_button" name="data[geo_button]" class="custom-select">
							      <option value="1"><?php echo __('Geo-Location','asl_admin') ?></option>
							      <option value="0"><?php echo __('Search Location','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="week_hours"><?php echo __('Display Hours','asl_admin') ?></label>
							    <select  id="asl-week_hours" name="data[week_hours]" class="custom-select">
							      <option value="0"><?php echo __('Today','asl_admin') ?></option>
							      <option value="1"><?php echo __('7 Days','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="asl-zoom_li"><?php echo __('Clicked Zoom','asl_admin') ?></label>
							    <select  id="asl-zoom_li" name="data[zoom_li]" class="custom-select">
							      <?php for($index = 2;$index <= 20;$index++):?>
							      <option value="<?php echo $index ?>"><?php echo $index ?></option>
							      <?php endfor; ?>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Zoom Value when List Item is Clicked, use zoom_li="10" in ShortCode','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="asl-search_zoom"><?php echo __('Search Zoom','asl_admin') ?></label>
							    <select  id="asl-search_zoom" name="data[search_zoom]" class="custom-select">
							      <?php for($index = 2;$index <= 20;$index++):?>
							      <option value="<?php echo $index ?>"><?php echo $index ?></option>
							      <?php endfor; ?>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Zoom value when Search is performed','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="search_type"><?php echo __('Search Type','asl_admin') ?></label>
							    <select  name="data[search_type]" id="asl-search_type" class="custom-select">
							      <option value="0"><?php echo __('Search By Address (Google)','asl_admin') ?></option>
							      <option disabled="disabled" value="1"><?php echo __('Search By Store Name (Database)','asl_admin') ?></option>
							      <option disabled="disabled" value="2"><?php echo __('Search By Stores Cities, States (Database)','asl_admin') ?></option>
							      <option value="3"><?php echo __('Geocoding on Enter key (Google Geocoding API)','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Search by Either Address or Store Name, use search_type="1" in ShortCode','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Full Height','asl_admin') ?></label>
							    <select  name="data[full_height]" id="asl-full_height" class="custom-select">
							      <option value=""><?php echo __('None','asl_admin') ?></option>
							      <option value="full-height"><?php echo __('Full Height (Not Fixed)','asl_admin') ?></option>
							      <option value="full-height asl-fixed"><?php echo __('Full Height (Fixed)','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Restrict Search','asl_admin') ?></label>
							      <input  type="text" class="form-control validate[minSize[2]]" maxlength="2" name="data[country_restrict]" id="asl-country_restrict" placeholder="Example: US">
							    <p class="help-p">(<?php echo __('Enter 2 alphabet country','asl_admin') ?> <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" target="_blank" rel="nofollow">Code</a>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Map/List Order (Mobile Only)','asl_admin') ?></label>
							    <select  name="data[map_top]" id="asl-map_top" class="custom-select">
							      <option value="0"><?php echo __('List Top, Map Bottom','asl_admin') ?></option>
							      <option value="2"><?php echo __('Map Top, List Bottom','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Stop list loading before search.','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Store Direction','asl_admin') ?></label>
							    <select  name="data[direction_redirect]" id="asl-direction_redirect" class="custom-select">
							      <option value="0"><?php echo __('Show in Direction Panel','asl_admin') ?></option>
							      <option value="1"><?php echo __('Open in Google Maps (mobile)','asl_admin') ?></option>
							      <option value="2"><?php echo __('Open in Google Maps (mobile & desktop)','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Stop list loading before search.','asl_admin') ?>)</p>
							  </div>
							</div>
							<div class="row">
								<div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[full_width]" id="asl-full_width">
									  <label class="custom-control-label" for="asl-full_width"><?php echo __('Full Width','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[scroll_wheel]" id="asl-scroll_wheel">
									  <label class="custom-control-label" for="asl-scroll_wheel'),"><?php echo __('Mouse Scroll','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[target_blank]" id="asl-target_blank">
									  <label class="custom-control-label" for="asl-target_blank"><?php echo __('Open Link New Tab','asl_admin') ?></label>
									</div>
							  </div>
							</div>
							<div class="row">
          			<div class="col-12">
          				<button type="button" class="btn btn-primary float-right" data-loading-text="<?php echo __('Saving...','asl_admin') ?>" data-completed-text="Settings Updated" id="btn-asl-user_setting"><?php echo __('Save Settings','asl_admin') ?></button>
          			</div>
          		</div>
          	</form>
          	<form id="asl-advance-features">
          		<h6 class="alert alert-info mt-4 mb-4"><?php echo __('ADVANCED PRO VERSION FEATURES','asl_admin') ?></h6>
							<div class="row mt-4">
								<div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Server Key','asl_admin') ?></label>
							    <input  type="text" class="form-control" name="data[server_key]" id="asl-server_key" placeholder="<?php echo __('Server API KEY (Geocoding)','asl_admin') ?>">
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="distance_control"><?php echo __('Distance Control','asl_admin') ?></label>
							    <select  id="asl-distance_control" name="data[distance_control]" class="custom-select">
							      <option value="0"><?php echo __('Slider','asl_admin') ?></option>
							      <option value="1"><?php echo __('Dropdown','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted"><?php echo __('Choose Either Slider or Dropdown for Radius Miles/KM','asl_admin') ?><br>
							    <a target="_blank" class="text-muted" href="https://agilestorelocator.com/wiki/set-radius-value-distance-range-slider/"><?php echo __('To Set Maximum value for Search Range Slider','asl_admin') ?></a></p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Search Dropdown Options','asl_admin') ?></label>
							    <input type="text" class="form-control" name="data[dropdown_range]" id="asl-dropdown_range" placeholder="Example: 10,20,30">
							    <p class="help-p text-muted"><?php echo __('Enter the Search dropdown Options number, Comma Separated. Add default value with * symbol.','asl_admin') ?>
							    <?php echo __('Default Value Example: *10,20,30 . Here 10 is default value','asl_admin') ?></p>
							  </div>
							  
							  <div class="col-md-4 form-group mb-4">
							    <label for="stores_limit"><?php echo __('Stores Limit (Show Limit Stores Only)','asl_admin') ?></label>
							    <input  type="number" class="form-control validate[integer]" name="data[stores_limit]" id="asl-stores_limit">
							    <p class="help-p text-muted">(<?php echo __('Default is NULL, Option will display given Store count only, for only mobile use attribute mobile_stores_limit="10" in shortcode','asl_admin') ?>)</p>
							  </div>

							  
							  
							  
							  <div class="col-md-4 form-group mb-4">
							    <label for="load_all"><?php echo __('Marker Load','asl_admin') ?></label>
							    <select  name="data[load_all]" id="asl-load_all" class="custom-select">
							      <option value="1"><?php echo __('Load All','asl_admin') ?></option>
							      <option value="2"><?php echo __('Load Markers with Search Area Button','asl_admin') ?></option>
							      <option value="0"><?php echo __('Load on Bound','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Use Load on Bound in case of 1000 plus markers','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label for="single_cat_select"><?php echo __('Category Select','asl_admin') ?></label>
							    <select  name="data[single_cat_select]" id="asl-single_cat_select" class="custom-select">
							      <option value="0"><?php echo __('Multiple Category Selection','asl_admin') ?></option>
							      <option value="1"><?php echo __('Single Category Selection','asl_admin') ?></option>
							    </select>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Search Field','asl_admin') ?></label>
							    <select  name="data[google_search_type]" id="asl-google_search_type" class="custom-select">
							      <option value=""><?php echo __('All','asl_admin') ?></option>
							      <option value="cities"><?php echo __('Cities (Cities)','asl_admin') ?></option>
							      <option value="regions"><?php echo __('Regions (Locality, City, State)','asl_admin') ?></option>
							      <option value="geocode"><?php echo __('Geocode','asl_admin') ?></option>
							      <option value="address"><?php echo __('Address','asl_admin') ?></option>
							    </select>
							  </div>
							  

							  
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('Reduce Query (Admin)','asl_admin') ?></label>
							    <select  name="data[cat_in_grid]" id="asl-cat_in_grid" class="custom-select">
							      <option value="1"><?php echo __('Show Category','asl_admin') ?></option>
							      <option value="0"><?php echo __('Hide Category','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Show/Hide category in admin listing to reduce query stress on manage stores.','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							    <label><?php echo __('List Load','asl_admin') ?></label>
							    <select  name="data[first_load]" id="asl-first_load" class="custom-select">
							      <option value="1"><?php echo __('Default','asl_admin') ?></option>
							      <option value="2"><?php echo __('Prevent List Load Only','asl_admin') ?></option>
							      <option value="3"><?php echo __('Prevent List Load with Full Map','asl_admin') ?></option>
							    </select>
							    <p class="help-p text-muted">(<?php echo __('Stop list loading before search.','asl_admin') ?>)</p>
							  </div>
							</div>
							<div class="row">
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[show_categories]" id="asl-show_categories">
									  <label class="custom-control-label" for="asl-show_categories"><?php echo __('Show Categories','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[time_switch]" id="asl-time_switch">
									  <label class="custom-control-label" for="asl-time_switch"><?php echo __('Time Switch','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[additional_info]" id="asl-additional_info">
									  <label class="custom-control-label" for="asl-additional_info"><?php echo __('Additional Info','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[advance_filter]" id="asl-advance_filter">
									  <label class="custom-control-label" for="asl-advance_filter"><?php echo __('Advance Filter','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[category_marker]" id="asl-category_marker">
									  <label class="custom-control-label" for="asl-category_marker"><?php echo __('Category Marker','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[distance_slider]" id="asl-distance_slider">
									  <label class="custom-control-label" for="asl-distance_slider"><?php echo __('Distance Slider','asl_admin') ?></label>
									</div>
							  </div>
							  
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[analytics]" id="asl-analytics">
									  <label class="custom-control-label" for="asl-analytics"><?php echo __('Analytics','asl_admin') ?></label>
									</div>
							  </div>

							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[sort_by_bound]" id="asl-sort_by_bound">
									  <label class="custom-control-label" for="asl-sort_by_bound"><?php echo __('Sort By Bound','asl_admin') ?></label>
									</div>
							  </div>
							  
							  <div class="col-md-4 form-group mb-4">
							    <div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[user_center]" id="asl-user_center">
									  <label class="custom-control-label" for="asl-user_center"><?php echo __('Default Location Marker','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[smooth_pan]" id="asl-smooth_pan">
									  <label class="custom-control-label" for="asl-smooth_pan"><?php echo __('Smooth Marker Pan','asl_admin') ?></label>
									</div>
							  </div>

							  <div class="col-md-4 form-group mb-4 hide">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[filter_result]" id="asl-filter_result">
									  <label class="custom-control-label" for="asl-filter_result"><?php echo __('Filter Location Result','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[remove_maps_script]" id="asl-remove_maps_script">
									  <label class="custom-control-label" for="asl-remove_maps_script"><?php echo __('Remove Other Maps Scripts','asl_admin') ?></label>
									</div>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[radius_circle]" id="asl-radius_circle">
									  <label class="custom-control-label" for="asl-radius_circle"><?php echo __('Radius Circle','asl_admin') ?></label>
									</div>
							    <p class="help-p text-muted">(<?php echo __('Radius Circle will only appear with Dropdown Control.','asl_admin') ?>)</p>
							  </div>
							  <div class="col-md-4 form-group mb-4">
							  	<div class="custom-control custom-checkbox">
									  <input type="checkbox" value="1" class="custom-control-input" name="data[search_2]" id="asl-radius_circle">
									  <label class="custom-control-label" for="asl-radius_circle"><?php echo __('Search by Name','asl_admin') ?></label>
									</div>
							    <p class="help-p text-muted">(<?php echo __('Another search field for search by name [ASL_STORELOCATOR search_2="1"] .','asl_admin') ?>)</p>
							  </div>
          		</div>
          		<div class="row mb-4">
          			<div class="col-md-4">
          					<div class="form-group">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="asl-template"><?php echo __('Template','asl_admin') ?></label>
                            </div>
                            <select id="asl-template" class="custom-select col-12" name="data[template]">
                                <option value="0"><?php echo __('Template','asl_admin') ?> 0</option>
                                <option value="1"><?php echo __('Template','asl_admin') ?> 1</option>
                                <option value="2"><?php echo __('Template','asl_admin') ?> 2</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <label for="asl-layout" class="input-group-text"><?php echo __('Layout','asl_admin') ?></label>
                            </div>
                            <select id="asl-layout" class="custom-select" name="data[layout]">
                                <option value="0"><?php echo __('List Format','asl_admin') ?></option>
                                <option value="1"><?php echo __('Accordion Format','asl_admin') ?></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                    	<div class="template-box box_layout_0">
										    <div class="form-group mb-3 color_scheme">
										      <label><?php echo __('Color Scheme','asl_admin') ?></label>
										      <div class="a-radio-select">
										        <?php for($_ind = 0; $_ind <= 9; $_ind++): ?>
										        <span>
										          <input type="radio" id="asl-color_scheme-<?php echo $_ind ?>" value="<?php echo $_ind ?>" name="data[color_scheme]">
										          <label class="color-box color-<?php echo $_ind ?>" for="asl-color_scheme-<?php echo $_ind ?>"></label>
										        </span>
										        <?php endfor; ?>
										      </div>

										    </div>
										    <div class="form-group mb-3 Font_color">
											    <label><?php echo __('Font Colors','asl_admin') ?></label>
											    <div class="a-radio-select">
											      <?php for($_ind = 0; $_ind <= 4; $_ind++): ?>
											      <span>
											        <input type="radio" id="asl-font_color_scheme-<?php echo $_ind ?>" value="<?php echo $_ind ?>" name="data[font_color_scheme]">
											        <label class="font-color-box color-<?php echo $_ind ?>" for="asl-font_color_scheme-<?php echo $_ind ?>"></label>
											      </span>
											      <?php endfor; ?>
											    </div>
											  </div>
										  </div>
										  <div class="template-box box_layout_1 hide">
										    <div class="form-group mb-3 color_scheme layout_2">
										      <label><?php echo __('Color Scheme','asl_admin') ?></label>
										      <div class="a-radio-select">
										        <?php for($_ind = 0; $_ind <= 9; $_ind++): ?>
										        <span>
										          <input type="radio" id="asl-color_scheme_1-<?php echo $_ind ?>" value="<?php echo $_ind ?>" name="data[color_scheme_1]">
										          <label class="color-box color-<?php echo $_ind ?>" for="asl-color_scheme_1-<?php echo $_ind ?>">
										          	<i class="actv"></i>
										            <span class="co_1"></span>
										            <span class="co_2"></span>
										          </label>
										        </span>
										        <?php endfor; ?>
										      </div>
										    </div>
										  </div>
										  <div class="template-box box_layout_2 hide">
										    <div class="form-group map_layout mb-3 color_scheme layout_2">
										      <label><?php echo __('Color Scheme','asl_admin') ?></label>
										      <div class="a-radio-select">
										        <?php 
										        $tmpl_2_colors = array(
										          '0' => array('#CC3333', '#542733'),
										          '1' => array('#008FED', '#2580C3'),
										          '2' => array('#93628F', '#4A2849'),
										          '3' => array('#FF9800', '#FFC107'),
										          '4' => array('#01524B', '#75C9D3'),
										          '5' => array('#ED468B', '#FDCC29'),
										          '6' => array('#D55121', '#FB9C6C'),
										          '7' => array('#D13D94', '#AD0066'),
										          '8' => array('#99BE3B', '#01735A'),
										          '9' => array('#3D5B99', '#EFF1F6')
										        );
										        foreach($tmpl_2_colors as $_ct => $ctv):
										        ?>
										        <span>
										          <input type="radio" id="asl-color_scheme_2-<?php echo $_ct ?>" value="<?php echo $_ct ?>" name="data[color_scheme_2]">
										          <label class="color-box color-<?php echo $_ct ?>" for="asl-color_scheme_2-<?php echo $_ct ?>" style="background-color:<?php echo $ctv[0] ?>">
										          	<i class="actv"></i>
										            <span class="co_1" style="background-color:<?php echo $ctv[2] ?>"></span>
										          </label>
										        </span>
										      <?php endforeach; ?>
										      </div>
										    </div>
										  </div>
										  <p class="help-p text-muted"><?php echo __('Colors Missing? Create your own color ','asl_admin') ?><a target="_blank" href="https://agilestorelocator.com/store-locator-color-maker/"><?php echo __('Color Maker','asl_admin') ?></a></p>
                    </div>
                </div>
                <div class="col-md-4 justify-content-md-center text-center">
                    <figure class="figure">
                        <img  id="asl-tmpl-img" src="<?php echo ASL_URL_PATH ?>admin/images/asl-tmpl-0-0.png" alt="Thumbnail" class="figure-img img-fluid rounded">
                        <figcaption class="figure-caption text-center"><?php echo __('Selected Store Locator','asl_admin') ?></figcaption>
                    </figure>
                </div>
          		</div>
          		<div class="row">
          			<div class="col-md-12 form-group mb-3 map_layout">
							    <label ><?php echo __('Map Layout','asl_admin') ?></label>
							    <div class="row">
							    	<div class="col-md-8 a-radio-select">
								      <input type="radio" id="asl-map_layout-0" value="0" name="data[map_layout]"><label for="asl-map_layout-0"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/25-blue-water/25-blue-water.png" /></label>
								      <input type="radio" id="asl-map_layout-1" value="1" name="data[map_layout]"><label for="asl-map_layout-1"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/Flat Map/53-flat-map.png" /></label>
								      <input type="radio" id="asl-map_layout-2" value="2" name="data[map_layout]"><label for="asl-map_layout-2"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/Icy Blue/7-icy-blue.png" /></label>
								      <input type="radio" id="asl-map_layout-3" value="3" name="data[map_layout]"><label for="asl-map_layout-3"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/Pale Dawn/1-pale-dawn.png" /></label>
								      <input type="radio" id="asl-map_layout-4" value="4" name="data[map_layout]"><label for="asl-map_layout-4"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/cladme/6618-cladme.png" /></label>
								      <input type="radio" id="asl-map_layout-5" value="5" name="data[map_layout]"><label for="asl-map_layout-5"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/light monochrome/29-light-monochrome.png" /></label>
								      <input type="radio" id="asl-map_layout-6" value="6" name="data[map_layout]"><label for="asl-map_layout-6"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/mostly grayscale/4183-mostly-grayscale.png" /></label>
								      <input type="radio" id="asl-map_layout-7" value="7" name="data[map_layout]"><label for="asl-map_layout-7"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/turquoise water/8-turquoise-water.png" /></label>
								      <input type="radio" id="asl-map_layout-8" value="8" name="data[map_layout]"><label for="asl-map_layout-8"><span class="actv"></span><img src="<?php echo ASL_URL_PATH ?>admin/images/map/unsaturated browns/70-unsaturated-browns.png" /></label>
								      <input type="radio" id="asl-map_layout-9" value="9" name="data[map_layout]"><label for="asl-map_layout-9"><span class="actv"></span><span class="ml-custom"><b><?php echo __('Custom','asl_admin') ?><?php echo __('Custom','asl_admin') ?></b></span></label>
								    </div>
								    <div class="col-md-4">
								    	<div class="form-group mb-3">
                        <label for="asl-map_layout_custom"><?php echo __('Google Map Custom','asl_admin') ?></label>
                        <textarea id="asl-map_layout_custom" style="width: 100%" rows="6"  placeholder="<?php echo __('Google Style','asl_admin') ?>" maxlength="500" class="input-medium form-control"></textarea>
                    	</div>
								    </div>
							    </div>
							  </div>
          		</div>
          		<div class="row">
          			<div class="col-md-12 form-group mb-3 infobox_layout">
          				<label ><?php echo __('Infobox Layout','asl_admin') ?></label>
							    <div class="a-radio-select">
							      <input type="radio" id="asl-infobox_layout-0" value="0" name="data[infobox_layout]"><label for="asl-infobox_layout-0"><img src="<?php echo ASL_URL_PATH ?>/admin/images/infobox_1.png" /></label>
							      <input type="radio" id="asl-infobox_layout-2" value="2" name="data[infobox_layout]"><label for="asl-infobox_layout-2"><img src="<?php echo ASL_URL_PATH ?>/admin/images/infobox_2.png" /></label>
							      <input type="radio" id="asl-infobox_layout-1" value="1" name="data[infobox_layout]"><label for="asl-infobox_layout-1"><img src="<?php echo ASL_URL_PATH ?>/admin/images/infobox_3.png" /></label>
							    </div>
							  </div>
          		</div>
          	</form>
          </div>
        </div>
      </div>

      <div class="col-12 asl-faq-sec">
      	<div class="card p-0 mb-4">
					<h3 class="card-title"><?php echo __('FAQ & Help','asl_admin') ?></h3>
          <div class="card-body">
						<div class="alert alert-info" role="alert"><?php echo __('Support Forum for new features or troubleshooting.','asl_admin') ?> <a target="_blank" href="https://wordpress.org/support/plugin/agile-store-locator"><?php echo __('Create a ticket','asl_admin') ?></a></div>
						<ul class="asl-faq">
					    <li><a target="_blank" href="https://agilestorelocator.com/blog/enable-google-maps-api-agile-store-locator-plugin/">Why Google Maps not working properly?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/store-locator-doesnot-appear/">Why doesn't store locator appear at all with the shortcode?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/custom-color-store-locator/">My required color scheme is not available in the Color Pallet.</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/remove-hours-store-list/">How to remove hours from the Store List?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/blog/ssl-must-geolocation-api-chrome-browser/">Why Geo-Location feature not working?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/can-import-stores-using-excel-sheet/">How can I import using Excel Sheet?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/change-words-text-store-locator/">How can I change the words of Store Locator?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/load-google-maps-app-mobile-direction/">How to load direction in Google Maps App instead of Store Locator?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/change-address-format/">How can I change Address format?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/blog/customize-google-marker-infowindow-sidebar-store-locator/">How to show additional information in listing or Info-Window?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/accordion-layout-stores-not-assigned-properly/">In accordion Layout, the Stores are not assigned properly to Cities.</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/show-limited-stores-sort-by-distance/">How to Show only 10 Stores sort by distance?</a></li>
					    <li><a target="_blank" href="https://agilestorelocator.com/wiki/"><< <?php echo __('DOCUMENTATION','asl_admin') ?> >> </a></li>
					  </ul>
					  <div class="row">
					  	<div class="col-12">
					    <p class="text-muted">If you have any problem with the plugin or suggestion, please create a ticket at <a  target="_blank" href="https://wordpress.org/support/plugin/agile-store-locator/">Forum</a>
					    We will respond as soon as possible to resolve your problem.</p>
						  </div>
					  </div>
          </div>
        </div>  
      </div>

      <div class="col-12 asl-pro-features">
      	<div class="card p-0 mb-4">
					<h3 class="card-title"><?php echo __('Pro Version Features','asl_admin') ?></h3>
          <div class="card-body">
						<p>You can upgrade to pro version any time for these extra features, that are available in pro version, upgrading to pro version is very easy, and can be done in a few minutes, without re-uploading any data or re-setting the existing configuration.</p>
						<div class="row">
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-0.png">
							</div>
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-2.png">
							</div>
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-1.png">
							</div>
							
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-3.png">
							</div>
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-4.png">
							</div>
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-6.png">
							</div>
							<div class="col-md-4">
								<img src="<?php echo ASL_URL_PATH ?>admin/images/pro/pro-5.png">
							</div>
						</div>
						<div class="row">
							<div class="col-md-12 text-center">
								<a target="_blank" href="https://codecanyon.net/item/agile-store-locator-google-maps-for-wordpress/16973546" class="btn btn-large btn-primary">UPGRADE NOW</a>
							</div>
						</div>
          </div>
        </div>  
      </div>
    </div>
	</div>
</div>

<!-- SCRIPTS -->
<script type="text/javascript">
	var ASL_Instance = {
		url: '<?php echo ASL_URL_PATH ?>'
	},
	asl_configs =  <?php echo json_encode($all_configs); ?>;
	window.addEventListener("load", function() {
	asl_engine.pages.user_setting(asl_configs);
	});
     
</script>