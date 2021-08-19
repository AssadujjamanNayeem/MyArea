<?php


$class = '';

if($all_configs['display_list'] == '0')
  $class = ' map-full';


if($all_configs['full_width'])
  $class .= ' full-width';

//add Full height
$class .= ' '.$all_configs['full_height'];



$geo_btn_class      = ($all_configs['geo_button'] == '1')?'asl-geo icon-direction-outline':'icon-search';
$search_type_class  = ($all_configs['search_type'] == '1')?'asl-search-name':'asl-search-address';
$panel_order        = (isset($all_configs['map_top']))?$all_configs['map_top']: '2';


?>
<style type="text/css">
  #asl-storelocator.container.storelocator-main.asl-p-cont .asl-loc-sec .asl-panel {order: <?php echo $panel_order ?>;}
</style>
<div id="asl-storelocator" class="container storelocator-main no-asl-filters asl-p-cont asl-template-0 asl-layout-0 asl-bg-0 <?php echo $class; ?> asl-text-0">
  <div class="row asl-loc-sec">
    <div class="col-sm-8 col-xs-12 asl-map">
      <div class="store-locator">
        <div id="asl-map-canv"></div>
        <!-- agile-modal -->
        <div id="agile-modal-direction" class="agile-modal fade">
          <div class="agile-modal-backdrop-in"></div>
          <div class="agile-modal-dialog in">
            <div class="agile-modal-content">
              <div class="agile-modal-header">
                <button type="button" class="close-directions close" data-dismiss="agile-modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4><?php echo __('Get Your Directions', 'asl_locator') ?></h4>
              </div>
              <div class="form-group">
                <label for="frm-lbl"><?php echo __('From', 'asl_locator') ?>:</label>
                <input type="text" class="form-control frm-place" id="frm-lbl" placeholder="<?php echo __('Enter a Location', 'asl_locator') ?>">
              </div>
              <div class="form-group">
                <label for="frm-lbl"><?php echo __('To', 'asl_locator') ?>:</label>
                <input readonly="true" type="text"  class="directions-to form-control" id="to-lbl" placeholder="<?php echo __('Prepopulated Destination Address', 'asl_locator') ?>">
              </div>
              <div class="form-group">
                <span for="frm-lbl"><?php echo __('Show Distance In', 'asl_locator') ?></span>
                <label class="checkbox-inline">
                  <input type="radio" name="dist-type"  id="rbtn-km" value="0"> <?php echo __('KM', 'asl_locator') ?>
                </label>
                <label class="checkbox-inline">
                  <input type="radio" name="dist-type" checked id="rbtn-mile" value="1"> <?php echo __('Mile', 'asl_locator') ?>
                </label>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-default btn-submit"><?php echo __('GET DIRECTIONS', 'asl_locator') ?></button>
              </div>
            </div>
          </div>
        </div>

        <div id="asl-geolocation-agile-modal" class="agile-modal fade">
          <div class="agile-modal-backdrop-in"></div>
          <div class="agile-modal-dialog in">
            <div class="agile-modal-content">
              <button type="button" class="close-directions close" data-dismiss="agile-modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <?php if($all_configs['prompt_location'] == '2'): ?>
              <div class="form-group">
                <h4><?php echo __('LOCATE YOUR GEOPOSITION', 'asl_locator') ?></h4>
              </div>
              <div class="form-group">
                <div class="">
                <div class="col-md-9 asl-p-0">
                  <input type="text" class="form-control" id="asl-current-loc" placeholder="<?php echo __('Your Address', 'asl_locator') ?>">
                </div>
                <div class="col-md-3 asl-p-0">
                  <button type="button" id="asl-btn-locate" class="btn btn-block btn-default"><?php echo __('LOCATE', 'asl_locator') ?></button>
                </div>
                </div>
              </div>
              <?php else: ?>
              <div class="form-group">
                <h4><?php echo __('Use my location to find the closest Service Provider near me', 'asl_locator') ?></h4>
              </div>
              <div class="form-group text-center">
                <button type="button" id="asl-btn-geolocation" class="btn btn-block btn-default"><?php echo __('USE LOCATION', 'asl_locator') ?></button>
              </div>
              <?php endif; ?>
            </div>
          </div>
        </div>
        <!-- agile-modal end -->
      </div>
    </div>
    <div class="col-sm-4 col-xs-12 asl-panel">
      
      <div class="col-xs-12 inside search_filter">
        <p><?php echo __( 'Search Location', 'asl_locator') ?></p>
        <div class="asl-store-search">
            <input type="text" value="" id="auto-complete-search" class="<?php echo $search_type_class ?> form-control" placeholder="<?php echo __( 'Enter a Location', 'asl_locator') ?>">
            <span><i class="glyphicon <?php echo $geo_btn_class ?>" title="<?php echo ($all_configs['geo_button'] == '1')?__('Current Location','asl_locator'):__('Search Location','asl_locator') ?>"></i></span>
        </div>
        <div class="Num_of_store">
          <span><?php echo $all_configs['head_title'] ?>: <span class="count-result">0</span></span>
        </div>    
      </div>
      <!--  Panel Listing -->
      <div id="asl-list" class="storelocator-panel">
        <div class="asl-overlay" id="map-loading">
          <div class="white"></div>
          <div class="loading"><img style="margin-right: 10px;" class="loader" src="<?php echo ASL_URL_PATH ?>public/Logo/loading.gif"><?php echo __('Loading...', 'asl_locator') ?></div>
        </div>
        <div class="panel-cont">
            <div class="panel-inner">
              <div class="col-md-12 asl-p-0">
                  <ul id="p-statelist"  role="tablist" aria-multiselectable="true">
                  </ul>
              </div>
            </div>
        </div>
        <div class="directions-cont hide">
          <div class="agile-modal-header">
            <button type="button" class="close"><span aria-hidden="true">&times;</span></button>
            <h4><?php echo __('Directions', 'asl_locator') ?></h4>
          </div>
          <div class="rendered-directions"></div>
        </div>
      </div>
    </div> 
  </div>
