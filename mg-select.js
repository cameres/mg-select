MG.add_hook('global.before_init', function(args){
  // if select: true isn't in args or...
  // if a selector has already been created,
  // create selector or copy args
  if((!args.mg_select == true) || $(args.target + " select").length != 0)
    return;

  // initial call to the chart hook
  // deep copies of original chart properties
  var chart_properties = $.extend(true, {}, args);
  var original_data = $.extend(true, chart_properties.data, {}, args);
  var target = chart_properties.target;
  var legend = chart_properties.legend;

  // create html for bootstrap-picker
  legend_options = legend.map(function(y_accessor){ return "<option>" + y_accessor + "</option>" });
  $(target).prepend('<select class="selectpicker linepicker" multiple data-actions-box="true">' + legend_options.join('') + '</select>');

  // setup properties for selectpicker
  $(target + ' .selectpicker').selectpicker({
    selectedTextFormat: 'static',
    width: 'fit',
    title: 'data'
  });
  $(target + ' .selectpicker').selectpicker('selectAll');

  // handle dynamically updating the chart
  $(target + ' .selectpicker').on('change', function(){
    // setup reload of the chart
    delete chart_properties.xax_format;

    // get the y_accessors that are selected
    var options = $(this).find("option:selected")
    var y_accessors = $.map(options, function(option){ return option.text })

    if(y_accessors.length == 0){
      // if a chart has no data, display an empty chart
      chart_properties.chart_type = "missing-data";
    } else {
      // currently only works for line charts
      chart_properties.chart_type = "line";
    }

    chart_properties.y_accessor = y_accessors;
    chart_properties.data = original_data;
    MG.data_graphic(chart_properties);
  });
});
