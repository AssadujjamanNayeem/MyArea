<div class="asl-p-cont asl-new-bg">
  <div class="hide">
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="i-trash" viewBox="0 0 32 32" width="16" height="16" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
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
					<h3 class="card-title"><?php echo __('Edit Store','asl_admin') ?></h3>
          <div class="card-body">
              <form id="frm-addstore">
              		<div class="row">
										<div class="col-md-8">
											<div class="alert alert-dismissable alert-danger hide">
												 <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
												<h4><?php echo __('Alert!','asl_admin') ?></h4> <strong><?php echo __('Warning!','asl_admin') ?></strong><?php echo __('Best check yourself ','asl_admin') ?><a href="#" class="alert-link"><?php echo __('alert link','asl_admin') ?></a>
											</div>
										</div>
									</div>
              		<input type="hidden" id="update_id" value="<?php echo $store->id ?>" />
              		<div class="card-title mb-3"><?php echo __('Store Details','asl_admin') ?></div>
                  <div class="row">
                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_title"><?php echo __('Title','asl_admin') ?></label>
                        <input type="text" id="txt_title" value="<?php echo $store->title ?>" name="data[title]" class="form-control">
                    </div>

                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_website"><?php echo __('Website','asl_admin') ?></label>
                        <input type="text" id="txt_website" value="<?php echo $store->website ?>" name="data[website]" placeholder="http://example.com" class="form-control">
                    </div>

                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_description"><?php echo __('Description','asl_admin') ?></label>
                        <textarea id="txt_description" name="data[description]" rows="3"  placeholder="Enter Description" maxlength="500" class="input-medium form-control"><?php echo $store->description; ?></textarea>
                    </div>

                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_description_2"><?php echo __('Additional Description','asl_admin') ?></label>
                        <textarea id="txt_description_2" name="data[description_2]" rows="3"  placeholder="Additional Description" maxlength="500" class="input-medium form-control"><?php echo $store->description_2; ?></textarea>
                    </div>

                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_phone"><?php echo __('Phone','asl_admin') ?></label>
                        <input type="text" id="txt_phone" value="<?php echo $store->phone ?>" name="data[phone]" class="form-control">
                        
                    </div>
                    
                    <div class="col-md-6 form-group mb-3">
                        <label for="txt_fax"><?php echo __('Fax','asl_admin') ?></label>
                        <input type="text"  id="txt_fax" value="<?php echo $store->fax ?>" name="data[fax]" class="form-control">
                    </div>
                  </div>

                  <div class="card-title mb-3 mt-3"><?php echo __('Store Address','asl_admin') ?></div>
                  <div class="row">

                  	<div class="col-md-6 form-group mb-3">
                        <label for="txt_email"><?php echo __('Email','asl_admin') ?></label>
                        <input type="text" id="txt_email" value="<?php echo $store->email ?>" name="data[email]" class="form-control validate[custom[email]]">
                    </div>
                  	<div class="col-md-6 form-group mb-3">
                        <label for="txt_street"><?php echo __('Street','asl_admin') ?></label>
                        <input type="text" id="txt_street" value="<?php echo $store->street ?>" name="data[street]" class="form-control">
                    </div>
                    
                    <div class="col-md-6 form-group mb-3">
                      <label for="txt_city"><?php echo __('City','asl_admin') ?></label>
                      <input type="text" id="txt_city" value="<?php echo $store->city ?>" name="data[city]" class="form-control validate[required]">
                    </div>

                    <div class="col-md-6 form-group mb-3">
                      <label for="txt_state"><?php echo __('State','asl_admin') ?></label>
                      <input type="text" id="txt_state" value="<?php echo $store->state ?>" name="data[state]" class="form-control">
                    </div>

                    <div class="col-md-6 form-group mb-3">
                      <label for="txt_postal_code"><?php echo __('Postal Code','asl_admin') ?></label>
                      <input type="text" id="txt_postal_code" value="<?php echo $store->postal_code ?>" name="data[postal_code]" class="form-control">
                    </div>

                    <div class="col-md-6 form-group mb-3">
                      <label for="txt_country"><?php echo __('Country','asl_admin') ?></label>
                      <select id="txt_country" style="width:100%" name="data[country]" class="custom-select validate[required]">
									      <option value=""><?php echo __('Select Country','asl_admin') ?></option>  
									      <?php foreach($countries as $country): ?>
									        <option <?php if($store->country == $country->id) echo 'selected' ?> value="<?php echo $country->id ?>"><?php echo $country->country ?></option>
									      <?php endforeach ?>
									    </select>
                    </div>
                  	<div class="form-group mt-3 col-12">
										  <div id="map_canvas" class="map_canvas"></div>
										</div>	
                    <div class="col-md-6 form-group mb-3">
                      <label for="asl_txt_lat"><?php echo __('Latitude','asl_admin') ?></label>
                      <input type="text" id="asl_txt_lat" value="<?php echo $store->lat ?>" name="data[lat]" value="0.0" readonly="true" class="form-control">
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label for="asl_txt_lng"><?php echo __('Longitude','asl_admin') ?></label>
                      <input type="text" id="asl_txt_lng" value="<?php echo $store->lng ?>" name="data[lng]" value="0.0" readonly="true" class="form-control">
                    </div>
                    <div class="col-12">
                    		<a id="lnk-edit-coord" class="btn float-right btn-warning"><?php echo __('Change Coordinates','asl_admin') ?></a>
                    </div>
                    <div class="col-12">
                    		<div class="dump-message"></div>
                    </div>
                  </div>

                  <div class="card-title mt-3 mb-3"><?php echo __('Other Details','asl_admin') ?></div>
                  <div class="row">
                  	<div class="col-md-6 form-group mb-3">
                    	<div class="form-group">
											  <label for="ddl-asl-markers"><?php echo __('Marker','asl_admin') ?></label>
											  	<div class="input-group">
											    <img src="<?php echo ASL_URL_PATH.'admin/images/ph-marker.png' ?>" alt="marker">
											    </div>
											</div>
                    </div>

                    <div class="col-md-6 form-group mb-3">
										  <label for="ddl-asl-logos"><?php echo __('Logo','asl_admin') ?></label>
										  <div class="input-group">
										    <img src="<?php echo ASL_URL_PATH.'admin/images/ph-logo.png' ?>" alt="marker">
										  </div>
										</div>
										<div class="col-md-6 form-group mb-3">
                      <label for="ddl_categories"><?php echo __('Category','asl_admin') ?></label>
                      <select name="ddl_categories"  id="ddl_categories" multiple class="chosen-select-width form-control">                     
									      <?php foreach($category as $catego): ?>
									        <option 
								            	<?php foreach($storecategory as $scategory ){ ?>
								            		<?php if($scategory->category_id == $catego->id) echo 'selected' ?>
								            	<?php }?>
								            	value="<?php echo $catego->id ?>"><?php echo $catego->category_name ?></option>
									      <?php endforeach ?>
									    </select>
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <label for="txt-ordering"><?php echo __('Priority Order','asl_admin') ?></label>
                      <input type="number" id="txt-ordering" name="data[ordr]" value="<?php echo $store->ordr ?>" placeholder="0" class="form-control validate[integer]">
                      <small class="form-text text-muted"><?php echo __('Descending Order for the list, higher number on top.','asl_admin') ?></small>
                    </div>
                    <div class="col-md-6 form-group mb-3">
                      <div class="custom-control custom-checkbox">
											  <input type="checkbox" class="custom-control-input" <?php if($store->is_disabled == 1) echo 'checked' ?> name="data[is_disabled]" id="chk_disabled">
											  <label class="custom-control-label" for="chk_disabled"><?php echo __('Disabled','asl_admin') ?></label>
											</div>
                    </div>
                    <?php foreach($fields as $field): ?>
                      <div class="col-md-6 form-group mb-3">
                        <label for="custom-f-<?php echo $field['name'] ?>"><?php echo $field['label'] ?></label>
                        <input type="text" value="<?php echo isset($custom_data[$field['name']])? $custom_data[$field['name']]: '' ?>" id="custom-f-<?php echo $field['name'] ?>" name="asl-custom[<?php echo $field['name'] ?>]"  class="form-control">
                      </div>
                    <?php endforeach; ?>
                  </div>
                  <div class="card-title mt-3 mb-3"><?php echo __('Store Timing','asl_admin') ?></div>
                  <?php
                    $open_hours = json_decode($store->open_hours);
                  ?>
                  <div class="row">
                  	<div class="col-12">
                      <div class="table-responsive">
  	                  	<table class="table table-bordered table-stripped asl-time-details">
  											  <tbody>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Monday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="mon">
  																<?php 
  																if(is_array($open_hours->mon))
  																foreach($open_hours->mon as $mon): $o_hour = explode(' - ', $mon); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  											          </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  										              <div class="a-swith">
  								                    <input id="cmn-toggle-0" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->mon && $open_hours->mon == '1') echo 'checked="checked"' ?>>
  								                    <label for="cmn-toggle-0"></label>
  								                    <span><?php echo __('Closed','asl_admin') ?></span>
  								                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  										              </div>
  											          </div>
  											        </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											      
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Tuesday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="tue">
  											        	<?php 
  																if(is_array($open_hours->tue))
  																foreach($open_hours->tue as $tue): $o_hour = explode(' - ', $tue); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  											          </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  										              <div class="a-swith">
  								                    <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->tue && $open_hours->tue == '1') echo 'checked="checked"' ?>>
  								                    <label for="cmn-toggle-1"></label>
  								                    <span><?php echo __('Closed','asl_admin') ?></span>
  								                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  										              </div>
  											          </div>
  											        </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Wednesday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="wed">
  											        	<?php 
  																if(is_array($open_hours->wed))
  																foreach($open_hours->wed as $wed): $o_hour = explode(' - ', $wed); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
                                      <svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
                                    </span>
                                  </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  											            <div class="a-swith">
  									                    <input id="cmn-toggle-2" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->wed && $open_hours->wed == '1') echo 'checked="checked"' ?>>
  									                    <label for="cmn-toggle-2"></label>
  									                    <span><?php echo __('Closed','asl_admin') ?></span>
  									                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  									                </div>
  											          </div>
  											        </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Thursday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="thu">
  											        	<?php 
  																if(is_array($open_hours->thu))
  																foreach($open_hours->thu as $thu): $o_hour = explode(' - ', $thu); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  											          </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  											              <div class="a-swith">
  									                    <input id="cmn-toggle-3" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->thu && $open_hours->thu == '1') echo 'checked="checked"' ?>>
  									                    <label for="cmn-toggle-3"></label>
  									                    <span><?php echo __('Closed','asl_admin') ?></span>
  									                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  										                </div>
  											            </div>
  											          </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											      
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Friday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="fri">
  											        	<?php 
  																if(is_array($open_hours->fri))
  																foreach($open_hours->fri as $fri): $o_hour = explode(' - ', $fri); ?>
  										          	<div class="form-group">
  										            	<div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  										            </div>
  										            <?php endforeach; ?>
  										            <div class="asl-closed-lbl">
  										              <div class="a-swith">
  										                    <input id="cmn-toggle-4" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->fri && $open_hours->fri == '1') echo 'checked="checked"' ?>>
  										                    <label for="cmn-toggle-4"></label>
  										                    <span><?php echo __('Closed','asl_admin') ?></span>
  										                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  										                </div>
  										            </div>
  											        </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Saturday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="sat">
  											        	<?php 
  																if(is_array($open_hours->sat))
  																foreach($open_hours->sat as $sat): $o_hour = explode(' - ', $sat); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  											          </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  											              <div class="a-swith">
  									                    <input id="cmn-toggle-5" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->sat && $open_hours->sat == '1') echo 'checked="checked"' ?>>
  									                    <label for="cmn-toggle-5"></label>
  									                    <span><?php echo __('Closed','asl_admin') ?></span>
  									                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  											              </div>
  											          </div>
  											        </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											      
  											    </tr>
  											    <tr>
  											      <td colspan="1"><span class="lbl-day"><?php echo __('Sunday','asl_admin') ?></span></td>
  											      <td colspan="3">
  											        <div class="asl-all-day-times" data-day="sun">
  											        	<?php 
  																if(is_array($open_hours->sun))
  																foreach($open_hours->sun as $sun): $o_hour = explode(' - ', $sun); ?>
  											          <div class="form-group">
  											            <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[0] ?>" class="form-control asltimepicker validate[required,funcCall[ASLmatchTime]]" placeholder="<?php echo __('Start Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <div class="input-group bootstrap-asltimepicker">
  									                  <input type="text" value="<?php echo $o_hour[1] ?>" class="form-control asltimepicker validate[required]" placeholder="<?php echo __('End Time','asl_admin') ?>">
  									                  <span class="input-group-append add-on"><span class="input-group-text"><svg width="16" height="16"><use xlink:href="#i-clock"></use></svg></span></span>
  									                </div>
  									                <span class="add-k-delete glyp-trash">
  									                	<svg width="16" height="16"><use xlink:href="#i-trash"></use></svg>
  									                </span>
  											          </div>
  											          <?php endforeach; ?>
  											          <div class="asl-closed-lbl">
  											              <div class="a-swith">
  											                    <input id="cmn-toggle-6" class="cmn-toggle cmn-toggle-round" type="checkbox" <?php if($open_hours->sun && $open_hours->sun == '1') echo 'checked="checked"' ?>>
  											                    <label for="cmn-toggle-6"></label>
  											                    <span><?php echo __('Closed','asl_admin') ?></span>
  											                    <span><?php echo __('Open 24 Hour','asl_admin') ?></span>
  											                </div>
  											            </div>
  											          </div>
  											      </td>
  											      <td>
  											      	<span class="add-k-add glyp-add">
  							                	<svg width="16" height="16"><use xlink:href="#i-plus"></use></svg>
  							                </span>
  											      </td>
  											      
  											    </tr>
  											  </tbody>
  											</table>
                      </div>
										</div>
                  </div>
                  <div class="row">
                  	<div class="col-12 mt-3">
                  		<button type="button" class="float-right btn btn-primary mrg-r-10" data-loading-text="<?php echo __('Saving Store...','asl_admin') ?>" data-completed-text="<?php echo __('Store Saved','asl_admin') ?>" id="btn-asl-add"><?php echo __('Update Store','asl_admin') ?></button>
                  	</div>
                  </div>
              </form>
          </div>
        </div>
			</div>
		</div>
	</div>


	<!-- Modals	-->
  <div class="smodal fade" tabindex="-1" id="addimagemodel" role="dialog">
    <div class="smodal-dialog" role="document">
      <div class="smodal-content">
        <form id="frm-upload-logo" name="frm-upload-logo">
        <div class="smodal-header">
          <h5 class="smodal-title"><?php echo __('Upload Logo','asl_admin') ?></h5>
          <button type="button" class="close" data-dismiss="smodal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="smodal-body">

          <div class="col-md-12 form-group mb-3">
              <label for="txt_logo-name"><?php echo __('Name','asl_admin') ?></label>
              <input type="text" id="txt_logo-name" name="data[logo_name]" placeholder="<?php echo __('Logo Name','asl_admin') ?>" class="form-control">
          </div>
          <div class="col-md-12 form-group mb-3" id="drop-zone">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><?php echo __('Logo','asl_admin') ?></span>
              </div>
              <div class="custom-file">
                <input name="files" type="file" class="custom-file-input" accept=".jpg,.png,.jpeg,.gif,.JPG" id="file-logo">
                <label  class="custom-file-label" for="file-logo"><?php echo __('File Path...','asl_admin') ?></label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="progress hideelement progress_bar_" style="display:none">
              <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                <span style="position:relative" class="sr-only">0% Complete</span>
              </div>
            </div>
          </div>
          <ul></ul>
          <div class="col-12"><p id="message_upload" class="alert alert-warning hide"></p></div>
        </div>

        <div class="smodal-footer">
          <button type="button" data-loading-text="<?php echo __('Submitting ...','asl_admin') ?>" class="btn btn-start btn-primary"><?php echo __('Upload','asl_admin') ?></button>
          <button type="button" class="btn btn-secondary" data-dismiss="smodal"><?php echo __('Close','asl_admin') ?></button>
        </div>

        </form>
      </div>
    </div>
  </div>


	<!-- Add Marker -->
	<div class="smodal fade" tabindex="-1" id="addmarkermodel" role="dialog">
    <div class="smodal-dialog" role="document">
      <div class="smodal-content">
        <form id="frm-upload-marker" name="frm-upload-logo">
        <div class="smodal-header">
          <h5 class="smodal-title"><?php echo __('Upload Marker','asl_admin') ?></h5>
          <button type="button" class="close" data-dismiss="smodal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="smodal-body">
	        <div class="col-md-12 form-group mb-3">
              <label for="txt_marker-name"><?php echo __('Marker Name','asl_admin') ?></label>
              <input type="text" id="txt_marker-name" name="data[marker_name]" class="form-control">
          </div>
          <div class="col-md-12 form-group mb-3" id="drop-zone-2">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><?php echo __('Icon','asl_admin') ?></span>
              </div>
              <div class="custom-file">
                <input name="files" type="file" class="custom-file-input" accept=".jpg,.png,.jpeg,.gif,.JPG" id="file-logo-2">
                <label  class="custom-file-label" for="file-logo-2"><?php echo __('File Path...','asl_admin') ?></label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="progress hideelement progress_bar_" style="display:none">
              <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                <span style="position:relative" class="sr-only">0% Complete</span>
              </div>
            </div>
          </div>
          <ul></ul>
          <div class="col-12"><p id="message_upload_1" class="alert alert-warning hide"></p></div>
	      </div>
	      <div class="smodal-footer">
          <button type="button" data-loading-text="<?php echo __('Submitting ...','asl_admin') ?>" class="btn btn-start btn-primary"><?php echo __('Upload','asl_admin') ?></button>
	        <button type="button" class="btn btn-default" data-dismiss="smodal"><?php echo __('Close','asl_admin') ?></button>
	      </div>
	    </div>
	  </div>
	</div>
</div>

<!-- SCRIPTS -->
<script type="text/javascript">

	var asl_configs =  <?php echo json_encode($all_configs); ?>;
	var ASL_Instance = {
		url: '<?php echo ASL_URL_PATH; ?>',
		sideurl: '<?php echo get_site_url();?>'
	};
	
  window.addEventListener("load", function() {
     
	asl_engine.pages.edit_store(<?php echo json_encode($store) ?>);
});
</script>
