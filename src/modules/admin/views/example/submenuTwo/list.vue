<template>
	<ErrorTip v-if="notAccess" msg="您无权限访问哟~"></ErrorTip>
    <el-row v-else>
        <!-- 查询选项 -->
        <el-row class="pb15 search">
            <el-col class="ptb5 search-item">
                <el-input placeholder="请输入" v-model="search.title.value" clearable>
                    <template slot="prepend">searchItem</template>
                </el-input>
            </el-col>
            <el-col class="ptb5 search-btn">
                <el-button type="primary">查询</el-button>
            </el-col>
        </el-row>
        <!-- table列表 -->
        <el-row class="pb15">
            <el-table :data="pagination.items" border style="width: 100%">
                 <el-table-column prop="date" label="日期" width="180"></el-table-column>
                <el-table-column prop="name" label="姓名" width="180"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>
        </el-row>
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
                notAccess:false,
                cfg: {
                    contentTypeCfg: {},
                },
                search:{
                	title: {value:'',operator:"like",type:'both'},
                },
                pagination: {
                    total_items: 0,
                    per_page: 12,
                    from: 1,
                    to: 0,
                    items:[{
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                        }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    },{
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                        }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    },{
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                        }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄',
                        }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }],
                    current_page: 1
                },
            }
        },
        mounted() {
        },
        methods: {
        },
    }
</script>