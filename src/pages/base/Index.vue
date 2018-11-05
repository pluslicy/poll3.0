<template>
	<div class="setting">
		<ul class="setting-nav">
			<li :class="{current:currentRoute=='/base/school'}">
				<router-link to='/base/school'>校园信息</router-link>
			</li>
			<li :class="{current:currentRoute=='/base/grade'}">
				<router-link to='/base/grade'>年级管理</router-link>
			</li>
			<li :class="{current:currentRoute=='/base/clazz'}">
				<router-link to='/base/clazz'>班级管理</router-link>
			</li>
			<li :class="{current:currentRoute=='/base/course'}">
				<router-link to='/base/course'>课程管理</router-link>
			</li>
			<li :class="{current:currentRoute=='/base/user'}">
				<router-link to='/base/user'>用户管理</router-link>
			</li>
		</ul>
		<div class="setting-content">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				currentRoute:'/base/school'
			}
		},
		watch:{
			'$route':function(to,from){
				this.currentRoute = to.path;
			}
		},
		mounted(){
			this.$router.push(this.currentRoute);
		}
	}
</script>
<style>
	.setting-nav {
		border-bottom: 1px solid #f0f0f0;
		height: 30px;
	}
	
	.setting-nav > li {
		line-height: 30px;
		float: left;
		width: 120px;
		text-align: center;
	}
	.setting-nav > li.current  {
		border-bottom: 1px solid teal;
	}
	.setting-content {
		padding: .5em 0;
	}
</style>