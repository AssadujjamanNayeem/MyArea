<!-- Container -->
<div class="asl-p-cont asl-new-bg">
<div class="hide">
  <svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="i-clipboard" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <title>Duplicate</title>
      <path d="M12 2 L12 6 20 6 20 2 12 2 Z M11 4 L6 4 6 30 26 30 26 4 21 4" />
    </symbol>
    <symbol id="i-trash" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <title>Trash</title>
        <path d="M28 6 L6 6 8 30 24 30 26 6 4 6 M16 12 L16 24 M21 12 L20 24 M11 12 L12 24 M12 6 L13 2 19 2 20 6" />
    </symbol>
    <symbol id="i-edit" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <title>Edit</title>
        <path d="M30 7 L25 2 5 22 3 29 10 27 Z M21 6 L26 11 Z M5 22 L10 27 Z" />
    </symbol>
    <symbol id="i-info" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="M16 14 L16 23 M16 8 L16 10" />
        <circle cx="16" cy="16" r="14" />
    </symbol>
  </svg>
</div>
  <div class="container">
    <div class="row asl-inner-cont">
      <div class="col-md-12">
        <div class="card p-0 mb-4">
          <h3 class="card-title"><?php echo __('Manage Stores','asl_admin') ?></h3>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <select class="mr-2 custom-select" id="asl-ddl-status">
                  <option value="1"><?php echo __('Status Enable','asl_admin') ?></option>
                  <option value="0"><?php echo __('Status Disable','asl_admin') ?></option>
                </select>
                <button class="btn btn-info" id="btn-change-status" type="button"><?php echo __('Change','asl_admin') ?></button>
              </div>
              <div class="col-md-6">
                <button type="button" id="btn-asl-delete-all" class="btn btn-danger float-right"><i class="mr-1"><svg width="12" height="12"><use xlink:href="#i-trash"></use></svg></i><?php echo __('Delete Selected','asl_admin') ?></button>
              </div>
            </div>
            <div class="alert alert-primary mt-3 mb-3" role="alert">
              <i><svg width="14" height="14"><use xlink:href="#i-info"></use></svg></i><?php echo __('Store Locator Listing columns can easily be updated by simply add/remove from the template, Please visit the link for more','asl_admin') ?> <a href="https://agilestorelocator.com/blog/customize-google-marker-infowindow-sidebar-store-locator/" target="_blank">"Customize Store Locator"</a>.
            </div>
            <div class="table-responsive">
              <table id="tbl_stores" class="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th><input type="text" class="form-control sml" data-id="id"  disabled="disabled" style="opacity: 0" placeholder="<?php echo __('Search ID','asl_admin') ?>"  /></th>
                    <th style="position: relative;" class="asl-search-btn">
                      <input type="text" class="form-control" data-id="-id" disabled="disabled" style="opacity: 0" placeholder="<?php echo __('Search ID','asl_admin') ?>"  />
                    </th>
                    <th><input type="text" class="form-control" data-id="id"  placeholder="<?php echo __('Search ID','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="title"  placeholder="<?php echo __('Search Title','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="description"  placeholder="<?php echo __('Search Description','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="lat"  placeholder="<?php echo __('Search Lat','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="lng"  placeholder="<?php echo __('Search Lng','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="street"  placeholder="<?php echo __('Search Street','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="state"  placeholder="<?php echo __('Search State','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="city"  placeholder="<?php echo __('Search City','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="phone"  placeholder="<?php echo __('Search Phone','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="email"  placeholder="<?php echo __('Search Email','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="website"  placeholder="<?php echo __('Search URL','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="postal_code"  placeholder="<?php echo __('Search Zip','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="is_disabled"  placeholder="<?php echo __('Disabled','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="category" disabled="disabled" style="opacity:0"  placeholder="<?php echo __('Categories','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="marker_id"  placeholder="<?php echo __('Marker ID','asl_admin') ?>"  /></th>
                    <th><input type="text" class="form-control" data-id="logo_id"  placeholder="<?php echo __('Logo ID','asl_admin') ?>" /></th>
                    <th><input type="text" class="form-control" data-id="created_on"  placeholder="<?php echo __('Created On','asl_admin') ?>"  /></th>
                  </tr>
                  <tr>
                    <th><a class="select-all"><?php echo __('Select All','asl_admin') ?></a></th>
                    <th><?php echo __('Action','asl_admin') ?>&nbsp;</th>
                    <th><?php echo __('Store ID','asl_admin') ?></th>
                    <th><?php echo __('Title','asl_admin') ?></th>
                    <th><?php echo __('Description','asl_admin') ?></th>
                    <th><?php echo __('Lat','asl_admin') ?></th>
                    <th><?php echo __('Lng','asl_admin') ?></th>
                    <th><?php echo __('Street','asl_admin') ?></th>
                    <th><?php echo __('State','asl_admin') ?></th>
                    <th><?php echo __('City','asl_admin') ?></th>
                    <th><?php echo __('Phone','asl_admin') ?></th>
                    <th><?php echo __('Email','asl_admin') ?></th>
                    <th><?php echo __('URL','asl_admin') ?></th>
                    <th><?php echo __('Postal Code','asl_admin') ?></th>
                    <th><?php echo __('Disabled','asl_admin') ?></th>
                    <th><?php echo __('Categories','asl_admin') ?></th>
                    <th><?php echo __('Marker ID','asl_admin') ?></th>
                    <th><?php echo __('Logo ID','asl_admin') ?></th>
                    <th><?php echo __('Created On','asl_admin') ?></th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
            <div class="dump-message asl-dumper"></div>
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

window.addEventListener("load", function() {
     
asl_engine.pages.manage_stores();
});
</script>
