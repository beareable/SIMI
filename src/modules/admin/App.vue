<!-- 页面结构入口 -->
<template>
	<router-view></router-view>
</template>

<script>
	import * as CommonApi from '../../lib/CommonApi';
	export default {
		data: function() {
			return {
                logTimer:null
			}
		},
		watch: {
			'$route': function(newRoute){
			}
		},
		mounted: function(){
		},
        methods: {
        }
	}

</script>