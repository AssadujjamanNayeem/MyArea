<!-- <script type="text/javascript" charset="utf-8" src="//maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script> -->
<div class="asl-p-cont asl-new-bg">
    <div class="container">
        <div class="row asl-inner-cont">
            <div class="col-md-12">
                <div class="card p-0 mb-4">
                    <h3 class="card-title"><?php echo __('Customize Map','asl_admin') ?></h3>
                    <div class="card-body">
                        <div class="row mb-3 mt-3">
                            <div class="col-md-2">
                                <div class="btn-group  btn-group-toggle"  data-toggle="buttons" id="asl-fill-option">
                                  <label class="btn disabled btn-sm btn-dark" data-value="0">
                                    <?php echo __('Border','asl_admin') ?>
                                  </label>
                                  <label class="btn disabled btn-sm btn-dark" data-value="1">
                                    <?php echo __('Solid','asl_admin') ?>
                                  </label>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <button class="btn disabled btn-sm btn-danger" type="button" id="asl-delete-shape"><span style="margin-right:10px;font-size:12px" class="glyphicon glyphicon-trash"></span><span><?php echo __('Delete','asl_admin') ?></span></button>
                                <button class="btn disabled btn-sm btn-warning" type="button" id="asl-clear-all"><span><?php echo __('Clear All','asl_admin') ?></span></button>
                            </div>
                            <div class="col-md-7">
                                <div class="color_scheme float-right">
                                    <div id="radio" class="map_cange">
                                        <span>
                                            <input type="radio" id="asl-color_scheme-0" value="#CC3333" name="data[color_scheme]">
                                            <label class="color-box color-0" for="asl-color_scheme-0"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-1" value="#E11619" name="data[color_scheme]">
                                            <label class="color-box color-1" for="asl-color_scheme-1"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-2" value="#542733" name="data[color_scheme]">
                                            <label class="color-box color-2" for="asl-color_scheme-2"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-3" value="#278BBC" name="data[color_scheme]">
                                            <label class="color-box color-3" for="asl-color_scheme-3"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-4" value="#78C1E4" name="data[color_scheme]">
                                            <label class="color-box color-4" for="asl-color_scheme-4"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-5" value="#ACD55D" name="data[color_scheme]">
                                            <label class="color-box color-5" for="asl-color_scheme-5"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-6" value="#A8BD78" name="data[color_scheme]">
                                            <label class="color-box color-6" for="asl-color_scheme-6"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-7" value="#EAAE40" name="data[color_scheme]">
                                            <label class="color-box color-7" for="asl-color_scheme-7"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-8" value="#E68EC1" name="data[color_scheme]">
                                            <label class="color-box color-8" for="asl-color_scheme-8"></label>
                                        </span>
                                        <span>
                                            <input type="radio" id="asl-color_scheme-9" value="#B39571" name="data[color_scheme]">
                                            <label class="color-box color-9" for="asl-color_scheme-9"></label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12" style="opacity: 0.5">
                                <img src="<?php echo ASL_URL_PATH ?>admin/images/custom-map.png" alt="" class="img-responsive">
                            </div>
                        </div>
                        <form id="frm-asl-layers">
                            <div class="row map-option-bottom mt-3 mb-3">
                                <div class="col-12">
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                      <input type="checkbox" id="asl-trafic_layer" name="data[trafic_layer]" class="custom-control-input">
                                      <label class="custom-control-label" for="asl-trafic_layer"><?php echo __('Traffic Layer','asl_admin') ?></label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                      <input type="checkbox" id="asl-transit_layer" name="data[transit_layer]" class="custom-control-input">
                                      <label class="custom-control-label" for="asl-transit_layer"><?php echo __('Transit Layer','asl_admin') ?></label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                      <input type="checkbox" id="asl-bike_layer" name="data[bike_layer]" class="custom-control-input">
                                      <label class="custom-control-label" for="asl-bike_layer"><?php echo __('Bike Layer','asl_admin') ?></label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                      <input type="checkbox" id="asl-marker_animations" name="data[marker_animations]" class="custom-control-input">
                                      <label class="custom-control-label" for="asl-marker_animations"><?php echo __('Marker Animation','asl_admin') ?></label>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="row">
                            <div class="col-12">
                                <button type="button" id="asl-save-map" data-loading-text="<?php echo __('Saving...','asl_admin') ?>" class="float-right btn disabled btn-primary"><?php echo __('Save Customization','asl_admin') ?></button>
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
	};

	var asl_configs 	  =  <?php echo json_encode($all_configs); ?>;
	var asl_map_customize =  <?php echo $map_customize; ?>;
	
    window.addEventListener("load", function() {
	   
       asl_engine.pages.customize_map(asl_map_customize);
     
    });
</script>