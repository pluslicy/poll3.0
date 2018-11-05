<template>
	<div class="school" v-loading='schoolFormLoading'>
		<el-form size='mini' ref="form" :model="form" label-width="80px">
		  <el-form-item label="校园名称">
		    <el-input size="small" v-model="form.name"></el-input>
		  </el-form-item>
		  <el-form-item label="校园地址">
		    <el-input size="small" v-model="form.address"></el-input>
		  </el-form-item>
		  <el-form-item label="校园电话">
		    <el-input size="small" v-model="form.telephone"></el-input>
		  </el-form-item>
		  <el-form-item label="版权信息">
		    <el-input size="small" v-model="form.copyright"></el-input>
		  </el-form-item>
		  <el-form-item label="校园介绍">
		    <el-input size="small" type="textarea" v-model="form.description"></el-input>
		  </el-form-item>
		  <el-form-item class="content-right">
		    <el-button type="primary" size="small" @click="submitSchoolForm">保存</el-button>
		  </el-form-item>
		</el-form>
	</div>
</template>
<script type="text/javascript">
	import axios from 'axios'
	export default {
		data(){
			return {
				schoolFormLoading:false,
				form:{}
			}
		},
		created(){
			this.loadSchool();
		},
		methods:{
			// 保存或更新校园信息
			submitSchoolForm(){
				axios.post('/school/saveOrUpdate',this.form)
				.then(({data:result})=>{
					this.$notify.success({title:'成功',message:result.message})
					this.loadSchool();
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
			// 加载校园信息
			loadSchool(){
				this.schoolFormLoading = true;
				axios.get('/school/findById?id=1')
				.then(({data:result})=>{
					this.form = result.data;
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})

				})
				.finally(()=>{
					this.schoolFormLoading = false;
				})

			}
		}
	}
</script>

<style lang='scss'>

</style>













