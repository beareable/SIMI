<template>
	<ErrorTip v-if="notAccess" msg="您无权限访问哟~"></ErrorTip>
    <el-row v-else>
        <span style="font-size: 16px">this is the example page for submenu</span>
    </el-row>
</template>

<script>
    import ErrorTip from '../../ErrorTip';
    export default {
        components: {
            ErrorTip,
		},
        data() {
            return {
                notAccess:true,
            }
        },
        mounted() {
        },
        watch:{
        },
        methods: {
        },
    }
</script>