</div>
<!-- This plugin is developed by "Agile Store Locator by WordPress" https://agilestorelocator.com -->
<script id="tmpl_list_item" type="text/x-jsrender">
  <div class="item" data-id="{{:id}}">
    <div class="addr-sec">
      <p class="p-title">{{:title}}</p>
    </div>
    <div class="row">
      <div class="col-xs-12 addr-sec">
        <p class="p-area"><span class="glyphicon icon-location"></span><span>{{:address}}</span></p>
        {{if phone}}
              <p class="p-area"><span class="glyphicon icon-phone-outline"></span><?php echo __( 'Phone','asl_locator') ?>: <a href="tel:{{:phone}}">{{:phone}}</a></p>
        {{/if}}
        {{if email}}
        <p class="p-area"><span class="glyphicon icon-at"></span><a href="mailto:{{:email}}" style="text-transform: lowercase">{{:email}}</a></p>
        {{/if}}
        {{if fax}}
          <p class="p-area"><span class="glyphicon icon-fax"></span> <?php echo __('Fax', 'asl_locator') ?>:{{:fax}}</p>
        {{/if}}
        {{if c_names}}
        <p class="p-area"><span class="glyphicon icon-tag"></span> {{:c_names}}</p>
        {{/if}}
        {{if open_hours}}
        <p class="p-area"><span class="glyphicon icon-clock-1"></span> {{:open_hours}}</p>
        {{/if}}
        {{if days_str}}
        <p class="p-area"><span class="glyphicon icon-calendar"></span> {{:days_str}}</p>
        {{/if}}
      </div>
    </div>
    <div class="row">
      <div class="mt-10 distance">
          <div class="col-xs-6">
            <p class="p-direction"><button type="button" class="btn btn-asl s-direction"><?php echo __( 'Direction','asl_locator') ?></button></p>
          </div>
          {{if dist_str}}
          <div class="col-xs-6">
              <a class="s-distance">{{:dist_str}}</a>
          </div>
          {{/if}}
      </div>
    </div>
  </div>
</script>
<script id="asl_too_tip" type="text/x-jsrender">
  <h3>{{:title}}</h3>
  <div class="infowindowContent">
    <div class="info-addr">
      <div class="address"><span class="glyphicon icon-location"></span><span>{{:address}}</span></div>
      {{if phone}}
      <div class="phone"><span class="glyphicon icon-phone-outline"></span><b><?php echo __( 'Phone','asl_locator') ?>: </b><a href="tel:{{:phone}}">{{:phone}}</a></div>
      {{/if}}
      {{if open_hours}}
      <div class="p-time"><span class="glyphicon icon-clock-1"></span> {{:open_hours}}</div>
      {{/if}}
      {{if days_str}}
      <div class="p-time"><span class="glyphicon icon-calendar-outlilne"></span> {{:days_str}}</div>
      {{/if}}
      {{if email}}
      <div class="p-time"><span class="glyphicon icon-at"></span><a href="mailto:{{:email}}" style="text-transform: lowercase">{{:email}}</a></div>
      {{/if}}
      {{if c_names}}
      <div class="categories"><span class="glyphicon icon-tag"></span>{{:c_names}}</div>
      {{/if}}
      {{if dist_str}}
      <div class="distance"><?php echo __( 'Distance','asl_locator') ?>: {{:dist_str}}</div>
      {{/if}}
    </div>
  <div class="asl-buttons"></div>
</div><div class="arrow-down"></div>
</script>