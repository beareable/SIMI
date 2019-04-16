<template>
	<div class="menu-card-main tabs-sort">
		<el-tabs id="items" type="card" v-model="curr_name" @tab-remove="handleRemove" closable  @tab-click="handleClick" style="overflow: auto;">
		<!-- <el-tabs type="border-card" :value="curr_name" closable @tab-remove="handleRemove" @tab-click="handleClick"> -->
				<el-tab-pane
					v-for="(item, index) in items"
					:key="index"
					:label="item.name"
					:name="item.routeName"
				>
			<div slot="label" :title="item.name">{{item.name | ellipsis}}</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import Sortable from 'sortablejs'
    export default {
        data() {
            return {
				curr_name:'roleList'
            }
        },
		props:["items",'active'],
		mounted: function(){
			this.curr_name = this.$route.name;
			//drag tab
			let el = document.querySelectorAll('.tabs-sort .el-tabs__nav')[0];
			let sortable = Sortable.create(el, {
				onEnd: (evt) => {
					//change the value of index
					let oldIndex = evt.oldIndex;
					let newIndex = evt.newIndex;
					let temp = this.items[oldIndex];
					this.items[oldIndex] = this.items[newIndex];
					this.items[newIndex] = temp;
					//jump new route
					let newRoute = this.items[newIndex];
					console.log(newRoute, 'test');
					this.curr_name = newRoute.name;
					this.$router.push({name:newRoute.routeName});
				}
			})
		},
		watch: {
			'$route': function(newRoute){//监听路由变化
				this.curr_name = newRoute.name;
			},
			'items': function(newVal,oldVal){
				this.curr_name = this.$route.name;
			},
			'curr_name':function(newVal,oldVal){
				this.curr_name = this.$route.name;
			}
		},
		filters: {
            ellipsis: function (value) {
                const max_len = 6;
                if (!value) return '404'
                value = value.toString()
                if(value.length>max_len){
                    return value.slice(0,max_len)+'...'
                }
                return value;
            }
        },
        methods: {
			handleClick(tab){
				this.$router.push({name:tab.name});
			},
			handleRemove(routeName, callback){
				if(this.items.length <= 1){
					return;
				}
				this.items.forEach((tab, index) => {
					if(tab.routeName == routeName){
						this.items.splice(index,1);
					}
				});
				if(typeof callback == 'function'){
					callback();
					return;
				}
				if(this.curr_name == routeName){
					const nextRoute = this.items[this.items.length - 1];
					this.$router.push({name:nextRoute.routeName});
				}
				this.$cookie.set('tabsMenu',JSON.stringify(this.items), { expires: '1h' });   //return this
			},
            linkPage(path){
            	this.$router.push(path);
			},
        }
    }
</script>
<style lang="less">
.menu-card-main{
	.el-tabs__nav{

	}
	.el-tabs__item{
        background-color: #EBEEF5;
        width: 140px !important;
		text-align: center;
		color: #909399;
	}
	.el-tabs__item.is-active {
		background-color: #FFFFFF;
		color: #409EFF;
	}
	.el-tabs__item:first-child{
        border-left: none !important;
	}
	.el-tabs__item:last-child{

	}
	.is-scrollable{
		.el-tabs__item:last-child{
			margin-right: 20px;
		}
	}
    .el-tabs__item .el-icon-close {
        top: 5px !important;
        position: absolute !important;
        right: 5px !important;
        font-size: 14px !important;
    }
    .el-tabs__item.is-active.is-closable .el-icon-close, 
    .el-tabs__item.is-closable:hover .el-icon-close {
        top: 5px;
        position: absolute;
        right: 5px;
        font-size: 14px;
    }
}
</style>