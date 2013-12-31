/**
 * Mashing Typeahead.js and Flat UI's tag's input extension
 *
 * @author Mike Joseph <mike.joseph@statenews.com>
 * @copyright State News, Inc.
 * @license BSD
 */
(function($){
    $.fn.typeTags = function(){
        var options = {
            filter: function(results) {
                var values = _.values(results[0].values);
                var out = [];

                for( var i = 0; i <= values.length; i++ ) {
                    var val = values[i];
                    if( !val ) {
                        continue;
                    }
                    out.push({
                        'value':    rawDecode(val.name_normalized),
                        'tokens':   [rawDecode(val.name), rawDecode(val.name_normalized)]
                    });
                }
                return out;
            },
            field: 'tags'
        };

        var rawDecode = function(str) {
            return _.unescape(decodeURIComponent(str));
        };

        var prePopulate = function(target, container, field) {
            var el = $('[name="'+field+'"]');
            var vals = el.val();
            if( vals.length ) {
                vals = vals.split(',');
            } else {
                return;
            }

            _.forEach(vals, function(v) {
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html(v+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));
                $(container).append(tag);
            });

        };

        var pushTag = function(tag, field) {
            tag = tag.trim();
            var el = $('[name="'+field+'"]');
            var vals = el.val();
            if( vals.length ) {
                vals = vals.split(',');
            } else {
                vals = [];
            }

            vals.push(tag);

            el.val(vals.join(','));
        };

        var popTag = function(tag, field) {
            tag = tag.trim();
            var el = $('[name="'+field+'"]');
            var vals = el.val();
            if( vals.length ) {
                vals = vals.split(',');
            } else {
                vals = [];
            }
            _.remove(vals, function(v) {
                return (v.trim() == tag);
            });

            el.val(vals.join(','));
        };

        if( arguments.length ) {
            $.extend(options, arguments[0]);
        }

        return this.each(function(){
            var $this = $(this);

            var container = $this.attr('data-container'),
                source = $this.attr('data-source');

            if( options.field ) {
                prePopulate($this, container, options.field);
            }

            $(container).on('click', '.tagsinput-remove-link', function(e) {
                var el = $(e.currentTarget);
                var parent = el.parents('span.tag').first();

                var val = parent.find('span').first();
                parent.remove();
                if( options.field ) {
                    popTag(val.text(), options.field);
                }
            });

            $this.typeahead({
              name: container.replace(/\,/, ''),
              limit: 15,
              remote: {
                url: source+'?q=%QUERY',
                filter: options.filter
            }
            }).on('typeahead:selected', function (e, d) {
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html(d.value+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));
                $(container).append(tag);
                $this.val('');

                if( options.field ) {
                    pushTag(d.value, options.field);
                }
            }).on('keypress', function(e) {
                if( e.keyCode != 13 ) {
                    return;
                }
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html($(this).val()+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));

                $(container).append(tag);
                if( options.field ) {
                    pushTag($(this).val(), options.field);
                }

                var evt = $.Event("keydown");
                evt.which = 27;
                $this.trigger(evt);
                $this.val('');
            });
        });
    };

})(jQuery);
