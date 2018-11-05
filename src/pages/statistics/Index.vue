<template>
	<div class="setting">
		<ul class="setting-nav">
			<li :class="{current:currentRoute=='/statistics/surveyList'}">
				<router-link to='/statistics/surveyList'>全部课调</router-link>
			</li>
			<li :class="{current:currentRoute=='/statistics/surveyClazz'}">
				<router-link to='/statistics/surveyClazz'>班级课调</router-link>
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
				currentRoute:'/statistics/surveyList'
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