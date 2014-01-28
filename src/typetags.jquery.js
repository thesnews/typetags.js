/**
 * Mashing Typeahead.js and Flat UI's tag's input extension
 *
 * @author Mike Joseph <mike.joseph@statenews.com>
 * @copyright State News, Inc.
 * @license BSD
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($) {

    var rawDecode = function(str) {
        return _.unescape(decodeURIComponent(str));
    };

    var pluginName = "typeTags",
        defaults = {
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
            field: 'tags',
            container: false,
            source: false
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var $this = $(this.element);

            this.settings.container = $this.attr('data-container');
            this.settings.source = $this.attr('data-source');

            $(this.settings.container).empty();

            if( this.settings.field ) {
                this.prePopulate();
            }

            var self = this;
            $(this.settings.container).on('click', '.tagsinput-remove-link', function(e) {
                var el = $(e.currentTarget);
                var parent = el.parents('span.tag').first();

                var val = parent.find('span').first();
                parent.remove();
                if( self.settings.field ) {
                    self.popTag(val.text());
                }
            });

            $this.typeahead({
                name: this.settings.container.replace(/\./, ''),
                limit: 15,
                remote: {
                    url: this.settings.source+'?q=%QUERY',
                    filter: this.settings.filter
                }
            }).on('typeahead:selected', function (e, d) {
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html(d.value+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));
                $(self.settings.container).append(tag);
                $this.val('');

                if( self.settings.field ) {
                    self.pushTag(d.value);
                }
            }).on('keypress', function(e) {
                if( e.keyCode != 13 ) {
                    return;
                }
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html($(this).val()+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));

                $(self.settings.container).append(tag);
                if( self.settings.field ) {
                    self.pushTag($(this).val());
                }

                var evt = $.Event("keydown");
                evt.which = 27;
                $this.trigger(evt);
                $this.val('');
            });

        },

        prePopulate: function() {
            var el = $(this.settings.field);
            var vals = el.val();
            if( vals.length ) {
                vals = vals.split(',');
            } else {
                return;
            }

            $(this.settings.container).empty();

            var self = this;
            _.forEach(vals, function(v) {
                var tag = $('<span></span>')
                    .addClass('tag')
                    .append($('<span></span>').html(v+'&nbsp;&nbsp;'))
                    .append($('<a class="tagsinput-remove-link"></a>'));
                $(self.settings.container).append(tag);
            });

        },

        pushTag: function(tag) {
            tag = tag.trim();
            var el = $(this.settings.field);
            var vals = el.val();
            if( vals.length ) {
                vals = vals.split(',');
            } else {
                vals = [];
            }

            vals.push(tag);

            el.val(vals.join(','));
        },

        popTag: function(tag) {
            tag = tag.trim();
            var el = $(this.settings.field);
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
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        if( options && options == 'reset' ) {
            var pl = $(this).data("plugin_"+pluginName);
            pl.prePopulate();
        }
        return this.each(function() {
            if( !$.data(this, "plugin_"+pluginName) ) {
                $.data(this, "plugin_"+pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery);

