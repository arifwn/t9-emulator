(function() {
    var root = this;
    var currentWord = '';
    var currentPredictions = [];
    var currentPredictionsIndex = 0;

    $(function(){
        $.ajax({
            url: 'data/dictionary.txt',
            success: function(data, textStatus, jqXHR ) {
                $('.loading p').text('Dictionary file downloaded!');
                _.delay(function(){
                    $('.loading').fadeOut();
                }, 1000);

                t9.init(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('.loading p').text('Error loading dictionary file! Try reloading the page.');
            },
            xhr: function(){
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("progress", function(event){
                    if (event.lengthComputable) {  
                     var percentComplete = 100 * event.loaded / event.total;
                     console.log(percentComplete);
                     $('.loading .progress-bar')
                        .attr('aria-valuenow', percentComplete)
                        .css('width', percentComplete + '%');
                    }
                }, false); 

                return xhr;
            }
        });
        
        $('button.key').on('click', function(event){
            var value = $(this).val();
            if(value == 'space'){
                currentWord = '';
                currentPredictions = [];
                currentPredictionsIndex = 0;
                var previousText = $('.prev-text').text() + ' ' + $('.current-text').text() + ' ';
                $('.prev-text').text(previousText);
                $('.current-text').text('');
            }

            if(isNaN(parseInt(value)))
                return;

            currentWord += value;
            currentPredictions = t9.predict(currentWord);
            currentPredictionsIndex = 0;
            if(currentPredictions.length > 0){
                $('.current-text').text(currentPredictions[0]);
            }
            else {
                $('.current-text').text($('.current-text').text() + value);
            }
        });

        $('.controller .prediction-cycle').on('click', function(event){
            if(currentPredictions.length > 0){
                if (++currentPredictionsIndex >= currentPredictions.length)
                    currentPredictionsIndex = 0;

                $('.current-text').text(currentPredictions[currentPredictionsIndex]);
            }
        });

        $('.controller .delete').on('click', function(event){
            if(currentWord == ''){
                var previousText = $('.prev-text').text();
                previousText = previousText.slice(0, previousText.length-1);
                $('.prev-text').text(previousText);
                return;
            }

            currentWord = currentWord.slice(0, currentWord.length-1);
            currentPredictions = t9.predict(currentWord);
            currentPredictionsIndex = 0;
            if(currentPredictions.length > 0){
                $('.current-text').text(currentPredictions[0]);
            }
            else {
                var currentText = $('.current-text').text();
                currentText = currentText.slice(0, currentText.length-1);
                $('.current-text').text(currentText);
            }

        });

    });

}).call(this);