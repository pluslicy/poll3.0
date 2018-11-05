<template>
	<div class="grade">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddGrade'>添加</el-button>
			<el-button size='mini' @click='batchDeleteGrades'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="grades" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="name" label="名称" width="160"></el-table-column>
	      <el-table-column prop="description" label="简介" ></el-table-column>
	      <el-table-column label="操作" width='70' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteGrade(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateGrade(row)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="gradeDialog.title" :visible.sync="gradeDialog.visible">
			<!-- {{gradeDialog.form}} -->
		  <el-form ref="categoryForm" :rules='rules' :model="gradeDialog.form" label-position='left' size='small'>
		    <el-form-item label="年级名称" label-width="100px" prop="name">
		      <el-input v-model="gradeDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
				<el-form-item label="年级简介" label-width="100px">
		      <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="gradeDialog.form.descriptioin">
					</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeGradeDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateGrade'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 按钮结束 -->

	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default {
		data(){
			return {
				loading:false,
				grades:[],
				rules:{},
				multipleSelection:[],
				gradeDialog:{
					title:'',
					visible:false,
					form:{}
				}
			}
		},
		created(){
			this.findAllGrades();
		},
		methods:{
			findAllGrades(){
				this.loading = true;
				axios.get('/grade/findAll')
				.then(({data:result})=>{
					this.grades = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddGrade(){
				this.gradeDialog.title = '添加年级';
				this.gradeDialog.visible = true;
			},
			closeGradeDialog(){
				this.gradeDialog.visible = false;
				this.gradeDialog.form = {};
			},
			saveOrUpdateGrade(){
				axios.post('/grade/saveOrUpdate',this.gradeDialog.form)
				.then(({data:result})=>{
					this.findAllGrades();
					this.closeGradeDialog();
					this.$notify.success({title:'成功',message:result.message})
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
			toUpdateGrade(row){
				this.gradeDialog.title = '修改年级';
				this.gradeDialog.visible = true;
				this.gradeDialog.form = row;
			},
			batchDeleteGrades(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/grade/batchDelete',{ids})
					.then(({data:result})=>{
						this.findAllGrades();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			deleteGrade(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/grade/deleteById?id='+id)
					.then(({data:result})=>{
						this.findAllGrades();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			}
		}
	}
</script>
<style>
	.btns {
		margin-bottom: .5em;
	}
	i.fa {
		padding: 0 .3em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
</style>