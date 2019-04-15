<!-- 页面结构入口 -->
<template>
	<el-container :style="'height: '+containerH">
		<el-header>
			<el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="2" class="header-logo">
				<a href="/admin/frame/index" class="logo"><!-- <i class="fa fa-fw fa-database"></i> -->SIMI前端框架</a>
			</el-col>
			<el-col :xl="1" :lg="1" :md="1" :sm="1" :xs="1" style="text-align:left;">
				<div @click="isCollapse=!isCollapse" style="cursor:pointer;"><font-awesome-icon icon="bars" :class="isCollapse?'rotate90':''"/></div>
			</el-col>
			<el-col :xl="20" :lg="19" :md="18" :sm="16" :xs="8">
				<el-dropdown @command="handleCommand" style="float: right;">
					<span class="el-dropdown-link">
						<img class="staff-header" :src="staff_header" width="40" height="40">
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="info">个人信息</el-dropdown-item>
						<el-dropdown-item command="logout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<span class="txt" style="float: right;padding:0 5px;">您好, {{user.name}}</span>
				<!-- <el-menu :default-active="activeIndex" 
				class="el-menu-top" 
				mode="horizontal" 
				@select="handleSelect"
				background-color="#1F2D3D"
				text-color="#fff"
				active-text-color="#ffd04b">
					<el-menu-item index="1">系统管理</el-menu-item>
					<el-submenu index="2">
						<template slot="title">我的工作台</template>
						<el-menu-item index="2-1">选项1</el-menu-item>
						<el-menu-item index="2-2">选项2</el-menu-item>
						<el-menu-item index="2-3">选项3</el-menu-item>
					</el-submenu>
				</el-menu> -->
			</el-col>
		</el-header>
		<el-container>
			<el-menu :default-active="$route.path" :collapse="isCollapse" :default-openeds="default_opened_index" unique-opened router class="el-menu-vertical">
				<template v-for="(item,index) in navData">
					<el-submenu :index="index+''" v-if="item.dropdown.length >0" :key="index">
						<template slot="title">
							<font-awesome-icon :icon="item.iconClass"></font-awesome-icon>
							<span v-if="isShowbar">{{item.name}}</span>
						</template>
						<el-menu-item v-for="(s_item,s_index) in item.dropdown" :index="s_item.path" :key="s_index">{{s_item.name}}</el-menu-item>
					</el-submenu>
					<el-menu-item v-else :index="item.path" :key="index">
						<font-awesome-icon :icon="item.iconClass"></font-awesome-icon>
						<span v-if="isShowbar">{{item.name}}</span>
					</el-menu-item>
				</template>
			</el-menu>
			<el-main>
				<NavTabs :items="linkArr" ref="navTabs"></NavTabs>
				<el-row class="breadcrumb" v-show="true">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item :to="{ path: '/' }"><font-awesome-icon icon="home" />首页</el-breadcrumb-item>
						<el-breadcrumb-item>{{navMap[$route.path]}}</el-breadcrumb-item>
					</el-breadcrumb>
				</el-row>
				<el-row class="main-content">
					<transition name="fade-transform" mode="out-in">
						<keep-alive>
							<router-view></router-view>
						</keep-alive>
					</transition>
				</el-row>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import NavTabs from '../components/Tabs';
	import '../../../style/css/base.less';
	import "./Frame.less";
	import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
	export default {
		components: {
			NavTabs,
			FontAwesomeIcon
		},
		data: function() {
			return {
				containerH: 'auto',
				navData: [],
				navMap: {},
				tabLabel: null,
				linkArr: [],
				isShowbar: true,
				default_opened_index:['0'],
				isCollapse:false,
				activeIndex:'',
				staff_header:'',
				user:{name:''}
			}
		},
		mounted: function(){
			//设置皮肤
			document.body.className = "dark";
			if(window._user && window._user.name){
        		this.user = window._user;
				this.staff_header = "../../src/style/images/header_default.png";
        	}
			this.initMenu(window._navData);
			this.$bus.on('set-menu', this.initMenu);
			
		},
		methods: {
			initMenu(navData){
				let tabsMenu = this.$cookie.get('tabsMenu');
				if(tabsMenu)this.linkArr = JSON.parse(tabsMenu);

				// 根据url判断默认的tab卡片显示
				this.navData = navData;
				const path = this.$route.path;
				let defaultTab = {};
				for(let i in this.navData) {
					const item = this.navData[i];
					if(item.path) {
						this.navMap[item.path] = item.name;
						if(path == item.path) {
							defaultTab = {name: item.name, path: item.path,routeName:item.routeName};
							this.default_opened_index = [i];
						}
					} else {
						for(let k in item.dropdown) {
							const s_item = item.dropdown[k];
							this.navMap[s_item.path] = s_item.name;
							if(path == s_item.path) {
								defaultTab = {name: s_item.name, path: s_item.path,routeName:s_item.routeName};
								this.default_opened_index = [i];
							}
						}
					}
				}
				this.setDefaultTab(defaultTab.routeName,defaultTab.path);
				this.containerH = document.body.clientHeight+'px';
			},
			handleSelect(){

			},
            handleChange(flag) {
            	this.isShowbar = flag;
            },
			setDefaultTab(routeName,path){
				if(!routeName){
					return false;
				}
				let tmp = this.linkArr.find(function(val){
					if(val.routeName == routeName){
						return true;
					}
				})
				if(!tmp){
					this.linkArr.push({name:this.navMap[path], path: path,routeName:routeName});
					const tabsMenu = JSON.stringify(this.linkArr);
					this.$cookie.set('tabsMenu',tabsMenu, { expires: '1h' })   //return this
					return true;
				}
				return false;
			},
            handleCommand(command){
				if(command == 'logout'){
					//请求api清空session，并跳转到登录页面
					this.$router.replace("/login");
					//window.location.href = window.base_url+'admin/frame/logout/';
				}else if(command == 'info'){
					this.navMap['/admin/personalInfo'] = '个人信息';
					this.$router.push({
						path:'/admin/personalInfo',
						query:{
							id: '',
							tabName:'个人信息',
							btn_flag:true
						}
					});
				}
            }
		},
		watch: {
			'$route': function(newRoute, oldRoute){//监听路由变化
				const path = newRoute.path;
                // 路由可以动态传入参数，以query参数传入
				let title = "";
                if(newRoute.params.tabName) {
                    title = newRoute.params.tabName;
                }else if(this.navMap[path]){
                    title = this.navMap[path];
				}
				this.linkArr[path] = {name:title, path: path};
				this.navMap[newRoute.path] = title;
				this.setDefaultTab(newRoute.name,newRoute.path);
			}
		}
	}

</script>