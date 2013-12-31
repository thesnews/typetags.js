TypeTags
========

Simple mashup between typeahead.js and Flat UI's Tags Input bits

## Requires

 * Flat UI
 * jQuery > 1.9
 * Lodash
 * Typeahead.js

## Example

    $('.autoauthors').typeTags({
        'filter': function(results) {
            var values = _.values(results[0].values);
            var out = [];

            for( var i = 0; i <= values.length; i++ ) {
                var val = values[i];
                if( !val ) {
                    continue;
                }
                out.push({
                    'value':    _.rawDecode(val.name),
                    'tokens':   [_.rawDecode(val.name), _.rawDecode(val.name_normalized)]
                });
            }
            return out;
        },
        'field':    'authors'
    });

    <div class="well">
                <input type="text" class="typetags autoauthors" autocomplete="off" placeholder="Authors: Test Testerson..." data-container=".authorcontainer" data-source="/path/to/list.json" />
                <div class="authorcontainer tagsinput tagsinput-primary" style="height:100%;">
                </div>
            </div>
            <input type="text" name="authors" value=""/>
    </div>
