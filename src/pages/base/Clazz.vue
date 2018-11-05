<template>
	<div class="clazz">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddClazz'>添加</el-button>
			<el-button size='mini' @click='batchDeleteClazzes'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="clazzes" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="name" label="班级名称" width="160"></el-table-column>
	      <el-table-column prop="description" label="班级简介" ></el-table-column>
	      <el-table-column prop="grade.name" label="班主任" width="120"></el-table-column>
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
		<el-dialog :title="clazzDialog.title" :visible.sync="clazzDialog.visible">
			{{clazzDialog.form}}
		  <el-form ref="categoryForm" :rules='rules' :model="clazzDialog.form" label-position='left' size='small'>
		    <el-form-item label="班级名称" label-width="100px" prop="name">
		      <el-input v-model="clazzDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="所属年级" label-width="100px" prop="name">
		      <el-select style='width:100%' v-model="clazzDialog.form.gradeId" placeholder="请选择所属年级">
		        <el-option :key='index' v-for='(c,index) in grades' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="所属班主任" label-width="100px" prop="name">
		      <el-select style='width:100%' v-model="clazzDialog.form.chargeId" placeholder="请选择班主任">
		        <el-option :key='index' v-for='(c,index) in teachers' :label="c.name" :value="c.id"></el-option>
		      </el-select>
		    </el-form-item>
		    
				<el-form-item label="班级简介" label-width="100px">
		      <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="clazzDialog.form.description">
					</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeClazzDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateClazz'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default {
		data(){
			return {
				loading:false,
				clazzes:[],
				teachers:[],
				grades:[],
				rules:{},
				clazzDialog:{
					ftitle:'',
					visible:false,
					form:{}
				}
			}
		},
		created(){
			this.findAllUsers();
			this.findAllGrades();
			this.findAllClazzes();
		},
		methods:{
			saveOrUpdateClazz(){
				axios.post('/clazz/saveOrUpdateClazz',this.clazzDialog.form)
				.then(({data:result})=>{
					this.findAllClazzes();
					this.closeClazzDialog();
					this.$notify.success({title:'成功',message:result.message})
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
			closeClazzDialog(){
				this.clazzDialog.visible = false;
				this.clazzDialog.form = {};
			},
			findAllClazzes(){
				this.loading = true;
				axios.get('/clazz/findAllVM')
				.then(({data:result})=>{
					this.clazzes = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddClazz(){
				this.clazzDialog.title = '添加班级';
				this.clazzDialog.visible = true;

			},
			batchDeleteClazzes(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/clazz/batchDeleteClazz',{ids})
					.then(({data:result})=>{
						this.findAllClazzes();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			deleteGrade(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/clazz/deleteClazzById?id='+id)
					.then(({data:result})=>{
						this.findAllClazzes();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			toUpdateGrade(row){
				let clazz = _.clone(row);
				clazz.gradeId = clazz.grade.id;
				clazz.chargeId = clazz.charge.id;
				delete clazz.grade;
				delete clazz.charge;
				this.clazzDialog.form = clazz;
				this.clazzDialog.visible = true;
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			findAllGrades(){
				axios.get('/grade/findAll')
				.then(({data:result})=>{
					this.grades = result.data;
				});
			},
			findAllUsers(){
				axios.get('/user/findAll')
				.then(({data:result})=>{
					this.teachers = result.data;
				});
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