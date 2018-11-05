<template>
	<div class="user">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddUser'>添加</el-button>
			<el-button size='mini' @click='batchDeleteUsers'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="users" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="name" label="姓名" width="160"></el-table-column>
	      <el-table-column prop="gender" label="性别" width="80" align='center'></el-table-column>
	      <el-table-column prop="type" label="类型" width="80" align='center'></el-table-column>
	      <el-table-column prop="birth" label="出生日期" align='center'></el-table-column>
	      <el-table-column prop="hiredate" label="入职时间" align='center'></el-table-column>
	      <el-table-column label="操作" width='70' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteUser(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateUser(row)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="userDialog.title" :visible.sync="userDialog.visible">
			{{userDialog.form}}
		  <el-form ref="categoryForm" :rules='rules' :model="userDialog.form" label-position='left' size='small'>
		    <el-form-item label="姓名" label-width="100px" prop="name">
		      <el-input v-model="userDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
				<el-form-item label="用户类型" label-width="100px">
		       <el-select style='width:100%' v-model="userDialog.form.type" placeholder="请选择用户类型">
		        <el-option label="讲师" value="讲师"></el-option>
		        <el-option label="班主任" value="班主任"></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="性别" label-width="100px">
		      <el-radio-group v-model="userDialog.form.gender">
				    <el-radio label="男">男</el-radio>
				    <el-radio label="女">女</el-radio>
				  </el-radio-group>
		    </el-form-item>
		    <el-form-item label="出生日期" label-width="100px">
		       <el-date-picker
			      v-model="userDialog.form.birth"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="出生日期">
			    </el-date-picker>
		    </el-form-item>
		    <el-form-item label="入职时间" label-width="100px">
		      <el-date-picker
			      v-model="userDialog.form.hiredate"
			      type="date"
			      value-format="yyyy-MM-dd"
			      placeholder="入职日期">
			    </el-date-picker>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeUserDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateUser'>确 定</el-button>
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
				users:[],
				rules:{},
				multipleSelection:[],
				userDialog:{
					title:'',
					visible:false,
					form:{
						gender:'男',
						type:'讲师'
					}
				}
			}
		},
		created(){
			this.findAllUsers();
		},
		methods:{
			findAllUsers(){
				this.loading = true;
				axios.get('/user/findAll')
				.then(({data:result})=>{
					this.users = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddUser(){
				this.userDialog.title = '添加用户';
				this.userDialog.visible = true;
			},
			closeUserDialog(){
				this.userDialog.visible = false;
				this.userDialog.form = {};
			},
			saveOrUpdateUser(){
				axios.post('/user/saveOrUpdate',this.userDialog.form)
				.then(({data:result})=>{
					this.findAllUsers();
					this.closeUserDialog();
					this.$notify.success({title:'成功',message:result.message})
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
			toUpdateUser(row){
				this.userDialog.title = '修改用户';
				this.userDialog.visible = true;
				this.userDialog.form = row;
			},
			batchDeleteUsers(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/user/batchDelete',{ids})
					.then(({data:result})=>{
						this.findAllUsers();
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
			deleteUser(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/user/deleteById?id='+id)
					.then(({data:result})=>{
						this.findAllUsers();
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