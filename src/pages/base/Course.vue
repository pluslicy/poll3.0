<template>
	<div class="course">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddCourse'>添加</el-button>
			<el-button size='mini' @click='batchDeleteCourses'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="courses" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="name" label="名称" width="160"></el-table-column>
	      <el-table-column prop="period" label="周期" width="160"></el-table-column>
	      <el-table-column prop="description" label="简介" ></el-table-column>
	      <el-table-column label="操作" width='70' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteCourse(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateCourse(row)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="courseDialog.title" :visible.sync="courseDialog.visible">
			<!-- {{courseDialog.form}} -->
		  <el-form ref="categoryForm" :rules='rules' :model="courseDialog.form" label-position='left' size='small'>
		    <el-form-item label="课程名称" label-width="100px" prop="name">
		      <el-input v-model="courseDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="课程周期" label-width="100px" prop="name">
		      <el-input v-model="courseDialog.form.period" autocomplete="off"></el-input>
		    </el-form-item>
				<el-form-item label="课程简介" label-width="100px">
		      <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="courseDialog.form.description">
					</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeCourseDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateCourse'>确 定</el-button>
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
				courses:[],
				rules:{},
				multipleSelection:[],
				courseDialog:{
					title:'',
					visible:false,
					form:{}
				}
			}
		},
		created(){
			this.findAllCourses();
		},
		methods:{
			findAllCourses(){
				this.loading = true;
				axios.get('/course/findAllCourse')
				.then(({data:result})=>{
					this.courses = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddCourse(){
				this.courseDialog.title = '添加课程';
				this.courseDialog.visible = true;
			},
			closeCourseDialog(){
				this.courseDialog.visible = false;
				this.courseDialog.form = {};
			},
			saveOrUpdateCourse(){
				axios.post('/course/saveOrUpdate',this.courseDialog.form)
				.then(({data:result})=>{
					this.findAllCourses();
					this.closeCourseDialog();
					this.$notify.success({title:'成功',message:result.message})
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
			toUpdateCourse(row){
				this.courseDialog.title = '修改课程';
				this.courseDialog.visible = true;
				this.courseDialog.form = row;
			},
			batchDeleteCourses(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/course/batchDelete',{ids})
					.then(({data:result})=>{
						this.findAllCourses();
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
			deleteCourse(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/course/deleteById?id='+id)
					.then(({data:result})=>{
						this.findAllCourses();
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