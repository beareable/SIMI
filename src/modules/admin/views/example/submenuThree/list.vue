<template>
	<ErrorTip v-if="notAccess" msg="您无权限访问哟~"></ErrorTip>
    <el-row v-else>
        <span style="font-size: 16px">this is the example page for charts</span>
        <el-row  style="height:879px;">
            <line-area-chart ref="chart" :data="lineData" :options="lineOptions" v-if="JSON.stringify(lineData)!='{}'"></line-area-chart>
            <error-tip :type="400" msg="无匹配数据显示" v-else></error-tip>
        </el-row>
    </el-row>
</template>

<script>
    import ErrorTip from '../../ErrorTip';
    import LineAreaChart from '../../../../../components/echarts/lineAreaChart';
    export default {
        components: {
            ErrorTip,
            LineAreaChart
		},
        data() {
            return {
                notAccess:false,
                 lineData:{},
                 lineOptions:{
                    title: {
                        text: '',
                        x: 'center',
                        textStyle: {
                            color: '#333333',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontFamily: 'Microsoft YaHei',
                            fontSize: 20,
                        },
                    },
                    tooltip : {
                        trigger: 'axis',
                        //formatter: '{b}<br />{a}: {c}<br />{a1}: {c1}'
                        formatter:(data,ticket)=>{
                            let tipstr = data[0].axisValue+"<br />";
                            for(let i in data){
                                let tmpi = data[i];
                                tipstr += tmpi.seriesName+"："+tmpi.data+"<br />";
                            }
                            return tipstr;
                        }
                    },
                    legend: {
                        left: 'right',
                        padding:[0,30,0,0]
                    },
                    grid: {
                        left: '30',
                        right: '30',
                        top: 60,
                        bottom: '5%',
                        containLabel: true
                    },
                },
            }
        },
        mounted() {
            this.lineData = {
                "最近七天均值": [
                    {
                        "name": "00:00",
                        "value": 5202
                    },
                    {
                        "name": "01:00",
                        "value": 2864
                    },
                    {
                        "name": "02:00",
                        "value": 1927
                    },
                    {
                        "name": "03:00",
                        "value": 1391
                    },
                    {
                        "name": "04:00",
                        "value": 1170
                    },
                    {
                        "name": "05:00",
                        "value": 1437
                    },
                    {
                        "name": "06:00",
                        "value": 3038
                    },
                    {
                        "name": "07:00",
                        "value": 5115
                    },
                    {
                        "name": "08:00",
                        "value": 8334
                    },
                    {
                        "name": "09:00",
                        "value": 11283
                    },
                    {
                        "name": "10:00",
                        "value": 13184
                    },
                    {
                        "name": "11:00",
                        "value": 15490
                    },
                    {
                        "name": "12:00",
                        "value": 16322
                    },
                    {
                        "name": "13:00",
                        "value": 15291
                    },
                    {
                        "name": "14:00",
                        "value": 15093
                    },
                    {
                        "name": "15:00",
                        "value": 15156
                    },
                    {
                        "name": "16:00",
                        "value": 15860
                    },
                    {
                        "name": "17:00",
                        "value": 15944
                    },
                    {
                        "name": "18:00",
                        "value": 16397
                    },
                    {
                        "name": "19:00",
                        "value": 16731
                    },
                    {
                        "name": "20:00",
                        "value": 17278
                    },
                    {
                        "name": "21:00",
                        "value": 16588
                    },
                    {
                        "name": "22:00",
                        "value": 14216
                    },
                    {
                        "name": "23:00",
                        "value": 9590
                    }
                ],
                "当天": [
                    {
                        "name": "00:00",
                        "value": 12170
                    },
                    {
                        "name": "01:00",
                        "value": 6654
                    },
                    {
                        "name": "02:00",
                        "value": 4080
                    },
                    {
                        "name": "03:00",
                        "value": 2916
                    },
                    {
                        "name": "04:00",
                        "value": 2520
                    },
                    {
                        "name": "05:00",
                        "value": 3298
                    },
                    {
                        "name": "06:00",
                        "value": 6833
                    },
                    {
                        "name": "07:00",
                        "value": 11305
                    },
                    {
                        "name": "08:00",
                        "value": 18013
                    },
                    {
                        "name": "09:00",
                        "value": 13632
                    },
                    {
                        "name": "10:00",
                        "value": 13525
                    },
                    {
                        "name": "11:00",
                        "value": 13876
                    },
                    {
                        "name": "12:00",
                        "value": 14356
                    },
                    {
                        "name": "13:00",
                        "value": 13347
                    },
                    {
                        "name": "14:00",
                        "value": 12640
                    },
                    {
                        "name": "15:00",
                        "value": 13149
                    },
                    {
                        "name": "16:00",
                        "value": 13419
                    },
                    {
                        "name": "17:00",
                        "value": 13474
                    },
                    {
                        "name": "18:00",
                        "value": 13849
                    },
                    {
                        "name": "19:00",
                        "value": 11307
                    },
                    {
                        "name": "20:00",
                        "value": 0
                    },
                    {
                        "name": "21:00",
                        "value": 0
                    },
                    {
                        "name": "22:00",
                        "value": 0
                    },
                    {
                        "name": "23:00",
                        "value": 0
                    }
                ]
            }
        },
        watch:{
        },
        methods: {
        },
    }
</script>