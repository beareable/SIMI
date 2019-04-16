<template>
    <div style="width:100%;height:100%;"></div>
</template>
<script>
    import echarts from 'echarts/lib/echarts'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/visualMap'
    import 'echarts/lib/component/markPoint'
    import 'echarts/lib/component/dataset'

    export default {
        props: ['data','options','theme'],
        data: function () {
            return {
                chart: null,
                color: ['#304BF4','#FF612F','#35a9ff','#FF9126','#4BD599','#FF9126','#35a9ff','#4BD599']
            }
        },
        mounted: function () {
            this.renderChart();
            //监听窗口变化resize图表
            window.addEventListener("resize",this.resizeChart)
        },
        destroyed() {
            window.removeEventListener("resize",this.resizeChart)
        },
        watch: {
            'data':function(newVal,oldVal){
                console.log(newVal, 'newVal');
                this.chart.setOption(this.handleOptions(newVal), true);
            }
        },
        methods: {
            renderChart(){
                const chart = echarts.init(this.$el,this.theme || '');
                const chartsOptions = this.handleOptions(this.data);
                chart.setOption(chartsOptions, true);
                this.chart = chart;
            },
            reloadChart(data_params,callback){
                const chartsOptions = this.handleOptions(this.data,data_params);
                this.chart.setOption(chartsOptions, true);
                if(typeof callback == 'function'){
                    callback();
                }
            },
            bindClick(hotRecordData){
                this.chart.on('click', (params) =>{
                    console.log(params, 'params');
                    if (params.componentType === 'markPoint') {
                        for(let i in hotRecordData){
                            console.log(hotRecordData[i], 'hotRecordData');
                            if(params.data.label.title == hotRecordData[i].hot_word){
                                this.$router.push({name:'staticHotDetail',params:{data:hotRecordData[i]}});
                                break;
                            }
                        }
                    }
                });
            },
            resizeChart(){
                this.chart.resize()
            },
            randomHexColor(length) {
                if(length <= this.color.length){//小于等于颜色数据长度, 不添加额外的颜色到颜色数组
                    return this.color;
                }
                let moreLength = length - this.color.length;
                let tmpArr = [];
                for(let i=0; i<moreLength; i++){
                    let flag = false;
                    let randomColor = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
                    for(let v in this.color){
                        if(v == randomColor){
                            flag = true;
                        }
                    }
                    if(flag == true){
                        continue;
                    }
                    tmpArr.push(randomColor);
                }
                let resultColir = this.color.concat(tmpArr);
                return resultColir;
            },
            handleOptions(data,data_params){
                console.log(data, 'data')
                console.log(data_params, 'data_params')
                let options = this.getDefaultOptions();
                if(this.options){
                    options = Object.assign(options,this.options);
                }
                let seriesData = [], xAxisData = [], legendData = [];
                //let color = this.color;
                let color = this.randomHexColor(Object.keys(data).length);
                for(let key in data){
                    legendData.push(key);
                    // todo 假如对象数量大于颜色数据长度...
                    if(data[key].length > 0){

                        let obj = {};
                        obj = {
                            name: key,
                            type:'line',
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: color[parseInt(legendData.length-1)]
                                    }, {
                                        offset: 1,
                                        color: '#fff'
                                    }]),
                                    opacity: 0.1
                                }
                            },
                            smooth:true,
                            smoothMonotone: 'x',
                            data: [],
                        }
                        let obj_data = [];
                        let is_xData = true;
                        if(xAxisData.length > 0) is_xData = false;
                        for(let item of data[key]){
                            if(is_xData) xAxisData.push(item.name);
                            obj_data.push(item.value);
                        }
                        obj.markPoint = {
                            data: [
                                //{type: 'max', name: '最大值'},
                                //{name: '异常热词',symbol:'circle', symbolSize: 15, coord: ['10:00', 28596]}
                            ],
                        };
                        if(data_params){
                            for(let k in data_params){
                                obj[k] = data_params[k];
                            }
                        }
                        obj.data = obj_data;
                        seriesData.push(obj);
                    }
                }
                if(data_params && data_params.xAxis){
                    for(let k in data_params.xAxis[0]){
                        options.xAxis[0][k] = data_params.xAxis[0][k];
                    }
                }
                if(data_params && data_params.yAxis){
                    for(let k in data_params.yAxis[0]){
                        options.yAxis[0][k] = data_params.yAxis[0][k];
                    }
                }
                options.xAxis[0].data = xAxisData;
                options.series = seriesData;
                options.legend.data = legendData;
                options.color = color;
                console.log(options, 'optionsoptionsoptions');
                return options;
            },
            getDefaultOptions(){
                const options = {
                    color: [],
                    title: {
                        text: ''
                    },
                    tooltip : {
                        trigger: 'axis',
                    },
                    legend: {
                        data:[]
                    },
                    grid: {
                        left: '4%',
                        right: '5%',
                        top: 30,
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['周一','周二','周三','周四','周五','周六','周日'],
                            axisTick:{
                                show:false
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#e1e1e1'
                                }
                            },
                            axisLabel: {
                                margin: 20,
                                textStyle: {
                                    color: '#333333'
                                },
                                interval: 0,
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick:{
                                show:false
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#D4D7DA'
                                }
                            },
                            axisLabel: {
                                margin: 20,
                                textStyle: {
                                    color: '#bebebe'
                                },
                            }
                        }
                    ],
                    series : []
                };
                return options;
            },
        }
    }
</script>