<template>
  <div class="payment-code">
    <input
      type="text"
      class="digit-1"
      maxlength="1"
      name="digit-1"
      data-next="digit-2"
    />
    <input
      type="text"
      class="digit-2"
      maxlength="1"
      name="digit-2"
      data-next="digit-3"
      data-previous="digit-1"
    />
    <input
      type="text"
      class="digit-3"
      maxlength="1"
      name="digit-3"
      data-next="digit-4"
      data-previous="digit-2"
    />
    <input
      type="text"
      class="digit-4"
      maxlength="1"
      name="digit-4"
      data-next="digit-5"
      data-previous="digit-3"
    />
    <input
      type="text"
      class="digit-5"
      maxlength="1"
      name="digit-5"
      data-next="digit-6"
      data-previous="digit-4"
    />
  </div>
</template>

<script>
export default {
  name: 'StPaymentCode',
  setup() {
    /*
      $('.payment-code').find('input').each(function() {
	$(this).attr('maxlength', 1);
	$(this).on('keyup', function(e) {
		console.log("ww", e)
		var parent = $($(this).parent());
		
		// backspace or left arrow
		if(e.keyCode === 8 || e.keyCode === 37) {
			var prev = parent.find('input#' + $(this).data('previous'));
			
			if(prev.length) {
				$(prev).select();
			}
			// 48-57 are 0-9, 96-105 0-9 on numpad, 39 is right arrow
		} else if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
			var next = parent.find('input.' + $(this).data('next'));
			
			if(next.length) {
				$(next).select();
			} 
		}
	});
});
      */
    return {};
  },
};
</script>

<style scoped>
.payment-code input {
  width: 30px;
  height: 50px;
  border: none;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  font-weight: 200;
  margin: 0 2px;
}
</style>
