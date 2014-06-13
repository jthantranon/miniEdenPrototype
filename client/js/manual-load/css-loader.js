/**
 * Created by John on 6/13/2014.
 */
YUI().use('get', function (Y) {
    Y.Get.css(CSS_FILES, function (err) {
        if (err) {
            Y.Array.each(err, function (error) {
                Y.log('Error loading CSS: ' + error.error, 'error');
            });
            return;
        }

        Y.log('All CSS files loaded successfully!');
    });
});