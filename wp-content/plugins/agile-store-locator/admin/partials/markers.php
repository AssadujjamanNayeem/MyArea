<!-- Container -->
<div class="asl-p-cont asl-new-bg">
<div class="hide">
  <svg xmlns="http://www.w3.org/2000/svg">
    <symbol id="i-plus" viewBox="0 0 32 32" width="13" height="13" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <title>Add</title>
        <path d="M16 2 L16 30 M2 16 L30 16" />
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
          <h3 class="card-title"><?php echo __('Manage Markers','asl_admin') ?></h3>
          <div class="card-body">
          <?php if(!is_writable(ASL_PLUGIN_PATH.'public/icon')): ?>
            <h6  class="alert alert-danger" style="font-size: 14px"><?php echo ASL_PLUGIN_PATH.'public/icon' ?> <= <?php echo __('Directory is not writable, Marker Image Upload will Fail, Make directory writable.','asl_admin') ?></h6>
          <?php endif; ?>
            <div class="row mb-3">
              <div class="col-md-12 ralign">
                <button type="button" id="btn-asl-delete-all" class="btn disabled btn-danger mrg-r-10"><i><svg width="13" height="13"><use xlink:href="#i-trash"></use></svg></i><?php echo __('Delete Selected','asl_admin') ?></button>
                <button type="button" id="btn-asl-new-c" class="btn disabled btn-primary mrg-r-10"><i><svg width="13" height="13"><use xlink:href="#i-plus"></use></svg></i><?php echo __('New Marker','asl_admin') ?></button>
              </div>
            </div>
            <div class="col-sm-12">
            	<table id="tbl_markers" class="display table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th align="center"><input type="text" class="form-control sml" data-id="id"  disabled="disabled" style="opacity: 0"/></th>
                      <th align="center"><input class="form-control" type="text" data-id="id"  placeholder="<?php echo __('Search ID','asl_admin') ?>"  /></th>
                      <th align="center"><input class="form-control" type="text" data-id="marker_name"  placeholder="<?php echo __('Search Name','asl_admin') ?>"  /></th>
                      <th align="center"><input class="form-control" type="text" data-id="is_active"  placeholder="<?php echo __('Active','asl_admin') ?>"  /></th>
                      <th align="center">&nbsp;</th>
                      <th align="center">&nbsp;</th>
                    </tr>
                    <tr>
                      <th align="center"><a class="select-all"><?php echo __('Select All','asl_admin') ?></a></th>
                      <th align="center"><?php echo __('Marker ID','asl_admin') ?></th>
                      <th align="center"><?php echo __('Name','asl_admin') ?></th>
                      <th align="center"><?php echo __('Active','asl_admin') ?></th>
                      <th align="center"><?php echo __('Icon','asl_admin') ?></th>
                      <th align="center"><?php echo __('Action','asl_admin') ?>&nbsp;</th>
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

<!-- Edit Alert -->
<div class="smodal fade" id="asl-update-modal" role="dialog">
  <div class="smodal-dialog" role="document">
    <div class="smodal-content">
      <form id="frm-updatemarker" name="frm-updatemarker">
      <div class="smodal-header">
        <h5 class="smodal-title"><?php echo __('Update Marker','asl_admin') ?></h5>
        <button type="button" class="close" data-dismiss="smodal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="smodal-body">
        <div class="row">
          <div class="col-md-12 form-group mb-3">
            <label class="control-label">Marker ID</label>
            <input type="text" class="form-control" readonly="readonly"  name="data[marker_id]" id="update_marker_id_input">
          </div>
          <div class="col-md-12 form-group mb-3">
            <label for="txt_name"  class="control-label"><?php echo __('Name','asl_admin') ?></label>
            <input type="text" class="form-control validate[required]" name="data[marker_name]" id="update_marker_name">
          </div>
          <div class="col-md-12 form-group mb-3" id="updatemarker_image">
             <img  src="" id="update_marker_icon" alt="" data-id="same" style="max-width: 80px;max-height: 80px"/>
             <button type="button" class="btn disabled btn-default" id="change_image"><?php echo __('Change','asl_admin') ?></button>
          </div>

          <div class="col-md-12 form-group mb-3" style="display:none" id="updatemarker_editimage">                  
            <div class="input-group" id="drop-zone">
              <div class="input-group-prepend">
                <span class="input-group-text"><?php echo __('Icon','asl_admin') ?></span>
              </div>
              <div class="custom-file">
                <input type="file" accept=".jpg,.png,.jpeg,.gif,.JPG" class="btn disabled btn-default" name="files" id="file-logo-1" />
                <label  class="custom-file-label" for="file-logo-1"><?php echo __('File Path...','asl_admin') ?></label>
              </div>
            </div>
            <div class="form-group">
              <div class="progress hideelement" style="display:none" id="progress_bar_">
                  <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:0%;">
                      <span style="position:relative" class="sr-only">0% Complete</span>
                  </div>
              </div>
            </div>
            <ul></ul>
          </div>
          <p id="message_update"></p>
        </div>
        <div class="smodal-footer">
          <button class="btn disabled btn-primary btn-start mrg-r-15" id="btn-asl-update-markers"   type="button" data-loading-text="<?php echo __('Submitting ...','asl_admin') ?>"><?php echo __('Update Marker','asl_admin') ?></button>
          <button type="button" class="btn disabled btn-default" data-dismiss="smodal"><?php echo __('Cancel','asl_admin') ?></button>
        </div>
      </div>
      </form>
    </div>
  </div>
</div>

<div class="smodal fade" id="asl-add-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="smodal-dialog" role="document">
    <div class="smodal-content">
      <form id="frm-addmarker" name="frm-upload-marker">
      <div class="smodal-header">
        <h5 class="smodal-title"><?php echo __('Upload Marker','asl_admin') ?></h5>
        <button type="button" class="close" data-dismiss="smodal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="smodal-body">
        <div class="row">
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
      </div>
      <div class="smodal-footer">
        <button type="button" data-loading-text="<?php echo __('Submitting ...','asl_admin') ?>" class="btn disabled btn-start btn-primary"><?php echo __('Upload','asl_admin') ?></button>
        <button type="button" class="btn disabled btn-default" data-dismiss="smodal"><?php echo __('Close','asl_admin') ?></button>
      </div>
      </form>
    </div>
  </div>
</div>

</div>
<!-- asl-cont end-->


<!-- SCRIPTS -->
<script type="text/javascript">
var ASL_Instance = {
	url: '<?php echo ASL_URL_PATH ?>'
};

window.addEventListener("load", function() {
     
asl_engine.pages.manage_markers();
});
</script>
